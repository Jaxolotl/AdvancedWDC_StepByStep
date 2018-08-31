import _ from 'lodash';
import Q from 'q';
import TableauShim from './TableauShim';

/**
 * Base connector DRAFTS
 * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.webdataconnector
 */
class Connector {

    /**
     * Base override of tableau.init method
     * If a customInit function has been defined on the concrete connector
     * it will be executed, then it will call tableau.initCallback
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
     * It also passes the tableau.connectionData values to the concrete connector setSchema()
     *
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.webdataconnector.getschema
     *
     * @param {Function} schemaCallback function to be called when table schema is ready to be informed
     *
     * @returns {Object} Promise/A+
     */
    getSchema (schemaCallback) {
        let defer = Q.defer();

        const done = (tables, standardConnections) => {
            defer.resolve({
                tables: tables,
                standardConnections: standardConnections
            });
        };

        defer.promise.then((p) => {
            // p.tables is required and represents the metadata about the table,
            // and p.standardConnections contains the metadata for standard connections, or predefined joins.

            // http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.schemacallback
            // http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.standardconnection
            schemaCallback(p.tables, p.standardConnections);
        });

        this.setSchema(done);

        return defer.promise;
    }

    /**
     * Wrapper for connector.getData
     * This separates the concrete connector implementation from the shim's one
     * It also passes the lastRecordToken values to the concrete connector setData()
     *
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.webdataconnector.getdata
     *
     * @param {Object} tableObject object describing the structure of the table being requested
     * @param {Function} dataDoneCallback function to be invoked when all data is gathered for the table.
     * @returns {undefined}
     */
    getData (tableObject, dataDoneCallback) {
        let defer = Q.defer();

        /**
         * You must call it to say data gathering for this table is done.
         *
         * @param {Array} data  structure: Array<Array<any>>
         * @returns {undefined}
         */
        const done = (data) => {
            defer.resolve(data);
        };

        /**
         * Used if we want to load data in chunks
         *
         * @param {Array} data , structure: Array<Array<any>>
         * @returns {undefined}
         */
        const dataProgressCallback = (data) => {
            tableObject.appendRows(data);
        };

        /**
         * This will contain all the scalar values that
         * provides information coming from Tableau shim, it will
         * not include functionality, this will be restricted to
         * the one proposed by WDC Framework
         *
         * @type Object
         */
        const tableInfoObject = JSON.parse(JSON.stringify(tableObject));

        defer.promise.then((rows) => {
            if (!_.isUndefined(rows)) {
                tableObject.appendRows(rows);
            }
            dataDoneCallback();
        });

        this.setData(tableObject.tableInfo.id, done, dataProgressCallback, tableInfoObject);
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

    /**
     * Wrapper for tableau.submit
     * @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.tableau.submit
     *
     * @returns {undefined}
     */
    submit () {
        TableauShim.submit();
    }
}

export default Connector;
