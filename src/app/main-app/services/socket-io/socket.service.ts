import { DOCUMENT } from '@angular/common';
import { EventEmitter, Inject, Injectable, Output } from '@angular/core';
import { TAuthService } from '@core/services/auth.service';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { TDSNotificationService } from 'tds-ui/notification';

@Injectable({
  providedIn: 'root'
})

export class SocketService {

  @Output()
  isConnectedSocket$ = new EventEmitter<boolean>();

  socket!: Socket;
  isInitialized: boolean = false;

  constructor(private notificationService: TDSNotificationService,
    private authService: TAuthService,
    @Inject(DOCUMENT) private document: Document) {

    this.authService.getAuthenIsLogin().subscribe({
      next: (isLogin: any) => {
        if (isLogin && !this.isInitialized) {
          this.initSocket();
          this.isInitialized = true;
        }
      }
    });
  }

  initSocket(): void {
    let hostname = this.document.location.hostname;

    this.socket = io(environment.socketUrl, {
      transports: ['websocket'], // Sử dụng khi socketserver không dùng sticky session
      query: {
        room: `${hostname}` // Viết hàm parse url lấy theo domain của tên miền hiện tại nếu ở production
      },
      auth: {
        token: this.authService.getAccessToken()?.access_token
      }
    });

    this.socket.on("connect", () => {
        console.log("Connected to socket.io server");
        this.isConnectedSocket$.emit(true);
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
