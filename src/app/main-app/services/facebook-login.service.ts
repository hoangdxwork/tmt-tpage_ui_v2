import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Observable, ReplaySubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Facebook, FacebookApiMethod, FacebookApiParams, FacebookAuth, FacebookAuthResponse, FacebookInitParams, FacebookLoginOptions, FacebookUser } from '../../lib/dto/facebook.dto';
import { TDSSafeAny } from 'tds-ui/shared/utility';

export const FACEBOOK_DEFAULTS: FacebookInitParams = {
  xfbml: false,
  appId: environment.facebook.appId,
  version: environment.facebook.appVersion
};

declare const FB: Facebook;
declare const window: {
  FB?: Facebook;
};

@Injectable({
  providedIn: 'root'
})

export class FacebookLoginService {
  sdk = new ReplaySubject<Facebook>(1);

  constructor(private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: string) {
  }

  load(locale: string = 'en_US'): Observable<Facebook> {
    return new Observable((subscriber: TDSSafeAny) => {
      if (isPlatformServer(this.platformId)) {
        return;
      }

      this.ngZone.runOutsideAngular(() => {
        delete window.FB;

        let jsSdk: TDSSafeAny | HTMLElement;
        let fbRoot: TDSSafeAny | HTMLElement;

        if (jsSdk = document.getElementById('facebook-jssdk')) {
          jsSdk.parentNode.removeChild(jsSdk);
        }

        if (fbRoot = document.getElementById('fb-root')) {
          fbRoot.parentNode.removeChild(fbRoot);
        }

        const script = document.createElement('script');
        script.id = 'facebook-jssdk';
        script.src = '//connect.facebook.net/' + (locale || 'en_US') + '/sdk.js';

        script.async = true;
        script.defer = true;
        script.crossOrigin = 'anonymous';

        script.onload = () => {
          this.ngZone.run(() => {
            subscriber.next(FB);
            subscriber.complete();
          });
        };

        script.onerror = () => {
          this.ngZone.run(() => {
            subscriber.error('Facebook SDK could not be loaded.');
            subscriber.complete();
          });
        };

        document.head.appendChild(script);
      });
    }).pipe(map((sdk: any) => {
      this.sdk.next(sdk);
      return sdk;
    }));
  }

  init(params: FacebookInitParams = {}, locale: string = 'en_US') {
    return this.load(locale).pipe<Facebook>(tap<Facebook>(sdk => {
      params = Object.assign({}, FACEBOOK_DEFAULTS, params);
      sdk.init(params);
      this.reloadRenderedElements().subscribe();
    }));
  }

  getLoginStatus(): Observable<TDSSafeAny> {
    return new Observable((subscriber: TDSSafeAny) => {
      this.sdk.subscribe({
        next: (sdk: any) => {
          this.ngZone.runOutsideAngular(() => {
            try {
              FB.getLoginStatus((response: FacebookAuthResponse) => {
                this.ngZone.run(() => {
                  if (response.authResponse) {
                    subscriber.next(response);
                  } else {
                    subscriber.error(response);
                  }
                  subscriber.complete();
                });
              });
            } catch (e) {
              subscriber.error(e);
              subscriber.complete();
            }
          });
        }
      });
    });
  }

  getAuthResponse(): Observable<FacebookAuth> {
    return new Observable((subscriber: TDSSafeAny) => {
      this.sdk.subscribe({
        next: (sdk) => {
          this.ngZone.runOutsideAngular(() => {
            try {
              FB.getAuthResponse((response: FacebookAuth) => {
                this.ngZone.run(() => {

                  if (response) {
                    subscriber.next(response);
                  } else {
                    subscriber.error(response);
                  }

                  subscriber.complete();
                });
              });
            } catch (e) {
              subscriber.error(e);
              subscriber.complete();
            }
          });
        }
      });
    });
  }

  getMe(): Observable<FacebookUser> {
    return this.api(`me`, FacebookApiMethod.Get, {'fields': 'id, name, picture'}) as Observable<FacebookUser>;
  }

  login(options?: FacebookLoginOptions): Observable<FacebookAuth> {
    return new Observable((subscriber: TDSSafeAny) => {
      this.sdk.subscribe({
        next: () => {
          this.ngZone.runOutsideAngular(() => {
            FB.login(response => {
              this.ngZone.run(() => {

                if (response.authResponse) {
                  subscriber.next(response.authResponse);
                } else {
                  subscriber.error(response);
                }

                subscriber.complete();
              });
            },
            { scope: 'email, public_profile, user_posts, user_videos, manage_pages, publish_pages, pages_messaging, pages_messaging, pages_messaging_subscriptions, pages_read_engagement, pages_read_user_content, pages_manage_engagement, pages_manage_metadata, pages_show_list' });
          });
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    });
  }

  logout(): Observable<any> {
    return new Observable((subscriber: TDSSafeAny) => {
      this.sdk.subscribe({
        next: (sdk: any) => {
          this.ngZone.runOutsideAngular(() => {
            try {
              FB.logout((response: any) => {
                this.ngZone.run(() => {
                  subscriber.next(response);
                  subscriber.complete();
                });
              });
            } catch (e) {
              subscriber.error(e);
              subscriber.complete();
            }
          });
        }
      });
    });
  }

  api(path: string, method?: FacebookApiMethod | FacebookApiParams, params?: FacebookApiParams): Observable<any> {
    return new Observable((subscriber: TDSSafeAny) => {
      this.sdk.subscribe({
        next: (sdk: any) => {
          this.ngZone.runOutsideAngular(() => {
            FB.api(path, method, params, (response: TDSSafeAny) => {
              this.ngZone.run(() => {
                if (!response || response.error) {
                  subscriber.error(response.error || 'Error occured');
                } else {
                  subscriber.next(response);
                }
                subscriber.complete();
              });
            });
          });
        }
      });
    });
  }

  parse(element: HTMLElement): Observable<HTMLElement> {
    return new Observable((subscriber: TDSSafeAny) => {
      this.sdk.subscribe({
        next: (sdk: any) => {
          this.ngZone.runOutsideAngular(() => {
            sdk.XFBML.parse(element, () => {
              this.ngZone.run(() => {
                subscriber.next(element);
                subscriber.complete();
              });
            });
          });
        }
      });
    });
  }

  reloadRenderedElements(): Observable<HTMLElement> {
    return new Observable((subscriber: TDSSafeAny) => {
      this.sdk.subscribe({
        next: (sdk :any) => {

          const elements = document.querySelectorAll('[fb-xfbml-state="rendered"]');
          let processing = elements.length;

          Array.from(elements).forEach((node: TDSSafeAny) => {
            this.ngZone.runOutsideAngular(() => {
              sdk.XFBML.parse(node.parentElement, () => {

                this.ngZone.run(() => {
                  --processing;
                  subscriber.next(node.parentElement);

                  if (processing <= 0) {
                    subscriber.complete();
                  }
                });
              });
            });
          });
        }
      });
    });
  }
}
