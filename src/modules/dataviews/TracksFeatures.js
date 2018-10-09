
import DataView from './DataView';
import Q from 'q';
import _ from 'lodash';

/**
 * 
 */
class TracksFeatures extends DataView {

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
                // The Spotify ID for the track.
                case 'trackId':
                    col.lookup = 'id';
                    break;
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
     * @param {Object} $0
     * @param {Object} $0.filterValues list of IDS for the request
     * 
     * @returns {Object} Promise/A+
     * 
     */
    getFlattenedData ({ filterValues = [] } = {}) {

        return this.requestor.getTracksFeatures({ ids: filterValues }).then((response) => {

            let { audio_features: items } = _.get(response, 'body');

            let flattenedData = this.mapping.flattenData(items);

            return Q(flattenedData);
        });
    }
}

export default TracksFeatures;
