
import ADVANCED_SCHEMA from '../schemas/advancedSchemas';
import SpotifyWebApi from 'spotify-web-api-node';

export const DEFAULT_TIME_RANGE = 'short_term';
export const DEFAULT_OFFSET = 0;
export const DEFAULT_LIMIT = 50;

/**
 * Requestor
 * 
 * This class abstracts away most of the interaction with Spotify's API.
 * All methods return promises which will be resolved once the requested resource has been returned from Spotify
 */
class Requestor {

    /**
     * 
     * @param {Object} $0
     * @param {Object<Authentication>} $0.authentication
     * @param {Object<SpotifyWebApi>} $0.apiLib
     * 
     * @see apiLib https://github.com/thelinmichael/spotify-web-api-node
     */
    constructor ({ authentication, apiLib = new SpotifyWebApi() } = {}) {
        this.authentication = authentication;

        this.apiLib = apiLib;
        this.apiLib.setAccessToken(authentication.getAccessToken());
    }

    /**
     * 
     * @param {Object} $0
     * @param {String} $0.timeRange long_term|medium_term|short_term 
     * @param {Number} $0.offset
     * @param {Number} $0.limit
     * 
     * @see https://developer.spotify.com/documentation/web-api/reference/personalization/get-users-top-artists-and-tracks/#query-parameters
     * 
     * @returns {Object} Promise/A+
     */
    getTopArtists ({ timeRange = DEFAULT_TIME_RANGE, offset = DEFAULT_OFFSET, limit = DEFAULT_LIMIT } = {}) { // eslint-disable-line no-unused-vars

        return this.apiLib.getMyTopArtists({ time_range: timeRange, limit, offset });

    }

    /**
     * 
     * @param {Object} $0
     * @param {String} $0.timeRange long_term|medium_term|short_term 
     * @param {Number} $0.offset
     * @param {Number} $0.limit
     * 
     * @see https://developer.spotify.com/documentation/web-api/reference/personalization/get-users-top-artists-and-tracks/#query-parameters
     * 
     * @returns {Object} Promise/A+
     */
    getTopTracks ({ timeRange = DEFAULT_TIME_RANGE, offset = DEFAULT_OFFSET, limit = DEFAULT_LIMIT } = {}) { // eslint-disable-line no-unused-vars

        return this.apiLib.getMyTopTracks({ time_range: timeRange, limit, offset });

    }

    /**
     * 
     * @param {Object} $0
     * @param {String} $0.market 
     * @param {Number} $0.offset
     * @param {Number} $0.limit
     * 
     * @see https://developer.spotify.com/documentation/web-api/reference/library/get-users-saved-albums/
     * 
     * @returns {Object} Promise/A+
     */
    getAlbums ({ market, offset = DEFAULT_OFFSET, limit = DEFAULT_LIMIT } = {}) { // eslint-disable-line no-unused-vars

        return this.apiLib.getMySavedAlbums({ market, limit, offset });

    }

    /**
     * 
     * @param {Object} $0
     * @param {String} $0.market 
     * @param {Number} $0.offset
     * @param {Number} $0.limit
     * 
     * @see https://developer.spotify.com/documentation/web-api/reference/library/get-users-saved-tracks/
     * 
     * @returns {Object} Promise/A+
     */
    getTracks ({ market, offset = DEFAULT_OFFSET, limit = DEFAULT_LIMIT } = {}) { // eslint-disable-line no-unused-vars

        return this.apiLib.getMySavedTracks({ market, limit, offset });

    }

    /**
     * 
     * @param {Object} $0
     * @param {Array<Number>} $0.ids
     * 
     * A list of the Spotify IDs for the tracks.
     * Maximum: 100 IDs.
     * @see https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids
     * @see https://developer.spotify.com/documentation/web-api/reference/tracks/get-several-audio-features/
     * 
     * @returns {Object} Promise/A+
     */
    getTracksFeatures ({ ids = [] } = {}) {

        return this.apiLib.getAudioFeaturesForTracks(ids);

    }

    /**
     * 
     * @param {Object} $0
     * @param {Array<Number>} $0.ids
     * 
     * A list of the Spotify IDs for the artists. 
     * Maximum: 50 IDs.
     * @see https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids
     * @see https://developer.spotify.com/documentation/web-api/reference/artists/get-several-artists/
     * 
     * @returns {Object} Promise/A+
     */
    getArtists ({ ids = [] } = {}) {

        return this.apiLib.getArtists(ids);

    }

    /**
     * 
     * @returns {Object} Promise/A+
     */
    retrieveSchema () {
        /**
         * We use static schema but want to leave the door open for an async schema retrieval
         */
        return Promise.resolve(ADVANCED_SCHEMA);
    }
}

export default Requestor;
