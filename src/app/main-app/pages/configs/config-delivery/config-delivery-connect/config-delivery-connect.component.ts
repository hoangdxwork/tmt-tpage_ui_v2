import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSHelperArray } from 'tds-ui/shared/utility';
import { DeliveryCarrierDTO } from './../../../../dto/carrier/delivery-carrier.dto';

import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { DeliveryCarrierV2Service } from 'src/app/main-app/services/delivery-carrier-v2.service';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSMessageService } from 'tds-ui/message';
import { finalize, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AshipGetInfoConfigProviderDto } from 'src/app/main-app/dto/carrierV2/aship-info-config-provider-data.dto';

@Component({
  selector: 'config-delivery-connect',
  templateUrl: './config-delivery-connect.component.html',
  providers: [TDSDestroyService],
  host: {
    class: 'w-full h-full flex'
  }
})

export class ConfigDeliveryConnectComponent implements OnInit {

  _form!: FormGroup;
  isLoading: boolean = false;
  dataModel!: DeliveryCarrierDTO;
  providerType!: string;
  data: Array<AshipGetInfoConfigProviderDto> = [];

  constructor(private router: Router,
    private message: TDSMessageService,
    private activatedRoute: ActivatedRoute,
    private deliveryCarrierV2Service: DeliveryCarrierV2Service,
    private destroy$: TDSDestroyService,
    private fb: FormBuilder) {

    this.providerType = this.activatedRoute.snapshot.queryParams?.type;
    this.createForm();
  }

  ngOnInit(): void {
    this.loadConfigProvider();
  }

  numberWithCommas =(value:TDSSafeAny) =>{
    if(value != null)
    {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return value;
  } ;

  parserComas = (value: TDSSafeAny) =>{
    if(value != null)
    {
      return TDSHelperString.replaceAll(value,'.','');
    }
    return value;
  };

  createForm() {
    this._form = this.fb.group({
        Name: [null, Validators.required],
        Active: [true],
        Config_DefaultFee: [0],
        IsInsuranceEqualTotalAmount:[false],
        IsPrintCustom: [false],
        InsuranceFee: [0],
        ExtraProperties: [null],
        Config_DefaultWeight: [100, Validators.required],
        GHN_PackageLength: [10, Validators.required],
        GHN_PackageWidth: [10, Validators.required],
        GHN_PackageHeight: [10, Validators.required],
        DeliveryType: [this.providerType, Validators.required],
        SenderName: [null]
    });
  }

  loadConfigProvider() {
    if (this.providerType) {
      this.isLoading = true;

      this.deliveryCarrierV2Service.getConfigProviderToAship(this.providerType)
        .pipe(finalize(() => this.isLoading = false)).subscribe(res => {

          if (res.Success && res.Data) {
            this.data = res.Data.Configs || [];
          } else {
            this.message.error(res.Error?.Message);
          }
        });
    }
  }

  prepareModel() {
    let formModel = this._form.value;
    let data = {} as DeliveryCarrierDTO;

    data.Name = formModel.Name;
    data.Active = formModel.Active;
    data.Config_DefaultFee = formModel.Config_DefaultFee;
    data.IsPrintCustom = formModel.IsPrintCustom;
    data.Extras = {
      InsuranceFee: formModel.InsuranceFee,
      IsInsuranceEqualTotalAmount : formModel.IsInsuranceEqualTotalAmount,
    };
    data.ExtraProperties = JSON.stringify(this.data);
    data.Config_DefaultWeight = formModel.Config_DefaultWeight;
    data.GHN_PackageLength = formModel.GHN_PackageLength;
    data.GHN_PackageWidth = formModel.GHN_PackageWidth;
    data.GHN_PackageHeight = formModel.GHN_PackageHeight;
    data.DeliveryType =  formModel.DeliveryType;
    data.SenderName = formModel.SenderName;

    return data;
  }

  onSubmit() {
    if(!TDSHelperString.hasValueString(this._form.controls['Name'].value)) {
        this.message.error('Vui lòng nhập tên đối tác');
    }
    if(this.checkEmpty() == 1) {
      return;
    }

    let dataModel = this.prepareModel();
    this.isLoading = true;

    this.deliveryCarrierV2Service.create(dataModel).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res) => {
        if (res && !res.Error) {
          this.redirectList();
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.message.error(res.Error?.Message);
        }
      },
      error:(err) => {
        this.isLoading = false;
        this.message.error(err?.error?.message || 'Không thể kết nối tới đối tác');
      }
    });
  }

  checkEmpty(): number {
    let ob = 0;
    this.data.map((x: AshipGetInfoConfigProviderDto) => {
      if(x.IsRequried && !x.ConfigValue) {
          this.message.error(`Vui lòng nhập ${x.DisplayName}` );
          ob = 1;
          return;
      }
    })
    return ob;
  }

  redirectList() {
    this.router.navigate(['configs/delivery']);
  }
}
