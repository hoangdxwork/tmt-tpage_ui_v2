import { Router } from '@angular/router';
import { TDSSafeAny } from 'tmt-tang-ui';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-config-decentralize-page',
  templateUrl: './config-decentralize-page.component.html',
  styleUrls: ['./config-decentralize-page.component.scss']
})
export class ConfigDecentralizePageComponent implements OnInit {

  @Output() getComponent:EventEmitter<number> = new EventEmitter<number>();

  public optionsPermission = [
    { id: 1, name: 'text1' },
    { id: 2, name: 'text2' },
    { id: 3, name: 'text3' },
    { id: 4, name: 'text5' },
    { id: 5, name: 'admin' },
    { id: 6, name: 'nhân viên' },
]
  listOfDataPermission=[
    {urlImg: 'assets/images/config/avatarPermission1.png', name: 'My Team', page: [
      {namePage: 'HiHi House',permission: [1,2]},
      {namePage: `Le's Page`,permission: [1,2]},
      {namePage: 'Test Bot',permission: [1,2]},
      {namePage: 'Wiki Bot' ,permission: [1,2]},
    ]},
    {urlImg: 'assets/images/config/avatarPermission1.png', name: 'Tester', page: [
      {namePage: 'Ralph Edwards',permission: [2,3]},
      {namePage: 'Brooklyn Simmons',permission: [3,4]},
      {namePage: 'Savannah Nguyen'  ,permission: [1,2]},
    ]},
    {urlImg: 'assets/images/config/avatarPermission1.png', name: 'John Designer', page: [
      {namePage: 'Kristin Watson',permission: [5,6]},
      {namePage: 'Cody Fisher',permission: [5,6]},
    ]},
    {urlImg: 'assets/images/config/avatarPermission1.png', name: 'Hòa An Ngô', page: [
      {namePage: 'Floyd Miles',permission: [5,6]},
    ]}
  ]

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  backToMain(){
    var returnUrl = '/configs/users/operation'
    this.router.navigate([returnUrl]);
  }

  submitSave(){
    this.getComponent.emit(1);
  }

  onModelChangePermission(ev: TDSSafeAny){
    
  }
}
