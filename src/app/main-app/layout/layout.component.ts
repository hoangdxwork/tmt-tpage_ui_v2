import { SocketStorageNotificationService } from './../services/socket-io/socket-config-notification.service';
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
  notiSocket!: boolean;

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
    private destroy$: TDSDestroyService,
    private socketStorageNotificationService: SocketStorageNotificationService ) {

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
    let localSocket = this.socketStorageNotificationService.getLocalStorage() as any;
    if(!localSocket) {
      this.socketStorageNotificationService.setLocalStorage();
      localSocket = this.socketStorageNotificationService.getLocalStorage();
    }
    this.notiSocket = localSocket["socket.all"];

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

    this.onEventEmitter();
  }

  onEventEmitter() {
    this.socketStorageNotificationService.socketAllEmitter$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.notiSocket = res;
    });
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
        htmlIcon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.78742 0.400124H7.78772C8.15564 0.400124 8.5085 0.546282 8.76866 0.806445C9.02883 1.06661 9.17499 1.41947 9.17499 1.78739V5.38757C9.17499 5.75529 9.02899 6.10797 8.76909 6.3681C8.50918 6.62823 8.15664 6.77452 7.78892 6.77484H1.78862C1.60644 6.775 1.42601 6.73927 1.25764 6.6697C1.08927 6.60013 0.936249 6.49808 0.807317 6.36937C0.678386 6.24066 0.576068 6.08782 0.506206 5.91957C0.436343 5.75132 0.400305 5.57095 0.400147 5.38877V1.78859C0.399989 1.60631 0.435756 1.42579 0.505402 1.25734C0.575048 1.08889 0.677209 0.935817 0.806044 0.80687C0.93488 0.677923 1.08786 0.57563 1.25625 0.505838C1.42464 0.436046 1.60514 0.400124 1.78742 0.400124V0.400124Z" class='tds-icon-secondary' />
        <path d="M12.2125 13.2252H18.2128C18.5807 13.2252 18.9335 13.3713 19.1937 13.6315C19.4539 13.8917 19.6 14.2445 19.6 14.6124V18.2126C19.6 18.5803 19.454 18.933 19.1941 19.1931C18.9342 19.4533 18.5817 19.5996 18.214 19.5999H12.2137C12.0315 19.6 11.8511 19.5643 11.6827 19.4947C11.5143 19.4252 11.3613 19.3231 11.2324 19.1944C11.1034 19.0657 11.0011 18.9129 10.9313 18.7446C10.8614 18.5764 10.8254 18.396 10.8252 18.2138V14.6136C10.825 14.4314 10.8608 14.2508 10.9305 14.0824C11.0001 13.9139 11.1023 13.7609 11.2311 13.6319C11.3599 13.503 11.5129 13.4007 11.6813 13.3309C11.8497 13.2611 12.0302 13.2252 12.2125 13.2252V13.2252Z" class='tds-icon-secondary'/>
        <path d="M1.78742 8.42493H7.78772C8.15564 8.42493 8.5085 8.57109 8.76866 8.83125C9.02883 9.09141 9.17499 9.44427 9.17499 9.8122V18.2126C9.17499 18.5803 9.02899 18.933 8.76909 19.1931C8.50918 19.4533 8.15664 19.5996 7.78892 19.5999H1.78862C1.60644 19.6 1.42601 19.5643 1.25764 19.4947C1.08927 19.4252 0.936249 19.3231 0.807317 19.1944C0.678386 19.0657 0.576068 18.9129 0.506206 18.7446C0.436343 18.5764 0.400305 18.396 0.400147 18.2138V9.8134C0.399989 9.63112 0.435756 9.45059 0.505402 9.28214C0.575048 9.11369 0.677209 8.96062 0.806044 8.83167C0.93488 8.70273 1.08786 8.60043 1.25625 8.53064C1.42464 8.46085 1.60514 8.42493 1.78742 8.42493V8.42493Z"  class="tds-icon-primary"/>
        <path d="M12.2125 0.400124H18.2128C18.5807 0.400124 18.9335 0.546282 19.1937 0.806445C19.4539 1.06661 19.6 1.41947 19.6 1.78739V10.1878C19.6 10.5555 19.454 10.9082 19.1941 11.1683C18.9342 11.4285 18.5817 11.5748 18.214 11.5751H12.2137C12.0315 11.5752 11.8511 11.5395 11.6827 11.4699C11.5143 11.4004 11.3613 11.2983 11.2324 11.1696C11.1034 11.0409 11.0011 10.8881 10.9313 10.7198C10.8614 10.5516 10.8254 10.3712 10.8252 10.189V1.78859C10.825 1.60631 10.8608 1.42579 10.9305 1.25734C11.0001 1.08889 11.1023 0.935817 11.2311 0.80687C11.3599 0.677923 11.5129 0.57563 11.6813 0.505838C11.8497 0.436046 12.0302 0.400124 12.2125 0.400124V0.400124Z" class="tds-icon-primary"/>
        </svg>`,
        link: '/dashboard',
      },
      {
        name: "Tất cả",
        // icon: "tdsi-drawer-fill",
        htmlIcon:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.94858 5.75781C5.94858 5.75781 3.36005 10.6889 3.27725 10.8533C3.19444 11.0177 8.98833 12.6198 8.98833 12.6198L14.0838 15.9067L17.2039 11.7161L20.5725 10.8533L18.2384 5.75781H5.94858Z" class='tds-icon-secondary'/>
        <path d="M21.5113 10.5197L19.4256 6.05548C19.2349 5.67798 18.9433 5.36072 18.5832 5.13893C18.223 4.91713 17.8085 4.79948 17.3855 4.79902H6.6402C6.21329 4.79346 5.79382 4.91105 5.432 5.13772C5.07019 5.36438 4.78136 5.69052 4.6001 6.07708L2.4904 10.5425C2.43717 10.631 2.40628 10.7311 2.40039 10.8341V16.1732C2.40229 16.7675 2.63921 17.3368 3.05942 17.7571C3.47964 18.1773 4.04903 18.4142 4.6433 18.4161H19.3584C19.9527 18.4142 20.5221 18.1773 20.9423 17.7571C21.3625 17.3368 21.5995 16.7675 21.6014 16.1732V10.8113C21.6061 10.7066 21.5743 10.6035 21.5113 10.5197ZM15.8411 10.1165V10.1609C15.6895 10.1576 15.5416 10.2074 15.4228 10.3016C15.304 10.3958 15.2219 10.5286 15.1906 10.6769C15.0452 11.4181 14.6484 12.0863 14.0672 12.5687C13.486 13.051 12.7561 13.3179 12.0009 13.3242C11.2488 13.3085 10.5243 13.038 9.94574 12.5572C9.36722 12.0763 8.96892 11.4135 8.81591 10.6769C8.78775 10.527 8.70647 10.3923 8.58699 10.2975C8.46751 10.2027 8.31785 10.1542 8.16548 10.1609H4.08047L5.74016 6.63871C5.81684 6.47121 5.9401 6.3293 6.09522 6.22992C6.25034 6.13055 6.43078 6.07791 6.615 6.07828H17.3591C17.5379 6.07739 17.7137 6.12489 17.8677 6.21573C18.0217 6.30658 18.1483 6.43738 18.234 6.5943L19.8937 10.1165H15.8411Z" class="tds-icon-primary"/>
        </svg>`,
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
      let localSocket = this.socketStorageNotificationService.getLocalStorage() as any;
      if(localSocket) {
          let cur = localSocket["socket.all"]
          if(cur == false) {
            for(let data in localSocket) {
              localSocket[data] = true;
            }
          } else {
            for(let data in localSocket) {
              localSocket[data] = false;
            }
          }
          this.notiSocket = localSocket["socket.all"];

          this.socketStorageNotificationService.setLocalStorage(localSocket);
          this.socketStorageNotificationService.socketAllEmitter$.emit(localSocket["socket.all"]);
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
