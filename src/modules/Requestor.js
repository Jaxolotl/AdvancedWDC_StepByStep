
import ADVANCED_SCHEMA from '../schemas/advancedSchemas';
import SpotifyWebApi from 'spotify-web-api-node';
import TableauShim from './TableauShim';
import TERMS from './termsDictionary';
// import Mapping from './Mapping';
// import _ from 'lodash';
// import Q from 'q';

// const DEFAULT_MAX_RESULTS = 1000;

export const DEFAULT_TIME_RANGE = 'short_term';
export const DEFAULT_OFFSET = 0;
export const DEFAULT_LIMIT = 50; // setting just 10 to show pagination later

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
     * @see https://github.com/thelinmichael/spotify-web-api-node
     * 
     * @see https://developer.spotify.com/documentation/web-api/reference/personalization/get-users-top-artists-and-tracks/#query-parameters
     * 
     * @returns {Object} Promise/A+
     */
    getTopArtists ({ timeRange = DEFAULT_TIME_RANGE, offset = DEFAULT_OFFSET, limit = DEFAULT_LIMIT } = {}) { // eslint-disable-line no-unused-vars

        TableauShim.reportProgress(`Retrieving Artists:\n ${TERMS.TIME_RANGE[timeRange.toUpperCase()]} \n offet:${offset} \n limit: ${limit}`);

        return this.apiLib.getMyTopArtists({ time_range: timeRange, limit, offset });

    }

    /**
     * 
     * @param {Object} $0
     * @param {String} $0.timeRange long_term|medium_term|short_term 
     * @param {Number} $0.offset
     * @param {Number} $0.limit
     * 
     * @see https://github.com/thelinmichael/spotify-web-api-node
     * 
     * @see https://developer.spotify.com/documentation/web-api/reference/personalization/get-users-top-artists-and-tracks/#query-parameters
     * 
     * @returns {Object} Promise/A+
     */
    getTopTracks ({ timeRange = DEFAULT_TIME_RANGE, offset = DEFAULT_OFFSET, limit = DEFAULT_LIMIT } = {}) { // eslint-disable-line no-unused-vars

        TableauShim.reportProgress(`Retrieving Tracks:\n ${TERMS.TIME_RANGE[timeRange.toUpperCase()]} \n offet:${offset} \n limit: ${limit}`);

        return this.apiLib.getMyTopTracks({ time_range: timeRange, limit, offset });

    }

    /**
     * 
     * @param {Object} $0
     * @param {String} $0.market 
     * @param {Number} $0.offset
     * @param {Number} $0.limit
     * 
     * @see https://github.com/thelinmichael/spotify-web-api-node
     * 
     * @see https://developer.spotify.com/documentation/web-api/reference/library/get-users-saved-albums/
     * 
     * @returns {Object} Promise/A+
     */
    getAlbums ({ market, offset = DEFAULT_OFFSET, limit = DEFAULT_LIMIT } = {}) { // eslint-disable-line no-unused-vars

        TableauShim.reportProgress(`Retrieving Albums:\n offet:${offset} \n limit: ${limit}`);

        return this.apiLib.getMySavedAlbums({ market, limit, offset });

    }

    /**
     * 
     * @param {Object} $0
     * @param {String} $0.market 
     * @param {Number} $0.offset
     * @param {Number} $0.limit
     * 
     * @see https://github.com/thelinmichael/spotify-web-api-node
     * 
     * @see https://developer.spotify.com/documentation/web-api/reference/library/get-users-saved-tracks/
     * 
     * @returns {Object} Promise/A+
     */
    getTracks ({ market, offset = DEFAULT_OFFSET, limit = DEFAULT_LIMIT } = {}) { // eslint-disable-line no-unused-vars

        TableauShim.reportProgress(`Retrieving Albums:\n offet:${offset} \n limit: ${limit}`);

        return this.apiLib.getMySavedTracks({ market, limit, offset });

    }

    /**
     * 
     * @param {Object} $0
     * @param {Array<Number>} $0.ids
     * 
     * @see https://github.com/thelinmichael/spotify-web-api-node
     * 
     * @see https://developer.spotify.com/documentation/web-api/reference/tracks/get-several-audio-features/
     * 
     * @returns {Object} Promise/A+
     */
    getTracksFeatures ({ ids = [] } = {}) {

        TableauShim.reportProgress(`Retrieving Track Features by id:\n ${ids.length} records`);

        return this.apiLib.getAudioFeaturesForTracks(ids);
    }

    /**
     * 
     * @param {Object} $0
     * @param {Array<Number>} $0.ids
     * 
     * @see https://github.com/thelinmichael/spotify-web-api-node
     * 
     * @see https://developer.spotify.com/documentation/web-api/reference/artists/get-several-artists/
     * 
     * @returns {Object} Promise/A+
     */
    getArtists ({ ids = [] } = {}) {

        TableauShim.reportProgress(`Retrieving Artists by id:\n ${ids.length} records`);

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
