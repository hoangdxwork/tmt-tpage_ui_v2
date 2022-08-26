import { Component, OnInit } from '@angular/core';
import { PrintHubConnectionResolver } from '@app/services/print/printhub-connection.resolver';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSNotificationService } from 'tds-ui/notification';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { takeUntil } from 'rxjs';
import { TDSMessageService } from 'tds-ui/message';
import { OrderPrintService } from '@app/services/print/order-print.service';

@Component({
  selector: 'app-config-print-bills',
  templateUrl: './config-print-bills.component.html',
  providers: [TDSDestroyService]
})

export class ConfigPrintBillsComponent implements OnInit {

  printerList:TDSSafeAny[] = [];
  isEnablePrint!:boolean;

  printHubConnected: boolean = false;
  isConnected: boolean = false;

  connectionId!: string;
  printHubSaleOnlineOrderCount: number = 0;
  connectedUsers: any[] = [];
  saleOnlineOrders: any[] = [];

  constructor(private printHub: PrintHubConnectionResolver,
    private notificationService: TDSNotificationService,
    private orderPrintService: OrderPrintService,
    private message: TDSMessageService,
    private destroy$: TDSDestroyService) {
      this.printHub.init();
  }

  ngOnInit(): void {
      this.isEnablePrint = this.printHub?.isEnablePrint;
      this.isConnected = this.printHub.isConnectionEstablished;
      this.connectedUsers = this.printHub.connectedUsers;

      this.printHub.onConnectionEstablished$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
          this.notificationService.success('Kết nối máy in','Kết nối thành công', { placement: 'bottomLeft'});

          this.isConnected = this.printHub.isConnectionEstablished;
          this.saleOnlineOrders = [...this.printHub.saleOnlineOrders];

          this.connectionId = this.printHub.getConnectionId();

          this.printHub.getConnectedUsers().pipe(takeUntil(this.destroy$)).subscribe({
            next: (res: any) => {
              this.connectedUsers = [...this.printHub.connectedUsers];
              console.log(this.connectedUsers)
            }
          });
        }
      });

      this.printHub.onForceDisconnect$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            this.notificationService.warning('Yêu cầu ngắt kết nối', 'Bạn đã bị yêu cầu ngắt kết nối máy in', { placement: 'bottomLeft'});
            this.printHub.stop();
        }
      });

      this.printHub.onPrintUserConnected$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            this.notificationService.info('Kết nối máy tin', 'Có một người dùng đã kết nối tính năng in đơn tự động', { placement: 'bottomLeft'});
            this.connectedUsers = [...this.printHub.connectedUsers];
        }
      });

      this.printHub.onPrintUserDisconnected$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            this.connectedUsers = [...this.printHub.connectedUsers];
        }
      });

      this.printHub.onConnectionEstablished$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            this.printHubConnected = this.printHub.isConnectionEstablished;
        }
      });

      this.printHub.onConnectionClosed$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            this.printHubConnected = this.printHub.isConnectionEstablished;
            this.isConnected = this.printHub.isConnectionEstablished;
            this.connectionId = this.printHub.connectionId;
            this.connectedUsers = [...this.printHub.connectedUsers];
        }
      });

      this.printHub.onSaleOnlineOrderCreated$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            this.printHubConnected = this.printHub.isConnectionEstablished;
            this.printHubSaleOnlineOrderCount++;
        }
      });

  }

  onPrintSwitchChange(event: boolean) {
    this.isEnablePrint = event;
    this.printHub.isEnablePrint = event;

    if(event) {
        this.notificationService.success('Kết nối máy in', 'Bật in thành công', { placement: 'bottomLeft'});
    } else {
        this.notificationService.success('Kết nối máy in', 'Đã tắt bật in' , { placement: 'bottomLeft'});
    }
  }

  onConnectPrinter(type: string){
    if(type == 'connect') {
        this.printHub.connect();
    } else {
        this.printHub.stop();
    }
  }

  forceDisconnect(item: any, index: number) {
    this.printHub.forceDisconnect(item.connectionId).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
          this.message.success('Thao tác thành công');
          this.connectedUsers.slice(index, 1);
      }
    });
  }

  printAgain(item: any) {
    item.isPrinting = true;
    this.orderPrintService.printOrder(item);
  }

}
