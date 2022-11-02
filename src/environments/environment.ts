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
    apiKey: "AIzaSyAAnP3M-JqrBLr-AGoHTZ1Qtx7QR0MXGVQ",
    authDomain: "tposmobile.firebaseapp.com",
    databaseURL: "https://tposmobile.firebaseio.com",
    projectId: "tposmobile",
    storageBucket: "tposmobile.appspot.com",
    messagingSenderId: "852209026200",
    appId: "1:852209026200:web:ef6ad3d5d7573855a63ced",
    measurementId: "G-XHX5BTL43H"
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
