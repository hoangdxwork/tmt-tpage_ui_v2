import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { TAuthService, TCommonService, TGlobalConfig, THelperCacheService } from './lib';
import { SocketService } from './services/socket.service';
import { PageLoadingService } from './shared/services/page-loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent {
  title = 'T-Page';
  public isLoaded: boolean = false;

  constructor(public libCommon: TCommonService,
    public auth: TAuthService,
    public cache: THelperCacheService,
    public zone: NgZone,
    public router: Router,
    private loader: PageLoadingService,
    private socketService: SocketService) {
    this.loader.show();
  }

  ngOnInit() {
    let that = this;
    that.init().subscribe(res => {
      this.loader.hidden();
      that.isLoaded = true;
    });

    this.socketService.listenEvent("on-events").subscribe((res: any) => {
      console.log(res);
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
