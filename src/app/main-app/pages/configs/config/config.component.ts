import { ConfigsMenu } from './../configs.menu';
import { TDSMenuDTO } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
  configMenuData:Array<TDSMenuDTO> = ConfigsMenu;
  constructor() { }

  ngOnInit(): void {
  }

}
