import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate, CanActivateChild } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tmt-tang-ui';
import { TAuthService } from './auth.service';
import { TGlobalConfig } from './global-config';


@Injectable({
    providedIn: 'root'
})
export class TAuthGuardService implements CanActivate, CanActivateChild {

    constructor(public router: Router,  public auth: TAuthService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

        let isDev = false;//!environment.production;
        let access_Token = this.auth.getAccessToken();
        return new Promise<boolean>((resolve) => {
            if (isDev) {
                resolve(true);
            } else {
                if (TDSHelperObject.hasValue(access_Token) &&
                    TDSHelperString.hasValueString(access_Token?.access_token)) {
                    resolve(true);
                } else {
                    this.auth.getCacheToken().subscribe((accessToken) => {
                        if (TDSHelperObject.hasValue(accessToken) &&
                            TDSHelperString.hasValueString(accessToken?.access_token)) {
                            resolve(true);
                        } else {

                            setTimeout(() => {
                                this.auth.logout(environment.urlLogin);
                            }, 100);
                            resolve(false);
                        }
                    }, f => {

                        setTimeout(() => {
                            this.auth.logout(environment.urlLogin);
                        }, 100);
                        resolve(false);
                    });
                }
            }
        })
    }
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        let isDev = false;
        let access_Token = this.auth.getAccessToken();
        return new Promise<boolean>((resolve) => {
            if (isDev) {
                resolve(true);
            } else {
                if (TDSHelperObject.hasValue(access_Token) &&
                    TDSHelperString.hasValueString(access_Token?.access_token)) {
                    resolve(true);
                } else {
                    this.auth.getCacheToken().subscribe((accessToken) => {

                        if (TDSHelperObject.hasValue(accessToken) &&
                            TDSHelperString.hasValueString(accessToken?.access_token)) {
                            resolve(true);
                        } else {

                            setTimeout(() => {
                                this.auth.logout(environment.urlLogin)
                            }, 100);
                            resolve(false);
                        }
                    }, (f: TDSSafeAny) => {
                        setTimeout(() => {
                            this.auth.logout(environment.urlLogin);
                        }, 100);
                        resolve(false);
                    });
                }
            }
        })
    }



}
