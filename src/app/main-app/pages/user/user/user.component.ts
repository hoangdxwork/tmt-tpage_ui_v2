import { TDSMenuDTO } from 'tmt-tang-ui';
import { UserMenu } from './../user.menu';
import { InfoUserComponent } from './../components/info-user/info-user.component';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  menuData = UserMenu;
  currentPage = UserMenu[0];
 
  constructor() { }

  ngOnInit(): void {
    let item = sessionStorage.getItem('userItem');
    if(item){
      this.currentPage = JSON.parse(item);
    }
  }

  onChangePageUser(page:TDSMenuDTO){
    this.currentPage = page;
    sessionStorage.setItem('userItem',JSON.stringify(page));
  }
}
