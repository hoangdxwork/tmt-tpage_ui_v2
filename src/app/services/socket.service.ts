import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket!: Socket;
  nsp: any;
  constructor() {
    this.initSocket();
  }

  initSocket(): void {
    this.socket = io(environment.socketUrl, {
      transports: ['websocket'], // Sủ dụng khi socketserver không dùng sticky session
      query:{
        room: 'test.tpos.dev'
      }
    });

    this.socket.onAny((event, data) => {
      debugger;
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
      });
    });
  }

  emitEvent(eventName: any, data: any): void {
    this.socket.emit(eventName, data);
  }
}
