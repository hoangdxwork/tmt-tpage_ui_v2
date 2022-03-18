import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  //#region variable
  showData = true;

  filterList= [
    {id:1, name:'Tuần này'},
    {id:2, name:'Tháng này'}
  ]
  currentFilter = this.filterList[0].name;

  labelData:{name:string,value:number}[]= [];
  //#endregion

  constructor() { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.labelData = [
      {
        name:'Tương tác',
        value:2500
      },
      {
        name:'Khách hàng',
        value:2500
      },
      {
        name:'Phiếu bán hàng',
        value:5
      },
      {
        name:'Đơn hàng',
        value:200
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
