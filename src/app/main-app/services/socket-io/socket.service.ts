import { Injectable } from '@angular/core';
import { TCommonService } from '@core/services';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { BaseSevice } from '../base.service';

@Injectable({
  providedIn: 'root'
})

export class SocketService extends BaseSevice {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";

  socket!: Socket;
  nsp: any;

  constructor(private apiService: TCommonService) {
    super(apiService);

    this.initSocket();
  }

  initSocket(): void {
    this.socket = io(environment.socketUrl, {
        transports: ['websocket'], // Sử dụng khi socketserver không dùng sticky session
        query: {
          room: `${this._BASE_URL}` // Viết hàm parse url lấy theo domain của tên miền hiện tại nếu ở production
        }
    });

    this.socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
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
