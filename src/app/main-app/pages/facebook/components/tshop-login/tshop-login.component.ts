import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CRMTeamService } from '@app/services/crm-team.service';
import { TpageBaseComponent } from '@app/shared/tpage-base/tpage-base.component';
import { Message } from '@core/consts/message.const';
import { TUserDto } from '@core/dto/tshop.dto';
import { Observable, takeUntil } from 'rxjs';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSMessageService } from 'tds-ui/message';

@Component({
  selector: 'tshop-login',
  templateUrl: './tshop-login.component.html'
})
export class TShopLoginComponent extends TpageBaseComponent implements OnInit, OnDestroy {

  constructor(
    private crmTeamService: CRMTeamService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private _destroy$: TDSDestroyService
  ) {
    super(crmTeamService, activatedRoute, router);
  }

  ngOnInit(): void {
    this.loadParam();
  }

  loadParam() {
    this.loadQueryParamMap().pipe(takeUntil(this._destroy$)).subscribe({
      next: ([team, params]: any) => {
        if (this.paramsUrl?.access_token) {

          this.loadUserTShop(this.paramsUrl?.access_token).subscribe({
            next: (user => {

              let data = {
                access_token: this.paramsUrl?.access_token,
                user: user
              };

              window.opener.postMessage(JSON.stringify(data), "*");
              window.close();
            })
          });
        }
      }});
  }

  loadUserTShop(accessToken: string): Observable<TUserDto> {
    return new Observable<TUserDto> (obs => {
      this.crmService.getTShopUser(accessToken).subscribe({
        next: (res => {
          obs.next(res);
          obs.complete();
        }),
        error: error => {
          obs.error(error);
          obs.complete();
        }
      })
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
