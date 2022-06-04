import { ChangeDetectorRef, EventEmitter, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { TAuthService, TCommonService } from "src/app/lib";
import { BaseSignalRSevice } from "./base-signalR.service";
import { HttpTransportType } from '@microsoft/signalr';
import { SignalRHttpClient } from "./client-signalR";
import * as signalR from "@microsoft/signalr";
import { TDSSafeAny } from "tmt-tang-ui";
import { HubEvents } from "./app-constant/hub-event";

@Injectable({
  providedIn: 'root'
})

export class SignalRConnectionService extends BaseSignalRSevice {

  private _hubConnection!: signalR.HubConnection;
  retry: number = 0;
  isResolved: boolean = false;
  repeatTimeKey: any;

  public connectionIsEstablished: boolean = false;
  public _connectionEstablished$ = new BehaviorSubject<Boolean>(false);

  public _onFacebookEvent$ = new EventEmitter<any>();
  public _onSendMessageCompleteEvent$ = new EventEmitter<any>();
  public _onSendMessageSendingEvent$ = new EventEmitter<any>();
  public _onSendMessageFailEvent$ = new EventEmitter<any>();

  public _onRetryMessage$ = new EventEmitter<any>();
  public _onAppendTagSucceedEvent$ = new EventEmitter<any>();
  public _onAppendAssignUserEvent$ = new EventEmitter<any>();
  public _onReadConversation$ = new EventEmitter<any>();
  public _onSentConversation$ = new EventEmitter<any>();
  public _onPaymentEvent$ = new EventEmitter<any>();
  public _onSaleOnlineOrder$ = new EventEmitter<any>();
  public _onFastSaleOrderEvent$ = new EventEmitter<any>();
  public _onSendMessageWithBill$ = new EventEmitter<any>();
  public _onAddTemplateMessage$ = new EventEmitter<any>();
  public _onFacebookScanData$ = new EventEmitter<any>();

  constructor(private apiService: TCommonService,
      private authen: TAuthService) {
      super(apiService);
  }

  public configSignalR(): any {
    let config = {
        hubName: 'common',
        token: this.authen.getAccessToken()?.access_token,
        logging: true,
    };
    return config;
  }

  initiateSignalRConnection() {
    let isLogin = this.authen.isLogin();
    if (isLogin == true) {
        this.connectionBuilder();
        this.connectionStart();
        this.addHubEvents();

        this.isResolved = true;
        console.log("SignalR resolved.");
    }
  }

  public addHubEvents(): void {
    this._hubConnection.on(`${HubEvents.onMessage}`, (data:TDSSafeAny) => {
      switch (data.type) {
        case "update_scan_feed":
        case "update_scan_conversation":
          {
            this._onFacebookScanData$.emit(data);
          }
          break;
        case "send_message_completed":
          {
            if (data.error) {
              // this.message.error(data.message);
            }
            let res = Object.assign({}, data);
            this._onSendMessageCompleteEvent$.emit(res);
          }
          break;
        case "send_message_sending":
          {
            this._onSendMessageSendingEvent$.emit(data);
          }
          break;
        case "send_message_failed":
          {
            this._onSendMessageFailEvent$.emit(data);
          }
          break;
        case "send_message_retry":
          this._onRetryMessage$.emit(data);
          break;
        case "append_tag_succeed":
        case "remove_tag_succeed":
          {
            this._onAppendTagSucceedEvent$.emit(data);
          }
          break;
        case "append_assign_user":
          {
            this._onAppendAssignUserEvent$.emit(data);
          }
          break;
        case "send_message_with_bill":
          {
            this._onSendMessageWithBill$.emit(data);
          }
          break;
        case "add_template_message":
          {
            this._onAddTemplateMessage$.emit(data);
          }
          break;
        case "SaleOnline_Order":
          {
            this._onSaleOnlineOrder$.emit(data);
          }
          break;
        // case "FastSaleOrder":
        //   {
        //       this._onFastSaleOrderEvent$.emit(data);
        //   }
        default:
          break;
      }
    });
    this._hubConnection.on(`${HubEvents.onFacebookEvent}`, (data:TDSSafeAny) => {
      this._onFacebookEvent$.emit(data);
    });
    this._hubConnection.on(`${HubEvents.onReadConversation}`, (data:TDSSafeAny) => {
      this._onReadConversation$.emit(data);
    });
    this._hubConnection.on(`${HubEvents.onSentConversation}`, (data:TDSSafeAny) => {
      this._onSentConversation$.emit(data);
    });
    this._hubConnection.on(`${HubEvents.onPaymentEvent}`, (data:TDSSafeAny) => {
      this._onPaymentEvent$.emit(data);
    });
    this._hubConnection.onreconnecting(() => {
      this.statusDisConnecting();
    });
    this._hubConnection.onreconnected(() => {
      this.statusConnecting();
    });
    this._hubConnection.onclose(() => {
      this.statusDisConnecting();
    });
  }

  public refreshConnected() {
    clearTimeout(this.repeatTimeKey);
    this.initiateSignalRConnection();

    this.repeatTimeKey = setTimeout(() => {
      this.initiateSignalRConnection();
    }, this.retry * 10 * 1000);
  }

  private connectionBuilder() {
    let configs = this.configSignalR() as any;
    let hubConnectionBuilder = new signalR.HubConnectionBuilder() as any;

    this._hubConnection = hubConnectionBuilder
      .withUrl(`${this._SIGNALR_URL}/hub/` + configs.hubName + this._SIGNALR_APPENDER , {
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

  private connectionStart() {
    this._hubConnection
      .start()
      .then(() => {
        console.log('Hub connection started');
        this.retry = 0;
        this.statusConnecting();
      })
      .catch(() => {
        console.log('Error while establishing connection, retrying...');
        if (this.retry < 6) { // Thử kết nối lại trong 5 lần
          this.retry += 1;
          this._hubConnection.onclose;
          this.repeatTimeKey = setTimeout(() => {
              this.initiateSignalRConnection();
          }, (this.retry * 10000));
        }
        this.statusDisConnecting();
      });
  }

  private statusDisConnecting() {
    this.isResolved = false;
    this.connectionIsEstablished = false;
    this._connectionEstablished$.next(false);
  }

  private statusConnecting() {
    this.isResolved = true;
    this.connectionIsEstablished = true;
    this._connectionEstablished$.next(true);
  }

  public sendMessage(action: any, data: any): void {
    if (this.connectionIsEstablished) {
        this._hubConnection
            .invoke(action, data)
            .catch(err => console.error(err));
    } else {
        // Xử lý chờ kết nối và gửi
        this._connectionEstablished$.subscribe(data => {
            if (data) {
                this._hubConnection
                    .invoke(action, data)
                    .catch(err => console.error(err));
            }
        })
    }
  }

}
