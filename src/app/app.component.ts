import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { TDSSafeAny } from 'tmt-tang-ui';
import { TAuthService, TCommonService, TGlobalConfig, THelperCacheService } from './lib';
import { PageLoadingService } from './shared/services/page-loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'T-Page';
  public isLoaded: boolean = false;
  constructor(
    public libCommon: TCommonService,
    public auth: TAuthService,
    public cache: THelperCacheService,
    public zone: NgZone,
    public router: Router,
    private loader: PageLoadingService,
  ) {
    this.loader.show();
  }
  ngOnInit() {
    let that = this;
    that.init().subscribe(res => {
      this.loader.hidden();
      that.isLoaded = true;
    });
  }
  init(): Observable<boolean> {
    let that = this;
    return new Observable(obs => {
      that.zone.runOutsideAngular(() => {
        that.setGlobalConfig();
        that.libCommon.init().subscribe((s: TDSSafeAny) => {
          obs.next(true);
          obs.complete();
        });

      });
    })

  }
  private setGlobalConfig() {
    let objConfig = {
      Authen: {
        isLogin: false,
        token: null,
        refreshTokenInProgress: false,
        refreshTokenSubject: new BehaviorSubject<any>(null),
      },
      cache: {
        timerPermission: 100,
        timerApi: 100,
        companyid: "1"
      }
    };
    Object.assign(TGlobalConfig, objConfig);
  }
}
