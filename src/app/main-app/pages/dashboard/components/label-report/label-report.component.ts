import { vi_VN } from 'tmt-tang-ui';
import { formatPercent } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-label-report',
  templateUrl: './label-report.component.html',
  styleUrls: ['./label-report.component.scss']
})
export class LabelReportComponent implements OnInit {
  //#region  variable
  showData = true;
  
  filterList= [
    {id:1, name:'Tuần này'},
    {id:2, name:'Tháng này'}
  ]
  currentFilter = this.filterList[0].name;

  labelData:{name:string,value:number,color:string,percent:string}[] = [];
  //#endregion
  constructor() { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.labelData = [
      {
        name:'Đã giao hàng',
        value:230,
        percent:'25%',
        color:'primary-1'
      },
      {
        name:'Bom hàng',
        value:230,
        percent:'25%',
        color:'error-400'
      },
      {
        name:'Hết hàng',
        value:230,
        percent:'25%',
        color:'warning-400'
      },
      {
        name:'Thẻ khác',
        value:230,
        percent:'25%',
        color:'neutral-1-300'
      },
      {
        name:'Thẻ khác',
        value:230,
        percent:'25%',
        color:'neutral-1-300'
      },
      {
        name:'Thẻ khác',
        value:230,
        percent:'25%',
        color:'neutral-1-300'
      },
    ]

    if(this.labelData.length == 0){
      this.showData = false;
    }
  }

  onChangeFilter(data:any){
    this.currentFilter = data;
  }
}
