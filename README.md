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

## Suggested GIT client for intermediate users
[Atlassian SourceTree](https://www.sourcetreeapp.com/) 

## Original Tableau WDC development tools and documentation
Part of this references are included on the repository source code son you can make a code/documentation relationship. In order to run this WDC on the simulator you'll need to follow the SDK and simulator instructions. Once you get confident with the connector's code and documentation, I'd strongly suggest you to dive into the API documentation to acquire a deeper knowledge.
Here some usefull links to get started :P
- [Get Started](http://tableau.github.io/webdataconnector/docs/)
- [SDK / simulator](http://tableau.github.io/webdataconnector/docs/#get-the-wdc-sdk)
- [Run the simulator](http://tableau.github.io/webdataconnector/docs/#run-the-simulator)
- [API reference](http://tableau.github.io/webdataconnector/docs/api_ref)

## Using Get-Content and Select-String powershell cmdlet to read logs on WIndows
Tableau WDC API for logging will output `TableauShim.log('log content')` as follow:

- Running connector on the **simulator** will output the content on the **log div** and on the **console dev tool**
- Running on **Tableau desktop** will write the output on `appPath\My Tableau Repository\Logs\tabprotosrv.txt`

Since Tableau Desktop embedded browser during dataGathering phase runs on a headless instance we need a `tail` Unix like command to debug in real time when running the connector.

On Windows >= 7 we can use **get-content** cmdlet running on our powershell.    
Below there's an example on debugging the `tabprotosrv.txt` filtering for a specific custom pattern.

Chunk of code with the log instruction

```javascript

    //log the column names array
    TableauShim.log('DEV-LOG names for headersCallback: ' + JSON.stringify(headers.names));

    //log the column types array
    TableauShim.log('DEV-LOG types for headersCallback: ' + JSON.stringify(headers.types));


```

Command line on the powershell to read tabprotosrv.txt and filter for *DEV-LOG* pattern

```

    PS C:\Users\[my user]\Documents\My Tableau Repository\Logs> Get-Content tabprotosrv.txt -Wait | Select-String DEV-LOG


```

For more details 

- [Get-Content Cmdlet](https://technet.microsoft.com/en-us/library/hh849787.aspx)
- [Select-String Cmdlet](https://technet.microsoft.com/en-us/library/ee176956.aspx)