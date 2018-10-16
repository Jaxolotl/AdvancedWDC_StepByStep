
import DataView from './DataView';
import Q from 'q';
import _ from 'lodash';
import TableauShim from '../TableauShim';

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
                case 'id':
                    col.lookup = 'id';
                    break;
                case 'danceability':
                    col.lookup = 'danceability';
                    break;
                case 'energy':
                    col.lookup = 'energy';
                    break;
                case 'key':
                    col.lookup = 'key';
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
     * @param {Function} $0.dataProgressCallback callback to send the data to Tableau
     * @param {Object} $0.filterValues list of IDS for the request
     * @param {Function<Q.Deferred>} $0.defer Deferred object to pass the promise along the recursion
     * 
     * @returns {Object} Promise/A+
     * 
     */
    getFlattenedData ({ dataProgressCallback, filterValues = [], defer = Q.defer() } = {}) {

        /**
         * 
         * A list of the Spotify IDs for the tracks.
         * Maximum: 100 IDs.
         * @see https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids
         * @see https://developer.spotify.com/documentation/web-api/reference/tracks/get-several-audio-features/
         */
        let ids = filterValues.splice(-100);

        /**
         * no ids?
         * resolve and get out
         */
        if (!ids.length) {
            defer.resolve();
            return defer.promise;
        }

        TableauShim.reportProgress(`Retrieving ${ids.length} Tracks Features\n ${filterValues.length} remaining`);

        this.requestor.getTracksFeatures({ ids }).then((response) => {

            let { audio_features: items } = _.get(response, 'body');

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

export default TracksFeatures;
