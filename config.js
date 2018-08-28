// The necessary configuration for your server
// Contains credentials for your Spotify application
// And the new redirect path for the OAuth flow
// Should be kept secret

require('dotenv').config();

var PORT = 3000;

var os = require("os");
var hostName = os.hostname();
var redirectUri = "http://" + hostName + ":" + PORT + "/callback";

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
    'REDIRECT_URI': redirectUri
};
