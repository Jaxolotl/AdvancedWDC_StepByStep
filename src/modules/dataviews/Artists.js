
import DataView from './DataView';
import Q from 'q';
import _ from 'lodash';
import TableauShim from '../TableauShim';

/**
 * 
 */
class Artists extends DataView {

    /**
     * 
     * @param {Object} $0
     * @param {Array} $0.columns
     * 
     * @returns {Object} this
     */
    defineMappingRules ({ columns } = {}) {

        let [...rules] = columns;

        for (let i = 0; i < rules.length; i++) {

            let col = rules[i];

            switch (col.id) {
                case 'id':
                    col.lookup = 'id';
                    break;
                case 'followers':
                    col.lookup = 'followers.total';
                    break;
                case 'genre1':
                    col.lookup = 'genres[0]';
                    break;
                case 'genre2':
                    col.lookup = 'genres[1]';
                    break;
                case 'href':
                    col.lookup = 'href';
                    break;
                case 'image_link':
                    col.lookup = 'images[0].url';
                    break;
                case 'name':
                    col.lookup = 'name';
                    break;
                case 'popularity':
                    col.lookup = 'popularity';
                    break;
                case 'uri':
                    col.lookup = 'uri';
                    break;
            }
        }

        this.mapping.addRules(rules);

        return this;
    }

    /**
     * @param {Object} $0
     * @param {Function} $0.dataProgressCallback callback to send the data to Tableau
     * @param {Object} $0.filterValues list of IDS for the request
     * @param {Function<Q.Deferred>} $0.defer Deferred object to pass the promise along the recursion
     * 
     * @returns {Object} Promise/A+
     * 
     */
    getFlattenedData ({ dataProgressCallback, filterValues = [], defer = Q.defer() } = {}) {

        let ids = filterValues.splice(0, 50);

        /**
         * no ids?
         * resolve and get out
         */
        if (!ids.length) {
            defer.resolve();
            return defer.promise;
        }

        TableauShim.reportProgress(`Retrieving ${ids.length} Artists\n ${filterValues.length} remaining`);

        this.requestor.getArtists({ ids: filterValues }).then((response) => {

            let { artists: items } = _.get(response, 'body');

            /**
             * No more data?
             * Resolve the promise and return it
             */
            if (!items.length) {
                defer.resolve();
                return defer.promise;
            }

            let flattenedData = this.mapping.flattenData(items);

            /**
             * Send the flattened data to tableau and release memory
             */
            dataProgressCallback(flattenedData);

            /**
             * oh! we have more data
             * Let's get it!
             */
            this.getFlattenedData({ dataProgressCallback, defer, filterValues });

        }).catch(defer.reject);

        return defer.promise;
    }
}

export default Artists;
