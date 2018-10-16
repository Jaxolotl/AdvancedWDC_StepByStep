
import DataView from './DataView';
import Q from 'q';
import _ from 'lodash';

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
     * @param {Object} $0.filterValues list of IDS for the request
     * 
     * @returns {Object} Promise/A+
     * 
     */
    getFlattenedData ({ filterValues = [] } = {}) {

        return this.requestor.getArtists({ ids: filterValues }).then((response) => {

            let { artists: items } = _.get(response, 'body');

            let flattenedData = this.mapping.flattenData(items);

            return Q(flattenedData);
        });
    }
}

export default Artists;
