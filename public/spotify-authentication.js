// Helper object which abstracts away most of the authentication related connector functionality
var SpotifyAuthentication = {
     // Obtains parameters from the hash of the URL
    _getHashParams : function getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while (e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    },

    // Checks whether or not we have saved authentication tokens available
    hasTokens : function() {
        console.log("Checking if we have auth tokens");
        var result = SpotifyAuthentication.getTokens();
        return !!result.access_token && !!result.refresh_token;
    },

    // Gets the access_token and refresh_token from either tableau.password or query hash
    getTokens : function() {
        var result = {};

        // We've saved off the access & refresh token to tableau.password
        if (tableau.password) {
            console.log("Grabbing authentication from tableau.password");
            result = JSON.parse(tableau.password);
        } else {
            console.log("Grabbing authentication from query hash")
            result = SpotifyAuthentication._getHashParams();
        }

        return result;
    },

    // Gets just the access token needed for making requests
    getAccessToken : function() {
        return SpotifyAuthentication.getTokens().access_token;
    },

    // Note: Refresh tokens are valid forever, just need to get a new access token.
    // Refresh tokens can me manually revoked but won"t expire
    refreshToken: function(doneHandler) {
        console.log("Requesting refreshToken");
        return $.ajax({
            url: "/refresh_token",
            data: {
                "refresh_token": refresh_token
            }
        }).done(function(data) {
            doneHandler(data.access_token);
        });
    }
};