export const environment = {
  production: true,
  signalRAppend: "",
  urlLogin:'/tpagev2/account/login',
  apiAccount:{
    signInPassword:"token",
    signInFacebook:"sign-in/facebook",
    signInGoogle:"sign-in/google",
    facebookIntegration:"social-network/facebook/integration",
    googleIntegration:"social-network/google/integration",
    signInVerifyOtpsms:"app-user/reset-password/verify-otpsms",
    refreshToken:"sign-in/refresh-token",
    userInit:"app-user/init"
  },
  facebook: {
    appId: '327268081110321',
    appVersion: 'v6.0',
  }
};
