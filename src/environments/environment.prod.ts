export const environment = {
  production: true,
  signalRAppend: "",
  urlLogin:'/account/login',
  socketUrl: 'https://rt.tpos.app/chatomni',
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
