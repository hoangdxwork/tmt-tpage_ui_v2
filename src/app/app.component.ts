import { ChatomniMessageType } from './main-app/dto/conversation-all/chatomni/chatomni-data.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ChangeDetectorRef, Component, NgZone, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SocketioOnMessageDto } from '@app/dto/socket-io/chatomni-on-message.dto';
import { CRMTeamService } from '@app/services/crm-team.service';
import { BehaviorSubject, Observable , takeUntil} from 'rxjs';
import { TDSNotificationService } from 'tds-ui/notification';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { TAuthService, TCommonService, TGlobalConfig, THelperCacheService } from './lib';
import { SocketService } from './main-app/services/socket-io/socket.service';
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
  url!: string;
  team!: CRMTeamDTO;
  @ViewChild('templateNotificationMessNew') templateNotificationMessNew!: TemplateRef<{}>;

  constructor(public libCommon: TCommonService,
    public auth: TAuthService,
    public cache: THelperCacheService,
    public zone: NgZone,
    public router: Router,
    private cdRef: ChangeDetectorRef,
    private crmTeamService: CRMTeamService,
    private notification: TDSNotificationService,
    private socketOnEventService: SocketOnEventService,
    private loader: PageLoadingService,
    private socketService: SocketService,
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
          if(res && res.Notification) {
            this.notification.template(this.templateNotificationMessNew, { data: res.Notification, placement: 'bottomLeft' });
          }
      }
    })

    this.socketService.listenEvent("on-events").pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        let socketData = JSON.parse(res) as SocketioOnMessageDto;
        console.log(socketData);

        // TODO: thông báo tin nhắn
        if(socketData && this.crmTeamService.getCurrentTeam()?.Id) {
            this.crmTeamService.getActiveByPageIds$([socketData.Conversation.ChannelId]).pipe(takeUntil(this.destroy$)).subscribe({
                next: (teams: CRMTeamDTO[]) => {
                    this.team = teams[0];

                    switch(socketData.Message.MessageType) {
                        case ChatomniMessageType.FacebookMessage:

                          let fbMessage = {
                              title: `Facebook: ${socketData.Conversation.Name} vừa nhắn tin`,
                              message: `${socketData.Message.Message}`,
                              attachments: socketData.Message.Data?.attachments,
                              url: `/conversation/inbox?teamId=${this.team?.Id}&type=message&csid=${socketData.Conversation?.UserId}`
                          } as any;

                          this.notification.template(this.templateNotificationMessNew, { data: fbMessage, placement: 'bottomLeft' });
                          break;

                        case ChatomniMessageType.FacebookComment:

                          let fbComment = {
                              title: `Facebook: ${socketData.Conversation.Name} vừa bình luận`,
                              message: `${socketData.Message.Message}`,
                              attachments: socketData.Message.Data?.attachments,
                              url: `/conversation/comment?teamId=${this.team?.Id}&type=comment&csid=${socketData.Conversation?.UserId}`
                          } as any;

                          this.notification.template(this.templateNotificationMessNew, { data: fbComment, placement: 'bottomLeft' });
                        break;

                        case ChatomniMessageType.TShopMessage:

                          let tShopMessage = {
                              title: `TShop: ${socketData.Conversation.Name} vừa nhắn tin`,
                              message: `${socketData.Message.Message}`,
                              attachments: socketData.Message.Data?.attachments,
                              url: `/conversation/all?teamId=${this.team?.Id}&type=all&csid=${socketData.Conversation?.UserId}`
                          } as any;

                          this.notification.template(this.templateNotificationMessNew, {data: tShopMessage, placement: 'bottomLeft' });
                        break;

                        case ChatomniMessageType.TShopComment:

                          let tShopComment = {
                              title: `TShop: ${socketData.Conversation.Name} vừa nhắn tin`,
                              message: `${socketData.Message.Message}`,
                              attachments: socketData.Message.Data?.attachments,
                              url: `/conversation/all?teamId=${this.team?.Id}&type=all&csid=${socketData.Conversation?.UserId}`
                          } as any;

                          this.notification.template(this.templateNotificationMessNew, {data: tShopComment, placement: 'bottomLeft' });
                        break;

                        default:

                          let dataDefault = {
                              title: `${socketData.Conversation.Name} vừa phản hồi`,
                              message: `${socketData.Message.Message}`,
                              attachments: socketData.Message.Data?.attachments,
                              url: `/conversation/all?teamId=${this.team.Id}&type=all&csid=${socketData.Conversation?.UserId}`
                          } as any;

                          this.notification.template(this.templateNotificationMessNew, { data: dataDefault, placement: 'bottomLeft' });
                        break;

                    }
                    this.cdRef.markForCheck();
                },
                error: (error: any) => {
                    console.log(`Thông báo đến từ kênh chưa được kết nối: \n ${socketData}`)
                }
            })
        }
      }
    });
  }

  getLink(url?: string) {
    if(url) {
        this.router.navigateByUrl(url);
        this.crmTeamService.onUpdateTeam(this.team);
    }
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
