import { Router } from '@angular/router';
import { TDSMenuDTO } from 'tmt-tang-ui';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tpage-menu-item',
  templateUrl: './tpage-menu-item.component.html',
  styleUrls: ['./tpage-menu-item.component.scss']
})
export class TpageMenuItemComponent implements OnInit {
  //#region variable
  @Input() menuData!:Array<TDSMenuDTO>;
  @Input() active:boolean = false;
  @Input() disableCollapse:boolean = false;
  @Input() currentItem!:TDSMenuDTO;
  currentPage!:TDSMenuDTO;
  //#endregion

  constructor(private router: Router) { }

  ngOnInit(): void {
    if(this.currentItem){
      this.currentPage = this.currentItem;
    }

    if(this.router.url === this.menuData[0].link){
      this.onChangePage(this.menuData[0]);
    }else{
      let item = sessionStorage.getItem('menuItem');
      if(item){
        this.currentPage = JSON.parse(item);
      }else{
        this.currentPage = this.menuData[0];
      }
    }
  }

  onChangePage(page:TDSMenuDTO){
    this.currentPage = page;
    sessionStorage.setItem('menuItem',JSON.stringify(page));
  }
}
