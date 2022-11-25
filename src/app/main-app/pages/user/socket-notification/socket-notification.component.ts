import { Component, OnInit } from '@angular/core';
import { SocketStorageNotificationService } from '@app/services/socket-io/socket-config-notification.service';

@Component({
  selector: 'app-socket-notification',
  templateUrl: './socket-notification.component.html',
})
export class SocketNotificationComponent implements OnInit {
  socketData: {[key: string]: boolean} = {} as any
  lstItems: Array<any> = [];

  constructor(
    private socketStorageNotificationService: SocketStorageNotificationService
  ) { }

  ngOnInit(): void {
    let exist = this.socketStorageNotificationService.getLocalStorage();
    if(!exist) {
      this.socketStorageNotificationService.setLocalStorage();
      exist = this.socketStorageNotificationService.getLocalStorage();
    }
    for(let item in exist) {
      this.lstItems.push(item);
    }
    this.socketData = exist
  }

  change(item: any) {
    let current = this.socketData[item]
    current = !current;
    this.socketStorageNotificationService.setLocalStorage(this.socketData);
  }

}
