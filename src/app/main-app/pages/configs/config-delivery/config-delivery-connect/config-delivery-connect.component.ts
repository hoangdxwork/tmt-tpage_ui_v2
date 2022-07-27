
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DeliveryCarrierV2Service } from 'src/app/main-app/services/delivery-carrier-v2.service';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { DeliveryDataResponseDto, GetDeliveryResponseDto } from 'src/app/main-app/dto/carrierV2/get-delivery.dto';
import { DeliveryResponseDto } from 'src/app/main-app/dto/carrierV2/delivery-carrier-response.dto';
import { TDSMessageService } from 'tds-ui/message';
import { finalize } from 'rxjs';
import { DeliveryCarrierDTO } from 'src/app/main-app/dto/carrier/delivery-carrier.dto';
import { isBuffer } from 'lodash';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'config-delivery-connect',
  templateUrl: './config-delivery-connect.component.html'
})

export class ConfigDeliveryConnectComponent implements OnInit {
  isLoading: boolean = false;
  submitForm!: FormGroup;
  providerType!: string;
  configsProviderDataSource: Array<TDSSafeAny> = [];

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    public deliveryCarrierV2Service: DeliveryCarrierV2Service,
    private message: TDSMessageService,
    private formBuilder: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.providerType = this.activatedRoute.snapshot.queryParams?.type;
    this.createForm();
    this.loadConfigProvider();
  }

  createForm() {
    this.submitForm = this.formBuilder.group({
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

  onValidConfigsProvider() {
    if (this.configsProviderDataSource.find(x => x.IsRequried && !x.ConfigValue)) {
      return false;
    }
    return true
  }

  loadConfigProvider() {
    if (this.providerType) {
      this.isLoading = true;
      this.deliveryCarrierV2Service.getConfigProviderToAship(this.providerType)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe(res => {
          debugger
          if (res.Success && res.Data) {
            this.configsProviderDataSource = res.Data.Configs ?? []
          } else {
            this.message.error(res.Error?.Message);
          }
        });
    }
  }

  onSubmit() {
    this.submitForm.controls.ExtraProperties.setValue(JSON.stringify(this.configsProviderDataSource));
    var dataModel = this.submitForm.value;
    this.isLoading = true;
    this.deliveryCarrierV2Service.create(dataModel)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        debugger
        if (res && !res.Error) {
          this.redirectList();
        } else {
          this.message.error(res.Error?.Message);
        }
      });
  }

  onValidForm() {
    if (!this.submitForm?.valid || !this.onValidConfigsProvider())
      return true;
    return false;
  }

  redirectList() {
    this.router.navigate(['configs/delivery']);
  }
}
