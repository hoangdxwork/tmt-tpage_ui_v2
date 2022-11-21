import { TDSConfigService } from 'tds-ui/core/config';
import { TDSDestroyService } from 'tds-ui/core/services';
import { Component, NgZone, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import { TDSNotificationService } from 'tds-ui/notification';
import { TDSHelperString, TDSSafeAny, TDSHelperObject } from 'tds-ui/shared/utility';
import { TAuthService, TCommonService, TGlobalConfig, THelperCacheService } from './lib';
import { PageLoadingService } from './shared/services/page-loading.service';
import { SocketEventSubjectDto, SocketOnEventService } from '@app/services/socket-io/socket-onevent.service';
import { ChatmoniSocketEventName } from '@app/services/socket-io/soketio-event';

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

    let localSocket = localStorage.getItem('_socketNotification') as any;
    let checkNotti = JSON.parse(localSocket || null);

    if(!TDSHelperString.hasValueString(checkNotti)) {
        localStorage.setItem('_socketNotification', JSON.stringify("ON"));
    }
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

        let localSocket = localStorage.getItem('_socketNotification') as any;
        let checkNotti = JSON.parse(localSocket || null) || '';

        if(checkNotti == 'OFF') return;

        this.teamId = (this.route.snapshot.queryParams?.teamId || 0) as number;
        switch(res.EventName) {
          // Thông báo tin nhắn lỗi
          case ChatmoniSocketEventName.chatomniOnUpdate:
              let paramsError =  this.router.url.startsWith('/conversation') && Number(this.route.snapshot.queryParams?.teamId) == res.Team?.Id;
              let userError = res.Data?.Data?.UserId == this.route.snapshot.queryParams?.csid;
              let hasNoti = TDSHelperObject.hasValue(res.Notification);
              let errorNoti = res && hasNoti && paramsError && userError ;

              if(errorNoti == false) break;
              this.notification.template( this.templateNotificationMessNew, { data: res, placement: 'bottomLeft' });
            break;

          // Thông báo tạo đơn hàng
          case ChatmoniSocketEventName.onCreatedSaleOnline_Order:
              let paramsCreated = this.router.url.startsWith('/conversation/post') && this.route.snapshot.queryParams?.post_id == res.Data?.Data?.Facebook_PostId;
              let createdNoti = res && paramsCreated;

              if(createdNoti == true) break;
              this.notification.template( this.templateNotificationMessNew, { data: res, placement: 'bottomLeft' });
          break;

          // Thông báo cập nhật đơn hàng
          case ChatmoniSocketEventName.onUpdateSaleOnline_Order:
              let paramsPost = this.router.url.startsWith('/conversation/post') && this.route.snapshot.queryParams?.post_id == res.Data?.Data?.Facebook_PostId;
              let orderNoti = res && paramsPost;

              if(orderNoti == true) break;
              this.notification.template( this.templateNotificationMessNew, { data: res, placement: 'bottomLeft' });
          break;

          // Thông báo xóa đơn hàng
          case ChatmoniSocketEventName.onDeleteSaleOnline_Order:
              let paramsDelete = this.router.url.startsWith('/conversation/post') && this.route.snapshot.queryParams?.post_id == res.Data?.Data?.Facebook_PostId;
              let deleteNoti = res && paramsDelete;

              if(deleteNoti == true) break;
              this.notification.template( this.templateNotificationMessNew, { data: res, placement: 'bottomLeft' });
          break;

          // Thông báo khi có tin nhắn gửi về
          case ChatmoniSocketEventName.chatomniOnMessage:
              let paramsMess = this.router.url.startsWith('/conversation') && Number(this.route.snapshot.queryParams?.teamId) == res.Team?.Id;
              let exist = res && paramsMess;

              if(exist == true) break;
              this.notification.template( this.templateNotificationMessNew, { data: res, placement: 'bottomLeft' });
          break;

          // Thông báo Số lượng sản phẩm chiến dịch chờ chốt
          case ChatmoniSocketEventName.livecampaign_Quantity_Order_Pending_Checkout:
          break;

          // Thông báo Số lượng sản phẩm chiến dịch có thểm mua
          case ChatmoniSocketEventName.livecampaign_Quantity_AvailableToBuy:
          break;

          default:
          break;
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
}
