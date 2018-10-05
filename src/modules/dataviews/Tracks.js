
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
                    col.lookup = 'track.artist_name[0].id';
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

                // from Track Properties ( to retrieve later and join here? or to make it a separate dataview for users to join? )
                case 'danceability':
                    col.lookup = 'danceability';
                    break;
                case 'energy':
                    col.lookup = 'energy';
                    break;
                case 'key':
                    col.lookup = 'keyLookup[key]';
                    col.transform = (key) => {
                        let keyLookup = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'A♯', 'B'];
                        return keyLookup[key];
                    };
                    col.defaultValue = null;
                    break;
                case 'loudness':
                    col.lookup = 'loudness';
                    break;
                case 'mode':
                    col.lookup = 'mode';
                    col.transform = (mode) => {
                        switch (parseInt(mode, 10)) {
                            case 0:
                                return 'Minor';
                            case 1:
                                return 'Major';
                            default:
                                return mode;
                        }
                    };
                    col.defaultValue = null;
                    break;
                case 'speechiness':
                    col.lookup = 'speechiness';
                    break;
                case 'acousticness':
                    col.lookup = 'acousticness';
                    break;
                case 'instrumentalness':
                    col.lookup = 'instrumentalness';
                    break;
                case 'liveness':
                    col.lookup = 'liveness';
                    break;
                case 'valence':
                    col.lookup = 'valence';
                    break;
                case 'tempo':
                    col.lookup = 'tempo';
                    break;
                case 'time_signature':
                    col.lookup = 'time_signature';
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
