// This class abstracts away most of the interaction with Spotify's API. All methods return promises
// which will be resolved once the requested resource has been returned from Spotify
function SpotifyRequestor(spotifyApi, timeRange, reportProgress) {
  this.s = spotifyApi;
  this.timeRange = timeRange;
  this.reportProgress = reportProgress || function() {};
  this.defaultPageSize = 50;
  this.maxResults = 1000;
  this.retryCount = 3;
}

// Helper function which will run fn more than once if the promise is rejected during execution.
// fn must be a function which returns a promise
SpotifyRequestor.prototype._runWithRetry = function(fn, actionDescription, retryCount) {
    retryCount = retryCount || this.retryCount;
    console.log("Running with retryCount of " + retryCount);

    function tryRunPromise() {
        return fn().then(function(data) {
            console.log("Promise '" + actionDescription + "' succeeded execution!");
            return Promise.resolve(data); 
        }, function(err) {
            console.log("Error encountered. Current retryCount is = " + retryCount);
            if (retryCount > 0) {
                console.log(actionDescription + " failed. Trying again.");
                retryCount--;
                return tryRunPromise();
            } else {
                console.log("Out of retries, failing the call: " + actionDescription);
                return Promise.reject(err);
            }
        });
    };

    return tryRunPromise();
}

// Helper function to make a request which returns a promise and process the data which the call returns.
// fn must be a function which returns a promise. rowProcessor will be called once for every row of data
// returned by the resolved fn promise. rowAccessor is an optional parameter to be called when fn resolves
// to access the array of objects for rowProcessor to handle
SpotifyRequestor.prototype._makeRequestAndProcessRows = function(description, fn, rowProcessor, rowAccessor) {
    console.log("Making request for " + description);
    rowAccessor = rowAccessor || function(data) { return data.items; };
    
    // Run this request using the retry logic we have
    return this._runWithRetry(fn, description).then(function(data) {
        console.log("Received Results for " + description + ". Number of rows: " + rowAccessor(data).length);
        var toRet = rowAccessor(data).map(rowProcessor);

        // Send back some paging information to the caller
        var paging = {
            offset : data.offset || 0,
            total : data.total || 0
        };

        return Promise.resolve({rows: toRet, paging: paging});
    });
}

// Helper function for paging through multiple requests. Takes the same parameters as _makeRequestAndProcessRows, but
// uses the returned paging information to make another request. the paging information will be applied to fn when
// it is called for each new page
SpotifyRequestor.prototype._makeRequestAndProcessRowsWithPaging = function(description, fn, rowProcessor, rowAccessor) {
    console.log("Making request with paging for " + description);
    var allRows = [];

    // Define a getPage helper function for getting a single page of data
    var getPage = function(limit, offset) {
        console.log("Getting a page of data with limit=" + limit + " and offset=" + offset);
        return this._makeRequestAndProcessRows(
            description, 
            fn.bind(this, {limit: limit, offset: offset}), // bind the limit and offset in here
            rowProcessor,
            rowAccessor).then(function(result) {
                var nextOffset = result.paging.offset + this.defaultPageSize;
                allRows = allRows.concat(result.rows);
                var totalRows = result.paging.total < this.maxResults ? result.paging.total : this.maxResults;
                
                console.log("Received a page of data for " + description + ". nextOffset is "  + nextOffset + ". totalRows is " + result.paging.total + ". maxResults is " + this.maxResults);

                // Report our progress to the progress reporting function which was passed in
                this.reportProgress("Received data for " + description + ". Retrieved " + result.paging.offset + " of " + totalRows);
                if (nextOffset < result.paging.total && nextOffset < this.maxResults) {
                    return getPage(this.defaultPageSize, nextOffset);
                } else {
                    console.log("Done paging through results. Number of results was " + allRows.length)
                    return Promise.resolve(allRows);
                }
        }.bind(this));
    }.bind(this);

    return getPage(this.defaultPageSize, 0);
}

// Helper function for calling a fn which takes in an array of ids. If the call has a limited blockSize, the requests
// will be broken up. The results will be recombined and returned in the same order as ids
SpotifyRequestor.prototype._getCollectionFromIds = function(ids, blockSize, description, fn, rowProcessor, rowAccessor) {
    console.log("Retrieving a collection for " + description + ". " + ids.length + " ids are requested with blockSize " + blockSize);

    // Request blockSize ids at a time
    var idBlocks = [];
    var currBlock = undefined;
    for(var i = 0; i < ids.length; i++) {
        if (!currBlock || currBlock.length == blockSize) {
            currBlock = new Array();
            idBlocks.push(currBlock);
        }

        currBlock.push(ids[i]);
    }

    console.log("Created " + idBlocks.length + " blocks");

    // Allocate a results array which will will insert all of our results into. This must return
    // The results in the order which ids were passed in
    var resultBlocks = new Array(idBlocks.length);

    var promises = [];
    for (var i = 0; i < idBlocks.length; i++) {
        // This function will get called when each promise finishes
        var insertValues = function(index, result) {
            // Place these values in their appropriate spot
            resultBlocks[index] = result.rows;
        }.bind(this, i);

        // Create a promise for each block
        promises.push(this._makeRequestAndProcessRows(
            description,
            fn.bind(this, idBlocks[i]), 
            rowProcessor,
            rowAccessor)
            .then(insertValues)
        );
    }

    // Once all the promises have finished, combine the resultBlocks into a single array
    return Promise.all(promises).then(function() {
        console.log("All requests have finished. Combining arrays together for " + description);
        var merged = [].concat.apply([], resultBlocks);
        return merged;
    });
}

// Gets the user's top artists for the given time range
SpotifyRequestor.prototype.getMyTopArtists = function() {
    if (this._myTopArtists) {
        console.log("Returning cached list of top artists");
        return Promise.resolve(this._myTopArtists);
    }

    return this._makeRequestAndProcessRows(
        "getMyTopArtists", 
        this.s.getMyTopArtists.bind(this, {time_range: this.timeRange, limit: 50}), 
        function(artist) {
            console.log("Processing item " + artist.name);              
            return {
                "followers": artist.followers ? artist.followers.total : 0,
                "genre1": artist.genres[0] || null,
                "genre2": artist.genres[1] || null,
                "href": artist.href,
                "id": artist.id,
                "image_link":artist.images[0] ? artist.images[0].url : null,
                "name": artist.name,
                "popularity":artist.popularity,
                "uri": artist.uri
            };
        }).then(function(result) {
            // Cache this off in case we need it later
            console.log("Finished retrieving top artists");
            this._myTopArtists = result.rows;
            return Promise.resolve(result.rows);
        }.bind(this));
}

// Gets the user's top tracks for the given time range
SpotifyRequestor.prototype.getMyTopTracks = function() {
    if (this._myTopTracks) {
        console.log("Returning cached list of top tracks");
        return Promise.resolve(this._myTopTracks);
    }

    return this._makeRequestAndProcessRows(
        "getMyTopTracks", 
        this.s.getMyTopTracks.bind(this, {time_range: this.timeRange, limit: 50}), 
        function(track) {
            console.log("Processing track " + track.name);              
            return {
                "album_id": track.album.id,
                "artist_id": track.artists[0].id,
                "artist_name": track.artists[0].name,
                "duration_ms": track.duration_ms,
                "explicit": track.explicit,
                "href": track.href,
                "id": track.id,
                "name": track.name,
                "preview_url": track.preview_url,
                "track_number": track.track_number,
                "uri": track.uri
            };
        }).then(function(result) {
            // Cache this off in case we need it later
            console.log("Finished retrieving top tracks");
            this._myTopTracks = result.rows;
            return Promise.resolve(result.rows);
        }.bind(this));
}

// Gets the saved albums for this user
SpotifyRequestor.prototype.getMySavedAlbums = function() {
    if (this._mySavedAlbums) {
        console.log("Returning cached list of saved albums");
        return Promise.resolve(this._mySavedAlbums);
    }

    // First request whole albums which are saved to the library
    return this._makeRequestAndProcessRowsWithPaging(
        "getMySavedAlbums", 
        this.s.getMySavedAlbums.bind(this),
        function(albumObject) {
            console.log("Processing album " + albumObject.album.name);              
            return {
                "added_at": albumObject.added_at,
                "artist_id": albumObject.album.artists[0].id,
                "genre1": albumObject.album.genres[0] || null,
                "genre2": albumObject.album.genres[1] || null,
                "href": albumObject.album.href,
                "id": albumObject.album.id,
                "image_link": albumObject.album.images[0] ? albumObject.album.images[0].url : null,
                "name": albumObject.album.name,
                "popularity": albumObject.album.popularity,
                "release_date": albumObject.album.release_date,
                "type": albumObject.album.type,
                "uri": albumObject.album.uri
            };
        }).then(function(savedAlbums) {
            // To get the rest of the albums, we first get all the user's saved tracks, then retrieve album
            // info for those tracks.
            return this.getMySavedTracks().then(function(rows) {
                var allAlbums = [];
                var albums = rows.map(function(row) { return row.album_id; } );
                for(var i in albums) {
                    if (allAlbums.indexOf(albums[i]) == -1) {
                        allAlbums.push(albums[i]);
                    }
                }
                
                return this.getAlbums(allAlbums).then(function(addedAlbums) {
                    var finalResults = savedAlbums.concat(addedAlbums);
                    this._mySavedAlbums = finalResults;
                    return finalResults;
                }.bind(this));
            }.bind(this));
        }.bind(this));
}

// Gets the saved tracks for this user as well as some metrics for each track
SpotifyRequestor.prototype.getMySavedTracks = function() {
    if (this._mySavedTracks) {
        console.log("Returning cached list of saved tracks");
        return Promise.resolve(this._mySavedTracks);
    }

    return this._makeRequestAndProcessRowsWithPaging(
    "getMySavedTracks", 
    this.s.getMySavedTracks.bind(this),
    function(trackObject) {
        console.log("Processing track " + trackObject.track.name);              
        return {
            "added_at": trackObject.added_at,
            "album_id": trackObject.track.album.id,
            "artist_id": trackObject.track.artists[0].id,
            "artist_name": trackObject.track.artists[0].name,
            "duration_ms": trackObject.track.duration_ms,
            "explicit": trackObject.track.explicit,
            "href": trackObject.track.href,
            "id": trackObject.track.id,
            "name": trackObject.track.name,
            "preview_url": trackObject.track.preview_url,
            "track_number": trackObject.track.track_number,
            "uri": trackObject.track.uri
        };
    }).then(function(rows) {
        // We have retrieved all the tracks. Now let's decorate them with some metrics
        var ids = rows.map(function(row) { return row.id; });
        return this.getTrackFeatures(ids).then(function(trackFeatures) {
            var finalResults = rows;
            for(var i = 0; i < trackFeatures.length; i++) {
                for (var attrname in trackFeatures[i]) { 
                    finalResults[i][attrname] = trackFeatures[i][attrname];
                }
            }

            this._mySavedTracks = finalResults;
            return finalResults;
        }.bind(this));
    }.bind(this));
}

// Gets the saved artists for the user
SpotifyRequestor.prototype.getMySavedArtists = function() {
    if (this._mySavedArtists) {
        console.log("Returning cached list of saved artists");
        return Promise.resolve(this._mySavedArtists);
    }

    // To get artists, we first must get all the user's albums and tracks since
    // there isn't an endpoint for getting artists
    var allArtists = [];
    var appendArtists = function(rows) {
        var artists = rows.map(function(row) { return row.artist_id; } );
        for(var i in artists) {
            if (allArtists.indexOf(artists[i]) == -1) {
                allArtists.push(artists[i]);
            }
        }
    };

    return Promise.all([
        spotifyRequestor.getMySavedAlbums().then(appendArtists),
        spotifyRequestor.getMySavedTracks().then(appendArtists)]).then(function() {
            console.log("Finished finding artists in albums and tracks. Number of artists=" + allArtists.length);
            return this.getArtists(allArtists).then(function(finalResults) {
                this._mySavedArtists = finalResults;
                return finalResults;
            }.bind(this));
        }.bind(this));
}

// Gets artists by their ids
SpotifyRequestor.prototype.getArtists = function(ids) {
    // TODO - cache the artists we have already retrieved by their id

    // Spotify only lets us request 50 artists at a time
    return this._getCollectionFromIds(ids, 50, "getArtists",
        this.s.getArtists.bind(this), 
        function(artist) {      
            return {
                "followers": artist.followers ? artist.followers.total : 0,
                "genre1": artist.genres[0] || null,
                "genre2": artist.genres[1] || null,
                "href": artist.href,
                "id": artist.id,
                "image_link": artist.images[0] ? artist.images[0].url : null,
                "name": artist.name,
                "popularity":artist.popularity,
                "uri": artist.uri                        
            };
        },
        function(data) { return data.artists; });
}

// Gets albums by their ids
SpotifyRequestor.prototype.getAlbums = function(ids) {
    // TODO - cache the artists we have already retrieved by their id

    // Spotify only lets us request 20 albums at a time
    return this._getCollectionFromIds(ids, 20, "getAlbums",
        this.s.getAlbums.bind(this), 
        function(album) {
            // Make sure this list is kept in sync with the saved albums endpoint    
            return {
                "artist_id": album.artists[0].id,
                "genre1": album.genres[0] || null,
                "genre2": album.genres[1] || null,
                "href": album.href,
                "id": album.id,
                "image_link": album.images[0] ? album.images[0].url : null,
                "name": album.name,
                "popularity": album.popularity,
                "release_date": album.release_date,
                "type": album.type,
                "uri": album.uri                      
            };
        },
        function(data) { return data.albums; });
}

// Gets track features by their ids
SpotifyRequestor.prototype.getTrackFeatures = function(ids) {
    // TODO - cache the tracks we have already retrieved by their id

    return this._getCollectionFromIds(ids, 100, "getTrackFeatures",
        this.s.getAudioFeaturesForTracks.bind(this), 
        function(audioFeature) {
            var keyLookup = {
                0 : "C",
                1 : "C♯",
                2 : "D",
                3 : "E♭",
                4 : "E",
                5 : "F",
                6 : "F♯",
                7 : "G",
                8 : "A♭",
                9 : "A",
                10 : "A♯",
                11 : "B" };
            return {
                "danceability": audioFeature.danceability,
                "energy": audioFeature.energy,
                "key": keyLookup[audioFeature.key],
                "loudness": audioFeature.loudness,
                "mode": audioFeature.mode == 1 ? "Major" : "Minor",
                "speechiness": audioFeature.speechiness,
                "acousticness": audioFeature.acousticness,
                "instrumentalness": audioFeature.instrumentalness,
                "liveness": audioFeature.liveness,
                "valence": audioFeature.valence,
                "tempo": audioFeature.tempo,
                "time_signature": audioFeature.time_signature
            }
        },
        function(data) { return data.audio_features; });
}
