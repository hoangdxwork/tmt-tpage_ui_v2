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
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSHelperString } from 'tds-ui/shared/utility';
import { ModalGetNotificationComponent } from '../components/modal-get-notification/modal-get-notification.component';
import { ModalRequestPermissionComponent } from '../components/modal-request-permission/modal-request-permission.component';

@Component({
  selector: 'firebase-notification',
  templateUrl: './firebase-notification.component.html'
})
export class FirebaseNotificationComponent implements OnInit {

  data!: NotificationItemDto[];
  dataDetail!: any;
  cursor: any;
  isLoadingProduct: boolean = false;
  isLoadingNextdata: boolean = false;
  id!: string;

  deviceToken: any;
  ids: any[] = [];

  constructor(
    private firebaseRegisterService: FirebaseRegisterService,
    private message: TDSMessageService,
    private destroy$: TDSDestroyService,
    private route: ActivatedRoute,
    public router: Router,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private firebaseMessagingService: FirebaseMessagingService,
  ) { }

  ngOnInit(): void {
    let id = this.route.snapshot.queryParams?.id;
    let paramsNoti = this.router.url.includes('firebase-notification');

    if (id && paramsNoti) {
      this.id = id;
    }

    this.loadData();
    this.loadUrl();

    this.deviceToken = this.firebaseMessagingService.getDeviceTokenLocalStorage();
    if(this.deviceToken) {
      this.loadSubscribedTopics();
    }
  }

  loadData(params?: any) {
    this.firebaseRegisterService.notifications(params).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.data = [...res.items];
        this.cursor = res.cursor;

        let item: NotificationItemDto = null as any;
        if (TDSHelperString.hasValueString(this.id) && this.data) {
          let exist = this.data.filter(x => x && x.id == this.id)[0];
          if (exist) {
            item = exist;
          }
        }

        if (item == null) {
          item = this.data[0];
        }

        this.onDetail(item);
      },
      error: (err: any) => {
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
            let exist = this.data.filter(x => x && x.id == id)[0];
            if (exist) {
              item = exist;
            }
          }

          if (item == null) {
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

  modalPermission() {
    const modal = this.modalService.create({
      title: 'Danh sách đăng kí nhận tin',
      content: ModalRequestPermissionComponent,
      size: "xl",
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        lstIds: this.ids,
        deviceToken: this.deviceToken
      }
    });
  }

  modalGetNotifications() {
    const modal = this.modalService.create({
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
        lstIds: this.ids
      }
    });
  }

  loadSubscribedTopics() {
    this.firebaseRegisterService.subscribedTopics().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.ids = [...res];
      },
      error: (error: any) => {
          this.message.error(error?.error?.message);
      }
    });
  }

}
