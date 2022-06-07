import { ChangeDetectorRef } from '@angular/core';
import { ConfigDataFacade } from './../../../services/facades/config-data.facade';
import { ConfigsMenu } from './../configs.menu';
import { TDSMenuDTO } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html'
})
export class ConfigComponent implements OnInit {

  configMenuData:Array<TDSMenuDTO> = ConfigsMenu;
  loading!:boolean;

  constructor(private cd: ChangeDetectorRef,
    private configDataService: ConfigDataFacade) { }

  ngOnInit(): void {
    this.configDataService.onLoading$.subscribe(
      (res:boolean)=>{
        this.loading = res;
        this.cd.detectChanges();
      }
    )
  }
}