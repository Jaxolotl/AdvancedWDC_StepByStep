"use strict";
var spotifyRequestor;

// Define our Web Data Connector
(function() {
    var myConnector = tableau.makeConnector();

    myConnector.init = function(initCallback){
        console.log("Initializing Web Data Connector. Phase is " + tableau.phase);

        // STEP 1 - WDC IS LOADED
        if (!SpotifyAuthentication.hasTokens()) {
            console.log("We do not have SpotifyAuthentication tokens available");
            if (tableau.phase != tableau.phaseEnum.gatherDataPhase) {
                toggleUIState('signIn');
                var redirectToSignIn = function() {
                    // STEP 2 - REDIRECT TO LOGIN PAGE
                    console.log("Redirecting to login page");
                    window.location.href = "/login";
                };
                $("#signIn").click(redirectToSignIn);
                redirectToSignIn();
            } else {
                tableau.abortForAuth("Missing SpotifyAuthentication!");
            }

            // Early return here to avoid changing any other state
            return;
        }

        console.log("Access token found!");
        toggleUIState('content');

        // STEP 6 - TOKEN STORED IN TABLEAU PASSWORD
        console.log("Setting tableau.password to access_token and refresh tokens");
        tableau.password = JSON.stringify(SpotifyAuthentication.getTokens());

        var s = new SpotifyWebApi();
        s.setAccessToken(SpotifyAuthentication.getAccessToken());
        spotifyRequestor = new SpotifyRequestor(s, tableau.connectionData, tableau.reportProgress);
        
        console.log("Calling initCallback");
        initCallback();

        if (tableau.phase === tableau.phaseEnum.authPhase) {
            // Immediately submit if we are running in the auth phase
            tableau.submit();
        }
    };

    myConnector.getSchema = function(schemaCallback) {
        console.log("getSchema called. Making request to ./schema");
        $.getJSON( "./schema" )
        .done(function(scehma_json) {
            console.log("call to get schema finished");
            schemaCallback(scehma_json.tables, scehma_json.standardConnections);
        })
        .fail(function(jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Request Failed: " + err);
            tableau.abortWithError(err);
        });
    }

    myConnector.getData = function(table, doneCallback) {
        console.log("getData called for table " + table.tableInfo.id);
        var tableFunctions = {
            "topArtists": spotifyRequestor.getMyTopArtists.bind(spotifyRequestor),
            "topTracks": spotifyRequestor.getMyTopTracks.bind(spotifyRequestor),
            "artists": spotifyRequestor.getMySavedArtists.bind(spotifyRequestor),
            "albums": spotifyRequestor.getMySavedAlbums.bind(spotifyRequestor),
            "tracks": spotifyRequestor.getMySavedTracks.bind(spotifyRequestor)
        };

        if (!tableFunctions.hasOwnProperty(table.tableInfo.id)) {
            tableau.abortWithError("Unknown table ID: " + table.tableInfo.id);
            return;
        }

        tableFunctions[table.tableInfo.id]().then(function(rows) {
            table.appendRows(rows);
            doneCallback();
        }, function(error) {
             console.log("Error occured waiting for promises. Aborting");
             tableau.abortWithError(error.toString());
             doneCallback();
         });
    }

    tableau.registerConnector(myConnector);


    //-------------------------------Connector UI---------------------------//

    $(document).ready(function() {  
        $("#getdata").click(function() { // This event fires when a button is clicked
            setupConnector();
        });
    });

    function setupConnector() {
        tableau.connectionName = "Spotify Connector";
        tableau.connectionData = document.querySelector('input[name="term"]:checked').value;
        tableau.authType = tableau.authTypeEnum.custom;
        tableau.submit();
    };
    
    function toggleUIState(contentToShow) {
        var allIds = [
            '#spinner',
            '#content',
            '#signIn'
        ];

        for(var i in allIds) {
            $(allIds[i]).css('display', 'none');
        }

        $('#' + contentToShow).css('display', 'inline-block');
    }
})();
