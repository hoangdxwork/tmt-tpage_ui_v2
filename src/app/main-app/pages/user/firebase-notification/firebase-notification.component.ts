import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { NgxVirtualScrollerDto } from '@app/dto/conversation-all/ngx-scroll/ngx-virtual-scroll.dto';
import { NotificationItemDto } from '@app/dto/firebase/firebase-notification.dto';
import { FireBaseDevice, FireBaseTopicDto, TopicDetailDto } from '@app/dto/firebase/topics.dto';
import { FirebaseMessagingService } from '@app/services/firebase/firebase-messaging.service';
import { FirebaseRegisterService } from '@app/services/firebase/firebase-register.service';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TDSConfigService } from 'tds-ui/core/config';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSHelperString } from 'tds-ui/shared/utility';
import { ModalGetNotificationComponent } from '../components/modal-get-notification/modal-get-notification.component';

@Component({
  selector: 'firebase-notification',
  templateUrl: './firebase-notification.component.html'
})
export class FirebaseNotificationComponent implements OnInit {

  data!: NotificationItemDto[];
  topicData: FireBaseTopicDto[] = [];
  dataDetail!: any;
  cursor: any;
  isLoadingProduct: boolean = false;
  isLoadingNextdata: boolean = false;
  id!: string;
  isLoading: boolean = false;

  deviceToken: any;
  idsRegister: any[] = [];
  idsTopic: any[] = [];

  constructor(private firebaseRegisterService: FirebaseRegisterService,
    private message: TDSMessageService,
    private readonly tdsConfigService: TDSConfigService,
    private destroy$: TDSDestroyService,
    private route: ActivatedRoute,
    public router: Router,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private firebaseMessagingService: FirebaseMessagingService) {
  }

  ngOnInit(): void {
    let id = this.route.snapshot.queryParams?.id;
    let paramsNoti = this.router.url.includes('firebase-notification');

    if (id && paramsNoti) {
      this.id = id;
    }

    this.loadData();
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
    this.isLoading = true;
    this.firebaseRegisterService.notifications(params).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.data = [...res.items];
        this.cursor = res.cursor;

        let item: NotificationItemDto = null as any;
        if (TDSHelperString.hasValueString(this.id) && this.data) {
          let exist = this.data?.filter(x => x && x.id == this.id)[0];
          if (exist) {
            item = exist;
          }
        }

        if (item == null) {
          item = this.data[0];
        }

        this.onDetail(item);
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
          if (TDSHelperString.hasValueString(id) && this.data) {
            let exist = this.data?.filter(x => x && x.id == id)[0];
            if (exist) {
              item = exist;
            }
          }

          if (item == null && this.data) {
            item = this.data[0];
          }

          if (id != this.id) {
            this.dataDetail = item;
          }

          if (id && paramsNoti) {
            this.id = id;
          }
        }, 350);
      }
    });
  }

  onDetail(item: any) {
    this.dataDetail = item;
    this.setCurrentConversationItem(item);
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
    }
  }

  nextData() {
    if (this.cursor) {
      this.firebaseRegisterService.notifications(this.cursor).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
          this.data = [...(this.data || []), ...res.items];
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

  requestPermission() {
    const messaging = getMessaging();
    this.isLoading = true;

    getToken(messaging, { vapidKey: environment.firebaseConfig.vapidKey })
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
            this.message.success('Đăng ký nhận tin thành công');
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
          this.message.success('Đăng kí nhận tin thành công');
      },
      error: (err: any) => {
          this.isLoading = false;
          this.message.error(err?.error?.message);
      }
    })
  }

  modalGetNotifications() {
    let deviceToken = this.firebaseMessagingService.getDeviceTokenLocalStorage();

    this.modalService.create({
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
  }


}
