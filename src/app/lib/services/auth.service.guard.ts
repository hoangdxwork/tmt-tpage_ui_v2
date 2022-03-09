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

    constructor(
        public router: Router,
        public auth: TAuthService,

    ) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        let isDev =!environment.production;
        return new Promise<boolean>((resolve) => {
            if (isDev) {
                resolve(true);
            } else {
                if (TDSHelperObject.hasValue(TGlobalConfig.Authen.token) &&
                    TDSHelperString.hasValueString(TGlobalConfig.Authen.token?.accessToken)) {
                    resolve(true);
                } else {
                    this.auth.getCacheToken().subscribe(() => {
                        if (TDSHelperObject.hasValue(TGlobalConfig.Authen.token) &&
                            TDSHelperString.hasValueString(TGlobalConfig.Authen.token?.accessToken)) {
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
        return new Promise<boolean>((resolve) => {
            if (isDev) {
                resolve(true);
            } else {
                if (TDSHelperObject.hasValue(TGlobalConfig.Authen.token) &&
                    TDSHelperString.hasValueString(TGlobalConfig.Authen.token?.accessToken)) {
                    resolve(true);
                } else {
                    this.auth.getCacheToken().subscribe(() => {

                        if (TDSHelperObject.hasValue(TGlobalConfig.Authen.token) &&
                            TDSHelperString.hasValueString(TGlobalConfig.Authen.token?.accessToken)) {
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