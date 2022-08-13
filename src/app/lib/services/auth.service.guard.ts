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

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

        return this.auth.getCacheToken().pipe(
            switchMap((data) => {
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
            switchMap((data) => {
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
