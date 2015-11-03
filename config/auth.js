// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'        : 'your-secret-clientID-here', // your App ID
        'clientSecret'    : 'your-client-secret-here', // your App Secret
        'callbackURL'     : 'http://localhost:8080/auth/facebook/callback'
    },

'twitterAuth' : {
        'consumerKey'        : 'CGzYryElFCfoAUkX577LdC4Ty',
        'consumerSecret'     : 'v2bGFctlPiBgrE1nXN4X1WmDnZqLDHvVnFHg3NfoYyYUndAdpo',
        'CALLBACKURL'        : ''
    },
    'googleAuth' : {
        'clientID'         : 'your-secret-clientID-here',
        'clientSecret'     : 'your-client-secret-here',
        'callbackURL'      : 'http://localhost:8080/auth/google/callback'
    }

};
