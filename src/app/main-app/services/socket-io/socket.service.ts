import { TDSNotificationService } from 'tds-ui/notification';
import { DOCUMENT } from '@angular/common';
import { EventEmitter, Inject, Injectable, Output } from '@angular/core';
import { TAuthService } from '@core/services/auth.service';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { BaseSevice } from '../base.service';
import { TCommonService } from '@core/services';
import { CoreAPIDTO } from '@core/dto';
import { CoreApiMethodType } from '@core/enum';

@Injectable({
  providedIn: 'root'
})

export class SocketService extends BaseSevice {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";

  public isConnectedSocket$: EventEmitter<boolean> = new EventEmitter<boolean>();

  socket!: Socket;
  isInitialized: boolean = false;

  isConnectError: number = 0;

  constructor(private apiService: TCommonService,
    private authService: TAuthService,
    private notificationService: TDSNotificationService,
    @Inject(DOCUMENT) private document: Document) {
    super(apiService);

    // this.authService.getAuthenIsLogin().subscribe({
    //   next: (isLogin: any) => {
    //     if (isLogin && !this.isInitialized) {
    //       this.initSocket();
    //       this.isInitialized = true;
    //     }
    //   }
    // });

    this.authService.getCacheToken().subscribe({
      next: (data: any) => {
        if(data && data.access_token) {
          this.apiUserinit().subscribe({
            next: (user: any) => {
              if(user && user.Id) {
                this.initSocket(data.access_token);
              }
            }
          })
        }
      }
    })
  }

  initSocket(accessToken: any): void {
    let hostname = this.document.location.hostname;
    hostname = hostname.toLowerCase();

    this.socket = io(environment.socketUrl, {
      transports: ['websocket'], // Sử dụng khi socketserver không dùng sticky session
      query: {
        room: `${hostname}` // Viết hàm parse url lấy theo domain của tên miền hiện tại nếu ở production
      },
      auth: {
        token: accessToken
      }
    });

    this.socket.on("connect", () => {
      console.log("Connected to socket.io server");
      this.isConnectedSocket$.emit(true);

      if(this.isConnectError == 1) {
        this.notificationService.info('Kết nối Realtime', 'Socket.io đã được kết nối lại!', { duration: 10 * 1000, placement: 'bottomLeft' });
        this.isConnectError = 0;
      }
    });

    this.socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);

      if(this.isConnectError == 0) {
        this.notificationService.error('Kết nối Realtime', 'Socket.io đã xảy ra lỗi!', { duration: 10 * 1000, placement: 'bottomLeft' });
        this.isConnectError = 1;
      }
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

  apiUserinit(): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/rest/v1.0/user/info`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }
}
