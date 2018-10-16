
/**
 * 
 */
class Schema {
    /**
     * 
     * @param {Object} $0
     * @param {Object<Requestor>} $0.requestor
     */
    constructor ({ requestor } = {}) {
        this.requestor = requestor;
    }

    /**
     * @returns {Object} Promise/A+
     */
    retrieveSchema () {
        return this.requestor.retrieveSchema();
    }
}

export default Schema;
