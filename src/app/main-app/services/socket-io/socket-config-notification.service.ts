import { CRMTeamType } from '@app/dto/team/chatomni-channel.dto';
import { EventEmitter, Injectable } from "@angular/core";
import { ChatmoniSocketEventName } from "./soketio-event";

@Injectable({
  providedIn: 'root'
})

export class SocketStorageNotificationService {

  public _keyCacheSocketConfig: string = "_socket_notification";
  public socketData: {[key: string]: boolean} = {} as any;

  public socketAllEmitter$ = new EventEmitter<boolean>();

  constructor() {
  }

  getSocketDataDefault() {
    this.socketData['socket.all'] = true;
    this.socketData[ChatmoniSocketEventName.chatomniOnMessage] = true;
    this.socketData[CRMTeamType._Facebook] = true;
    this.socketData[CRMTeamType._TShop] = true;
    this.socketData[CRMTeamType._TikTok] = true;
    this.socketData[ChatmoniSocketEventName.chatomniOnUpdate] = true;
    this.socketData[ChatmoniSocketEventName.onCreatedSaleOnline_Order] = true;
    this.socketData[ChatmoniSocketEventName.onDeleteSaleOnline_Order] = true;
    this.socketData[ChatmoniSocketEventName.livecampaign_CartCheckout] = true;
    this.socketData[ChatmoniSocketEventName.chatomniPostLiveEnd] = true;
    this.socketData[ChatmoniSocketEventName.chatomniCreatePost] = true;

    return this.socketData;
  }

  setLocalStorage(item?: any) {
    let value={} as any;
    const key = this._keyCacheSocketConfig;

    if(item) {
      value =  JSON.stringify(item);
    } else {
      value = JSON.stringify(this.getSocketDataDefault());
    }

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
