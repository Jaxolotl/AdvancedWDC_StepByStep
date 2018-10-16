// import _ from 'lodash';
// import Q from 'q';
import TableauShim from './TableauShim';

/**
 * Base connector DRAFTS
 * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.webdataconnector
 */
class Connector {

    /**
     * Base override of tableau.init method
     *
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.webdataconnector.init
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.initcallback
     *
     * @param {Function} initCallback
     * @returns {undefined}
     */
    init (initCallback) {
        initCallback();
    }

    /**
     * Simple wrapper of tableau.shutdownCallback
     *
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.webdataconnector.shutdown
     * @param {Function} shutdownCallback
     * @returns {undefined}
     */
    shutdown (shutdownCallback) {
        shutdownCallback();
    }

    /**
     * Wrapper for connector.getSchema
     * This separates the concrete connector implementation from the shim's one
     *
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.webdataconnector.getschema
     *
     * @param {Function} schemaCallback function to be called when table schema is ready to be informed
     *
     * @returns {Undefined}
     */
    getSchema (schemaCallback) {

        /**
         * 
         * @param {Object} $0
         * @param {Array} $0.tables (required) represents the metadata about the table
         * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.schemacallback
         * 
         * @param {Array} $0.standardConnections (optional) contains the metadata for standard connections, or predefined joins
         * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.standardconnection
         * 
         * @returns {Undefined}
         */
        const done = ({ tables, standardConnections } = {}) => {
            schemaCallback(tables, standardConnections);
        };

        this.schema(done);

    }

    /**
     * Wrapper for connector.getData
     * This separates the concrete connector implementation from the shim's one
     *
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.webdataconnector.getdata
     *
     * @param {Object} tableObject object describing the structure of the table being requested
     * @param {Function} dataDoneCallback function to be invoked when all data is gathered for the table.
     * @returns {undefined}
     */
    getData (tableObject, dataDoneCallback) {

        /**
         * You must call it to say data gathering for this table is done.
         * done is a more meaningful name for the function,
         * also wrapping this, opens the door for better control and testing
         * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.datadonecallback
         * @returns {undefined}
         */
        const done = () => {
            dataDoneCallback();
        };

        /**
         * Send data in chumks to Tableau
         * dataProgressCallback is a more meaningful name for the function,
         * also wrapping this, opens the door for better control and testing
         * 
         * @param {Array} data , structure: Array<Array<any>>
         * @returns {undefined}
         */
        const dataProgressCallback = (data) => {
            tableObject.appendRows(data);
        };

        /**
         * This will contain all the serializable structure and data that
         * provides information coming from Tableau shim, it will
         * not include functionality
         *
         * @type Object
         */
        const tableProperties = JSON.parse(JSON.stringify(tableObject));

        /**
         * Pass along tableId separately for easy consumption
         */
        let { tableInfo: { id: tableId } = {} } = tableObject;

        this.data({ tableId, done, dataProgressCallback, tableProperties });
    }

    /**
     * Wrapper for tableau.registerConnector
     * It calls tableau.registerConnector with this as parameter
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableau.registerconnector
     *
     * @returns {Object} this
     */
    register () {

        TableauShim.registerConnector(this);

        return this;
    }
}

export default Connector;
