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
        htmlIcon:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.24486 9.79588C4.48862 9.97994 5.21991 10.5264 6.43873 11.4353C7.65755 12.3442 8.59198 13.0442 9.24202 13.5353C9.31352 13.5891 9.46547 13.706 9.69786 13.886C9.93025 14.0659 10.1232 14.2117 10.2768 14.3233C10.4304 14.4341 10.616 14.5587 10.8338 14.6971C11.0274 14.823 11.2342 14.927 11.4505 15.0074C11.622 15.0727 11.8034 15.1078 11.9868 15.1113H12.0087C12.1921 15.1078 12.3735 15.0726 12.545 15.0074C12.7609 14.9269 12.9673 14.8229 13.1605 14.6971C13.3783 14.5587 13.564 14.4341 13.7175 14.3233C13.8711 14.2125 14.0641 14.0668 14.2965 13.886C14.5289 13.7052 14.6808 13.5883 14.7523 13.5353L19.7665 9.79588C20.2847 9.40791 20.7276 8.92801 21.0731 8.37999C21.4124 7.86417 21.5949 7.26065 21.5984 6.6428C21.6064 6.15911 21.4233 5.69186 21.089 5.34297C20.9379 5.1721 20.7523 5.03545 20.5445 4.94213C20.3366 4.84881 20.1113 4.80096 19.8835 4.80178H4.11688C3.8724 4.78916 3.62859 4.83719 3.40705 4.9416C3.18552 5.04602 2.99311 5.20361 2.84687 5.40039C2.53893 5.83641 2.38261 6.36183 2.402 6.89568C2.43363 7.46753 2.63953 8.01587 2.99191 8.46672C3.33303 8.97643 3.75647 9.42563 4.24486 9.79588V9.79588Z" class="tds-icon-secondary"/>
        <path d="M20.5306 7.45761C18.188 9.25669 16.4094 10.6547 15.1946 11.6515C14.7883 11.992 14.458 12.2575 14.2037 12.448C13.8862 12.6759 13.547 12.8715 13.1909 13.032C12.8247 13.2172 12.4222 13.3189 12.0123 13.3301H11.9915C11.5816 13.3189 11.1791 13.2172 10.8129 13.032C10.4569 12.8715 10.1176 12.6758 9.8001 12.448C9.54659 12.2575 9.21629 11.992 8.8092 11.6515C7.84471 10.8518 6.0697 9.45378 3.48417 7.45761C3.08016 7.15372 2.71645 6.79943 2.40186 6.40332V16.0544C2.39067 16.5597 2.57048 17.0506 2.90523 17.4287C3.05209 17.6079 3.23686 17.7522 3.44618 17.8511C3.6555 17.95 3.88412 18.001 4.11552 18.0004H19.8871C20.1185 18.001 20.3471 17.95 20.5564 17.8511C20.7657 17.7522 20.9505 17.6079 21.0973 17.4287C21.4321 17.0506 21.6119 16.5597 21.6007 16.0544V6.40332C21.2879 6.7969 20.9286 7.15093 20.5306 7.45761V7.45761Z" class="tds-icon-primary"/>
        </svg>`,
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
        htmlIcon:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.6808 5.24512C6.10978 5.24512 2.40039 8.56688 2.40039 12.6651C2.4066 14.1369 2.88673 15.5677 3.76966 16.7453C3.75671 18.2519 3.27847 19.7176 2.40039 20.9419C4.06351 20.6941 5.67271 20.1666 7.15983 19.3818C8.27323 19.8485 9.46876 20.0876 10.676 20.0851C15.247 20.0851 18.9564 16.7633 18.9564 12.6651C18.9564 8.56688 15.247 5.24512 10.6808 5.24512Z" class="tds-icon-primary"/>
        <path d="M21.6017 9.82238C21.6017 5.72418 17.896 2.40241 13.3213 2.40241C11.8086 2.36919 10.315 2.74557 8.99869 3.49172C7.68236 4.23787 6.59225 5.32603 5.84375 6.64103C7.28595 5.72048 8.96306 5.23547 10.674 5.24416C15.245 5.24416 18.9544 8.56592 18.9544 12.6641C18.9484 14.1946 18.4314 15.6792 17.4855 16.8823C18.7978 17.469 20.1825 17.8778 21.6029 18.098C20.7266 16.8756 20.2489 15.4126 20.2349 13.9086C21.1182 12.729 21.5975 11.296 21.6017 9.82238Z" class="tds-icon-secondary"/>
        <path d="M7.14545 13.5849C7.67236 13.5849 8.0995 13.1577 8.0995 12.6308C8.0995 12.1039 7.67236 11.6768 7.14545 11.6768C6.61855 11.6768 6.19141 12.1039 6.19141 12.6308C6.19141 13.1577 6.61855 13.5849 7.14545 13.5849Z" fill="white"/>
        <path d="M10.9619 13.5849C11.4888 13.5849 11.9159 13.1577 11.9159 12.6308C11.9159 12.1039 11.4888 11.6768 10.9619 11.6768C10.435 11.6768 10.0078 12.1039 10.0078 12.6308C10.0078 13.1577 10.435 13.5849 10.9619 13.5849Z" fill="white"/>
        <path d="M14.7783 13.5849C15.3052 13.5849 15.7323 13.1577 15.7323 12.6308C15.7323 12.1039 15.3052 11.6768 14.7783 11.6768C14.2514 11.6768 13.8242 12.1039 13.8242 12.6308C13.8242 13.1577 14.2514 13.5849 14.7783 13.5849Z" fill="white"/>
        </svg>`,
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
        htmlIcon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.80101 2.40039H14.9976L20.4014 7.78377V20.4004C20.4014 20.7188 20.275 21.0241 20.0498 21.2492C19.8247 21.4743 19.5194 21.6008 19.201 21.6008H4.80101C4.48264 21.6008 4.17731 21.4743 3.95218 21.2492C3.72706 21.0241 3.60059 20.7188 3.60059 20.4004V3.60082C3.60059 3.28244 3.72706 2.97711 3.95218 2.75199C4.17731 2.52686 4.48264 2.40039 4.80101 2.40039V2.40039Z" class="tds-icon-primary"/>
        <path d="M20.3851 7.79962H16.2073C15.8889 7.79962 15.5836 7.67315 15.3584 7.44803C15.1333 7.2229 15.0068 6.91757 15.0068 6.5992V2.41113L20.3851 7.79962Z" class="tds-icon-secondary"/>
        <path d="M7.52148 15.7478V17.4033H9.17702L14.0605 12.5198L12.405 10.8643L7.52148 15.7478Z" class="tds-icon-secondary"/>
        <path d="M15.3356 10.6181L14.3052 9.58638C14.2222 9.50355 14.1098 9.45703 13.9926 9.45703C13.8754 9.45703 13.7629 9.50355 13.68 9.58638L12.8721 10.3943L14.5276 12.0499L15.3356 11.2419C15.418 11.159 15.4643 11.0469 15.4643 10.93C15.4643 10.8131 15.418 10.7009 15.3356 10.6181Z" class="tds-icon-secondary"/>
        </svg>`,
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
        htmlIcon:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.6328 4.8083V6.7549H13.8019C13.8019 6.2898 13.8137 5.82469 13.8019 5.35959C13.7974 5.15465 13.7445 4.95369 13.6474 4.77313C13.5504 4.59258 13.412 4.43757 13.2435 4.32078C13.0112 4.13869 12.7404 4.01212 12.4517 3.95074C12.163 3.88936 11.8641 3.89479 11.5779 3.96663C11.2079 4.01881 10.87 4.20474 10.6279 4.48927C10.3857 4.77379 10.2563 5.13717 10.264 5.51069C10.2746 5.92503 10.264 6.33701 10.264 6.7549H8.4331C8.4331 6.2898 8.45198 5.82351 8.4331 5.35959C8.41382 4.93016 8.50944 4.50337 8.71009 4.12322C8.91075 3.74307 9.20919 3.42333 9.57462 3.19697C10.1951 2.74949 10.9257 2.47924 11.688 2.4152C12.4503 2.35115 13.2157 2.49571 13.9022 2.83338C14.3216 3.00964 14.6954 3.27907 14.9953 3.62124C15.2951 3.96342 15.5131 4.36936 15.6328 4.8083Z" class="tds-icon-secondary"/>
        <path d="M20.2994 19.8226C20.1979 18.8912 20.107 17.9587 20.0055 17.0273C19.8945 16.0121 19.7694 14.9992 19.6584 13.9852C19.5628 13.1483 19.4696 12.3113 19.368 11.4755C19.237 10.3883 19.0977 9.30229 18.9667 8.21508C18.9372 7.97308 18.9218 7.72873 18.9065 7.48555C18.8759 7.27201 18.7655 7.07802 18.5974 6.94281C18.4293 6.80761 18.2162 6.74126 18.001 6.7572C17.2491 6.7572 16.4971 6.7572 15.744 6.7572H15.4312H8.59862H6.11962C5.99072 6.73838 5.85924 6.74867 5.73484 6.78731C5.61044 6.82595 5.49628 6.89196 5.40072 6.9805C5.30517 7.06903 5.23065 7.17786 5.18265 7.29896C5.13464 7.42006 5.11437 7.55036 5.12331 7.68032C5.05131 8.4252 4.93207 9.16535 4.84471 9.90905C4.77625 10.4993 4.72667 11.0895 4.6641 11.6727C4.60154 12.2558 4.50947 12.8402 4.441 13.4257C4.37489 13.9852 4.32295 14.5459 4.26039 15.1055C4.18838 15.7276 4.10575 16.3485 4.03492 16.9706C3.97 17.5384 3.91688 18.1086 3.85431 18.6776C3.78703 19.2678 3.73625 19.8698 3.63119 20.4589C3.53557 21.0173 3.65717 21.3679 4.09276 21.5072C4.28407 21.5651 4.48313 21.5934 4.683 21.591C9.57329 21.5957 14.4636 21.5957 19.3539 21.591C19.5553 21.6184 19.7603 21.5909 19.9474 21.5113C20.1344 21.4317 20.2964 21.303 20.4163 21.1389V20.4542C20.3738 20.2417 20.323 20.0339 20.2994 19.8226Z" class="tds-icon-primary"/>
        </svg>
        `,
        link: `/order`,
      },
      {
        name: "Chiến dịch live",
        htmlIcon:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.8889 6.38462H4.96296C3.33333 6.38462 2 7.7 2 9.30769V12.2308C2 13.8385 3.33333 15.1538 4.96296 15.1538H6.44444L6.44444 19.5385C6.44444 20.3423 7.11111 21 7.92593 21C8.74074 21 9.40741 20.3423 9.40741 19.5385V15.1538H10.8889L18.2963 19.5385V2L10.8889 6.38462Z" class="tds-icon-primary"/>
        <path d="M19.7773 5.87305C21.1403 7.07151 21.9996 8.82536 21.9996 10.7692C21.9996 12.713 21.1403 14.4669 19.7773 15.6507V5.87305Z" class="tds-icon-secondary"/>
        </svg>`,
        link: `/live-campaign`,
      },
      {
        name: "Phiếu bán hàng",
        htmlIcon:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.5444 2.41296H5.1434C4.49278 2.34669 3.84265 2.54425 3.3307 2.96384C2.81875 3.38343 2.48512 3.99217 2.40039 4.66113V21.0356C2.41951 21.2038 2.50249 21.3574 2.63107 21.4627C2.75965 21.568 2.92337 21.6163 3.08647 21.5973H16.7987C16.9618 21.6163 17.1256 21.568 17.2541 21.4627C17.3827 21.3574 17.4656 21.2038 17.4847 21.0356V8.03263L20.2277 5.22145L19.5444 2.41296Z" class="tds-icon-primary"/>
        <path d="M20.669 2.7655C20.3374 2.53298 19.9452 2.40973 19.5442 2.41214C19.274 2.41178 19.0064 2.46649 18.7567 2.57303C18.507 2.67957 18.2801 2.83585 18.089 3.03302C17.8979 3.23019 17.7465 3.46436 17.6432 3.72205C17.54 3.97973 17.487 4.25588 17.4873 4.53472V9.48642H20.9151C21.097 9.48642 21.2715 9.41181 21.4002 9.27904C21.5289 9.14627 21.6012 8.96622 21.6012 8.77845V4.53472C21.6036 4.18252 21.5192 3.83548 21.3562 3.52604C21.1932 3.2166 20.9567 2.95491 20.669 2.7655Z" class="tds-icon-secondary"/>
        <path d="M12.99 12.4102H6.5171C6.30251 12.4102 6.09671 12.4981 5.94497 12.6547C5.79323 12.8113 5.70801 13.0236 5.70801 13.2451C5.70801 13.4665 5.79323 13.6789 5.94497 13.8355C6.09671 13.992 6.30251 14.0801 6.5171 14.0801H12.99C13.2046 14.0801 13.4105 13.992 13.5622 13.8355C13.7139 13.6789 13.7992 13.4665 13.7992 13.2451C13.7992 13.0236 13.7139 12.8113 13.5622 12.6547C13.4105 12.4981 13.2046 12.4102 12.99 12.4102Z" class="tds-icon-secondary"/>
        <path d="M12.99 9.33691H6.5171C6.30251 9.33691 6.09671 9.42486 5.94497 9.58144C5.79323 9.73802 5.70801 9.95039 5.70801 10.1718C5.70801 10.3933 5.79323 10.6056 5.94497 10.7622C6.09671 10.9188 6.30251 11.0068 6.5171 11.0068H12.99C13.2046 11.0068 13.4105 10.9188 13.5622 10.7622C13.7139 10.6056 13.7992 10.3933 13.7992 10.1718C13.7992 9.95039 13.7139 9.73802 13.5622 9.58144C13.4105 9.42486 13.2046 9.33691 12.99 9.33691Z" class="tds-icon-secondary"/>
        <path d="M12.99 15.4131H6.5171C6.30251 15.4131 6.09671 15.501 5.94497 15.6576C5.79323 15.8142 5.70801 16.0266 5.70801 16.248C5.70801 16.4694 5.79323 16.6818 5.94497 16.8384C6.09671 16.995 6.30251 17.083 6.5171 17.083H12.99C13.2046 17.083 13.4105 16.995 13.5622 16.8384C13.7139 16.6818 13.7992 16.4694 13.7992 16.248C13.7992 16.0266 13.7139 15.8142 13.5622 15.6576C13.4105 15.501 13.2046 15.4131 12.99 15.4131Z" class="tds-icon-secondary"/>
        </svg>`,
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
        htmlIcon:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.9993 10.0544C13.891 10.0544 15.4245 8.52088 15.4245 6.62923C15.4245 4.73758 13.891 3.2041 11.9993 3.2041C10.1077 3.2041 8.57422 4.73758 8.57422 6.62923C8.57422 8.52088 10.1077 10.0544 11.9993 10.0544Z" class="tds-icon-primary"/>
        <path d="M18.4837 10.4146C19.6795 10.4146 20.649 9.44517 20.649 8.2493C20.649 7.05343 19.6795 6.08398 18.4837 6.08398C17.2878 6.08398 16.3184 7.05343 16.3184 8.2493C16.3184 9.44517 17.2878 10.4146 18.4837 10.4146Z" class="tds-icon-secondary"/>
        <path d="M5.52566 10.4146C6.72153 10.4146 7.69097 9.44517 7.69097 8.2493C7.69097 7.05343 6.72153 6.08398 5.52566 6.08398C4.32979 6.08398 3.36035 7.05343 3.36035 8.2493C3.36035 9.44517 4.32979 10.4146 5.52566 10.4146Z" class="tds-icon-secondary"/>
        <path d="M7.68336 12.2144C6.83101 11.5161 6.0591 11.6085 5.07357 11.6085C3.59958 11.6085 2.40039 12.8006 2.40039 14.2656V18.5651C2.40039 19.2013 2.91967 19.7186 3.55824 19.7186C6.31512 19.7186 5.983 19.7685 5.983 19.5997C5.983 16.5531 5.62214 14.3188 7.68336 12.2144Z" class="tds-icon-secondary"/>
        <path d="M12.9367 11.4078C11.2153 11.2642 9.71907 11.4094 8.42851 12.4747C6.26882 14.2046 6.68445 16.5338 6.68445 19.3832C6.68445 20.1371 7.29782 20.7619 8.06316 20.7619C16.3733 20.7619 16.7041 21.03 17.1968 19.9387C17.3584 19.5697 17.3142 19.6869 17.3142 16.1565C17.3142 13.3524 14.8861 11.4078 12.9367 11.4078Z" class="tds-icon-primary"/>
        <path d="M18.9282 11.6084C17.9372 11.6084 17.1696 11.517 16.3184 12.2143C18.3642 14.3031 18.0187 16.3849 18.0187 19.5996C18.0187 19.7695 17.743 19.7185 20.4021 19.7185C21.0635 19.7185 21.6013 19.1827 21.6013 18.5241V14.2655C21.6013 12.8005 20.4021 11.6084 18.9282 11.6084Z" class="tds-icon-secondary"/>
        </svg>`,
        link: `/partner`,
      },
      {
        name: "Kênh kết nối",
        htmlIcon:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.542 2.40039H3.45972C3.17877 2.40039 2.90933 2.512 2.71066 2.71066C2.512 2.90933 2.40039 3.17877 2.40039 3.45972L2.40039 20.5435C2.40039 20.8244 2.512 21.0939 2.71066 21.2925C2.90933 21.4912 3.17877 21.6028 3.45972 21.6028H20.542C20.823 21.6028 21.0924 21.4912 21.2911 21.2925C21.4897 21.0939 21.6014 20.8244 21.6014 20.5435V3.45972C21.6014 3.17877 21.4897 2.90933 21.2911 2.71066C21.0924 2.512 20.823 2.40039 20.542 2.40039V2.40039Z" class="tds-icon-primary"/>
        <path d="M15.657 21.6014V14.1773H18.16L18.5355 11.271H15.657V9.41828C15.657 8.57812 15.8908 8.00682 17.0933 8.00682H18.6188V5.41036C17.8762 5.3317 17.1299 5.29365 16.3832 5.29638C15.8752 5.25928 15.3652 5.3338 14.8891 5.51471C14.413 5.69562 13.9822 5.97855 13.627 6.34362C13.2718 6.70869 13.0008 7.14708 12.833 7.628C12.6653 8.10892 12.6048 8.62073 12.6558 9.12752V11.2696H10.1631V14.1773H12.6573V21.6028L15.657 21.6014Z" class="tds-icon-secondary"/>
        </svg>`,
        link: `/connect-channel?page=fb`,
      },
    //   {
    //     name: "Bán hàng đa kênh",
    //     htmlIcon:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    //     <path d="M11.4005 12.6015V4.72559H10.8384C9.16951 4.72559 7.53811 5.22047 6.15049 6.14765C4.76287 7.07482 3.68135 8.39266 3.0427 9.9345C2.40405 11.4763 2.23695 13.1729 2.56253 14.8097C2.88811 16.4466 3.69175 17.9501 4.87182 19.1301C6.0519 20.3102 7.5554 21.1139 9.19221 21.4394C10.829 21.765 12.5256 21.5979 14.0675 20.9593C15.6093 20.3206 16.9271 19.2391 17.8543 17.8515C18.7815 16.4639 19.2764 14.8325 19.2764 13.1636V12.6015H11.4005Z" class="tds-icon-primary"/>
    //     <path d="M13.1627 2.40039H12.6006V11.4005H21.6007V10.8384C21.5983 8.60121 20.7086 6.45635 19.1266 4.87443C17.5447 3.29251 15.3999 2.40275 13.1627 2.40039V2.40039Z" class="tds-icon-secondary"/>
    //     </svg>`,
    //     listChild: [
    //       {
    //         name: "Kết nối",
    //         link: `/omni-connection`,
    //       },
    //       {
    //         name: "Sản phẩm sàn TMĐT",
    //         link: `/omni-product`,
    //       },
    //       {
    //         name: "Đơn hàng",
    //         link: `/omni-order`,
    //       },
    //       {
    //         name: "Sản phẩm TPOS",
    //         link: `/omni-product-tpos`,
    //       },
    //     ]
    //   },
      {
        name: "Cấu hình",
        htmlIcon:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.0004 9.1875C11.4441 9.1875 10.9002 9.35248 10.4377 9.66157C9.97507 9.97066 9.61452 10.41 9.40161 10.924C9.18871 11.438 9.13302 12.0036 9.24155 12.5492C9.35009 13.0949 9.61799 13.5961 10.0114 13.9895C10.4048 14.3829 10.906 14.6508 11.4517 14.7593C11.9973 14.8679 12.5629 14.8122 13.0769 14.5993C13.5909 14.3863 14.0302 14.0258 14.3393 13.5632C14.6484 13.1006 14.8134 12.5568 14.8134 12.0004C14.8127 11.2546 14.5162 10.5395 13.9888 10.0121C13.4614 9.48471 12.7463 9.18814 12.0004 9.1875Z" class="tds-icon-secondary"/>
        <path d="M21.6014 13.2789V10.7228C21.6014 10.6359 21.5712 10.5517 21.5161 10.4845C21.4609 10.4173 21.3842 10.3713 21.2989 10.3544L18.9984 9.90197C18.8566 9.42941 18.6668 8.9726 18.432 8.5387L19.7137 6.6186C19.7618 6.54655 19.7834 6.46004 19.7749 6.37382C19.7663 6.2876 19.7282 6.20701 19.6669 6.14578L17.8584 4.33489C17.7971 4.27359 17.7165 4.23541 17.6303 4.22688C17.5441 4.21835 17.4576 4.23998 17.3855 4.28809L15.4654 5.56975C15.0315 5.33491 14.5747 5.14511 14.1022 5.00332L13.6474 2.70281C13.6306 2.61745 13.5847 2.54059 13.5175 2.4854C13.4503 2.43022 13.3659 2.40016 13.2789 2.40039H10.7228C10.6359 2.40039 10.5517 2.43053 10.4845 2.48568C10.4173 2.54082 10.3713 2.61756 10.3544 2.70281L9.90197 5.00332C9.4294 5.14512 8.9726 5.33492 8.5387 5.56975L6.6186 4.28809C6.54655 4.23998 6.46003 4.21835 6.37381 4.22688C6.2876 4.23541 6.207 4.27359 6.14578 4.33489L4.33489 6.14338C4.27358 6.20461 4.23541 6.2852 4.22688 6.37142C4.21834 6.45764 4.23998 6.54415 4.28808 6.6162L5.56975 8.5363C5.33491 8.9702 5.14511 9.427 5.00332 9.89957L2.70281 10.3544C2.61756 10.3713 2.54082 10.4173 2.48568 10.4845C2.43053 10.5517 2.40039 10.6359 2.40039 10.7228V13.2789C2.40039 13.3658 2.43053 13.4501 2.48568 13.5173C2.54082 13.5844 2.61756 13.6304 2.70281 13.6474L5.00332 14.0998C5.14512 14.5723 5.33491 15.0291 5.56975 15.463L4.28808 17.3831C4.23998 17.4552 4.21834 17.5417 4.22688 17.6279C4.23541 17.7141 4.27358 17.7947 4.33489 17.856L6.14338 19.6645C6.2046 19.7258 6.2852 19.7639 6.37141 19.7725C6.45763 19.781 6.54415 19.7594 6.6162 19.7113L8.5363 18.4296C8.9702 18.6644 9.427 18.8542 9.89957 18.996L10.352 21.2965C10.3685 21.3826 10.4146 21.4602 10.4824 21.5159C10.5501 21.5716 10.6351 21.6018 10.7228 21.6014H13.2789C13.3658 21.6014 13.4501 21.5712 13.5173 21.5161C13.5844 21.4609 13.6304 21.3842 13.6474 21.2989L14.0998 18.9984C14.5723 18.8566 15.0291 18.6668 15.463 18.432L17.3831 19.7137C17.4552 19.7618 17.5417 19.7834 17.6279 19.7749C17.7141 19.7663 17.7947 19.7282 17.856 19.6669L19.6645 17.8584C19.7258 17.7971 19.7639 17.7165 19.7725 17.6303C19.781 17.5441 19.7594 17.4576 19.7113 17.3855L18.4296 15.4654C18.6644 15.0315 18.8542 14.5747 18.996 14.1022L21.2965 13.6498C21.3827 13.6334 21.4605 13.5874 21.5162 13.5196C21.5719 13.4518 21.602 13.3667 21.6014 13.2789ZM12.1317 15.9359C11.3423 15.9619 10.5633 15.75 9.89597 15.3276C9.22862 14.9051 8.70372 14.2918 8.38948 13.5672C8.07524 12.8426 7.98618 12.0402 8.13387 11.2643C8.28156 10.4885 8.65917 9.77493 9.21765 9.21645C9.77613 8.65797 10.4897 8.28036 11.2655 8.13267C12.0414 7.98498 12.8438 8.07404 13.5684 8.38828C14.293 8.70252 14.9063 9.22742 15.3288 9.89477C15.7512 10.5621 15.9631 11.3411 15.9371 12.1305C15.903 13.1289 15.4911 14.0771 14.7847 14.7835C14.0783 15.4899 13.1301 15.9018 12.1317 15.9359Z" class="tds-icon-primary"/>
        </svg>`,
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
