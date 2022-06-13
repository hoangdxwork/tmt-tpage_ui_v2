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
  reportMenuData = ReportMenu;
  //#endregion

  constructor() { }

  ngOnInit(): void {
  }
}
