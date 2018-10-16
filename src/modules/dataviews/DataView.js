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
     * @param {Object} $0.filters 
     */
    constructor ({ requestor, id, filters } = {}) {
        this.requestor = requestor;
        this.id = id;
        this.filters = filters;
        this.mapping = new Mapping();
    }

}

export default DataView;
