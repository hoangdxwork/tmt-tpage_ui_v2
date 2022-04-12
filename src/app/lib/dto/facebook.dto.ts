export interface FacebookInitParams {
  appId?: string;
  status?: boolean;
  xfbml?: boolean;
  version?: string;
}

export interface FacebookAuth {
  accessToken: string;
  expiresIn: number;
  signedRequest: string;
  userID: string;
}

export interface FacebookAuthResponse {
  status: string;
  authResponse: FacebookAuth;
}

export interface FacebookPicture {
  data: any;
}

export interface FacebookUser {
  id: string;
  name: string;
  picture: FacebookPicture
}

export interface FacebookLoginOptions {
  auth_type?: 'rerequest';
  scope?: string;
  return_scopes?: boolean;
  enable_profile_selector?: boolean;
  profile_selector_ids?: string;
}

export interface FacebookApiError {
  message: string;
}

export const enum FacebookApiMethod {
  Get = 'get',
  Post = 'post',
  Delete = 'delete',
}

export interface FacebookApiParams {
  [propName: string]: any;
}

export type FacebookApiCallback = (response?: {
  error?: FacebookApiError;
  [propName: string]: any;
}) => void;

export interface Facebook {
  XFBML: {
    parse: (element: HTMLElement, cb?: () => void) => void;
  };

  init: (params: FacebookInitParams) => void;

  login: (callback?: (response: FacebookAuthResponse) => void, options?: FacebookLoginOptions) => void;

  getLoginStatus: (callback?: (response: FacebookAuthResponse) => void) => void;
  getAuthResponse: (callback?: (response: FacebookAuth) => void) => void;

  logout: (callback: (response: any) => void) => void;

  api: (
    path: string,
    method?: FacebookApiMethod | FacebookApiParams | FacebookApiCallback,
    params?: FacebookApiParams | FacebookApiCallback,
    callback?: FacebookApiCallback
  ) => void;
}

