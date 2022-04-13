import { FormGroup } from '@angular/forms';
import { ConfigPromotionService } from './../config-promotion.service';
import { Component, OnInit, Output } from '@angular/core';
import { TDSSafeAny } from 'tmt-tang-ui';

@Component({
  selector: 'app-config-add-promotion-group',
  templateUrl: './config-add-promotion-group.component.html',
  styleUrls: ['./config-add-promotion-group.component.scss']
})
export class ConfigAddPromotionGroupComponent implements OnInit {
  @Output() data!:FormGroup;

  companyList:Array<TDSSafeAny> = [];

  constructor(private service: ConfigPromotionService) { 
    this.data =  new FormGroup({})
    this.companyList = this.service.getCompanyList();
  }

  ngOnInit(): void {

  }

  getData(){

  }
}
