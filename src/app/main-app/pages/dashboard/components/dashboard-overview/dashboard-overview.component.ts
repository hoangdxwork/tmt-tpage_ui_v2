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
  labelData:TDSSafeAny;
  //#endregion
  
  constructor() { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.labelData = {
      customer:{
        value:25,
        percent:20,
        decrease:false
      },
      reaction:{
        value:140000,
        percent:20
      },
      bill:{
        value:25,
        percent:20
      },
      order:{
        value:3,
        percent:20
      },
    }
  }

  onChangeFilter(data:any){
    this.currentFilter = data;
  }
}
