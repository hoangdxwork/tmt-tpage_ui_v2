import { TDSSafeAny } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss']
})
export class DashboardOverviewComponent implements OnInit {
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
        value:25,
        percent:20,
        decrease:false
      },
      {
        value:140000,
        percent:20
      },
      {
        value:25,
        percent:20
      },
      {
        value:3,
        percent:20
      }
    ];

    if(this.labelData.length < 4){
      this.emptyData = true;
    }
  }

  onChangeFilter(data:any){
    this.currentFilter = data;
  }
}
