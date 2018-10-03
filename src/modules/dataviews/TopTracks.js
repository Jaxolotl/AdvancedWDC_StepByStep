
import DataView from './DataView';
import Q from 'q';
import _ from 'lodash';

/**
 * 
 */
class TopTracks extends DataView {

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
                case 'album_id':
                    col.lookup = 'album.id';
                    break;
                case 'artist_id':
                    col.lookup = 'artists[0].id';
                    break;
                case 'artist_name':
                    col.lookup = 'artists[0].name';
                    break;
                case 'duration_ms':
                    col.lookup = 'duration_ms';
                    break;
                case 'explicit':
                    col.lookup = 'explicit';
                    break;
                case 'href':
                    col.lookup = 'href';
                    break;
                case 'id':
                    col.lookup = 'id';
                    break;
                case 'name':
                    col.lookup = 'name';
                    break;
                case 'preview_url':
                    col.lookup = 'preview_url';
                    break;
                case 'track_number':
                    col.lookup = 'track_number';
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
     * @returns {Object} Promise/A+
     * 
     */
    getFlattenedData () {

        return this.requestor.getTopTracks().then((response) => {

            let { items } = _.get(response, 'body');

            let flattenedData = this.mapping.flattenData(items);

            return Q(flattenedData);
        });
    }
}

export default TopTracks;
