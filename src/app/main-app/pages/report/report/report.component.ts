import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  //#region variable
  currentPage = { id:1, name:'Hội thoại' };
  PageList = [
    { id:1, name:'Hội thoại' },
    { id:2, name:'Bài viết' },
    { id:3, name:'Bán hàng' },
    { id:4, name:'Trang Facebook' },
    { id:5, name:'Nhân viên' },
    { id:6, name:'Nhãn hội thoại' },
  ]
  //#endregion

  constructor() { }

  ngOnInit(): void {
  }

  onChangePage(page:number){
    this.currentPage = this.PageList[page-1];
  }
}
