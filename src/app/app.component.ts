import { ChatomniMessageType } from '@app/dto/conversation-all/chatomni/chatomni-data.dto';
import { CRMTeamType } from '@app/dto/team/chatomni-channel.dto';
import { TDSConfigService } from 'tds-ui/core/config';
import { TDSDestroyService } from 'tds-ui/core/services';
import { Component, NgZone, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import { TDSNotificationService } from 'tds-ui/notification';
import { TDSSafeAny, TDSHelperObject } from 'tds-ui/shared/utility';
import { TAuthService, TCommonService, TGlobalConfig, THelperCacheService } from './lib';
import { PageLoadingService } from './shared/services/page-loading.service';
import { SocketEventSubjectDto, SocketOnEventService } from '@app/services/socket-io/socket-onevent.service';
import { ChatmoniSocketEventName } from '@app/services/socket-io/soketio-event';
import { SocketStorageNotificationService } from '@app/services/socket-io/socket-config-notification.service';

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
  @ViewChild('templateFirebase') templateFirebase!: TemplateRef<{}>;

  message: any;
  token: any;

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
    private socketStorageNotificationService: SocketStorageNotificationService,
    private destroy$: TDSDestroyService) {
    this.loader.show();

    let exist = this.socketStorageNotificationService.getLocalStorage();
    if(!exist) {
      this.socketStorageNotificationService.setLocalStorage();
      exist = this.socketStorageNotificationService.getLocalStorage();
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

        let localSocket = this.socketStorageNotificationService.getLocalStorage() as any;
        if(!(localSocket && localSocket['socket.all'])) return;

        this.teamId = (this.route.snapshot.queryParams?.teamId || 0) as number;
        switch(res.EventName) {
          // Thông báo tin nhắn lỗi
          case ChatmoniSocketEventName.chatomniOnUpdate:
              if(!localSocket[ChatmoniSocketEventName.chatomniOnUpdate]) return;
              let paramsError =  this.router.url.startsWith('/conversation') && Number(this.route.snapshot.queryParams?.teamId) == res.Team?.Id;
              let userError = res.Data?.Data?.UserId == this.route.snapshot.queryParams?.csid;
              let hasNoti = TDSHelperObject.hasValue(res.Notification);
              let errorNoti = res && hasNoti && paramsError && userError ;

              if(errorNoti == false) break;
              this.notification.template( this.templateNotificationMessNew, { data: res, placement: 'bottomLeft' });
            break;

          // Thông báo tạo đơn hàng
          case ChatmoniSocketEventName.onCreatedSaleOnline_Order:
              if(!localSocket[ChatmoniSocketEventName.onCreatedSaleOnline_Order]) return;
              // let paramsCreated = this.router.url.startsWith('/conversation/post') && this.route.snapshot.queryParams?.post_id == res.Data?.Data?.Facebook_PostId;
              // let createdNoti = res && paramsCreated;

              // if(createdNoti == true) break;
              this.notification.template( this.templateNotificationMessNew, { data: res, placement: 'bottomLeft' });
          break;

          // Thông báo xóa đơn hàng
          case ChatmoniSocketEventName.onDeleteSaleOnline_Order:
              if(!localSocket[ChatmoniSocketEventName.onDeleteSaleOnline_Order]) return;
              // let paramsDelete = this.router.url.startsWith('/conversation/post') && this.route.snapshot.queryParams?.post_id == res.Data?.Data?.Facebook_PostId;
              // let deleteNoti = res && paramsDelete;

              // if(deleteNoti == true) break;
              this.notification.template( this.templateNotificationMessNew, { data: res, placement: 'bottomLeft' });
          break;

          // Thông báo khi có tin nhắn gửi về
          case ChatmoniSocketEventName.chatomniOnMessage:
              if(!localSocket[ChatmoniSocketEventName.chatomniOnMessage]) return;
              if(!localSocket[CRMTeamType._Facebook] && (res?.Data?.Message?.MessageType == ChatomniMessageType.FacebookComment || res?.Data?.Message?.MessageType == ChatomniMessageType.FacebookMessage)) return;
              if(!localSocket[CRMTeamType._TShop] && (res?.Data?.Message?.MessageType == ChatomniMessageType.TShopComment || res?.Data?.Message?.MessageType == ChatomniMessageType.TShopMessage)) return;
              if(!localSocket[CRMTeamType._TikTok] && res?.Data?.Message?.MessageType == ChatomniMessageType.UnofficialTikTokChat ) return;

              let paramsMess = this.router.url.startsWith('/conversation') && Number(this.route.snapshot.queryParams?.teamId) == res.Team?.Id;
              let exist = res && paramsMess;

              if(exist == true) break;
              this.notification.template( this.templateNotificationMessNew, { data: res, placement: 'bottomLeft' });
          break;

          // Thông báo Số lượng sản phẩm chiến dịch chờ chốt
          case ChatmoniSocketEventName.livecampaign_Quantity_Order_Pending_Checkout:
              if(!localSocket[ChatmoniSocketEventName.livecampaign_Quantity_Order_Pending_Checkout]) return;
          break;

          // Thông báo Số lượng sản phẩm chiến dịch có thểm mua
          case ChatmoniSocketEventName.livecampaign_Quantity_AvailableToBuy:
              if(!localSocket[ChatmoniSocketEventName.livecampaign_Quantity_AvailableToBuy]) return;
          break;

          // Thông báo bài viết mới
          case ChatmoniSocketEventName.chatomniCreatePost:
              if(!localSocket[ChatmoniSocketEventName.chatomniCreatePost]) return;
              let paramsPost = this.router.url.startsWith('/conversation/post') && Number(this.route.snapshot.queryParams?.teamId) == res.Team?.Id;
              let existPost = res && paramsPost;

              if(existPost == true) break;
              this.notification.template( this.templateNotificationMessNew, { data: res, placement: 'bottomLeft' });
          break;

          // Thông báo mất kết nối bài viết
          case ChatmoniSocketEventName.chatomniPostLiveDisconnected:
              // if(!localSocket[ChatmoniSocketEventName.chatomniPostLiveDisconnected]) return;
              let paramsPostLiveDisconnected = this.router.url.startsWith('/conversation/post') && Number(this.route.snapshot.queryParams?.teamId) == res.Team?.Id;
              let existPostLiveDisconnected = res && paramsPostLiveDisconnected;

              if(existPostLiveDisconnected == true) break;
              this.notification.template( this.templateNotificationMessNew, { data: res, placement: 'bottomLeft' });
          break;

          // Thông báo kết thúc bài live
          case ChatmoniSocketEventName.chatomniPostLiveEnd:
              if(!localSocket[ChatmoniSocketEventName.chatomniPostLiveEnd]) return;
              let paramsPostLiveEnd = this.router.url.startsWith('/conversation/post') && Number(this.route.snapshot.queryParams?.teamId) == res.Team?.Id;
              let existPostLiveEnd = res && paramsPostLiveEnd;

              if(existPostLiveEnd == true) break;
              this.notification.template( this.templateNotificationMessNew, { data: res, placement: 'bottomLeft' });
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
