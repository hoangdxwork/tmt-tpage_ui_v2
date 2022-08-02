export const environment = {
  production: true,
  signalRAppend: "?host=admin.tpos.vn",
  urlLogin:'/account/login',
  socketUrl: 'https://socket-tpos.live.rke.dev.tmtco.org/chatomni',
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
