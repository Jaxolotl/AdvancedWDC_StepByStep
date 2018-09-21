import _ from 'lodash';
import Connector from './Connector';
import TableauShim from './TableauShim';
import SpotifyAuthentication from './SpotifyAuthentication';
import UI from './UI';
import TERMS from './termsDictionary';

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
            /**
             * We have authentication data!
             * Let store them to the right properties
             * 
             * Note:
             * Username and username alias:
             *      will be permanently stored as part of the workbook
             * 
             * Password:
             *      will be kept in memory but not persisted on the workbook or the extract.
             *      Though, they can be persisted on server by using the publishing options
             *      @see https://onlinehelp.tableau.com/current/online/en-us/to_fresh_data_saved_credentials.htm
             *      @see https://onlinehelp.tableau.com/current/pro/desktop/en-us/help.html#publishing_sharing_authentication.html
             */
            spotifyAuthentication.saveUsername(`${TERMS.CONNECTOR_NAME}: ${(new Date()).toLocaleString()}`);
            spotifyAuthentication.saveTokensToPassword(tokens);

            switch (TableauShim.phase) {

                /**
                 * INTERACTIVE PHASE
                 * 
                 * @see http://tableau.github.io/webdataconnector/docs/wdc_phases#phase-one
                 */
                case TableauShim.phaseEnum.interactivePhase:

                    UI.toggleUIState('content');
                    UI.setFilterFromConnectionData();
                    initCallback();

                    break;
                /**
                 * DATA GATHERING
                 * 
                 * @see http://tableau.github.io/webdataconnector/docs/wdc_phases#phase-two
                 */
                case TableauShim.phaseEnum.gatherDataPhase:

                    initCallback();

                    break;
                /**
                 * AUTH PHASE
                 * 
                 * @see http://tableau.github.io/webdataconnector/docs/wdc_phases#phase-three
                 */
                case TableauShim.phaseEnum.authPhase:

                    initCallback();
                    TableauShim.submit();

                    break;

            }

        } else {

            /**
             * No tokens found
             * It means this is new blind session
             * or
             * something went wrong we end up here without the necessary info for data gathering
             */

            switch (TableauShim.phase) {
                /**
                 * INTERACTIVE PHASE
                 */
                case TableauShim.phaseEnum.interactivePhase:

                    UI.toggleUIState('signIn');

                    break;
                /**
                 * DATA GATHERING
                 */
                case TableauShim.phaseEnum.gatherDataPhase:

                    // no tokens, this is an error during data gathering phase
                    TableauShim.abortForAuth(TERMS.ERROR.SAVE_TOKENS_TO_PASSWD);
                    break;
                /**
                 * AUTH PHASE
                 */
                case TableauShim.phaseEnum.authPhase:

                    UI.toggleUIState('signIn');

                    break;

            }
        }

    }

    /**
     * 
     * Done is an async wrapper of to SchemaCallback
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.schemacallback
     * @param {function} done
     * 
     * @returns {undefined}
     */
    schema (done) {

        if (_.isEmpty(TableauShim.connectionData)) {
            /**
             * If no connection data we assume to be here after authPhase ( @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.phaseenum )
             * In which case the schema, isn't writable
             */
            done([]);
            return;
        }

        /**
         * Pass along the params required by the SchemaCallback signature
         * 
         * @argument {Array} Array<TableInfo> @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableinfo-1
         * @argument {Array} Array<StandardConnection> @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.standardconnection
         * 
         */
        done([], []);

    }

    /**
     * 
     * The id value of the current requested Table ( Table.tableInfo.id ) since this will cover most of the common usage cases
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableinfo-1.id-1
     * @param {string} tableId
     * 
     * Accept 1 parameter which will be passed to table.appendRows()
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.table.appendrows
     * and finally will call DataDoneCallback
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.datadonecallback
     * @param {function} done
     * 
     * Reference to Table:appendRows
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.table.appendrows
     * @param {function} dataProgressCallback
     * 
     * Reference to Table
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.table
     * @param {function} tableInfoObject
     * 
     * @returns {undefined}
     */
    data (tableId, done, dataProgressCallback, tableInfoObject) { // eslint-disable-line no-unused-vars

        // send the rows to Tableau ( Array<Array<any>> )
        // @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.table.appendrows
        done([]);

    }

}

export default SpotifyConnector;
