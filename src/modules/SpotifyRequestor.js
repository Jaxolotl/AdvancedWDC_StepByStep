import TableauShim from './TableauShim';
import Q from 'q';

const DEFAULT_PAGE_SIZE = 50;
const DEFAULT_MAX_RESULTS = 1000;
const DEFAULT_RETRY_COUNT = 3;

/**
 * Helper function which will run fn more than once if the promise is rejected during execution.
 * fn must be a function which returns a promise
 * 
 * @param {Function} fn 
 * @param {String} actionDescription 
 * @param {Number} retryCount
 * 
 * @returns {Object} Promise/A+
 */
function runWithRetry (fn, actionDescription, retryCount = DEFAULT_RETRY_COUNT) {

    TableauShim.log(`Running with retryCount of ${retryCount}`);

    let defer = Q.defer();

    /**
     * 
     * @returns {Object} Promise/A+
     */
    function tryRunPromise () {

        fn().then((data) => {

            TableauShim.log(`Promise ${actionDescription} succeeded execution!`);

            defer.resolve(data);

        }, (error) => {
            let { statusCode } = error;
            TableauShim.log(`Error encountered. Current retryCount is = ${retryCount}`);
            let nextRetryTime = 500;

            if (retryCount > 0) {

                if (statusCode === 429) {
                    // @see https://developer.spotify.com/documentation/web-api/#rate-limiting
                    nextRetryTime = 10000;

                    TableauShim.reportProgress(`Waiting for API to enable retry due to rate limit`);

                }

                TableauShim.log(`${actionDescription} failed. Trying again.`);

                retryCount--;

                setTimeout(tryRunPromise, nextRetryTime);

            } else {
                TableauShim.log(`Out of retries, failing the call: ${actionDescription}`);

                defer.reject(error);
            }

        });
    }

    tryRunPromise();

    return defer.promise;
}

/**
 * Helper function to make a request which returns a promise 
 * and process the data which the call returns.
 * fn must be a function which returns a promise. 
 * rowProcessor will be called once for every row of data
 * returned by the resolved fn promise. 
 * rowsAccessor is an optional parameter to be called when fn resolves
 * to access the array of objects for rowProcessor to handle
 * 
 * @param {String} description 
 * @param {Function} fn 
 * @param {Function} rowProcessor 
 * @param {Function} rowsAccessor 
 * 
 * @returns {Object} Promise/A+
 */
function makeRequestAndProcessRows (description, fn, rowProcessor, rowsAccessor = (data) => { return data.items; }) {
    TableauShim.log(`Making request for ${description}`);

    // Run this request using the retry logic we have
    return runWithRetry(fn, description).then(function ({ body: data } = {}) {

        let unprocessedRows = rowsAccessor(data);

        TableauShim.log(`Received Results for  ${description}. Number of rows: ${unprocessedRows.length}`);

        let rows = unprocessedRows.map(rowProcessor);

        // Send back some paging information to the caller
        let paging = {
            offset: data.offset || 0,
            total: data.total || 0
        };

        return Promise.resolve({ rows, paging });
    });
}

/**
 * Helper function for paging through multiple requests.
 * Takes the same parameters as _makeRequestAndProcessRows, but
 * uses the returned paging information to make another request. 
 * the paging information will be applied to fn when
 * it is called for each new page
 * 
 * @param {String} description 
 * @param {Function} fn 
 * @param {Function} rowProcessor 
 * @param {Function} rowsAccessor  
 * @param {Number} defaultPageSize  
 * @param {Number} maxResults
 * 
 * @returns {Object} Promise/A+
 */
function makeRequestAndProcessRowsWithPaging (description, fn, rowProcessor, rowsAccessor, defaultPageSize = DEFAULT_PAGE_SIZE, maxResults = DEFAULT_MAX_RESULTS) {
    TableauShim.log(`Making request with paging for ${description}`);

    let allRows = [];

    // Define a getPage helper function for getting a single page of data
    let getPage = (limit, offset) => {

        TableauShim.log(`Getting a page of data with limit=${limit} and offset=${offset}`);

        return makeRequestAndProcessRows(
            description,
            // bind the limit and offset in here
            fn.bind(null, { limit: limit, offset: offset }),
            rowProcessor,
            rowsAccessor
        ).then((result) => {
            let nextOffset = result.paging.offset + defaultPageSize;

            let totalRows = result.paging.total < maxResults ? result.paging.total : maxResults;

            allRows = [...allRows, ...result.rows];

            TableauShim.log(`Received a page of data for ${description}. nextOffset is ${nextOffset}. totalRows is ${result.paging.total}. maxResults is ${maxResults}`);

            // Report our progress to the progress reporting function which was passed in
            TableauShim.reportProgress(`Received data for ${description}. Retrieved ${result.paging.offset} of ${totalRows}`);

            if (nextOffset < result.paging.total && nextOffset < maxResults) {

                return getPage(defaultPageSize, nextOffset);

            } else {

                TableauShim.log(`Done paging through results. Number of results was ${allRows.length}`);

                return Promise.resolve(allRows);
            }

        });

    };

    return getPage(defaultPageSize, 0);
}

/**
 * SpotifyRequestor
 * 
 * This class abstracts away most of the interaction with Spotify's API. All methods return promises
 * which will be resolved once the requested resource has been returned from Spotify
 */
class SpotifyRequestor {
    /**
     * 
     * @param {Object} spotifyWebApi instance of SpotifyWebApi
     * @param {String} timeRange [long_term|medium_term|short_term]
     */
    constructor (spotifyWebApi, timeRange) {
        this.spotifyWebApi = spotifyWebApi;
        this.timeRange = timeRange;
        this.defaultPageSize = DEFAULT_PAGE_SIZE;
        this.maxResults = DEFAULT_MAX_RESULTS;
        this.retryCount = DEFAULT_RETRY_COUNT;
    }

    /**
     * 
     * Helper function for calling a fn which takes in an array of ids. 
     * If the call has a limited blockSize, the requests will be broken up. 
     * The results will be recombined and returned in the same order as ids
     * 
     * @param {Array} ids 
     * @param {Number} blockSize 
     * @param {String} description 
     * @param {Function} fn 
     * @param {Function} rowProcessor 
     * @param {Function} rowsAccessor 
     * 
     * @returns {Object} Promise/A+
     */
    _getCollectionFromIds (ids, blockSize, description, fn, rowProcessor, rowsAccessor) {
        TableauShim.log(`Retrieving a collection for ${description}. ${ids.length} ids are requested with blockSize ${blockSize}`);

        // Request blockSize ids at a time
        blockSize = 3;
        let idBlocks = [];
        let currBlock;

        for (let i = 0; i < ids.length; i++) {
            if (!currBlock || currBlock.length === blockSize) {
                currBlock = [];
                idBlocks.push(currBlock);
            }

            currBlock.push(ids[i]);
        }

        TableauShim.log(`Created ${idBlocks.length} blocks`);

        // Allocate a results array which will insert all of our results into.
        // This must return the results in the order which ids were passed in
        let resultBlocks = new Array(idBlocks.length);

        let promises = [];

        for (let i = 0; i < idBlocks.length; i++) {

            // This function will get called when each promise finishes
            let insertValues = function (index, result) {
                // Place these values in their appropriate spot
                resultBlocks[index] = result.rows;
            }.bind(this, i);

            // Create a promise for each block
            promises.push(
                makeRequestAndProcessRows(
                    description,
                    fn.bind(this, idBlocks[i]),
                    rowProcessor,
                    rowsAccessor
                ).then(insertValues)
            );
        }

        // Once all the promises have finished, combine the resultBlocks into a single array
        return Promise.all(promises).then(function () {

            TableauShim.log(`All requests have finished. Combining arrays together for ${description}`);

            let merged = [].concat(...resultBlocks);

            return merged;
        });
    }

    /**
     * Gets the user's top artists for the given time range
     * 
     * @returns {Object} Promise/A+
     */
    getMyTopArtists () {

        if (this._myTopArtists) {
            TableauShim.log(`Returning cached list of top artists`);

            return Promise.resolve(this._myTopArtists);
        }

        return makeRequestAndProcessRows(
            'getMyTopArtists',
            this.spotifyWebApi.getMyTopArtists.bind(this.spotifyWebApi, { time_range: this.timeRange, limit: 50 }),
            /**
             * rowProcessor
             * 
             * @param {Object} artist
             * @returns {Object}
             */
            (artist) => {

                TableauShim.log(`Processing item ${artist.name}`);

                return {
                    'followers': artist.followers ? artist.followers.total : 0,
                    'genre1': artist.genres[0] || null,
                    'genre2': artist.genres[1] || null,
                    'href': artist.href,
                    'id': artist.id,
                    'image_link': artist.images[0] ? artist.images[0].url : null,
                    'name': artist.name,
                    'popularity': artist.popularity,
                    'uri': artist.uri
                };

            }
        ).then((result) => {
            // Cache this off in case we need it later
            TableauShim.log(`Finished retrieving top artists`);

            this._myTopArtists = result.rows;

            return Promise.resolve(result.rows);

        });
    }

    /**
     * Gets the user's top tracks for the given time range
     * 
     * @returns {Object} Promise/A+
     */
    getMyTopTracks () {

        if (this._myTopTracks) {
            TableauShim.log(`Returning cached list of top tracks`);
            return Promise.resolve(this._myTopTracks);
        }

        return makeRequestAndProcessRows(
            'getMyTopTracks',
            this.spotifyWebApi.getMyTopTracks.bind(this.spotifyWebApi, { time_range: this.timeRange, limit: 50 }),
            /**
             * rowProcessor
             * 
             * @param {Object} track
             * @returns {Object}
             */
            (track) => {
                TableauShim.log(`Processing track ${track.name}`);
                return {
                    'album_id': track.album.id,
                    'artist_id': track.artists[0].id,
                    'artist_name': track.artists[0].name,
                    'duration_ms': track.duration_ms,
                    'explicit': track.explicit,
                    'href': track.href,
                    'id': track.id,
                    'name': track.name,
                    'preview_url': track.preview_url,
                    'track_number': track.track_number,
                    'uri': track.uri
                };
            }
        ).then((result) => {
            // Cache this off in case we need it later
            TableauShim.log(`Finished retrieving top tracks`);

            this._myTopTracks = result.rows;

            return Promise.resolve(result.rows);

        });
    }

    /**
     * Gets the saved albums for this user
     * 
     * @returns {Object} Promise/A+
     */
    getMySavedAlbums () {

        if (this._mySavedAlbums) {
            TableauShim.log(`Returning cached list of saved albums`);

            return Promise.resolve(this._mySavedAlbums);
        }

        // First request whole albums which are saved to the library
        return makeRequestAndProcessRowsWithPaging(
            'getMySavedAlbums',
            this.spotifyWebApi.getMySavedAlbums.bind(this.spotifyWebApi),
            /**
             * rowProcessor
             * 
             * @param {Object} albumObject
             * @returns {Object}
             */
            (albumObject) => {

                TableauShim.log('Processing album ' + albumObject.album.name);

                return {
                    'added_at': albumObject.added_at,
                    'artist_id': albumObject.album.artists[0].id,
                    'genre1': albumObject.album.genres[0] || null,
                    'genre2': albumObject.album.genres[1] || null,
                    'href': albumObject.album.href,
                    'id': albumObject.album.id,
                    'image_link': albumObject.album.images[0] ? albumObject.album.images[0].url : null,
                    'name': albumObject.album.name,
                    'popularity': albumObject.album.popularity,
                    'release_date': albumObject.album.release_date,
                    'type': albumObject.album.type,
                    'uri': albumObject.album.uri
                };
            }
        ).then((savedAlbums) => {
            // To get the rest of the albums, we first get all the user's saved tracks, then retrieve album
            // info for those tracks.

            return this.getMySavedTracks().then((rows) => {
                let allAlbums = [];

                let albums = rows.map(function (row) {
                    return row.album_id;
                });

                for (let i in albums) {
                    if (allAlbums.indexOf(albums[i]) == -1) { // eslint-disable-line eqeqeq
                        allAlbums.push(albums[i]);
                    }
                }

                return this.getAlbums(allAlbums).then((addedAlbums) => {

                    let finalResults = [...savedAlbums, ...addedAlbums];

                    this._mySavedAlbums = finalResults;

                    return finalResults;

                });

            });

        });
    }

    /**
     * Gets the saved tracks for this user as well as some metrics for each track
     * 
     * @returns {Object} Promise/A+
     */
    getMySavedTracks () {

        if (this._mySavedTracks) {
            TableauShim.log(`Returning cached list of saved tracks`);

            return Promise.resolve(this._mySavedTracks);
        }

        return makeRequestAndProcessRowsWithPaging(
            'getMySavedTracks',
            this.spotifyWebApi.getMySavedTracks.bind(this.spotifyWebApi),
            /**
             * rowProcessor
             * 
             * @param {Object} trackObject
             * @returns {Object}
             */
            (trackObject) => {

                TableauShim.log('Processing track ' + trackObject.track.name);

                return {
                    'added_at': trackObject.added_at,
                    'album_id': trackObject.track.album.id,
                    'artist_id': trackObject.track.artists[0].id,
                    'artist_name': trackObject.track.artists[0].name,
                    'duration_ms': trackObject.track.duration_ms,
                    'explicit': trackObject.track.explicit,
                    'href': trackObject.track.href,
                    'id': trackObject.track.id,
                    'name': trackObject.track.name,
                    'preview_url': trackObject.track.preview_url,
                    'track_number': trackObject.track.track_number,
                    'uri': trackObject.track.uri
                };
            }
        ).then((rows) => {
            // We have retrieved all the tracks. Now let's decorate them with some metrics
            let ids = rows.map(function (row) {
                return row.id;
            });

            return this.getTrackFeatures(ids).then((trackFeatures) => {

                let finalResults = rows;

                for (let i = 0; i < trackFeatures.length; i++) {
                    for (let attrname in trackFeatures[i]) {
                        finalResults[i][attrname] = trackFeatures[i][attrname];
                    }
                }

                this._mySavedTracks = finalResults;

                return finalResults;

            });

        });
    }

    /**
     * Gets the saved artists for the user
     * 
     * @returns {Object} Promise/A+
     */
    getMySavedArtists () {

        if (this._mySavedArtists) {
            TableauShim.log(`Returning cached list of saved artists`);

            return Promise.resolve(this._mySavedArtists);
        }

        // To get artists, we first must get all the user's albums and tracks since
        // there isn't an endpoint for getting artists
        var allArtists = [];

        let appendArtists = function (rows) {
            let artists = rows.map(function (row) { return row.artist_id; });
            for (let i in artists) {
                if (allArtists.indexOf(artists[i]) == -1) { // eslint-disable-line eqeqeq
                    allArtists.push(artists[i]);
                }
            }
        };

        return Promise.all(
            [
                this.getMySavedAlbums().then(appendArtists),
                this.getMySavedTracks().then(appendArtists)
            ]
        ).then(() => {
            TableauShim.log(`Finished finding artists in albums and tracks. Number of artists=${allArtists.length}`);

            return this.getArtists(allArtists).then((finalResults) => {

                this._mySavedArtists = finalResults;
                return finalResults;

            });

        });
    }

    /**
     * Gets artists by their ids
     * 
     * @param {Array} ids 
     * @returns {Object} Promise/A+
     */
    getArtists (ids) {
        // TODO - cache the artists we have already retrieved by their id

        // Spotify only lets us request 50 artists at a time
        return this._getCollectionFromIds(
            ids,
            50,
            'getArtists',
            this.spotifyWebApi.getArtists.bind(this.spotifyWebApi),
            /**
             * rowProcessor
             * 
             * @param {Object} artist
             * @returns {Object}
             */
            (artist) => {
                return {
                    'followers': artist.followers ? artist.followers.total : 0,
                    'genre1': artist.genres[0] || null,
                    'genre2': artist.genres[1] || null,
                    'href': artist.href,
                    'id': artist.id,
                    'image_link': artist.images[0] ? artist.images[0].url : null,
                    'name': artist.name,
                    'popularity': artist.popularity,
                    'uri': artist.uri
                };
            },
            /**
             * rowsAccessor
             * 
             * @param {Object} response
             * @returns {Array}
             */
            (response) => {
                return response.artists;
            });
    }

    /**
     * Gets albums by their ids
     * 
     * @param {Array} ids 
     * @returns {Object} Promise/A+
     */
    getAlbums (ids) {
        // TODO - cache the artists we have already retrieved by their id

        // Spotify only lets us request 20 albums at a time
        return this._getCollectionFromIds(
            ids,
            20,
            'getAlbums',
            this.spotifyWebApi.getAlbums.bind(this.spotifyWebApi),
            /**
             * rowProcessor
             * 
             * @param {Object} album
             * @returns {Object}
             */
            (album) => {
                // Make sure this list is kept in sync with the saved albums endpoint    
                return {
                    'artist_id': album.artists[0].id,
                    'genre1': album.genres[0] || null,
                    'genre2': album.genres[1] || null,
                    'href': album.href,
                    'id': album.id,
                    'image_link': album.images[0] ? album.images[0].url : null,
                    'name': album.name,
                    'popularity': album.popularity,
                    'release_date': album.release_date,
                    'type': album.type,
                    'uri': album.uri
                };
            },
            /**
             * rowsAccessor
             * 
             * @param {Object} response
             * @returns {Array}
             */
            (response) => {
                return response.albums;
            });
    }

    /**
     * Gets track features by their ids
     * 
     * @param {Array} ids
     * @returns {Object} Promise/A+
     */
    getTrackFeatures (ids) {
        // TODO - cache the tracks we have already retrieved by their id

        return this._getCollectionFromIds(
            ids,
            100,
            'getTrackFeatures',
            this.spotifyWebApi.getAudioFeaturesForTracks.bind(this.spotifyWebApi),
            /**
             * rowProcessor
             * 
             * @param {Object} audioFeature
             * @returns {Object}
             */
            (audioFeature) => {

                let keyLookup = {
                    0: 'C',
                    1: 'C♯',
                    2: 'D',
                    3: 'E♭',
                    4: 'E',
                    5: 'F',
                    6: 'F♯',
                    7: 'G',
                    8: 'A♭',
                    9: 'A',
                    10: 'A♯',
                    11: 'B'
                };

                return {
                    'danceability': audioFeature.danceability,
                    'energy': audioFeature.energy,
                    'key': keyLookup[audioFeature.key],
                    'loudness': audioFeature.loudness,
                    'mode': audioFeature.mode == 1 ? 'Major' : 'Minor', // eslint-disable-line eqeqeq
                    'speechiness': audioFeature.speechiness,
                    'acousticness': audioFeature.acousticness,
                    'instrumentalness': audioFeature.instrumentalness,
                    'liveness': audioFeature.liveness,
                    'valence': audioFeature.valence,
                    'tempo': audioFeature.tempo,
                    'time_signature': audioFeature.time_signature
                };
            },
            /**
             * rowsAccessor
             * 
             * @param {Object} response
             * @returns {Array}
             */
            (response) => {
                return response.audio_features;
            }
        );
    }

}

export default SpotifyRequestor;
