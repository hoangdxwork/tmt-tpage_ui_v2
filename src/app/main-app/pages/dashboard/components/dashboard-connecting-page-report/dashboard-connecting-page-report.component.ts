import { TDSSafeAny } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-connecting-page-report',
  templateUrl: './dashboard-connecting-page-report.component.html',
  styleUrls: ['./dashboard-connecting-page-report.component.scss']
})
export class DashboardConnectingPageReportComponent implements OnInit {
  //#region variable
  filterList= [
    {id:1, name:'Tuần này'},
    {id:2, name:'Tháng này'}
  ]
  currentFilter = this.filterList[0].name;
  labelData:TDSSafeAny;
  //#endregion

  constructor() { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.labelData = {
      personalAccounts:{
        value:150,
        percent:20,
        decrease:false
      },
      fanpages:{
        value:150,
        percent:20
      },
    }
  }

  onChangeFilter(data:any){
    this.currentFilter = data;
  }
}
