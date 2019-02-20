/**
 *
 * The necessary configuration for your server
 * Contains credentials ref from env variables for your Spotify application
 *
 */
// this will attempt to load /.env to emulate process.env stored vars and avoid hardcode them
import dotenv from 'dotenv';
import { env } from 'process';

dotenv.config();

const PORT = env.PORT || 3000;
const HOST_NAME = env.HOST_NAME || 'localhost';
const REDIRECT_URI = 'http://' + HOST_NAME + ':' + PORT + '/callback';
const API_URI = 'https://accounts.spotify.com';

export default {
    PORT,
    HOST_NAME,
    // @see http://tableau.github.io/webdataconnector/docs/api_ref.html#webdataconnectorapi.authpurposeenum
    // DESKTOP SECRETS
    'EPHEMERAL': {
        'CLIENT_ID': env.EPHEMERAL_CLIENT_ID,
        'CLIENT_SECRET': env.EPHEMERAL_CLIENT_SECRET
    },
    // SERVER SECRETS
    'ENDURING': {
        'CLIENT_ID': env.ENDURING_CLIENT_ID,
        'CLIENT_SECRET': env.ENDURING_CLIENT_SECRET
    },
    'REDIRECT_URI': REDIRECT_URI,
    'API_URI': API_URI,
    'AUTHORIZE_URI': `${API_URI}/authorize`,
    'TOKENS_URI': `${API_URI}/api/token`,
    'APP_SCOPE': 'user-read-private user-read-email user-top-read playlist-read-private user-library-read'

};
