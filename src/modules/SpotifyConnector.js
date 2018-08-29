import Connector from './Connector';
import TableauShim from './TableauShim';

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

        // show our UI on prompting authentication
        TableauShim.authType = TableauShim.authTypeEnum.custom;

        initCallback();

    }

    /**
     *
     * @param {object} connectionData
     * @param {function} done
     * @returns {undefined}
     */
    setHeaders (connectionData, done) {
        TableauShim.log('Setting headers');
    }

    /**
     *
     * @param {string} tableId
     * @param {function} done
     * @param {function} dataProgressCallback
     * @returns {undefined}
     */
    setData (tableId, done, dataProgressCallback) {
        TableauShim.log('Setting data');
    }

}

export default SpotifyConnector;
