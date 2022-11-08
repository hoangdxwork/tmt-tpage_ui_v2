import { Component, OnInit, ViewContainerRef, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TDSMessageService } from 'tds-ui/message';
import { FirebaseRegisterService } from '@app/services/firebase/firebase-register.service';
import { FireBaseDevice, FireBaseTopicDto, TopicDetailDto } from '@app/dto/firebase/topics.dto';
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
  isLoading: boolean = false;

  constructor(private message: TDSMessageService,
    private firebaseMessagingService: FirebaseMessagingService,
    private destroy$: TDSDestroyService,
    private firebaseRegisterService: FirebaseRegisterService){
      this.listenPayload();
  }

  ngOnInit(){
    this.loadTopics();

    this.deviceToken = this.firebaseMessagingService.getDeviceTokenLocalStorage();
    if(this.deviceToken) {
      this.loadSubscribedTopics();
    }
  }

  loadTopics() {
    this.isLoading = true;
    this.firebaseRegisterService.topics().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: any) => {
          this.data = [...data];
          this.isLoading = false;
      },
      error: (error: any) => {
          this.isLoading = false;
          this.message.error(error?.error?.message);
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

  registerTopics() {
    let model = {
      TopicIds: this.ids
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

  onChecked(event: any, item: any) {
    if(this.isLoading) return;

    if(event == true) {
        this.ids.push(item.id);
    } else {
        this.ids = this.ids.filter(x => x != item.id);
    }

    this.ids = [...this.ids];
  }

  removeToken() {
    if(this.isLoading) return;

    this.isLoading = true;
    this.firebaseMessagingService.deleteToken().subscribe({
      next: (token) => {
          this.isLoading = false;
          this.message.success('Xóa token nhận tin thành công');

          this.ids = [];
          this.deviceToken = null;
          this.firebaseMessagingService.removeDeviceTokenLocalStorage();
      },
      error: (error) => {debugger
          this.isLoading = false;
          this.message.error('Xóa token nhận tin thất bại')
      }
    });;
  }

  requestPermission() {
    if(this.isLoading) return;

    const messaging = getMessaging();
    this.isLoading = true;

    getToken(messaging, { vapidKey: environment.firebaseConfig.vapidKey })
      .then((token: any) => {

          this.isLoading = false;
          if(!token)  {
              this.message.info('No registration token available. Request permission to generate one');
              return;
          }

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
            this.isLoading = false;
            this.message.success('Đăng ký nhận tin thành công');

            this.deviceToken = token;
            this.firebaseMessagingService.setDeviceTokenLocalStorage(token);

            this.mappingTopicIds();
            this.registerTopics();
        },
        error: (err: any) => {
          this.isLoading = false;
          this.message.error(err?.error?.message);
        }
    })
  }

  listenPayload() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
        this.payload = payload;
    });
  }

  mappingTopicIds() {
    let topics = this.data?.map(x => x.topics) as any as TopicDetailDto[];
    let ids = topics?.map(x => x.id) as any[];
    this.ids = ids;
  }

}
