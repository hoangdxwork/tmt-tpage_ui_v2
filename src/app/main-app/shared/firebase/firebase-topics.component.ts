import { Component, OnInit, ViewContainerRef, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TDSMessageService } from 'tds-ui/message';
import { FirebaseRegisterService } from '@app/services/firebase/firebase-register.service';
import { FireBaseDevice, FireBaseTopicDto } from '@app/dto/firebase/topics.dto';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { environment } from 'src/environments/environment';
import { FirebaseMessagingService } from '@app/services/firebase/firebase-messaging.service';
import { takeUntil } from 'rxjs';
import { TDSDestroyService } from 'tds-ui/core/services';

@Component({
  selector: 'firebase-topics',
  templateUrl: './firebase-topics.component.html',
  styles: [
    ` :host {
        width: 100%;
        height: 100%;
      }
    `
  ],
  providers: [TDSDestroyService]
})

export class FirebaseTopicsComponent implements OnInit {

  data: FireBaseTopicDto[] = [];
  ids: any[] = [];

  deviceToken: any;
  payload: any;
  error: any;

  isLoading: boolean = false;
  isRegistered: boolean = false;

  constructor(private message: TDSMessageService,
    private firebaseMessagingService: FirebaseMessagingService,
    private destroy$: TDSDestroyService,
    private firebaseRegisterService: FirebaseRegisterService){
      this.listen();
  }

  ngOnInit(){
    this.deviceToken = this.firebaseMessagingService.getDeviceTokenLocalStorage();
    this.isRegistered = this.firebaseMessagingService.checkDeviceToken();
    this.loadTopics();
    this.loadSubscribedTopics();
  }

  loadTopics() {
    this.firebaseRegisterService.topics().subscribe({
      next: (data: any) => {
        this.data = [...data];
      },
      error: (error: any) => {
        this.message.error(error?.error?.message);
      }
    });
  }

  loadSubscribedTopics() {
    this.firebaseRegisterService.subscribedTopics().subscribe({
      next: (data: any) => {debugger
          this.ids = [...data];
      },
      error: (error: any) => {
          this.message.error(error?.error?.message);
      }
    });
  }

  registerTopics() {
    let model = {
      TopicIds: this.ids
    }

    this.firebaseRegisterService.registerTopics(model).subscribe({
      next: (res: any) => {
          this.message.success('Đăng kí nhận tin thành công');
      },
      error: (err: any) => {
          this.message.error(err?.error?.message);
      }
    })
  }

  onChecked(event: any, item: any) {
    if(event == true) {
        this.ids.push(item.id);
    } else {
        this.ids = this.ids.filter(x => x != item.id);
    }

    this.ids = [...this.ids];
    console.log(this.ids);
  }

  removeToken() {
    if(this.isLoading) {
      return;
    }

    this.validate();
    this.isLoading = true;

    this.firebaseMessagingService.deleteToken()
    .subscribe({
      next: (token) => {
          this.firebaseMessagingService.removeDeviceTokenLocalStorage();
          this.isLoading = false;
          this.error = 'Xóa token nhận tin thành công \n' + (token);
      },
      error: (error) => {
          this.isLoading = false;
          this.error = 'Xóa token nhận tin thất bại \n' + (error);
      }
    });;
  }

  requestPermission() {
    if(this.isLoading) {
      return;
    }

    this.validate();
    let messaging = getMessaging();
    this.isLoading = true;

    getToken(messaging, { vapidKey: environment.firebaseConfig.vapidKey })
      .then((token) => {
          this.isLoading = false;
          if(!token)  {
              this.message.info('No registration token available. Request permission to generate one.');
              return;
          }

          this.registerDevice(token);

      }).catch((error) => {
          this.isLoading = false;
          this.error = 'An error occurred while retrieving token \n' + (error);
    });
  }

  registerDevice(token: string) {
    let model = {
      Platform: FireBaseDevice.Google,
      DeviceToken: token
    };

    this.firebaseRegisterService.registerDevice(model).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {

            this.isLoading = false;
            this.deviceToken = token;
            this.firebaseMessagingService.setDeviceTokenLocalStorage(token);

            if(!this.isRegistered) {
              this.isRegistered = this.firebaseMessagingService.checkDeviceToken();
            }

            console.log(res);
            this.message.success('Đăng ký nhận tin thành công');
        },
        error: (err: any) => {
          this.isLoading = false;
          this.message.error(err?.error?.message);
        }
    })
  }

  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
        this.payload = payload;
        console.log(payload);
    });
  }

  validate() {
    this.payload = null;
    this.error = null;
    this.deviceToken = null;
  }

}
