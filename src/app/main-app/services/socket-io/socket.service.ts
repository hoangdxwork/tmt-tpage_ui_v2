import { DOCUMENT } from '@angular/common';
import { EventEmitter, Inject, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { TDSMessageService } from 'tds-ui/message';
import { TDSNotificationService } from 'tds-ui/notification';

@Injectable({
  providedIn: 'root'
})

export class SocketService  {

  @Output() isConnectedSocket = new EventEmitter<boolean>();
  socket!: Socket;
  retryNoti: number = 1;
  establishedConnected = true;

  constructor(private notificationService: TDSNotificationService,
    @Inject(DOCUMENT) private document: Document) {

    this.initSocket();
  }

  initSocket(): void {
    let hostname = 'test.tpos.dev';// this.document.location.hostname;

    this.socket = io(environment.socketUrl, {
        transports: ['websocket'], // Sử dụng khi socketserver không dùng sticky session
        query: {
            room: `${hostname}` // Viết hàm parse url lấy theo domain của tên miền hiện tại nếu ở production
        },
    });

    this.socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);

        if(this.retryNoti == 1) {
          this.notificationService.error(
              'Kết nối socket-io xảy ra lỗi',
              `${err.message}`,
              { placement: 'bottomLeft'} )
        }

        this.establishedConnected = false;
        this.retryNoti++;
    });
  }

  reconnecting() {
    this.socket.on('reconnect', () => {
        console.log('The connection socket-io was successfully established');
        this.establishedConnected = true;
    });
  }

  getSocketId = () => this.socket.id;

  disconnectSocket(): void {
      this.socket.close();
  }

  listenEvent(eventName: any): Observable<any> {
    return new Observable((subscriber) => {
        this.socket.on(eventName, (data: any) => {
            subscriber.next(data);
            subscriber.complete();
        });
    });
  }

  emitEvent(eventName: any, data: any): void {
      this.socket.emit(eventName, data);
  }
}
