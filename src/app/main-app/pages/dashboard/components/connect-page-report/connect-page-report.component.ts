import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-connect-page-report',
  templateUrl: './connect-page-report.component.html'
})
export class ConnectPageReportComponent implements OnInit {
  //#region variable
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
        name:'Tài khoản kết nối',
        value:100,
        percent:'60%',
        color:'primary-1'
      },
      {
        name:'Số Page kết nối',
        value:100,
        percent:'60%',
        color:'blue-500'
      },
      {
        name:'Số Page gia hạn',
        value:100,
        percent:'60%',
        color:'warning-400'
      },
      {
        name:'Số Page hết hạn',
        value:100,
        percent:'60%',
        color:'error-400'
      }
    ]

    if(this.labelData.length == 0){
      this.showData = false;
    }
  }

  onChangeFilter(data:any){
    this.currentFilter = data;
  }
}
