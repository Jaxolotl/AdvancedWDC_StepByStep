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

## What if I use this code to build my own connector?
That's the point of all of this!!! Please do it! Any feedback will be welcome.  

Just take this in consideration:  

### CORS
Despite the Tableau Desktop embedded browser implementation, all browsers will apply a security policy regarding [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) and [Same-origin policy](https://en.wikipedia.org/wiki/Same-origin_policy), therefore, depending on the API you're consuming, you'll have to workaround that, a developer should be able to test a connector on the Simulator
without the interference of a browser level security blocking access to an API that doesn't support CORS.  
In order to achieve that, here you have a hack to disable the Same-Origin security restriction on Chrome.

### Example for Windows
1. Create a directory where Chrome will save all the session information
1. Create a shortcut with the following target "`[PATH TO CHROME APP]\chrome.exe" --user-data-dir=[PATH TO THE DIRECTORY CREATED ON STEP 1] --disable-web-security`
1. Upon execution Chrome will prompt an alert message, just ignore it.

```

    /** 
     * Create a directory on the C drive.
     * e.g. c:\my-session-staff
     * 
     * Then create a shortcut with the following target
     */

    "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --user-data-dir=c:\my-session-staff --disable-web-security

```

### Example for Mac
On the terminal type the following:

```
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --user-data-dir="/tmp/chrome_dev_session" --disable-web-security
```

Replace with your particular path to chrome if necessary.


## Official Tableau WDC development tools and documentation
Part of this references are included on the repository source code so you can make a code/documentation relationship. In order to run this WDC on the simulator you'll need to follow the SDK and simulator instructions. Once you get confident with the connector's code and documentation, I'd strongly suggest you to dive into the API documentation to acquire a deeper knowledge.
Here some usefull links to get started :P
- [Get Started](http://tableau.github.io/webdataconnector/docs/)
- [SDK / simulator](http://tableau.github.io/webdataconnector/docs/#get-the-wdc-sdk)
- [Run the simulator](http://tableau.github.io/webdataconnector/docs/#run-the-simulator)
- [API reference](http://tableau.github.io/webdataconnector/docs/api_ref)
