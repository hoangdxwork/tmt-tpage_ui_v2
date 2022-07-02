import { ConfigsMenu } from './../configs.menu';
import { Component, OnInit } from '@angular/core';
import { TDSMenuDTO } from 'tds-ui/menu';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html'
})
export class ConfigComponent implements OnInit {

  configMenuData:Array<TDSMenuDTO> = ConfigsMenu;

  constructor() { }

  ngOnInit(): void { }
}
