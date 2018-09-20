import TableauShim from './TableauShim';
import _ from 'lodash';

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
     * Gets the access_token and refresh_token from either tableau.password or query hash
     * Return false if those properties are not found
     * @returns {Object|Boolean}
     */
    getTokens () {

        let tokens = {};

        // We've saved off the access & refresh token to tableau.password
        if (TableauShim.password) {

            TableauShim.log('Grabbing authentication from tableau.password');
            tokens = TableauShim.passwordData;

        } else {

            TableauShim.log('Grabbing authentication from query hash');
            tokens = getHashParams();

        }

        if (_.get(tokens, 'access_token') && _.get(tokens, 'refresh_token')) {
            return Object.assign({}, tokens);
        }

        return false;

    }

    /**
     * @param {Object} $0
     * @param {String} $.access_token
     * @param {String} $.refresh_token
     * @returns {Undefined}
     */
    saveTokens ({ access_token, refresh_token } = {}) {

        if (!access_token || !refresh_token) {
            throw new Error('SpotifyAuthentication.setTokens value must contain access_token and refresh_token');
        }

        TableauShim.passwordData = { access_token, refresh_token };
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
