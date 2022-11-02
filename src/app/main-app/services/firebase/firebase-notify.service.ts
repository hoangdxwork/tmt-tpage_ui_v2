import { Injectable } from "@angular/core";
import { BehaviorSubject, take, mergeMap } from "rxjs";
import { AngularFireMessaging, AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { TDSMessageService } from "tds-ui/message";
import { FirebaseRegisterService } from "./firebase-register.service";
import { FireBaseTopicDto } from "@app/dto/firebase/topics.dto";

@Injectable({
  providedIn: 'root'
})

export class FirebasePushNotificationService  {

  _notificationFirebase: any;
  currentMessage = new BehaviorSubject(null);
  token: any;
  topics!: FireBaseTopicDto[];

  constructor(private message: TDSMessageService,
      private angularFireMessaging: AngularFireMessaging,
      private angularFireDb: AngularFireDatabase,
      private firebaseRegisterService: FirebaseRegisterService,
      private angularFireAuth: AngularFireAuth) {

        this.angularFireMessaging.messages.subscribe({
          next: (message: any) => {
              console.log("Subscribing to foreground messages",message);
          },
          error: (err: any) => {
            console.error("Thông nhận tin", err);
            this.message.error(err);
          }
        })
  }

  updateToken(userId: string, token: string) {
      this.angularFireAuth.authState.pipe(take(1)).subscribe({
        next: (res: any) => {
            const data = {} as any;
            data[userId] = token;
            this.angularFireDb.object('/fcmTokens/').update(data);
        },
        error: (err: any) => {
            console.error("updateToken", err);
            this.message.error(err);
        }
      })
  }

  requestPermission(userId: string) {
    this.angularFireMessaging.requestToken.subscribe({
      next: (token: any) => {
          console.log(token);
          this.token = token;
          this.updateToken(userId, token);
      },
      error: (err: any) => {
          console.error("Unable to get permission to notify", err);
          this.message.error(err);
      }
    })
  }

  deleteToken() {
    this.angularFireMessaging.getToken
      .pipe(mergeMap((token: any) => this.angularFireMessaging.deleteToken(token)))
      .subscribe({
        next: (token) => {
            console.log('Xóa token nhận tin thành công', token);
        },
        error: (error) => {
          console.error(error)
        }
      });
  }

  // Thông báo và hiện thị tin nhắn mới
  setReceiveMessage() {
    this.angularFireMessaging.onMessage((payload: any) => {
        console.log('Message received. ', payload);
        this.currentMessage.next(payload);
    });
  }

  getReceiveMessage() {
      return this.currentMessage.asObservable();
  }

  loadTopics() {
    this.firebaseRegisterService.topics().subscribe({
      next: (res: any) => {
        this.topics = [...res];
      },
      error: (err) => {
        this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
      }
    })
  }
}
