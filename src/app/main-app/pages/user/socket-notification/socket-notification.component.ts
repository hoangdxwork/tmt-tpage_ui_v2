import { CRMTeamType } from '@app/dto/team/chatomni-channel.dto';
import { ChatmoniSocketEventName } from '@app/services/socket-io/soketio-event';
import { TDSDestroyService } from 'tds-ui/core/services';
import { takeUntil } from 'rxjs';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { SocketStorageNotificationService } from '@app/services/socket-io/socket-config-notification.service';

@Component({
  selector: 'app-socket-notification',
  templateUrl: './socket-notification.component.html',
  providers: [ TDSDestroyService ]
})
export class SocketNotificationComponent implements OnInit {
  socketData: {[key: string]: boolean} = {} as any
  lstItems: Array<any> = [];

  constructor(
    private socketStorageNotificationService: SocketStorageNotificationService,
    private destroy$: TDSDestroyService,
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
    this.onEventEmitter();
  }

  onEventEmitter() {
    this.socketStorageNotificationService.socketAllEmitter$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.socketData = this.socketStorageNotificationService.getLocalStorage();
    });
  }


  change(item: any) {
    if(item == "socket.all") {
        let cur = this.socketData[item];
        
        if(cur == false) {
            for(let data in this.socketData) {
              this.socketData[data] = false;
            }
        } else {
            for(let data in this.socketData) {
              this.socketData[data] = true;
            }
        }

        this.socketStorageNotificationService.setLocalStorage(this.socketData);
        this.socketStorageNotificationService.socketAllEmitter$.emit(this.socketData[item]);
    } else {
        if(item == ChatmoniSocketEventName.chatomniOnMessage) {
          this.socketData[CRMTeamType._Facebook] = this.socketData[item];
          this.socketData[CRMTeamType._TShop] = this.socketData[item];
          this.socketData[CRMTeamType._TikTok] = this.socketData[item];
        }
      this.socketStorageNotificationService.setLocalStorage(this.socketData);
    }
  }

}
