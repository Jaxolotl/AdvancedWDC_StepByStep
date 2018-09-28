import ADVANCED_SCHEMA from '../schemas/advancedSchemas';

/**
 * SpotifyRequestor
 * 
 * This class abstracts away most of the interaction with Spotify's API.
 * All methods return promises which will be resolved once the requested resource has been returned from Spotify
 */
class SpotifyRequestor {

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

export default SpotifyRequestor;
