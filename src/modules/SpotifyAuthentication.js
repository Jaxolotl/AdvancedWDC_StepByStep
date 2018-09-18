import TableauShim from './TableauShim';

/**
 * Obtains parameters from the hash of the URL
 * @returns {Object}
 */
function getHashParams () {
    let hashParams = {};
    let r = /([^&;=]+)=?([^&;]*)/g;
    let q = window.location.hash.substring(1);
    let e;

    while (e = r.exec(q)) { // eslint-disable-line no-cond-assign
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }

    return hashParams;
}

/**
 * Helper object which abstracts away most of the authentication related connector functionality
 */
class SpotifyAuthentication {

    /**
     * Checks whether or not we have saved authentication tokens available
     * @returns {Boolean}
     */
    hasTokens () {
        TableauShim.log('Checking if we have auth tokens');

        let result = this.getTokens();

        return !!result.access_token && !!result.refresh_token;
    }

    /**
     * Gets the access_token and refresh_token from either tableau.password or query hash
     * @returns {Object}
     */
    getTokens () {

        // We've saved off the access & refresh token to tableau.password
        if (TableauShim.password) {

            TableauShim.log('Grabbing authentication from tableau.password');

            return JSON.parse(TableauShim.password);

        } else {

            TableauShim.log('Grabbing authentication from query hash');

            return getHashParams();
        }
    }

    /**
     * Gets just the access token needed for making requests
     * @returns {String}
     */
    getAccessToken () {
        return this.getTokens().access_token;
    }

    /**
     * Note: Refresh tokens are valid forever, just need to get a new access token.
     * Refresh tokens can me manually revoked but won't expire
     *
     * @param {Function} doneHandler
     * @returns {Object} Promise
     */
    refreshToken (doneHandler) {
        TableauShim.log('Requesting refreshToken');

        return window.jQuery.ajax({
            url: '/refresh_token',
            data: {
                'refresh_token': this.getTokens().refresh_token
            }
        }).done(function (data) {
            doneHandler(data.access_token);
        });
    }
}

export default SpotifyAuthentication;
