import { Injectable } from "@angular/core";
import { ChatmoniSocketEventName } from "./soketio-event";

@Injectable({
  providedIn: 'root'
})

export class SocketStorageNotificationService {

  public _keyCacheSocketConfig: string = "_socket_notification";
  public socketData: any = {};

  constructor() {
  }

  getSocketDataDefault() {
    this.socketData['socket.all'] = true;
    this.socketData[ChatmoniSocketEventName.chatomniOnMessage] = true;
    this.socketData[ChatmoniSocketEventName.chatomniOnUpdate] = true;
    this.socketData[ChatmoniSocketEventName.onCreatedSaleOnline_Order] = true;
    this.socketData[ChatmoniSocketEventName.onDeleteSaleOnline_Order] = true;
    this.socketData[ChatmoniSocketEventName.livecampaign_CartCheckout] = true;
    this.socketData[ChatmoniSocketEventName.chatomniPostLiveEnd] = true;

    return this.socketData;
  }

  setLocalStorage() {
    const key = this._keyCacheSocketConfig;
    let value = JSON.stringify(this.getSocketDataDefault());
    localStorage.setItem(key, value);
  }

  getLocalStorage() {
    const key = this._keyCacheSocketConfig;
    let localSocket = localStorage.getItem(key) as any;
    let data = JSON.parse(localSocket || null);
    return data;
  }

  removeLocalStorage() {
    const key = this._keyCacheSocketConfig;
    localStorage.removeItem(key) as any;
  }

}
