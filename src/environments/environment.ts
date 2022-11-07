// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  urlLogin:'/account/login',
  signalRAppend: "?host=test.tpos.dev",
  socketUrl: 'https://socket-tpos.dev.tmtco.org/chatomni',
  tShopUrl: 'https://app.live.dev.tmtco.org/oauth',
  apiAccount:{
    signInPassword:"/token",
    signInFacebook:"/sign-in/facebook",
    signInGoogle:"/sign-in/google",
    facebookIntegration:"/social-network/facebook/integration",
    googleIntegration:"/social-network/google/integration",
    signInVerifyOtpsms:"/app-user/reset-password/verify-otpsms",
    refreshToken:"/sign-in/refresh-token",
    userInit:"/rest/v1.0/user/info"
  },
  facebook: {
    appId: '327268081110321',
    appVersion: 'v11.0',
  },
  firebaseConfig: {
    apiKey: "AIzaSyB6MbPLjt0r9NrCfasAs3aOA2zXZcAS1h4",
    authDomain: "toanlefirebase.firebaseapp.com",
    projectId: "toanlefirebase",
    storageBucket: "toanlefirebase.appspot.com",
    messagingSenderId: "743574831100",
    appId: "1:743574831100:web:d26a6a84d7c3b8fc0f3c79",
    measurementId: "G-87WC6HQ2F7",
    vapidKey: "BIkenc_rHdoJHmQGv_qO7faaDRdrSPtWEAwjbHmgx62ugBW1zdihyOhT_qXnZRi1Q46nQ-VZzfxqKyrCWbb4GMM"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
