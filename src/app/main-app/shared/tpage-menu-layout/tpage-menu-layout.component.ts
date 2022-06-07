import { TDSMenuDTO } from 'tmt-tang-ui';
import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'tpage-menu-layout',
  templateUrl: './tpage-menu-layout.component.html'
})
export class TpageMenuLayoutComponent implements OnInit {
  //#region variable
  @Input() menuData!:Array<TDSMenuDTO>;
  @Input() active:boolean = false;
  @Input() disableCollapse:boolean = false;
  @Input() loading!:boolean;
  //#endregion

  constructor() { }

  ngOnInit(): void {
  }
}
