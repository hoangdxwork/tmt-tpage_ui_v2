import { CRMTeamType } from './../../../../dto/team/chatomni-channel.dto';
import { ChatmoniSocketEventName } from './../../../../services/socket-io/soketio-event';
import { SocketStorageNotificationService } from './../../../../services/socket-io/socket-config-notification.service';
import { Component, Input, OnInit } from '@angular/core';
import { FireBaseTopicDto } from '@app/dto/firebase/topics.dto';
import { FirebaseMessagingService } from '@app/services/firebase/firebase-messaging.service';
import { FirebaseRegisterService } from '@app/services/firebase/firebase-register.service';
import { takeUntil, mergeMap } from 'rxjs';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';

@Component({
  selector: 'modal-get-notification',
  templateUrl: './modal-get-notification.component.html',
})
export class ModalGetNotificationComponent implements OnInit {

  @Input() deviceToken: any
  @Input() topicData: FireBaseTopicDto[] = [];
  @Input() idsTopic: any[] = [];

  socketData: {[key: string]: boolean} = {} as any;
  socketItems: Array<any> = [];
  selectedIndex: number = 0;
  idsRegister: any[] = [];
  isLoading: boolean = false;
  checkAll: boolean = false;

  constructor(private modal: TDSModalRef,
    private modalService: TDSModalService,
    private firebaseMessagingService: FirebaseMessagingService,
    private message: TDSMessageService,
    private destroy$: TDSDestroyService,
    private afMessaging: AngularFireMessaging,
    private firebaseRegisterService: FirebaseRegisterService,
    private socketStorageNotificationService: SocketStorageNotificationService) {
  }

  ngOnInit(): void {
    // socket noti
    let exist = this.socketStorageNotificationService.getLocalStorage();
    if(!exist) {
      this.socketStorageNotificationService.setLocalStorage();
      exist = this.socketStorageNotificationService.getLocalStorage();
    }

    for(let item in exist) {
      this.socketItems.push(item);
    }

    this.socketData = exist;
    this.loadSubscribedTopics();
    this.onEventEmitter();
  }

  onEventEmitter() {
    this.socketStorageNotificationService.socketAllEmitter$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.socketData = this.socketStorageNotificationService.getLocalStorage();
    });
  }

  loadSubscribedTopics() {
    this.firebaseRegisterService.subscribedTopics().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.idsRegister = [...res];
      },
      error: (error: any) => {
          this.message.error(error?.error?.message);
      }
    });
  }

  cancel() {
    this.modal.destroy(null);
  }

  changeCheckAll(event: boolean) {
    this.checkAll = event;
    if(this.checkAll == true) {
        this.idsRegister = this.idsTopic;
    }
  }

  save() {
    this.registerTopics(true);
  }

  registerTopics(isMessage: boolean) {
    let model = {
      TopicIds: this.idsRegister
    }

    this.isLoading = true;
    this.firebaseRegisterService.registerTopics(model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.isLoading = false;

          if(isMessage == true) {
            this.message.success('Đăng ký nhận tin thành công');
          }

          this.modal.destroy(null);
      },
      error: (err: any) => {
          this.isLoading = false;
          this.message.error(err?.error?.message);
      }
    })
  }

  modalRemove() {
    this.modalService.error({
      title: 'Hủy đăng kí',
      content: 'Bạn có chắc muốn hủy đăng ký với thiết bị này!',
      onOk: () => { this.removeToken() },
      onCancel:() => { this.modal.destroy(null) },
      okText:"Xác nhận",
      cancelText:"Hủy bỏ"
    });
  }

  onChecked(event: any, item: any) {
    if (this.isLoading) return;

    if (event == true) {
      this.idsRegister.push(item.id);
    } else {
      this.idsRegister = this.idsRegister.filter((x : any) => x != item.id);
    }

    this.idsRegister = [...this.idsRegister];
  }

  removeToken() {
    if(this.isLoading) return;
    this.isLoading = true;

    this.afMessaging.getToken
      .pipe(mergeMap((token: any) => this.afMessaging.deleteToken(token)))
      .subscribe({
        next: (token: any) => {
            this.isLoading = false;
            this.message.success('Xóa token nhận tin thành công');

            this.idsRegister = [];
            this.deviceToken = null;

            this.firebaseMessagingService.removeDeviceTokenLocalStorage();
            this.registerTopics(false);
        },
        error: (err: any) => {
            this.isLoading = false;
            this.message.error(err?.code);
        }
      });
  }

  change(item: any) {
    if(item == "socket.all") {
        let cur = this.socketData[item];

        if(cur == false) {
            for(let data in this.socketData) {
              this.socketData[data] = false;
            }
        } else {
            for(let data in this.socketData) {
              this.socketData[data] = true;
            }
        }

        this.socketStorageNotificationService.setLocalStorage(this.socketData);
        this.socketStorageNotificationService.socketAllEmitter$.emit(this.socketData[item]);
    } else {
        if(item == ChatmoniSocketEventName.chatomniOnMessage) {
          this.socketData[CRMTeamType._Facebook] = this.socketData[item];
          this.socketData[CRMTeamType._TShop] = this.socketData[item];
          this.socketData[CRMTeamType._TikTok] = this.socketData[item];
        }
      this.socketStorageNotificationService.setLocalStorage(this.socketData);
    }
  }
}
