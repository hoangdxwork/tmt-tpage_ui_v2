import { Injectable } from "@angular/core";
import { BehaviorSubject, take, mergeMap, Observable } from "rxjs";
import { TDSMessageService } from "tds-ui/message";
import { FirebaseRegisterService } from "./firebase-register.service";
import { FireBaseTopicDto } from "@app/dto/firebase/topics.dto";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { AngularFireMessaging } from "@angular/fire/compat/messaging";
import { AngularFireAuth } from "@angular/fire/compat/auth";

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
      private angularFireMessaging: AngularFireMessaging,
      private firebaseRegisterService: FirebaseRegisterService,
      private angularFireDatabase: AngularFireDatabase,
      private angularFireAuth: AngularFireAuth) {
  }

  deleteToken1() {
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
