import { Component, OnInit, ViewChild, ViewContainerRef, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { NgxVirtualScrollerDto } from '@app/dto/conversation-all/ngx-scroll/ngx-virtual-scroll.dto';
import { NotificationItemDto } from '@app/dto/firebase/firebase-notification.dto';
import { FireBaseDevice, FireBaseTopicDto, TopicDetailDto } from '@app/dto/firebase/topics.dto';
import { FirebaseMessagingService } from '@app/services/firebase/firebase-messaging.service';
import { FirebaseRegisterService } from '@app/services/firebase/firebase-register.service';
import { getMessaging, getToken } from 'firebase/messaging';
import { takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TDSConfigService } from 'tds-ui/core/config';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSHelperString } from 'tds-ui/shared/utility';
import { ModalGetNotificationComponent } from '../components/modal-get-notification/modal-get-notification.component';
// socket noti
import { SocketStorageNotificationService } from '@app/services/socket-io/socket-config-notification.service';
import { CRMTeamType } from '@app/dto/team/chatomni-channel.dto';
import { ChatmoniSocketEventName } from '@app/services/socket-io/soketio-event';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';

@Component({
  selector: 'firebase-notification',
  templateUrl: './firebase-notification.component.html',
  providers: [TDSDestroyService]
})

export class FirebaseNotificationComponent implements OnInit {

  @ViewChild(VirtualScrollerComponent) private virtualScroller!: VirtualScrollerComponent;

  data!: NotificationItemDto[];
  topicData: FireBaseTopicDto[] = [];
  dataDetail!: any;
  cursor: any;
  isLoadingProduct: boolean = false;
  isLoadingNextdata: boolean = false;
  id!: string;
  isLoading: boolean = false;

  viewPortHeight: number = 0;
  itemHeight: number = 0;
  itemCount: number = 0;

  deviceToken: any;
  idsRegister: any[] = [];
  idsTopic: any[] = [];
  selectedIndex = 0;

  isSearch: boolean =  false;
  searchText: string = '';

  constructor(private firebaseRegisterService: FirebaseRegisterService,
    private message: TDSMessageService,
    private readonly tdsConfigService: TDSConfigService,
    private destroy$: TDSDestroyService,
    private route: ActivatedRoute,
    public router: Router,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private render: Renderer2,
    private firebaseMessagingService: FirebaseMessagingService,
    private socketStorageNotificationService: SocketStorageNotificationService) {
  }

  ngOnInit(): void {
    let id = this.route.snapshot.queryParams?.id;
    let paramsNoti = this.router.url.includes('firebase-notification');

    if (id && paramsNoti) {
      this.id = id;
    }

    if(this.selectedIndex == 0) {
      let params = { type: "other" };
        this.loadData(params);
    } else {
      this.loadData();
    }
    
    this.loadUrl();

    this.deviceToken = this.firebaseMessagingService.getDeviceTokenLocalStorage();
    this.loadTopics();

    this.tdsConfigService.set('message', {
      maxStack: 3
    });
  }

  loadTopics() {
    this.isLoading = true;
    this.firebaseRegisterService.topics().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: any) => {
          this.topicData = [...data];
          this.mappingTopicIds();

          this.isLoading = false;
      },
      error: (error: any) => {
          this.isLoading = false;
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

  loadData(params?: any) {
    this.data = [];
    this.dataDetail = null;
    this.isLoading = true;

    this.firebaseRegisterService.notifications(params).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.data = [...res.items];
        this.cursor = res.cursor;

        let item: NotificationItemDto = null as any;
        if (TDSHelperString.hasValueString(this.id) && this.data && this.data.length > 0) {
          let exist = this.data?.filter(x => x && x.id == this.id)[0];
          if (exist) {
            item = exist;
          }
        }

        if (item == null && this.data && this.data.length > 0) {
          item = this.data[0];
        }

        if(item != null) {
          this.onDetail(item);
        }

        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.message.error(`${err?.error?.message}`);
      }
    })
  }

  loadUrl() {
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res instanceof NavigationStart) {
        setTimeout(() => {
          let id = this.route.snapshot.queryParams?.id;
          let paramsNoti = this.router.url.includes('firebase-notification');

          let item: NotificationItemDto = null as any;
          if (TDSHelperString.hasValueString(id) && this.data && this.data.length > 0) {
            let exist = this.data?.filter(x => x && x.id == id)[0];
            if (exist) {
              item = exist;
            }
          }

          if (item == null && this.data && this.data.length > 0) {
            item = this.data[0];
          }

          if (id != this.id && item != null) {
            this.onDetail(item)
          }

          if (id && paramsNoti) {
            this.id = id;
          }
        }, 350);
      }
    });
  }

  onDetail(item: any) {
    this.firebaseRegisterService.notificationDetail(item?.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.dataDetail = res;
        if(item.dateRead == null) {
          this.makeRead(item);
        }
      }
    })
    this.setCurrentConversationItem(item);
  }

  makeRead(item: any) {
    this.firebaseRegisterService.makeRead(item?.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        let index = this.data.findIndex(x => x.id === item.id);
        if(index >= 0) {
          this.data[index].dateRead = new Date()
        }
      }
    });
  }

  setCurrentConversationItem(item: any) {
    let uri = this.router.url.split("?")[0];
    let uriParams = `${uri}?id=${item?.id}`;
    this.router.navigateByUrl(uriParams);
  }

  vsEnd(event: NgxVirtualScrollerDto) {
    if (this.isLoadingProduct || this.isLoadingNextdata) {
      return;
    }

    let exisData = this.data && this.data.length > 0 && event && event.scrollStartPosition > 0;
    if (exisData) {
      const vsEnd = Number(this.data.length - 1) == Number(event.endIndex);
      if (vsEnd) {
        this.isLoadingNextdata = true;
        setTimeout(() => {
          this.nextData();
          this.isLoadingNextdata = false;
        }, 350)
      }
    } else {
      setTimeout(() => {
        let scrollContent = document.getElementsByClassName('scrollable-content')?.item(0);

        if(scrollContent) {
          this.render.addClass(scrollContent,'!h-auto');//set thuộc tính h-auto cho viewport

          let scrollerHeight = this.render.parentNode(scrollContent)?.clientHeight as number;//chiều cao của scroller
          this.viewPortHeight = scrollContent?.clientHeight as number;//chiều cao viewport
          this.itemHeight = Math.round(this.viewPortHeight/this.itemCount);//chiều cao của mỗi item
          // trường hợp chiều cao của viewport < scroller height, get nextdata
          if(this.viewPortHeight < scrollerHeight) {
            this.nextData(scrollerHeight);
          }
        }
      }, 2000);
    }
  }

  nextData(scrollerHeight?: number) {
    if (this.cursor) {
      if(scrollerHeight) this.isLoading = true;

      this.firebaseRegisterService.notifications(this.cursor).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
          this.data = [...(this.data || []), ...res.items];
          // TODO: xử lý scroll viewport khi load dữ liệu
          if(scrollerHeight) {
            this.itemCount = this.data?.length || 0;
            this.viewPortHeight =  this.itemHeight * this.itemCount;

            if(this.viewPortHeight < scrollerHeight) {
              this.nextData(scrollerHeight);
            } else {
              this.isLoading = false;
            }
          }

          this.cursor = res.cursor;
          this.isLoadingNextdata = false;
        },
        error: (err: any) => {
          this.isLoadingNextdata = false;
          this.message.error(`${err?.error?.message}`);
        }
      })
    }
  }

  async requestPermission() {
    this.isLoading = true;

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
              this.isLoading = false;
              this.message.info('No registration token available. Request permission to generate one');
              return;
          }

          this.deviceToken = token;
          this.firebaseMessagingService.setDeviceTokenLocalStorage(token);

          this.registerDevice(token);

      }).catch((error) => {
          this.isLoading = false;
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
            this.message.success('Đăng ký token thiết bị thành công');
            this.registerTopics();
        },
        error: (err: any) => {
          this.isLoading = false;
          this.message.error('Đăng kí nhận tin thất bại');
        }
    })
  }

  registerTopics() {
    let model = {
      TopicIds: this.idsTopic
    }

    this.isLoading = true;
    this.firebaseRegisterService.registerTopics(model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.isLoading = false;
          this.message.success('Đăng ký nhận tin thành công');
      },
      error: (err: any) => {
          this.isLoading = false;
          this.message.error(err?.error?.message);
      }
    })
  }

  modalGetNotifications() {
    let deviceToken = this.firebaseMessagingService.getDeviceTokenLocalStorage();

    let modal = this.modalService.create({
      title: 'Danh sách đăng kí nhận tin',
      content: ModalGetNotificationComponent,
      size: "xl",
      centered: true,
      bodyStyle: {
        padding: '0',
        height: '650px',
      },
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        deviceToken: deviceToken,
        topicData: this.topicData,
        idsTopic: this.idsTopic
      }
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.deviceToken = this.firebaseMessagingService.getDeviceTokenLocalStorage();
      }
    })
  }

  onSelectedIndexChange(event: any) {
    switch(event) {
      case 0:
        let params = { type: "other" };
        this.loadData(params);
        break;
      case 1:
        this.loadData();
        break;
    }
  }

  showSearchInput() {
    this.isSearch = !this.isSearch;
    if(this.isSearch) {
      this.loadData();
    } else {
      switch(this.selectedIndex) {
        case 0:
          let params = { type: "other" };
          this.loadData(params);
          break;
        case 1:
          this.loadData();
          break;
      }
    }
  }

  onSearch(event: any) {
    let params = {
      q: event.value
    }

    this.loadData(params);
  }

  onClearFilterSearch() {
    this.searchText = '';
    this.loadData();
  }
}
