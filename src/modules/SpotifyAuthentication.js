import TableauShim from './TableauShim';
import _ from 'lodash';
import TERMS from './termsDictionary';
import $ from 'jquery';

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
     * 
     * @returns {Object|Boolean}
     */
    getTokens () {

        let tokens = {};

        // We've saved off the access & refresh token to tableau.password
        if (TableauShim.password) {
            /**
             * It seems we have password stored
             */
            tokens = TableauShim.passwordData;

        } else {
            /**
             * No password stored, are we coming back from Spotify auth flow?
             */
            tokens = getHashParams();

        }

        /**
         * Make sure the required values are there
         */
        if (_.get(tokens, 'access_token') && _.get(tokens, 'refresh_token')) {
            // send a shallow compy of tokens
            return Object.assign({}, tokens);
        }

        return false;

    }

    /**
     * @param {Object} $0
     * @param {String} $.access_token
     * @param {String} $.refresh_token
     * 
     * @returns {Undefined}
     */
    saveTokensToPassword ({ access_token, refresh_token } = {}) {

        if (!access_token || !refresh_token) {
            throw new Error(TERMS.ERROR.SAVE_TOKENS_TO_PASSWD);
        }

        TableauShim.passwordData = { access_token, refresh_token };
    }

    /**
     * 
     * @param {String} username 
     * 
     * @returns {Undefined}
     */
    saveUsername (username = '') {
        TableauShim.username = username;
    }

    /**
     * Gets just the access token needed for making requests
     * 
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

        return $.ajax({
            url: `/refresh_token?authPurpose=${TableauShim.authPurpose}`,
            data: {
                'refresh_token': this.getTokens().refresh_token
            }
        }).done((data) => {

            doneHandler(data.access_token);

        }).fail(() => {
            // something went wrong, lets communicate that
            throw new Error(TERMS.ERROR.UNABLE_TO_REFRESH_TOKENS);

        });
    }
}

export default SpotifyAuthentication;
