import { TDSMenuDTO } from 'tmt-tang-ui';
import { ReportMenu } from './../report.menu';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportComponent implements OnInit {
  //#region variable
  menuData = ReportMenu;
  currentPage = ReportMenu[0];
  //#endregion

  constructor() { }

  ngOnInit(): void {
    let item = sessionStorage.getItem('reportItem');
    if(item){
      this.currentPage = JSON.parse(item);
    }
  }

  onChangePage(page:TDSMenuDTO){
    this.currentPage = page;
    sessionStorage.setItem('reportItem',JSON.stringify(page));
  }
}
