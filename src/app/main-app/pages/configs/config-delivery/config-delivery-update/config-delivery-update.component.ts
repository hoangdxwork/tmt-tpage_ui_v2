
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
  selector: 'config-delivery-update',
  templateUrl: './config-delivery-update.component.html'
})

export class ConfigDeliveryUpdateComponent implements OnInit {
  isLoading: boolean = false;
  submitForm!: FormGroup;
  configsProviderDataSource: Array<TDSSafeAny> = [];
  id!: number;
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    public deliveryCarrierV2Service: DeliveryCarrierV2Service,
    private message: TDSMessageService,
    private formBuilder: FormBuilder
  ) {

  }

  ngOnInit(): void {
    debugger
    this.id = this.activatedRoute.snapshot.queryParams?.id;
    this.createForm();
    this.loadDelivery();
  }

  createForm() {
    this.submitForm = this.formBuilder.group({
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

  onSetValueForm(item: DeliveryCarrierDTO) {
    this.submitForm.controls.Name.setValue(item.Name);
    this.submitForm.controls.Active.setValue(item.Active);
    this.submitForm.controls.IsPrintCustom.setValue(item.IsPrintCustom);
    this.submitForm.controls.ExtraProperties.setValue(item.ExtraProperties);
    this.submitForm.controls.Config_DefaultWeight.setValue(item.Config_DefaultWeight);
    this.submitForm.controls.GHN_PackageLength.setValue(item.GHN_PackageLength);
    this.submitForm.controls.GHN_PackageWidth.setValue(item.GHN_PackageWidth);
    this.submitForm.controls.GHN_PackageHeight.setValue(item.GHN_PackageHeight);
    this.submitForm.controls.DeliveryType.setValue(item.DeliveryType);
    this.submitForm.controls.ConfigId.setValue(item.ConfigId);
    this.submitForm.controls.Id.setValue(item.Id);
  }

  loadDelivery() {
    if (this.id) {
      this.isLoading = true;
      this.deliveryCarrierV2Service.getById(this.id)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe(res => {
          if(res){
            this.onSetValueForm(res);
            this.configsProviderDataSource = res.ExtraProperties ? JSON.parse(res.ExtraProperties) : [];
            // this.loadConfigProvider(res.ConfigId);
          }
        });
    }
  }

  onValidConfigsProvider() {
    if (this.configsProviderDataSource.find(x => x.IsRequried && !x.ConfigValue)) {
      return false;
    }
    return true
  }

  // loadConfigProvider(configId: string) {
  //   if (configId) {
  //     this.isLoading = true;
  //     this.deliveryCarrierV2Service.getInfoConfigProviderToAship(configId)
  //       .pipe(finalize(() => this.isLoading = false))
  //       .subscribe(res => {
  //         debugger
  //         if (res.Success && res.Data) {
  //           this.configsProviderDataSource = res.Data.Configs ?? []
  //         } else {
  //           this.message.error(res.Error?.Message);
  //         }
  //       });
  //   }
  // }

  onSubmit() {
    this.isLoading = true;
    this.submitForm.controls.ExtraProperties.setValue(JSON.stringify(this.configsProviderDataSource));
    var dataModel = this.submitForm.value;
    this.deliveryCarrierV2Service.update(dataModel)
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
