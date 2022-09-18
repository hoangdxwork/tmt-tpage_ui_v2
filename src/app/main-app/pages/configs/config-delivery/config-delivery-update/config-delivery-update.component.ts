
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
  data: Array<AshipGetInfoConfigProviderDto> = [];
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
      ExtraProperties: [null],
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
    this._form.controls.IsPrintCustom.setValue(item.IsPrintCustom);
    this._form.controls.ExtraProperties.setValue(item.ExtraProperties);
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

      this.deliveryCarrierV2Service.getById(this.id)
        .pipe(finalize(() => this.isLoading = false)).subscribe(res => {
          if(res){

            this.data = res.ExtraProperties ? JSON.parse(res.ExtraProperties) : [];
            this.updateForm(res);
          }
        });
    }
  }

  onSubmit(): any {

    if(!TDSHelperString.hasValueString(this._form.controls['Name'].value)) {
        this.message.error('Vui lòng nhập tên đối tác')
    }
    if(this.checkEmpty() == 1) {
      return;
    }

    this.isLoading = true;
    this._form.controls.ExtraProperties.setValue(JSON.stringify(this.data));
    let dataModel = this._form.value;

    this.deliveryCarrierV2Service.update(dataModel)
      .pipe(finalize(() => this.isLoading = false)).subscribe(res => {

        if (res && !res.Error) {
            this.message.success('Thao tác thành công')
        } else {
            this.message.error(res.Error?.Message);
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

}
