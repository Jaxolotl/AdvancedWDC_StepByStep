/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var config = require('./config.js');              // Get our config info (app id and app secret)
var path = require('path');

var client_id = process.env.CLIENT_ID || process.env.APPSETTING_CLIENT_ID || config.CLIENT_ID; // Your client sid
var client_secret = process.env.CLIENT_SECRET || process.env.APPSETTING_CLIENT_SECRET || config.CLIENT_SECRET; // Your secret
var redirect_uri = process.env.REDIRECT_URI || process.env.APPSETTING_REDIRECT_URI || config.REDIRECT_URI; // Your redirect uri
var port = process.env.PORT || process.env.APPSETTING_PORT || config.PORT;

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cookieParser());

app.get('/schema', function(req, res) {
  res.sendfile(path.join(__dirname + '/public/schema_advanced.json'));
});

app.get('/login', function(req, res) {
  // your application requests authorization
  var scope = 'user-read-private user-read-email user-top-read playlist-read-private user-library-read';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri
    }));
});

app.get('/callback', function(req, res) {
  // STEP 3 - CODE SENT TO BACKEND
  console.log("/callback called. Exchanging code for access token");
  var code = req.query.code || null;

  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    json: true
  };

  // STEP 4 - CODE EXCHANGED FOR ACCESS TOKEN
  console.log("Requesting access token");
  request.post(authOptions, function(error, response, body) {
    console.log("Received access token response");
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      var refresh_token = body.refresh_token;

      // STEP 5 - TOKEN PASSED BACK TO THE CONNECTOR
      // Pass the token to the browser to make requests from there
      console.log("Redirecting back to start page");
      res.redirect('/#' +
        querystring.stringify({
          access_token: access_token,
          refresh_token: refresh_token
        }));
    } else {
      res.redirect('/#' +
        querystring.stringify({
          error: 'invalid_token'
        }));
    }
  });
});

app.get('/refresh_token', function(req, res) {
  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

console.log('Listening on ' + port);
app.listen(port);
