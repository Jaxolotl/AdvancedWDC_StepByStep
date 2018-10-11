
const TERMS_DICTIONARY = {
    'CONNECTOR_NAME': 'Spotify Connector',
    'ERROR': {
        'SAVE_TOKENS_TO_PASSWD': 'Authentication.saveTokensToPassword value must contain access_token and refresh_token',
        'MISSING_AUTH': 'Missing Authentication!',
        'UNABLE_TO_REFRESH_TOKENS': 'Unable to refresh tokens',
        'DEFAULT_ERROR': 'An unrecoverable error occurred. Contact Support Team'
    },
    'TIME_RANGE': {
        'SHORT_TERM': 'Last 4 weeks aprox. of data.',
        'MEDIUM_TERM': 'Last 6 months aprox. of data.',
        'LONG_TERM': 'Several years of data.'
    },
    /**
     * @see https://developer.spotify.com/documentation/web-api/#response-status-codes
     */
    'STATUS_CODES': {
        '400': 'Bad Request - The request could not be understood by the server due to malformed syntax. The message body will contain more information; see Response Schema https://developer.spotify.com/documentation/web-api/#response-schema.',
        '401': 'Unauthorized - The request requires user authentication or, if the request included authorization credentials, authorization has been refused for those credentials.',
        '403': 'Forbidden - The server understood the request, but is refusing to fulfill it.',
        '404': 'Not Found - The requested resource could not be found. This error can be due to a temporary or permanent condition.',
        '429': 'Too Many Requests - Rate limiting has been applied. see https://developer.spotify.com/documentation/web-api/#rate-limiting',
        '500': 'Internal Server Error. You should never receive this error because our clever coders catch them all … but if you are unlucky enough to get one, please report it to us through a comment at the bottom of this page.',
        '502': 'Bad Gateway - The server was acting as a gateway or proxy and received an invalid response from the upstream server.',
        '503': 'Service Unavailable - The server is currently unable to handle the request due to a temporary condition which will be alleviated after some delay. You can choose to resend the request again.'
    }
};

export default TERMS_DICTIONARY;
