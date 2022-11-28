import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FireBaseTopicDto } from '@app/dto/firebase/topics.dto';
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
export class ModalGetNotificationComponent implements OnInit, OnChanges {

  @Input() deviceToken: any
  @Input() topicData: FireBaseTopicDto[] = [];
  @Input() idsTopic: any[] = [];

  idsRegister: any[] = [];
  isLoading: boolean = false;
  checkAll: boolean = false;

  constructor(private modal: TDSModalRef,
    private modalService: TDSModalService,
    private firebaseMessagingService: FirebaseMessagingService,
    private message: TDSMessageService,
    private destroy$: TDSDestroyService,
    private firebaseRegisterService: FirebaseRegisterService) {
  }

  ngOnInit(): void {
    this.loadSubscribedTopics();
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

  ngOnChanges(changes: SimpleChanges): void {
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
    this.registerTopics()
  }

  registerTopics() {
    let model = {
      TopicIds: this.idsRegister
    }

    this.isLoading = true;
    this.firebaseRegisterService.registerTopics(model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.isLoading = false;
          this.message.success('Thao tác thành công');
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
    this.firebaseMessagingService.deleteToken().subscribe({
      next: (token) => {
          this.isLoading = false;
          this.message.success('Xóa token nhận tin thành công');

          this.idsRegister = [];
          this.deviceToken = null;
          this.firebaseMessagingService.removeDeviceTokenLocalStorage();
          this.registerTopics();
      },
      error: (error) => {
          this.isLoading = false;
          this.message.error('Xóa token nhận tin thất bại');
          this.modal.destroy(null)
      }
    });
  }

}
