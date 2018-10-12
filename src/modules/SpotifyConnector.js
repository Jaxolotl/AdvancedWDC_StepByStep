import _ from 'lodash';
import Connector from './Connector';
import TableauShim from './TableauShim';
import Authentication from './Authentication';
import UI from './UI';
import TERMS from './termsDictionary';
import Requestor from './Requestor';
import Schema from './Schema';
import ErrorHelper from './ErrorHelper';

import TopArtists from './dataviews/TopArtists';
import TopTracks from './dataviews/TopTracks';
import Albums from './dataviews/Albums';
import Tracks from './dataviews/Tracks';
import TracksFeatures from './dataviews/TracksFeatures';
import Artists from './dataviews/Artists';

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

        let authentication = new Authentication();
        let tokens = authentication.getTokens();

        this.requestor = new Requestor({ authentication });

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
            authentication.saveUsername(`${TERMS.CONNECTOR_NAME}: ${(new Date()).toLocaleString()}`);
            authentication.saveTokensToPassword(tokens);

            switch (TableauShim.phase) {

                /**
                 * INTERACTIVE PHASE
                 * 
                 * @see http://tableau.github.io/webdataconnector/docs/wdc_phases#phase-one
                 */
                case TableauShim.phaseEnum.interactivePhase:

                    /**
                     * User will need to interact with the connector
                     * In this case we show the filters page
                     */
                    UI.toggleUIState('content');
                    UI.setFilterFromConnectionData();
                    /**
                     * Init is completed
                     */
                    initCallback();

                    break;
                /**
                 * DATA GATHERING
                 * 
                 * @see http://tableau.github.io/webdataconnector/docs/wdc_phases#phase-two
                 */
                case TableauShim.phaseEnum.gatherDataPhase:

                    /**
                     * Init is completed
                     * Tell tableau to continue.
                     * On Tableau Desktop this phase will occur on an headless browser,
                     * hence no UI will be displayed
                     */
                    initCallback();

                    break;
                /**
                 * AUTH PHASE
                 * 
                 * @see http://tableau.github.io/webdataconnector/docs/wdc_phases#phase-three
                 */
                case TableauShim.phaseEnum.authPhase:

                    /**
                     * Init is completed
                     */
                    initCallback();
                    /**
                     * Just tell tableau we're done.
                     * 
                     * Updates to properties other than tableau.username and tableau.password
                     * will be ignored during this phase and we already have those defined.
                     */
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

                    /**
                     * Display the sign in UI
                     */
                    UI.toggleUIState('signIn');

                    break;
                /**
                 * DATA GATHERING
                 */
                case TableauShim.phaseEnum.gatherDataPhase:

                    /**
                     * 
                     * On Tableau Desktop this phase will occur on an headless browser,
                     * hence no UI will be displayed,
                     * 
                     * but WAIT!!
                     * 
                     * no tokens???!
                     * this is an error!
                     * You can't get no data if you ain't got no tokens ( Yo Victor! You can't hold no groove if you ain't got no pocket. )
                     */
                    TableauShim.abortForAuth(TERMS.ERROR.SAVE_TOKENS_TO_PASSWD);

                    break;
                /**
                 * AUTH PHASE
                 */
                case TableauShim.phaseEnum.authPhase:

                    /**
                     * Display the sign in UI
                     */
                    UI.toggleUIState('signIn');

                    break;

            }
        }

    }

    /**
     * 
     * 
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.schemacallback
     * @param {function} done an async wrapper of SchemaCallback
     * 
     * @returns {undefined}
     */
    schema (done) {

        if (_.isEmpty(TableauShim.connectionData)) {
            /**
             * If no connection data we assume to be here after authPhase
             * ( @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.phaseenum )
             * In which case the schema, isn't writable
             */
            done([]);
            return;
        }

        let schema = new Schema({ requestor: this.requestor });

        // retrieve the schema
        schema.retrieveSchema().then((schema) => {

            /**
             * Destructure schema object for documentation purpose
             */
            let { tables, standardConnections } = schema;
            /**
             * Pass along the params required by the SchemaCallback signature
             * 
             * @argument {Array} Array<TableInfo>
             * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableinfo-1
             * 
             * @argument {Array} Array<StandardConnection>
             * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.standardconnection
             * 
             */
            done({ tables, standardConnections });

        }).catch((reason) => {
            /**
             * something went wrong during schema retrieval
             * Let's communicate the error and log it
             */

            // error for developers to be logged
            ErrorHelper.createError('Connector.schema ->', JSON.stringify(reason)).log();

            // error to the user
            TableauShim.abortWithError(TERMS.ERROR.DEFAULT_ERROR);
        });

    }

    /**
     * 
     * @param {Object} $0 Object for destructuring
     * 
     * tableId:
     *      The id value of the current requested Table ( Table.tableInfo.id ) since this will cover most of the common usage cases
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableinfo-1.id-1
     * @param {string} $0.tableId
     * 
     * done:
     *      Accept 1 parameter which will be passed to table.appendRows()
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.table.appendrows
     * and finally will call DataDoneCallback
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.datadonecallback
     * @param {function} $0.done
     * 
     * dataProgressCallback:
     *      Wrapper of Table:appendRows
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.table.appendrows
     * @param {function} $0.dataProgressCallback
     * 
     * tableProperties:
     *      Serializable data of Table object
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.table
     * @param {function} $0.tableProperties
     * 
     * @returns {undefined}
     */
    data ({ tableId, done, dataProgressCallback, tableProperties } = {}) { // eslint-disable-line no-unused-vars

        /**
         * Destructure tableProperties object for documentation purpose
         */
        let {
            /**
             * Do we have documentation for this?
             */
            filterColumnId, // eslint-disable-line no-unused-vars
            /**
             * An array of the values to use for filtering.
             * For example, an array of the user ID values to get data for.
             * @see http://tableau.github.io/webdataconnector/docs/wdc_join_filtering.html
             */
            filterValues,
            /**
             * Value assigned for incremental refreshes
             * 
             * @see http://tableau.github.io/webdataconnector/docs/wdc_incremental_refresh
             * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.table.incrementvalue
             */
            incrementValue, // eslint-disable-line no-unused-vars
            /**
             * Whether the table can be used for join filtering.
             * If the schema properties are set correctly, this equals true.
             * 
             * @see http://tableau.github.io/webdataconnector/docs/wdc_join_filtering.html
             */
            isJoinFiltered // eslint-disable-line no-unused-vars

        } = tableProperties;

        let dataView = this.getDataViewInstance({ tableId, tableProperties });

        /**
         * We send the filter values to the "requesting data" mechanism to be consumed where needed
         * @argument {Array} filterValues
         * 
         * We pass the dataProgressCallback as argument so that the "requesting data" mechanism can consume it
         * @argument {Function} dataProgressCallback
         * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.table.appendrows
         */
        return dataView.getFlattenedData({ filterValues, dataProgressCallback }).then(() => {

            /**
             * We're done so we don't need to send more data to Tableau for this Table
             * Let tableau know we're done
             * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.datadonecallback
             */
            done();

        }).catch((reason) => {
            /**
             * d'oh! something went wrong during data retrieval!
             * Let's communicate the error and log it
             */

            // error for developers to be logged
            ErrorHelper.createError('Connector.data ->', JSON.stringify(reason)).log();

            // error to the user
            TableauShim.abortWithError(reason.customMessage || TERMS.ERROR.DEFAULT_ERROR);
        });

    }

    /**
     * This method is just documentational, it'd be better to follow a design pattern ( e.g Factory, Builder )
     * @see https://loredanacirstea.github.io/es6-design-patterns/
     * 
     * @param {Object} $0
     * @param {Object} $0.tableId just the Table.id for easy documentation
     * @param {Object} $0.tableProperties Serializable data of Table object
     * 
     * @returns {Object} Instance of DataView
     */
    getDataViewInstance ({ tableId, tableProperties }) {

        /**
         * Connection data is the mechanism to pass data between phases (interacvite|gatherData|auth)
         * 
         * The TableauShim performs for you the "JSON.stringify <-> JSON.parse" overhead,
         * so you can pass an object and get always an object ( the shim will store the string for you ).
         * The data MUST be serializable, and it's gonna be stored on the workbook as human readable data, 
         * therefore YOU SHOULD NEVER pass sensitive information along connectionData
         * 
         * @see http://tableau.github.io/webdataconnector/docs/wdc_phases#pass-data-between-phases
         * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableau.connectiondata
         * 
         */
        let { filters = {} } = TableauShim.connectionData;

        let DataViewClass;

        switch (tableId) {
            case 'topArtists':
                DataViewClass = TopArtists;
                break;
            case 'topTracks':
                DataViewClass = TopTracks;
                break;
            case 'albums':
                DataViewClass = Albums;
                break;
            case 'tracks':
                DataViewClass = Tracks;
                break;
            case 'tracksFeatures':
                DataViewClass = TracksFeatures;
                break;
            case 'tracksArtists':
            case 'albumsArtists':
                DataViewClass = Artists;
                break;
            default:
                /**
                 * d'oh! something went wrong during data retrieval!
                 * Let's communicate the error and log it
                 */

                // error for developers to be logged
                ErrorHelper.createError('Connector.getDataViewInstance ->', `${tableId} not found on Data View Classes`).log();

                // error to the user
                throw new Error(TERMS.ERROR.DEFAULT_ERROR);
        }

        /**
         * We don't need to retrieve the table schema again,
         * Tableau will pass the stored columns info along with the table properties
         * 
         * Serializable information can be stored on the schema during schema definition and it'll be here
         * e.g you might add a prop name 'color': 'red' to a column and it'll be accessible here for that column
         */
        let { tableInfo: { columns } } = tableProperties;

        /**
         * Make the Data View instance and define the rules to map the incoming data
         */
        let DataViewInstance = new DataViewClass({ requestor: this.requestor, tableId, filters }).defineMappingRules({ columns });

        return DataViewInstance;
    }

}

export default SpotifyConnector;
