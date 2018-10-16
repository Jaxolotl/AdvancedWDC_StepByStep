
import DataView from './DataView';
import Q from 'q';
import _ from 'lodash';

/**
 * 
 */
class Tracks extends DataView {

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
                case 'added_at':
                    col.lookup = 'added_at';
                    break;
                case 'album_id':
                    col.lookup = 'track.album.id';
                    break;
                case 'artist_id':
                    col.lookup = 'track.artists[0].id';
                    break;
                case 'artist_name':
                    col.lookup = 'track.artists[0].name';
                    break;
                case 'duration_ms':
                    col.lookup = 'track.duration_ms';
                    break;
                case 'explicit':
                    col.lookup = 'track.explicit';
                    break;
                case 'href':
                    col.lookup = 'track.href';
                    break;
                case 'id':
                    col.lookup = 'track.id';
                    break;
                case 'name':
                    col.lookup = 'track.name';
                    break;
                case 'preview_url':
                    col.lookup = 'track.preview_url';
                    break;
                case 'track_number':
                    col.lookup = 'track.track_number';
                    break;
                case 'uri':
                    col.lookup = 'track.uri';
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

        return this.requestor.getTracks().then((response) => {

            let { items } = _.get(response, 'body');

            let flattenedData = this.mapping.flattenData(items);

            return Q(flattenedData);
        });
    }
}

export default Tracks;
