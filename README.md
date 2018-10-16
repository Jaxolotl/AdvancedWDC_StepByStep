# SpotifyWDC

To use, do the following:

- run `npm install`
- Create an app on spotify developer platform: https://developer.spotify.com/my-applications/#!/applications


## Local development:
- Create a .env files from .env.TEMPLATE
- Set `EPHEMERAL_CLIENT_ID` and `ENDURING_CLIENT_ID` with the `CLIENT_ID` provided by Spotify app
- Set `EPHEMERAL_CLIENT_SECRET` and `ENDURING_CLIENT_SECRET` with the `CLIENT_SECRET` provided by Spotify app
- run `npm start` to make a build and start the local server
- For more script options check the package.json scripts section


## Publishing to a server
- Do not publish your .env file, instead
    - Set `EPHEMERAL_CLIENT_ID` and `ENDURING_CLIENT_ID` environment variables with the `CLIENT_ID` provided by Spotify app
    - Set `EPHEMERAL_CLIENT_SECRET` and `ENDURING_CLIENT_SECRET` environment variables with the `CLIENT_SECRET` provided by Spotify app
- Make sure the server settings ( on the `./auth_proxy` section ) are correct for your needs.
- Make sure the `output` section of the webpack.config file are correct for your needs. ( see https://webpack.js.org/configuration/output/#output-publicpath )