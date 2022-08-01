import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate, CanActivateChild } from '@angular/router';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TAuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class TAuthGuardService implements CanActivate, CanActivateChild {

    constructor(public router: Router,  public auth: TAuthService) {}

    // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

    //     let isDev = false;//!environment.production;
    //     let access_Token = this.auth.getAccessToken();


    //     return new Promise<boolean>((resolve) => {
    //         if (isDev) {
    //             resolve(true);
    //         } else {
    //             if (TDSHelperObject.hasValue(access_Token) &&
    //                 TDSHelperString.hasValueString(access_Token?.access_token)) {
    //                 resolve(true);
    //             } else {
    //                 this.auth.getCacheToken().subscribe((accessToken) => {
    //                     if (TDSHelperObject.hasValue(accessToken) &&
    //                         TDSHelperString.hasValueString(accessToken?.access_token)) {
    //                         resolve(true);
    //                     } else {

    //                         setTimeout(() => {
    //                             this.auth.logout(environment.urlLogin);
    //                         }, 100);
    //                         resolve(false);
    //                     }
    //                 }, f => {

    //                     setTimeout(() => {
    //                         this.auth.logout(environment.urlLogin);
    //                     }, 100);
    //                     resolve(false);
    //                 });
    //             }
    //         }
    //     })
    // }

    // canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    //     let isDev = false;
    //     let access_Token = this.auth.getAccessToken();
    //     return new Promise<boolean>((resolve) => {
    //         if (isDev) {
    //             resolve(true);
    //         } else {
    //             if (TDSHelperObject.hasValue(access_Token) &&
    //                 TDSHelperString.hasValueString(access_Token?.access_token)) {
    //                 resolve(true);
    //             } else {
    //                 this.auth.getCacheToken().subscribe((accessToken) => {

    //                     if (TDSHelperObject.hasValue(accessToken) &&
    //                         TDSHelperString.hasValueString(accessToken?.access_token)) {
    //                         resolve(true);
    //                     } else {

    //                         setTimeout(() => {
    //                             this.auth.logout(environment.urlLogin)
    //                         }, 100);
    //                         resolve(false);
    //                     }
    //                 }, (f: TDSSafeAny) => {
    //                     setTimeout(() => {
    //                         this.auth.logout(environment.urlLogin);
    //                     }, 100);
    //                     resolve(false);
    //                 });
    //             }
    //         }
    //     })
    // }


    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

        return this.auth.getCacheToken().pipe(
            switchMap((data) => {debugger
                if (TDSHelperObject.hasValue(data) &&
                    TDSHelperString.hasValueString(data?.access_token)) {
                    return of(true);
                } else {
                    return of(this.router.parseUrl(environment.urlLogin));
                }
            }),
            catchError((err) => {
                return of(this.router.parseUrl(environment.urlLogin));
            })
        )
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.auth.getCacheToken().pipe(
            switchMap((data) => {debugger
                if (TDSHelperObject.hasValue(data) &&
                    TDSHelperString.hasValueString(data?.access_token)) {
                    return of(true);
                } else {
                    return of(this.router.parseUrl(environment.urlLogin));
                }
            }),
            catchError((err) => {
                return of(this.router.parseUrl(environment.urlLogin));
            })
        )
    }


}
