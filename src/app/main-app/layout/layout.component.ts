import { TDSResizeObserver } from 'tds-ui/core/resize-observers';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap, takeUntil } from 'rxjs/operators';
import { TAuthService, UserInitDTO } from 'src/app/lib';
import { environment } from 'src/environments/environment';
import { TDSMenuDTO } from 'tds-ui/menu';
import { TDSModalService } from 'tds-ui/modal';
import { TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { CRMTeamDTO } from '../dto/team/team.dto';
import { CRMTeamService } from '../services/crm-team.service';
import { TPageHelperService } from '../services/helper.service';
import { SocketService } from '@app/services/socket-io/socket.service';
import { TDSDestroyService } from 'tds-ui/core/services';
import { FirebaseMessagingService } from '@app/services/firebase/firebase-messaging.service';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { TDSMessageService } from 'tds-ui/message';
import { FireBaseDevice, TopicDetailDto } from '@app/dto/firebase/topics.dto';
import { FirebaseRegisterService } from '@app/services/firebase/firebase-register.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  providers: [ TDSDestroyService ]
})

export class LayoutComponent implements OnInit, AfterViewInit {

  userInit!: UserInitDTO;
  currentTeam!: CRMTeamDTO | null;
  lstMenu!: TDSSafeAny;
  inlineCollapsed = false;
  params!: TDSSafeAny;
  withLayout!: number;
  withLaptop: number = 1600;
  establishedConnected?: boolean = true;
  notiSocket!: string;

  @ViewChild('withLayout') viewChildWithLayout!: ElementRef;
  isDeviceToken: boolean = false;
  isRegister: boolean = false;
  topicData: any = [];
  idsTopic: any[] = [];

  constructor(private auth: TAuthService,
    public crmService: CRMTeamService,
    private modalService: TDSModalService,
    private socketService: SocketService,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private firebaseRegisterService: FirebaseRegisterService,
    private firebaseMessagingService: FirebaseMessagingService,
    private cdRef: ChangeDetectorRef,
    private message: TDSMessageService,
    private resizeObserver: TDSResizeObserver,
    private destroy$: TDSDestroyService ) {

    router.events.pipe(
        takeUntil(this.destroy$),filter(event => event instanceof NavigationEnd), // Only get the event of NavigationEnd
        map(() => activatedRoute), // Listen to activateRoute
        map(route => {

            while (route.firstChild) {
                route = route.firstChild;
            }
            return route;
        }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data) ,
        // get the data
    ).subscribe(res => {
        if(this.withLayout < this.withLaptop){
            this.inlineCollapsed = true;
        } else {
            this.inlineCollapsed = res.collapse;
        }
    })
  }

  ngOnInit(): void {
    // TODO: check trạng thái bât tắt socket thông báo
    let localSocket = localStorage.getItem('_socketNotification') as any;
    let checkNotti = JSON.parse(localSocket || null);
    this.notiSocket = checkNotti;

    this.crmService.onChangeTeam().pipe(takeUntil(this.destroy$)).subscribe(res => {
        this.lstMenu = this.setMenu(res);
        this.currentTeam = res;
    })

    this.getAllFacebook();
    this.loadUserInfo();

    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe(res => {
        this.params = res;
    });

    // TODO: check trạng thái connnect socket-io
    this.establishedConnected = this.socketService.establishedConnected;

    this.firebaseDevice();
  }

  firebaseDevice() {
    let deviceToken = this.firebaseMessagingService.getDeviceTokenLocalStorage();
    if(deviceToken) {
        this.isDeviceToken = true;
    } else {
        this.isDeviceToken = false;
        this.loadTopics();
    }
  }

  ngAfterViewInit(): void {
    this.withLayout = this.viewChildWithLayout?.nativeElement?.offsetWidth;

    this.resizeObserver.observe(this.viewChildWithLayout)
      .subscribe(() => {

        this.withLayout = this.viewChildWithLayout?.nativeElement?.offsetWidth;

        if(this.withLayout < this.withLaptop){
             this.inlineCollapsed = true;
        }
      });
  }

  onLogout() {
    this.auth.logout(environment.urlLogin)
  }

  onOpenChange(e: boolean) {
    this.inlineCollapsed = e;
  }

  //lay danh sách facebook
  getAllFacebook() {
    this.crmService.getAllFacebooks().pipe(takeUntil(this.destroy$)).pipe(takeUntil(this.destroy$)).subscribe({
      next: (dataTeam: any) => {

        if (TDSHelperObject.hasValue(dataTeam)) {
            this.crmService.onUpdateListFaceBook(dataTeam);

            this.crmService.getCacheTeamId().subscribe((teamId: string | null) => {
                const team = TPageHelperService.findTeamById(dataTeam, teamId, true)
                this.crmService.onUpdateTeam(team);
            })
        }
        else {
            this.crmService.onUpdateListFaceBook(null);
            this.crmService.onUpdateTeam(null);
        }
      },
      error: (error: any) => {
        this.crmService.onUpdateListFaceBook(null);
        this.crmService.onUpdateTeam(null);
      }
    })
  }

  setMenu(data: CRMTeamDTO | null): Array<TDSMenuDTO> {
    let hidden = TDSHelperObject.hasValue(data) ? false : true;
    return [
      {
        name: "Tổng quan",
        icon: "tdsi-home-fill",
        link: '/dashboard',
      },
      {
        name: "Tất cả",
        icon: "tdsi-drawer-fill",
        link: '/conversation/all',
        linkProps: {
          queryParams: {
            'teamId': data?.Id,
            'type': 'all',
          },
        },
        hidden: hidden
      },
      {
        name: "Tin nhắn",
        icon: "tdsi-email-fill",
        link: '/conversation/inbox',
        linkProps: {
          queryParams: {
            'teamId': data?.Id,
            'type': 'message',
          },
        },
        hidden: hidden,
      },
      {
        name: "Bình luận",
        icon: "tdsi-comment-fill",
        link: `/conversation/comment`,
        linkProps: {
          queryParams: {
            'teamId': data?.Id,
            'type': 'comment',
          },
        },
        hidden: hidden,
      },
      {
        name: "Bài viết",
        icon: "tdsi-edit-paper-fill",
        link: `/conversation/post`,
        linkProps: {
          queryParams: {
            'teamId': data?.Id,
            'type': 'post',
          },
        },
        hidden: hidden,
      },
      {
        name: "Đơn hàng",
        icon: "tdsi-bag-fill",
        link: `/order`,
      },
      {
        name: "Chiến dịch live",
        icon: "tdsi-live-session-fill",
        link: `/live-campaign`,
      },
      {
        name: "Phiếu bán hàng",
        icon: "tdsi-dataset-fill",
        link: `/bill`,
        hidden: hidden,
      },
      // {
      //   name: "Chatbot",
      //   icon: "tdsi-callcenter-fill",
      //   link: `/chatbot`,
      // },
      {
        name: "Khách hàng",
        icon: "tdsi-user-fill",
        link: `/partner`,
      },
      {
        name: "Kênh kết nối",
        icon: "tdsi-facebook-2-fill",
        link: `/connect-channel?page=fb`,
      },
      {
        name: "Bán hàng đa kênh",
        icon: "tdsi-cart-fill",
        listChild: [
          {
            name: "Kết nối",
            link: `/omni-connection`,
          },
          {
            name: "Sản phẩm sàn TMĐT",
            link: `/omni-product`,
          },
          {
            name: "Đơn hàng",
            link: `/omni-order`,
          },
          {
            name: "Sản phẩm TPOS",
            link: `/omni-product-tpos`,
          },
        ]
      },
      {
        name: "Cấu hình",
        icon: "tdsi-gear-1-fill",
        link: `/configs`,
      }
    ];
  }

  //load thông tin user
  loadUserInfo() {
    this.auth.getUserInit().subscribe(res => {
      if(res) {
          this.userInit = res || {};
      }
    })
  }

  onClickTeam(data: CRMTeamDTO): any{
    let uri = this.router.url;

    if(uri && uri.startsWith("/conversation")){
        this.crmService.changeTeamFromLayout$.emit(data);
    } else {
        this.crmService.onUpdateTeam(data);
    }
  }

  onProfile() {
    this.router.navigateByUrl(`user/info`);
  }

  onPackOfData() {
    this.router.navigateByUrl(`user/pack-of-data`);
  }

  changeNotiSocketInfo() {
      let localSocket = localStorage.getItem('_socketNotification') as any;
      let checkNotti = JSON.parse(localSocket || null);

      if(TDSHelperString.hasValueString(checkNotti)) {
        if(checkNotti == "ON") {
            this.notiSocket = "OFF";
            localStorage.setItem('_socketNotification', JSON.stringify(this.notiSocket));
        } else {
            this.notiSocket = "ON";
            localStorage.setItem('_socketNotification', JSON.stringify(this.notiSocket));
        }
      }
  }

  onCancel() {
    this.isDeviceToken = true;
  }

  async requestPermission() {
    this.isRegister = true;

    const messaging = getMessaging();
    const serviceWorkerRegistration = await navigator
      .serviceWorker
      .register('../../../assets/firebase/firebase-messaging-sw.js');

      await getToken(messaging, {
        serviceWorkerRegistration: serviceWorkerRegistration,
        vapidKey: environment.firebaseConfig.vapidKey
      })
      .then((token: any) => {

          if(!token)  {
              this.isRegister = false;
              this.message.info('No registration token available. Request permission to generate one');
              return;
          }

          this.firebaseMessagingService.setDeviceTokenLocalStorage(token);
          this.registerDevice(token);

      }).catch((error) => {
          this.isRegister = false;
          this.message.error('An error occurred while retrieving token');
    });
  }

  registerDevice(token: string) {
    let model = {
        Platform: FireBaseDevice.Google,
        DeviceToken: token
    };

    this.firebaseRegisterService.registerDevice(model).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            this.message.success('Đăng ký nhận tin thành công');
            this.isRegister = false;
            this.isDeviceToken = true;
            this.registerTopics();
        },
        error: (err: any) => {
          this.isRegister = false;
          this.isDeviceToken = true;
          this.message.error('Đăng kí nhận tin thất bại');
        }
    })
  }

  registerTopics() {
    let model = {
      TopicIds: this.idsTopic
    }

    this.firebaseRegisterService.registerTopics(model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {},
      error: (err: any) => {
          this.isRegister = false;
          this.isDeviceToken = true;
          this.message.error(err?.error?.message);
      }
    })
  }

  loadTopics() {
    this.firebaseRegisterService.topics().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: any) => {
          this.topicData = [...data];
          this.mappingTopicIds();
      },
      error: (error: any) => {
          this.message.error(error?.error?.message);
      }
    });
  }

  mappingTopicIds() {
    let value = [] as TopicDetailDto[];

    this.topicData?.map((x: any) => {
      if(x && x.topics) {
          x.topics.map((a: any) => {
              value.push(a);
          })
      }
    });

    let ids = value?.map(x => x.id) as any[];
    this.idsTopic = ids;
  }

}
