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
    apiKey: "AIzaSyB13Zlrc54Xz2qZwBOsZN1cGwkWUV7RDiw",
    authDomain: "propane-bebop-278706.firebaseapp.com",
    projectId: "propane-bebop-278706",
    storageBucket: "propane-bebop-278706.appspot.com",
    messagingSenderId: "528073803166",
    appId: "1:528073803166:web:ebd0d1f5d380cdd86c428f",
    measurementId: "G-PMJ8HGCCT1",
    vapidKey: "BJmSmdMKisyz_YsNNHWSXT8nLi5kgII9pcys9qwKQWU5FN7I5ESvqNx8ysWrwK9fvXPNhmjmOY8a_5LkaR9S0Rg"
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
