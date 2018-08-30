import Connector from './Connector';
import TableauShim from './TableauShim';
import SpotifyWebApi from 'spotify-web-api-node';
import SpotifyAuthentication from './SpotifyAuthentication';

import schema from '../schemas/simple.json';

/**
 *
 */
class SpotifyConnector extends Connector {

    /**
     *
     * @param {Function} initCallback
     * @returns {undefined}
     */
    init (initCallback) {
        TableauShim.log(`Connector.Init: phase: ${TableauShim.phase}`);

        let spotifyAuthentication = new SpotifyAuthentication();

        // STEP 1 - WDC IS LOADED
        if (!spotifyAuthentication.hasTokens()) {

            TableauShim.log('We do not have SpotifyAuthentication tokens available');

            if (TableauShim.phase !== TableauShim.phaseEnum.gatherDataPhase) {

                this.toggleUIState('signIn');

                var redirectToSignIn = function () {

                    // STEP 2 - REDIRECT TO LOGIN PAGE
                    TableauShim.log('Redirecting to login page');

                    window.location.href = '/login';
                };

                window.jQuery('#signIn').click(redirectToSignIn);

                redirectToSignIn();

            } else {

                TableauShim.abortForAuth('Missing SpotifyAuthentication!');

            }

            // Early return here to avoid changing any other state
            return;
        }

        TableauShim.log('Access token found!');

        this.toggleUIState('content');

        // STEP 6 - TOKEN STORED IN TABLEAU PASSWORD
        TableauShim.log('Setting tableau.password to access_token and refresh tokens');

        TableauShim.password = JSON.stringify(spotifyAuthentication.getTokens());

        let spotifyWebApi = new SpotifyWebApi();
        spotifyWebApi.setAccessToken(spotifyAuthentication.getAccessToken());

        // let spotifyRequestor = new SpotifyRequestor(s, TableauShim.connectionData, TableauShim.reportProgress);

        TableauShim.log('Calling initCallback');
        initCallback();

        if (TableauShim.phase === TableauShim.phaseEnum.authPhase) {
            // Immediately submit if we are running in the auth phase
            this.submit();
        }

    }

    /**
     *
     * @param {object} connectionData
     * @param {function} done
     * @returns {undefined}
     */
    setHeaders (connectionData, done) { // eslint-disable-line no-unused-vars
        TableauShim.log('Setting headers');

        done(schema.tables, schema.standardConnections);

    }

    /**
     *
     * @param {string} tableId
     * @param {function} done
     * @param {function} dataProgressCallback
     * @returns {undefined}
     */
    setData (tableId, done, dataProgressCallback) { // eslint-disable-line no-unused-vars
        TableauShim.log('Setting data');
    }

    /**
     * @param {String} contentToShow
     * @returns {Undefined}
     */
    toggleUIState (contentToShow) {
        let allIds = [
            '#spinner',
            '#content',
            '#signIn'
        ];

        for (let i in allIds) {
            window.jQuery(allIds[i]).css('display', 'none');
        }

        window.jQuery('#' + contentToShow).css('display', 'inline-block');
    }

    /**
     * @returns {Undefined}
     */
    saveConfiguration () {

        TableauShim.authType = TableauShim.authTypeEnum.custom;

        TableauShim.connectionName = 'Spotify Connector';

        TableauShim.connectionData = {
            filterBy: document.querySelector('input[name="term"]:checked').value
        };

        this.submit();
    }

    /**
     * @returns {Undefined}
     */
    bootstrap () {
        /**
         *
         */
        window.jQuery(document).ready(() => {
            window.jQuery('#getdata').click(() => { // This event fires when a button is clicked
                this.saveConfiguration();
            });
        });

    }

}

export default SpotifyConnector;
