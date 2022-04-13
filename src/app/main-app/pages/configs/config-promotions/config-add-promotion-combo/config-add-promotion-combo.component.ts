import { FormGroup } from '@angular/forms';
import { ConfigPromotionService } from './../config-promotion.service';
import { Component, OnInit, Output } from '@angular/core';
import { TDSSafeAny } from 'tmt-tang-ui';

@Component({
  selector: 'app-config-add-promotion-combo',
  templateUrl: './config-add-promotion-combo.component.html',
  styleUrls: ['./config-add-promotion-combo.component.scss']
})
export class ConfigAddPromotionComboComponent implements OnInit {
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
