import { ConfigDataFacade } from './../../../services/facades/config-data.facade';
import { Component, OnInit } from '@angular/core';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-config-print-bills',
  templateUrl: './config-print-bills.component.html'
})
export class ConfigPrintBillsComponent implements OnInit {
  printerList:TDSSafeAny[] = [];
  enablePrintSwitch!:boolean;

  constructor(private configDataService: ConfigDataFacade) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.enablePrintSwitch = true;
    this.printerList = [
      {
        id:1,
        name:'HP LaserJet Pro MFP M428FDN Printer W1A29A',
        status:1
      },
      {
        id:1,
        name:'HP LaserJet Pro MFP M428FDN Printer W1A29A',
        status:1
      },
    ];
  }

  onPrintSwitchChange(value:boolean){
    this.enablePrintSwitch = value;
  }

  onConnectPrinter(data:TDSSafeAny){

  }

  onSaveConfig(data:TDSSafeAny){

  }

  onRemovePrinter(data:TDSSafeAny,index:number){

  }
}
