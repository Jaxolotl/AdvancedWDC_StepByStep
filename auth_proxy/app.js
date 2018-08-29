/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

// this will attempt to load /.env to emulate process.env stored vars and avoid hardcode them
require('dotenv').config();

let version = require('../package.json').version;
const CONFIG = require('./config.js'); // Get our config info (app id and app secret)

let express = require('express'); // Express web server framework
let request = require('request'); // "Request" library
let querystring = require('querystring');
let cookieParser = require('cookie-parser');
let path = require('path');

let app = express();

const SIGNATURE = `${CONFIG.CLIENT_ID}:${CONFIG.CLIENT_SECRET}`;
const ENCODED_SIGNATURE = Buffer.alloc(SIGNATURE.length, SIGNATURE).toString('base64');

/**
 * Connector's public folder
 */
app.use(express.static(path.resolve(process.cwd(), 'dist')))
    .use(cookieParser());

/**
 * REQUEST TO GET THE SERVER HEALTH
 */
app.get('/health', function (req, res) {
    'use strict';

    res.send({
        pid: process.pid,
        memory: process.memoryUsage(),
        uptime: process.uptime(),
        version
    });

});

/**
 * Hardcoded schema endpoint
 */
app.get('/schema', function (req, res) {
    res.sendFile(path.resolve(process.cwd(), 'public/schema_advanced.json'));
});

/**
 * application requests authorization
 */
app.get('/login', function (req, res) {

    const PARAMS = querystring.stringify({
        response_type: 'code',
        client_id: CONFIG.CLIENT_ID,
        scope: CONFIG.APP_SCOPE,
        redirect_uri: CONFIG.REDIRECT_URI
    });

    res.redirect(`${CONFIG.AUTHORIZE_URI}?${PARAMS}`);

});

/**
 * Callback url coming after auth process on Spotify
 */
app.get('/callback', function (req, res) {
    // STEP 3 - CODE SENT TO BACKEND
    console.log('/callback called. Exchanging code for access token');

    const CODE = req.query.code || null;

    let authOptions = {
        url: CONFIG.TOKENS_URI,
        form: {
            code: CODE,
            redirect_uri: CONFIG.REDIRECT_URI,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': `Basic ${ENCODED_SIGNATURE}`
        },
        json: true
    };

    // STEP 4 - CODE EXCHANGED FOR ACCESS TOKEN
    console.log('Requesting access token');

    request.post(authOptions, function (error, response, body) {

        console.log('Received access token response');

        if (!error && response.statusCode === 200) {

            const ACCESS_TOKEN = body.access_token;
            const REFRESH_TOKEN = body.refresh_token;

            const PARAMS = querystring.stringify({
                access_token: ACCESS_TOKEN,
                refresh_token: REFRESH_TOKEN
            });

            // STEP 5 - TOKEN PASSED BACK TO THE CONNECTOR
            // Pass the token to the browser to make requests from there
            console.log('Redirecting back to start page');

            res.redirect(`/#${PARAMS}`);

        } else {

            const PARAMS = querystring.stringify({
                error: 'invalid_token'
            });

            res.redirect(`/#${PARAMS}`);

        }
    });
});

/**
 * Request access token from refresh token
 */
app.get('/refresh_token', function (req, res) {

    const REFRESH_TOKEN = req.query.refresh_token;

    let authOptions = {
        url: CONFIG.TOKENS_URI,
        headers: { 'Authorization': `Basic ${ENCODED_SIGNATURE}` },
        form: {
            grant_type: 'refresh_token',
            refresh_token: REFRESH_TOKEN
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            const ACCESS_TOKEN = body.access_token;

            res.send({
                'access_token': ACCESS_TOKEN
            });
        }

    });
});

console.log('Listening on ' + CONFIG.PORT);

app.listen(CONFIG.PORT);
