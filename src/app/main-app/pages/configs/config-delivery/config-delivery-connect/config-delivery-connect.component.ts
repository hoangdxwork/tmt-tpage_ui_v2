
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DeliveryCarrierV2Service } from 'src/app/main-app/services/delivery-carrier-v2.service';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSMessageService } from 'tds-ui/message';
import { finalize } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AshipGetInfoConfigProviderDto } from 'src/app/main-app/dto/carrierV2/aship-info-config-provider-data.dto';

@Component({
  selector: 'config-delivery-connect',
  templateUrl: './config-delivery-connect.component.html',
  host: {
    class: 'w-full h-full flex'
  }
})

export class ConfigDeliveryConnectComponent implements OnInit {

  _form!: FormGroup;
  isLoading: boolean = false;
  providerType!: string;
  data: Array<AshipGetInfoConfigProviderDto> = [];

  constructor(private router: Router,
    private message: TDSMessageService,
    private activatedRoute: ActivatedRoute,
    public deliveryCarrierV2Service: DeliveryCarrierV2Service,
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
        IsPrintCustom: [false],
        ExtraProperties: [null],
        Config_DefaultWeight: [100, Validators.required],
        GHN_PackageLength: [10, Validators.required],
        GHN_PackageWidth: [10, Validators.required],
        GHN_PackageHeight: [10, Validators.required],
        DeliveryType: [this.providerType, Validators.required]
    });
  }

  loadConfigProvider() {
    if (this.providerType) {
      this.isLoading = true;

      this.deliveryCarrierV2Service.getConfigProviderToAship(this.providerType)
        .pipe(finalize(() => this.isLoading = false)).subscribe(res => {

          if (res.Success && res.Data) {
            this.data = res.Data.Configs ?? []
          } else {
            this.message.error(res.Error?.Message);
          }
        });
    }
  }

  onSubmit() {
    if(!TDSHelperString.hasValueString(this._form.controls['Name'].value)) {
        this.message.error('Vui lòng nhập tên đối tác')
    }
    if(this.checkEmpty() == 1) {
      return;
    }

    this._form.controls['ExtraProperties'].setValue(JSON.stringify(this.data));
    let dataModel = this._form.value;

    this.isLoading = true;
    this.deliveryCarrierV2Service.create(dataModel)
      .pipe(finalize(() => this.isLoading = false)).subscribe(res => {

        if (res && !res.Error) {
          this.redirectList();
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

  redirectList() {
    this.router.navigate(['configs/delivery']);
  }
}
