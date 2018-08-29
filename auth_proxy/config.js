// The necessary configuration for your server
// Contains credentials for your Spotify application
// And the new redirect path for the OAuth flow
// Should be kept secret

require('dotenv').config();

const PORT = 3000;

const OS = require("os");
const HOST_NAME = OS.hostname();
const REDIRECT_URI = "http://" + HOST_NAME + ":" + PORT + "/callback";
const API_URI = 'https://accounts.spotify.com';

module.exports = {
    'PORT': PORT,
    'CLIENT_ID': process.env.EPHEMERAL_CLIENT_ID,
    'CLIENT_SECRET': process.env.EPHEMERAL_CLIENT_SECRET,
    // DESKTOP SECRETS
    'EPHEMERAL': {
        'CLIENT_ID': process.env.EPHEMERAL_CLIENT_ID,
        'CLIENT_SECRET': process.env.EPHEMERAL_CLIENT_SECRET
    },
    // SERVER SECRETS
    'ENDURING': {
        'CLIENT_ID': process.env.ENDURING_CLIENT_ID,
        'CLIENT_SECRET': process.env.ENDURING_CLIENT_SECRET
    },
    'REDIRECT_URI': REDIRECT_URI,
    'API_URI': API_URI,
    'AUTHORIZE_URI': `${API_URI}/authorize`,
    'TOKENS_URI': `${API_URI}/api/token`,
    'APP_SCOPE': 'user-read-private user-read-email user-top-read playlist-read-private user-library-read'

};
