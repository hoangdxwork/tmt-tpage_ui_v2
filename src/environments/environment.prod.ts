export const environment = {
  production: true,
  signalRAppend: "",
  urlLogin:'/account/login',
  socketUrl: 'https://rt-2.tpos.app/chatomni',
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
