import { FormControl, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { PackOfDataEnum } from 'src/app/main-app/dto/account/account.dto';
import { PackageDTO, PackagePaymentDTO, TenantInfoDTO, TenantUsedDTO } from 'src/app/main-app/dto/tenant/tenant.dto';
import { addMonths, endOfMonth } from 'date-fns';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'extend-pack-of-data',
  templateUrl: './extend-pack-of-data.component.html'
})
export class ExtendPackOfDataComponent implements OnInit, OnChanges {

  price = 1000000;
  public contactOptions = [
    { id: 1, value: 1 },
    { id: 2, value: 2 },
    { id: 3, value: 3 },
    { id: 4, value: 4 },
    { id: 5, value: 5 },
    { id: 6, value: 6 },
    { id: 7, value: 7 },
    { id: 8, value: 8 },
    { id: 9, value: 9 },
    { id: 10, value: 10 },
    { id: 11, value: 11 },
    { id: 12, value: 12 },
  ]

  chooseMonth!: FormControl;

  @Input() tenantInfo!: TenantInfoDTO;
  @Input() tenantUsed!: TenantUsedDTO;
  @Input() currentPackage?: PackageDTO;
  @Input() userTime: TDSSafeAny;

  @Output() eventChangeTab = new EventEmitter<PackOfDataEnum>();
  @Output() eventDataPayment = new EventEmitter<PackagePaymentDTO>();

  totalAmount: number = 0;

  constructor() { }

  get getTotalAmount() {
    return this.chooseMonth.value * (parseInt(this.currentPackage?.price || '0'));
  }

  get getDateExpired() {
    if(this.tenantInfo?.Tenant?.DateExpired) {
      let addMonth = addMonths(new Date(this.tenantInfo?.Tenant?.DateExpired), this.chooseMonth.value);
      return addMonth;
    }

    return undefined;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.tenantInfo && this.tenantUsed) {
      console.log(this.tenantInfo);
      console.log(this.tenantUsed);
    }
  }

  ngOnInit(): void {
    this.chooseMonth = new FormControl(1, Validators.required);
  }

  selectMonthChange(){
  }

  clickBackPageInfoData(){
  }

  clickNextInfoDataPayment(){
  }

  onBack() {
    this.eventChangeTab.emit(PackOfDataEnum.INFO);
  }

  onNext() {
    let model = this.prepareModel();
    this.eventDataPayment.emit(model);
  }

  prepareModel() {
    let model = {} as PackagePaymentDTO;

    model.Package = this.currentPackage;
    model.TotalAmount = this.getTotalAmount;
    model.Month = this.chooseMonth.value;
    model.DateStarted = this.tenantInfo?.Tenant?.DateExpired;
    model.DateExpired = this.getDateExpired;

    return model;
  }
}
