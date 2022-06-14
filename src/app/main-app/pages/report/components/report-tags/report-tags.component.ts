import { TDSBarChartComponent, TDSChartOptions, TDSBarChartDataSeries } from 'tds-report';
import { Component, OnInit } from '@angular/core';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-report-tags',
  templateUrl: './report-tags.component.html',
  styleUrls: ['./report-tags.component.scss']
})
export class ReportTagsComponent implements OnInit {
//#region variable
  option:TDSSafeAny;
  chartOption = TDSChartOptions();
  tableData:Array<TDSSafeAny> = [];
  emptyData = false;

  selectList = [
    { id:1, name:'App Quản Lí Bán Hàng TPos 1' },
    { id:2, name:'App Quản Lí Bán Hàng TPos 2' },
    { id:3, name:'App Quản Lí Bán Hàng TPos 3' },
  ];
  selectedItem = this.selectList[0].name;
  rangeDate = null;
  //#endregion

  constructor() { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.tableData = [
      {
        id:1,
        labelName:'Bom hàng',
        value:100,
        percent:'20%',
        color:'#EB3B5B',
        filter:'Tháng trước',
        data:[
          {
            id:1,
            name:'06/06/2021',
            value:2
          },
          {
            id:2,
            name:'07/06/2021',
            value:2
          },
          {
            id:3,
            name:'08/06/2021',
            value:3
          },
          {
            id:4,
            name:'09/06/2021',
            value:5
          },
          {
            id:5,
            name:'10/06/2021',
            value:2
          },
          {
            id:6,
            name:'11/06/2021',
            value:6
          },
          {
            id:7,
            name:'12/06/2021',
            value:4
          },
        ],
        usedTime:24
      },
      {
        id:2,
        labelName:'Khách mới',
        value:100,
        percent:'20%',
        color:'#2395FF',
        filter:'Tháng trước',
        data:[
          {
            id:1,
            name:'06/06/2021',
            value:2
          },
          {
            id:2,
            name:'07/06/2021',
            value:2
          },
          {
            id:3,
            name:'08/06/2021',
            value:3
          },
          {
            id:4,
            name:'09/06/2021',
            value:5
          },
          {
            id:5,
            name:'10/06/2021',
            value:2
          },
          {
            id:6,
            name:'11/06/2021',
            value:6
          },
          {
            id:7,
            name:'12/06/2021',
            value:4
          },
        ],
        usedTime:24
      },
      {
        id:3,
        labelName:'Khách thân thiết',
        value:100,
        percent:'20%',
        color:'#28A745',
        filter:'Tháng trước',
        data:[
          {
            id:1,
            name:'06/06/2021',
            value:2
          },
          {
            id:2,
            name:'07/06/2021',
            value:2
          },
          {
            id:3,
            name:'08/06/2021',
            value:3
          },
          {
            id:4,
            name:'09/06/2021',
            value:5
          },
          {
            id:5,
            name:'10/06/2021',
            value:2
          },
          {
            id:6,
            name:'11/06/2021',
            value:6
          },
          {
            id:7,
            name:'12/06/2021',
            value:4
          },
        ],
        usedTime:24
      },
      {
        id:4,
        labelName:'Thẻ khác',
        value:100,
        percent:'20%',
        color:'#A1ACB8',
        filter:'Tháng trước',
        data:[
          {
            id:1,
            name:'06/06/2021',
            value:2
          },
          {
            id:2,
            name:'07/06/2021',
            value:2
          },
          {
            id:3,
            name:'08/06/2021',
            value:3
          },
          {
            id:4,
            name:'09/06/2021',
            value:5
          },
          {
            id:5,
            name:'10/06/2021',
            value:2
          },
          {
            id:6,
            name:'11/06/2021',
            value:6
          },
          {
            id:7,
            name:'12/06/2021',
            value:4
          },
        ],
        usedTime:24
      }
    ];

    if(this.tableData.length == 0){
      this.emptyData = true;
    }
  }

  onChangeSelect(data:TDSSafeAny){
    this.selectedItem = data;
  }

  onChangeDate(result: Date[]): void {

  }
}
