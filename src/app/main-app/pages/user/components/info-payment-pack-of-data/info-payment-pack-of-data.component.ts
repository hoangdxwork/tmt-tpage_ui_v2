import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PackOfDataEnum } from 'src/app/main-app/dto/account/account.dto';
import { PackageDTO, PackagePaymentDTO, TenantInfoDTO, TenantUsedDTO } from 'src/app/main-app/dto/tenant/tenant.dto';
import { TDSSafeAny } from 'tmt-tang-ui';

@Component({
  selector: 'info-payment-pack-of-data',
  templateUrl: './info-payment-pack-of-data.component.html'
})
export class InfoPaymentPackOfDataComponent implements OnInit {

  isPaymentInfoData=true
  isNextPaymentQR = false

  @Input() tenantInfo!: TenantInfoDTO;
  @Input() tenantUsed!: TenantUsedDTO;
  @Input() currentPackage?: PackageDTO;
  @Input() userTime: TDSSafeAny;
  @Input() dataPayment!: PackagePaymentDTO;

  @Output() eventChangeTab = new EventEmitter<PackOfDataEnum>();

  isLoading: boolean = false;
  currentTab: PackOfDataEnum = PackOfDataEnum.INFO;

  constructor() { }

  ngOnInit(): void {
  }

  onBack() {
    this.eventChangeTab.emit(PackOfDataEnum.EXPAND);
  }

  onNext() {

  }

  clickBackPageExtendData(){
  }
  clickNextPaymentQR(){
    this.isPaymentInfoData = false
    this.isNextPaymentQR = true
  }
  clickBackPageInfoPaymentData(){

  }
}
