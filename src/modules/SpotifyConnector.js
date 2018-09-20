import _ from 'lodash';
import Connector from './Connector';
import TableauShim from './TableauShim';
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
        TableauShim.log(`Connector.Init -> ${TableauShim.phase}`);

        let spotifyAuthentication = new SpotifyAuthentication();
        let tokens = spotifyAuthentication.getTokens();

        if (tokens) {
            // YAY! we're authenticated
            spotifyAuthentication.saveTokens(tokens);

            switch (TableauShim.phase) {
                // ##### INTERACTIVE PHASE
                case TableauShim.phaseEnum.interactivePhase:

                    this.toggleUIState('content');
                    initCallback();

                    break;
                // ##### AUTH PHASE
                case TableauShim.phaseEnum.authPhase:

                    initCallback();
                    this.submit();

                    break;
                // ##### DATA GATHERING
                case TableauShim.phaseEnum.gatherDataPhase:

                    initCallback();

                    break;

            }

        } else {
            // No Tokens :(
            // authentication is required

            switch (TableauShim.phase) {
                // ##### INTERACTIVE PHASE
                case TableauShim.phaseEnum.interactivePhase:

                    this.toggleUIState('signIn');

                    break;
                // ##### AUTH PHASE
                case TableauShim.phaseEnum.authPhase:

                    this.toggleUIState('signIn');

                    break;
                // ##### DATA GATHERING
                case TableauShim.phaseEnum.gatherDataPhase:

                    // no tokens, this is an error during data gathering phase
                    TableauShim.abortForAuth('Missing SpotifyAuthentication!');
                    break;

            }
        }

    }

    /**
     *
     * @param {function} done
     * @returns {undefined}
     */
    setSchema (done) {

        if (_.isEmpty(TableauShim.connectionData)) {
            // connectionData is empty
            done([]);
            return;
        }

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

        done();

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
     * 
     * @returns {Undefined}
     */
    redirectToSignIn () {

        TableauShim.log('Redirecting to login page');

        window.location.href = '/login';
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

            window.jQuery('#getdata').click(() => this.saveConfiguration());

            window.jQuery('#signIn').click(() => this.redirectToSignIn());

        });

    }

}

export default SpotifyConnector;
