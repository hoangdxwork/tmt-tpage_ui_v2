import { Component, OnInit } from '@angular/core';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-dashboard-connecting-page-report',
  templateUrl: './dashboard-connecting-page-report.component.html'
})
export class DashboardConnectingPageReportComponent implements OnInit {
  //#region variable
  labelData:TDSSafeAny[] = [];
  emptyData = false;
  //#endregion

  constructor() { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.labelData = [
      {
        value:150,
        percent:20,
        decrease:false
      },
      {
        value:150,
        percent:20
      }
    ]

    if(this.labelData.length < 2){
      this.emptyData = true;
    }
  }
}
