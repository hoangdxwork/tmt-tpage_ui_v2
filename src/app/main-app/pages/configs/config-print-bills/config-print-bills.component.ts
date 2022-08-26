import { Component, OnInit } from '@angular/core';
import { PrintHubConnectionResolver } from '@app/services/print/printhub-connection.resolver';
import { TDSNotificationService } from 'tds-ui/notification';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-config-print-bills',
  templateUrl: './config-print-bills.component.html'
})
export class ConfigPrintBillsComponent implements OnInit {

  printerList:TDSSafeAny[] = [];
  isEnablePrint!:boolean;

  constructor(private printHub: PrintHubConnectionResolver,
    private notificationService: TDSNotificationService) { }

  ngOnInit(): void {
    this.isEnablePrint = this.printHub.isEnablePrint;
  }

  onPrintSwitchChange(event: boolean){
    this.isEnablePrint = event;
    this.printHub.isEnablePrint = event;

    if(event) {
        this.notificationService.success('Kết nối máy in', 'Bật in thành công', { placement: 'bottomLeft'});
    } else {
        this.notificationService.success('Kết nối máy in', 'Đã tắt bật in' , { placement: 'bottomLeft'});
    }
  }

  onConnectPrinter(data:TDSSafeAny){
  }

  onSaveConfig(data:TDSSafeAny){

  }

  onRemovePrinter(data:TDSSafeAny,index:number){

  }
}
