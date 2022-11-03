// import { Injectable } from "@angular/core";
// import { BehaviorSubject } from "rxjs";
// import { AngularFireAuth } from "@angular/fire/compat/auth";
// import { AngularFirestore } from "@angular/fire/compat/firestore";

// @Injectable({
//   providedIn: 'root'
// })

// export class AfAuthDeviceDetectorService {

//   private _user: any = new BehaviorSubject(null);

//   constructor(private afAuth: AngularFireAuth,
//     private _afs: AngularFirestore) {
//   }

//   private setUser(user: any) {
//     this._user.next(user);
//   }

//   public get user(): BehaviorSubject<any> {
//     return this._user;
//   }

//   /**
//  * Update the User's push token
//  * @param token string
//  */
//   public async updatePushToken(token: string) {
//     try {
//       const devices = await this._afs.firestore.collection('Devices').where('token', '==', token).get();

//       if (devices.empty) {
//         const deviceInfo = this.deviceService.getDeviceInfo();
//         const data = {
//           token: token,
//           userId: this._user._value.uid,
//           deviceType: 'web',
//           deviceInfo: {
//             browser: deviceInfo.browser,
//             userAgent: deviceInfo.userAgent
//           },
//         };

//         await this._afs.firestore.collection('Devices').add(data);
//         console.log('New Device Added');
//       } else {
//         console.log('Already existing Device');
//       }
//     } catch (error) {
//       console.log("Error Message", error);
//     }
//   }

// }
