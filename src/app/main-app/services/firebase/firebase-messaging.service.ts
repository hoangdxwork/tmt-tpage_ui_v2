import { Injectable } from "@angular/core";
import { BehaviorSubject, take, mergeMap, Observable } from "rxjs";
import { TDSMessageService } from "tds-ui/message";
import { FireBaseTopicDto } from "@app/dto/firebase/topics.dto";
import { AngularFireMessaging } from "@angular/fire/compat/messaging";

@Injectable({
  providedIn: 'root'
})

export class FirebaseMessagingService  {

  payload = new BehaviorSubject(null);
  token: any;
  _notificationFirebase: any;
  topics!: FireBaseTopicDto[];

  _firebaseDeviceToken: string = "_firebaseDeviceToken";

  constructor(private message: TDSMessageService,
      private angularFireMessaging: AngularFireMessaging) {
  }

  deleteToken() {
    return this.angularFireMessaging.getToken
      .pipe(mergeMap((token: any) => this.angularFireMessaging.deleteToken(token)));
  }

  getDeviceTokenLocalStorage() {
    const key = this._firebaseDeviceToken;
    let token = localStorage.getItem(key) as any;
    return token;
  }

  setDeviceTokenLocalStorage(token: string) {
    const key = this._firebaseDeviceToken;
    localStorage.setItem(key, token);
  }

  removeDeviceTokenLocalStorage() {
    const key = this._firebaseDeviceToken;
    localStorage.removeItem(key);
  }

}
