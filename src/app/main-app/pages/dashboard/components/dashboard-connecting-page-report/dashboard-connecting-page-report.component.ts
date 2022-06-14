import { Component, OnInit } from '@angular/core';
import { TDSSafeAny } from 'tds-ui/shared/utility';

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

  onChangeFilter(data:any){
    this.currentFilter = data;
  }
}
