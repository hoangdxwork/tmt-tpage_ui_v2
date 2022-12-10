import { Component, Input, OnInit } from '@angular/core';
import { FireBaseDevice } from '@app/dto/firebase/topics.dto';
import { FirebaseMessagingService } from '@app/services/firebase/firebase-messaging.service';
import { FirebaseRegisterService } from '@app/services/firebase/firebase-register.service';
import { getMessaging, getToken } from 'firebase/messaging';
import { takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';

@Component({
  selector: 'app-modal-request-permission',
  templateUrl: './modal-request-permission.component.html'
})
export class ModalRequestPermissionComponent implements OnInit {

  @Input() idsTopic: any[] = [];

  deviceToken: any;
  isLoading: boolean = false;

  constructor(private modal: TDSModalRef,
    private message: TDSMessageService,
    private destroy$: TDSDestroyService,
    private firebaseMessagingService: FirebaseMessagingService,
    private firebaseRegisterService: FirebaseRegisterService) { }

  ngOnInit(): void {
    let token = this.firebaseMessagingService.getDeviceTokenLocalStorage();
    if(token) {
      this.deviceToken = token;
    }
  }

  onCancel() {
    this.modal.destroy(null);
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

}
