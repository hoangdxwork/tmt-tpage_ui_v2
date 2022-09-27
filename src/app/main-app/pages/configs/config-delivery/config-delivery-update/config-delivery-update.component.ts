
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DeliveryCarrierV2Service } from 'src/app/main-app/services/delivery-carrier-v2.service';
import { TDSMessageService } from 'tds-ui/message';
import { finalize } from 'rxjs';
import { DeliveryCarrierDTO } from 'src/app/main-app/dto/carrier/delivery-carrier.dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AshipGetInfoConfigProviderDto } from 'src/app/main-app/dto/carrierV2/aship-info-config-provider-data.dto';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'config-delivery-update',
  templateUrl: './config-delivery-update.component.html',
  host: {
    class: 'w-full h-full flex'
  }
})

export class ConfigDeliveryUpdateComponent implements OnInit {

  _form!: FormGroup;
  isLoading: boolean = false;
  lstExtraProperties: Array<AshipGetInfoConfigProviderDto> = [];
  dataModel!: DeliveryCarrierDTO;
  id!: number;

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

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    public deliveryCarrierV2Service: DeliveryCarrierV2Service,
    private message: TDSMessageService,
    private fb: FormBuilder) {
      this.createForm();
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.queryParams?.id;
    this.loadDelivery();
  }

  createForm() {
    this._form = this.fb.group({
      Name: [null, Validators.required],
      Active: [null],
      IsPrintCustom: [null],
      InsuranceFee: [0],
      IsInsuranceEqualTotalAmount:[false],
      ExtraProperties: [null],
      Config_DefaultFee: [0],
      Config_DefaultWeight: [null, Validators.required],
      GHN_PackageLength: [null, Validators.required],
      GHN_PackageWidth: [null, Validators.required],
      GHN_PackageHeight: [null, Validators.required],
      DeliveryType: [null],
      ConfigId: [null],
      Id: [null],
    });
  }

  updateForm(item: DeliveryCarrierDTO) {
    this._form.controls.Name.setValue(item.Name);
    this._form.controls.Active.setValue(item.Active);
    this._form.controls.InsuranceFee.setValue(item.Extras?.InsuranceFee);
    this._form.controls.IsInsuranceEqualTotalAmount.setValue(item.Extras?.IsInsuranceEqualTotalAmount);
    this._form.controls.IsPrintCustom.setValue(item.IsPrintCustom);
    this._form.controls.ExtraProperties.setValue(item.ExtraProperties);
    this._form.controls.Config_DefaultFee.setValue(item.Config_DefaultFee);
    this._form.controls.Config_DefaultWeight.setValue(item.Config_DefaultWeight);
    this._form.controls.GHN_PackageLength.setValue(item.GHN_PackageLength);
    this._form.controls.GHN_PackageWidth.setValue(item.GHN_PackageWidth);
    this._form.controls.GHN_PackageHeight.setValue(item.GHN_PackageHeight);
    this._form.controls.DeliveryType.setValue(item.DeliveryType);
    this._form.controls.ConfigId.setValue(item.ConfigId);
    this._form.controls.Id.setValue(item.Id);
  }

  loadDelivery() {
    if (this.id) {
      this.isLoading = true;

      this.deliveryCarrierV2Service.getById(this.id).pipe(finalize(() => this.isLoading = false)).subscribe(res => {
          if(res){
            this.dataModel = {...res};
            this.lstExtraProperties = res.ExtraProperties ? JSON.parse(res.ExtraProperties) : [];
            this.updateForm(res);
          }
        });
    }
  }

  prepareModel(){
    let formValue = this._form.value;

    this.dataModel.Name = formValue.Name;
    this.dataModel.Active = formValue.Active;
    this.dataModel.IsPrintCustom = formValue.IsPrintCustom;
    this.dataModel.ExtraProperties = formValue.ExtraProperties;
    this.dataModel.Config_DefaultFee = formValue.Config_DefaultFee;
    this.dataModel.Config_DefaultWeight = formValue.Config_DefaultWeight;
    this.dataModel.GHN_PackageLength = formValue.GHN_PackageLength;
    this.dataModel.GHN_PackageWidth = formValue.GHN_PackageWidth;
    this.dataModel.GHN_PackageHeight = formValue.GHN_PackageHeight;
    this.dataModel.DeliveryType = formValue.DeliveryType;
    this.dataModel.ConfigId = formValue.ConfigId;
    this.dataModel.Id = formValue.Id;

    if(this._form.controls.InsuranceFee){
      this.dataModel.Extras.InsuranceFee = formValue.InsuranceFee;
    }

    if(this._form.controls.IsInsuranceEqualTotalAmount){
      this.dataModel.Extras.IsInsuranceEqualTotalAmount = formValue.IsInsuranceEqualTotalAmount;
    }

    return this.dataModel;
  }

  onSubmit(): any {

    if(!TDSHelperString.hasValueString(this._form.controls['Name'].value)) {
        this.message.error('Vui lòng nhập tên đối tác');
    }
    if(this.checkEmpty() == 1) {
      return;
    }

    this.isLoading = true;
    this._form.controls.ExtraProperties.setValue(JSON.stringify(this.lstExtraProperties));
    let data = this.prepareModel();

    this.deliveryCarrierV2Service.update(data).pipe().subscribe({
      next:res => {
        if (res && !res.Error) {
          this.isLoading = false;
          this.message.success('Thao tác thành công');
        } else {
          this.isLoading = false;
          this.message.error(res.Error?.Message);
        }
      },
      error:(err) => {
        this.isLoading = false;
        this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
      }
    });
  }

  checkEmpty(): number {
    let ob = 0;
    this.lstExtraProperties.map((x: AshipGetInfoConfigProviderDto) => {
      if(x.IsRequried && !x.ConfigValue) {
          this.message.error(`Vui lòng nhập ${x.DisplayName}` );
          ob = 1;
          return;
      }
    })

    return ob;
  }

}
