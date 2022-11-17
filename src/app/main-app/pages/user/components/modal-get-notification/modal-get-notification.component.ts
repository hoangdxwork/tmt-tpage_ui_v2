import { Component, Input, OnInit } from '@angular/core';
import { FirebaseMessagingService } from '@app/services/firebase/firebase-messaging.service';
import { FirebaseRegisterService } from '@app/services/firebase/firebase-register.service';
import { getMessaging, onMessage } from 'firebase/messaging';
import { takeUntil } from 'rxjs';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';

@Component({
  selector: 'modal-get-notification',
  templateUrl: './modal-get-notification.component.html',
})
export class ModalGetNotificationComponent implements OnInit {

  @Input() lstIds: any[] = []
  @Input() deviceToken: any

  isLoading: boolean = false;
  payload: any;
  ids: any = [];

  constructor(
    private modal: TDSModalRef,
    private modalService: TDSModalService,
    private firebaseMessagingService: FirebaseMessagingService,
    private message: TDSMessageService,
    private destroy$: TDSDestroyService,
    private firebaseRegisterService: FirebaseRegisterService) {
  }

  ngOnInit(): void {
    if(this.deviceToken) {
      this.loadSubscribedTopics();
    }
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

  cancel() {
    this.modal.destroy(null);
  }

  save() {
    this.registerTopics()
  }

  registerTopics() {
    let model = {
      TopicIds: this.lstIds
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

  modalRemove() {
    this.modalService.error({
      title: 'Hủy đăng kí',
      content: 'Bạn có chắc muốn hủy đăng ký với thiết bị này!',
      onOk: () => { this.removeToken() },
      onCancel:()=>{ console.log('cancel') },
      okText:"Xác nhận",
      cancelText:"Hủy bỏ"
    });
  }

  onChecked(event: any, item: any) {
    if (this.isLoading) return;

    if (event == true) {
      this.lstIds.push(item.id);
    } else {
      this.lstIds = this.lstIds.filter(x => x != item.id);
    }

    this.lstIds = [...this.lstIds];
  }

  removeToken() {
    if(this.isLoading) return;

    this.isLoading = true;
    this.firebaseMessagingService.deleteToken().subscribe({
      next: (token) => {
          this.isLoading = false;
          this.message.success('Xóa token nhận tin thành công');

          this.lstIds = [];
          this.deviceToken = null;
          this.firebaseMessagingService.removeDeviceTokenLocalStorage();
      },
      error: (error) => {
          this.isLoading = false;
          this.message.error('Xóa token nhận tin thất bại')
      }
    });;

  }

}
