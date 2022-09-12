import { TDSConfigService } from 'tds-ui/core/config';
import { TDSDestroyService } from 'tds-ui/core/services';
import { Component, NgZone, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import { TDSNotificationService } from 'tds-ui/notification';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { TAuthService, TCommonService, TGlobalConfig, THelperCacheService } from './lib';
import { PageLoadingService } from './shared/services/page-loading.service';
import { SocketEventSubjectDto, SocketOnEventService } from '@app/services/socket-io/socket-onevent.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [ TDSDestroyService]
})

export class AppComponent {

  title = 'T-Page';
  isLoaded: boolean = false;
  teamId!: number;
  isShowModal: boolean = false;
  @ViewChild('templateNotificationMessNew') templateNotificationMessNew!: TemplateRef<{}>;

  constructor(public libCommon: TCommonService,
    public auth: TAuthService,
    public cache: THelperCacheService,
    public zone: NgZone,
    public router: Router,
    private route: ActivatedRoute,
    private notification: TDSNotificationService,
    private tdsConfigService: TDSConfigService,
    private socketOnEventService: SocketOnEventService,
    private loader: PageLoadingService,
    private destroy$: TDSDestroyService) {
    this.loader.show();
  }

  ngOnInit() {
    let that = this;
    that.init().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.loader.hidden();
        that.isLoaded = true;
      }
    });

    this.socketOnEventService.onEventSocket().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: SocketEventSubjectDto) => {
        this.teamId = (this.route.snapshot.queryParams?.teamId || 0) as number;
        let exist = this.router.url.startsWith('/conversation') && Number(this.route.snapshot.queryParams?.teamId) == res.Team?.Id;

        if (res && res.Notification && !exist) {
          this.notification.template( this.templateNotificationMessNew, { data: res, placement: 'bottomLeft' });
        }
      }
    })

    this.tdsConfigService.set('notification', {
        maxStack: 3
    });
  }

  init(): Observable<boolean> {
    let that = this;
    return new Observable(obs => {
      that.zone.runOutsideAngular(() => {
        that.setGlobalConfig();

        that.libCommon.init().subscribe({
          next: (s: TDSSafeAny) => {
            obs.next(true);
            obs.complete();
          }
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

  onShowModal(orderId:string) {
    this.socketOnEventService.showModalSocketOrder(orderId);
  }
}
