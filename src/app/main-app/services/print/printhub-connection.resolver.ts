import { EventEmitter, Inject, Injectable } from "@angular/core";
import { HttpTransportType, HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { BehaviorSubject, from, map, Observable, mergeMap } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { TDSMessageService } from "tds-ui/message";
import { TAuthService } from "@core/services";
import * as signalR from "@microsoft/signalr";
import { SignalRHttpClient } from "../signalR/client-signalR";
import { OrderPrintService } from "./order-print.service";

@Injectable({
  providedIn: 'root'
})

export class PrintHubConnectionResolver {
  private _hubConnection!: HubConnection;

  public saleOnlineOrders$ = new BehaviorSubject<any[]>([]);

  public connectedUsers: any[] = [];
  public saleOnlineOrders: any[] = [];

  public isEnablePrint: boolean = false;
  public isConnectionEstablished = false;
  public isConnecting: boolean = false;
  public connectionId: any;

  public onSaleOnlineOrderCreated$ = new EventEmitter<any>();
  public onPrintUserConnected$ = new EventEmitter<any>();
  public onPrintUserDisconnected$ = new EventEmitter<any>();
  public onForceDisconnect$ = new EventEmitter<any>();
  public onConnectionEstablished$ = new EventEmitter<any>();
  public onConnectionClosed$ = new EventEmitter<any>();

  private startedConnection!: Promise<any>;

  constructor(@Inject('BASE_SIGNALR') private BASE_SIGNALR: string,
    private http: HttpClient,
    private orderPrintService: OrderPrintService,
    private message: TDSMessageService,
    private authen: TAuthService) {
  }

  public configSignalR(): any {
    let config = {
        hubName: 'common',
        token: this.authen.getAccessToken()?.access_token,
        logging: true,
    };
    return config;
  }


  resolve() {
    this.createConnection();
    this.startConnection();
    this.addEvents();
  }

  public init() {
    this.createConnection();
    this.addEvents();
  }

  public connect() {
    this.startedConnection = this.startConnection();
  }

  public stop() {
    this._hubConnection.stop().then(res => {
        this.onConnectionClosed$.emit(res);
      });
  }

  public getSaleOnlineOrders$() {
    return this.saleOnlineOrders$.asObservable();
  }

  // Đăng ký sự kiện
  private addEvents(): void {
    // Nhận sự kiện tạo đơn để in
    this._hubConnection.on('onSaleOnlineOrderCreated', (model: any) => {
      if (this.isEnablePrint) { // Nếu bật in thì mới in
        model.isPrinting = true;
        this.orderPrintService.printId(model.Id, model);
      }

      this.saleOnlineOrders = [...[model], ...this.saleOnlineOrders];
      this.saleOnlineOrders$.next(this.saleOnlineOrders);
      this.onSaleOnlineOrderCreated$.emit(model);
    });

    // Thông báo để cảnh báo khi có trên 1 user kết nối in => lỗi in trùng
    this._hubConnection.on('onPrintUserConnected', (data) => {
      this.connectedUsers = [...this.connectedUsers, ...[data]];
      this.onPrintUserConnected$.emit(data);
    });

    this._hubConnection.on('onPrintUserDisconnected', (data) => {
      this.removeConnectedUser(data.connectionId);
      this.onPrintUserDisconnected$.emit(data);
    });

    this._hubConnection.on('onForceDisconnect', (data) => {
      this.onForceDisconnect$.emit(data);
      this._hubConnection.stop();
    });

    this._hubConnection.onclose(res => {
      this.removeConnectedUser(this.connectionId);
      this.isConnectionEstablished = false;
      this.connectionId = null;

      this.onConnectionClosed$.emit(res);
    });
  }

  public getConnectedUsers() {
    return this.invoke('GetConnectedUsers', null).pipe(map(res => {
        this.connectedUsers = res;
        if (this.connectedUsers.length == 1) { // Nếu chỉ có 1 kết nối thì bật enable print
          this.isEnablePrint = true;
        }
        return res;
      }));
  }

  public getConnectionId(): string {
    return this.connectionId;
  }

  public forceDisconnect(connectionId: string) {
    return this.invoke('ForceDisconnect', connectionId).pipe(map(res => {
        return res;
      }));
  }

  invoke(method: string, ...data: any): Observable<any> {
    return from(this.startedConnection)
      .pipe(mergeMap(_ => {
          if (data) {
            return this._hubConnection.invoke(method, ...data);
          } else {
            return this._hubConnection.invoke(method, []);
          }
        })
      )
  }

  private removeConnectedUser(connectionId: string) {
    var existIndex = this.connectedUsers.findIndex(x => x.connectionId == connectionId);
    if (existIndex >= 0) {
      this.connectedUsers.splice(existIndex, 1);
    }
  }

  private createConnection() {
    let configs = this.configSignalR() as any;
    let hubConnectionBuilder = new signalR.HubConnectionBuilder() as any;

    this._hubConnection = hubConnectionBuilder
      // .withUrl(`${this.BASE_SIGNALR}/hub/` + configs.hubName + environment.signalRAppend , {
      .withUrl(`${this.BASE_SIGNALR}/hub/` + configs.hubName , {
          transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
          accessTokenFactory: () => {
              return configs.token;
          },
          httpClient: new SignalRHttpClient(this.authen) as any,
          skipNegotiation: false
      })
      .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext: { elapsedMilliseconds: number }) => {
            if (retryContext.elapsedMilliseconds < 60000) {
                // If we've been reconnecting for less than 60 seconds so far,
                // wait between 0 and 10 seconds before the next reconnect attempt.
                return Math.random() * 10000;
            } else {
                // If we've been reconnecting for more than 60 seconds so far, stop reconnecting.
                return null;
            }
          }
      }).build();
  }

  private startConnection() {
    this.isConnecting = true;

    if (!this._hubConnection) {
      this.init();
    }

    return this._hubConnection.start().then(() => {
        this.isConnecting = false;
        this.isConnectionEstablished = true;
        this.connectionId = this._hubConnection.connectionId;
        this.onConnectionEstablished$.emit(true);
      })
      .catch((error) => {
        this.isConnecting = false;
        console.log(`Error while establishing connection, retrying... ${error}`);
        setTimeout(() => this.startConnection(), 5000)
      });
  }
}
