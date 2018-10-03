import Mapping from '../Mapping';

/**
 * 
 */
class DataView {

    /**
     * 
     * @param {Object} $0
     * @param {Object<Requestor>} $0.requestor 
     * @param {String} $0.id TableId
     */
    constructor ({ requestor, id } = {}) {
        this.requestor = requestor;
        this.id = id;
        this.mapping = new Mapping();
    }

}

export default DataView;
