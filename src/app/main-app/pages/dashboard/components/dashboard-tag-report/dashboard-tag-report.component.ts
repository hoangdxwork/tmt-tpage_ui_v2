import { TDSSafeAny } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-tag-report',
  templateUrl: './dashboard-tag-report.component.html',
  styleUrls: ['./dashboard-tag-report.component.scss']
})
export class DashboardTagReportComponent implements OnInit {
//#region variable
  filterList= [
    {id:1, name:'Tuần này'},
    {id:2, name:'Tháng này'}
  ]
  currentFilter = this.filterList[0].name;
  tableData:Array<TDSSafeAny> = [];
  emptyData = false;
  //#endregion
  constructor() { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.tableData = [
      {
        id:1,
        tagName:'Bom hàng',
        position:1,
        numberOfTag:60,
        rateOfAppearance:20,
        color:'#EB3B5B',
        decrease:false
      },
      {
        id:2,
        tagName:'Đang vận chuyển',
        position:2,
        numberOfTag:48,
        rateOfAppearance:20,
        color:'#2395FF'
      },
      {
        id:3,
        tagName:'Hoàn thành',
        position:3,
        numberOfTag:40,
        rateOfAppearance:20,
        color:'#28A745'
      },
      {
        id:4,
        tagName:'Khách hẹn',
        position:4,
        numberOfTag:32,
        rateOfAppearance:20,
        color:'#FFC107'
      },
      {
        id:5,
        tagName:'Khách nguy cơ bom hàng',
        position:5,
        numberOfTag:26,
        rateOfAppearance:20,
        color:'#FF8900'
      }
    ];

    if(this.tableData.length == 0){
      this.emptyData = true;
    }
  }

  onChangeFilter(data:any){
    this.currentFilter = data;
  }
}
