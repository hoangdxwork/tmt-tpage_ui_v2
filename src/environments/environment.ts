// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  urlLogin:'/account/login',
  signalR: "https://sr.tpos.vn",
  signalRAppend: "?host=admin.tpos.vn",
  apiApp:"https://demoprod01.tpos.vn",
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
    appVersion: 'v6.0',
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
