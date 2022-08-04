import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { Component, NgZone, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChatomniMessageType } from '@app/dto/conversation-all/chatomni/chatomni-message.dto';
import { SocketioOnMessageDto } from '@app/dto/socket-io/chatomni-on-message.dto';
import { CRMTeamService } from '@app/services/crm-team.service';
import { BehaviorSubject, Observable , takeUntil} from 'rxjs';
import { TDSNotificationService } from 'tds-ui/notification';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { TAuthService, TCommonService, TGlobalConfig, THelperCacheService } from './lib';
import { SocketService } from './main-app/services/socket-io/socket.service';
import { PageLoadingService } from './shared/services/page-loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [ TDSDestroyService]
})

export class AppComponent {

  title = 'T-Page';
  public isLoaded: boolean = false;

  data!: SocketioOnMessageDto;
  url!: string;
  titleMessage!: string;
  team!: CRMTeamDTO;
  @ViewChild('templateNotificationMessNew') templateNotificationMessNew!: TemplateRef<{}>;

  constructor(public libCommon: TCommonService,
    public auth: TAuthService,
    public cache: THelperCacheService,
    public zone: NgZone,
    public router: Router,
    private crmTeamService: CRMTeamService,
    private notification: TDSNotificationService,
    private loader: PageLoadingService,
    private socketService: SocketService,
    private destroy$: TDSDestroyService) {
    this.loader.show();
  }

  ngOnInit() {
    let that = this;
    that.init().subscribe(res => {
        this.loader.hidden();
        that.isLoaded = true;
    });

    this.socketService.listenEvent("on-events").subscribe((res: any) => {
        this.data = JSON.parse(res) as SocketioOnMessageDto;
        console.log(this.data);

        if(this.data) {
          this.crmTeamService.getActiveByPageIds$([this.data.Conversation.ChannelId]).pipe(takeUntil(this.destroy$)).subscribe((teams: CRMTeamDTO[]) => {

              this.team = teams[0];
              switch(this.data.Message.MessageType) {
                  case ChatomniMessageType.FacebookMessage:

                    this.titleMessage = `Facebook: ${this.data.Conversation.Name} vừa nhắn tin`;
                    this.notification.template(this.templateNotificationMessNew, { data: this.data, placement: 'bottomLeft' });
                    this.url = `/conversation/inbox?teamId=${teams[0].Id}&type=message&csid=${this.data.Conversation.UserId}`;

                    break;

                  case ChatomniMessageType.FacebookComment:

                    this.titleMessage = `Facebook: ${this.data.Conversation.Name} vừa bình luận`;
                    this.notification.template(this.templateNotificationMessNew, { data: this.data, placement: 'bottomLeft' });
                    this.url = `/conversation/comment?teamId=${teams[0].Id}&type=comment&csid=${this.data.Conversation.UserId}`;

                  break;

                  case ChatomniMessageType.TShopMessage:

                    this.titleMessage = `TShop: ${this.data.Conversation.Name} vừa nhắn tin`;
                    this.notification.template(this.templateNotificationMessNew, { data: this.data, placement: 'bottomLeft' });
                    this.url = `/conversation/inbox?teamId=${teams[0].Id}&type=message&csid=${this.data.Conversation.UserId}`;

                  break;

                  case ChatomniMessageType.TShopComment:

                    this.titleMessage = `TShop: ${this.data.Conversation.Name} vừa bình luận`;
                    this.notification.template(this.templateNotificationMessNew, { data: this.data, placement: 'bottomLeft' });
                    this.url = `/conversation/comment?teamId=${teams[0].Id}&type=comment&csid=${this.data.Conversation.UserId}`;

                  break;

              }
          }, error => {
             console.log('Thông báo đến từ kênh chưa được kết nối', this.data)
          })
        }

    }, err => {
      console.log(err);
    });
  }

  getLink() {
    this.crmTeamService.onUpdateTeam(this.team);
    this.router.navigateByUrl(this.url);
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
