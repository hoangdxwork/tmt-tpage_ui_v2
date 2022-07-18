import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AutoInteractionDTO } from 'src/app/main-app/dto/configs/general-config.dto';
import { TDSMessageService } from 'tds-ui/message';
import { Subject, takeUntil, finalize } from 'rxjs';
import { GeneralConfigService } from 'src/app/main-app/services/general-config.service';
import { ConfigFacebookCartDTO } from 'src/app/main-app/dto/configs/facebook-cart/config-facebook-cart.dto';

@Component({
  selector: 'facebook-cart',
  templateUrl: './facebook-cart.component.html'
})

export class FacebookCartComponent implements OnInit, OnDestroy {

  _form!: FormGroup;
  private destroy$ = new Subject<void>();
  isLoading: boolean = false;
  dataModel!: ConfigFacebookCartDTO;

  constructor(private fb: FormBuilder,
    private generalConfigService: GeneralConfigService,
    private message: TDSMessageService) {
      this.createForm();
  }

  createForm() {
    this._form = this.fb.group({
      IsUpdatePartnerInfo: [false],
      IsCheckout: [false],
      IsUpdateQuantity: [false],
      IsBuyMore: [false],
      IsCancelCheckout: [false]
    })
  }

  updateForm(data: AutoInteractionDTO) {
    this._form.patchValue(data);
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    let name = "ConfigCart";
    this.isLoading  = true;

    this.generalConfigService.getByName(name)
      .pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false))
      .subscribe((res: any) => {

          this.dataModel = res;
          this.updateForm(res);

    }, error => {
        this.message.error(error?.error?.message || 'Đã xảy ra lỗi')
    })
  }

  changeIsCheckout(event: any) {
    if(event == false) {
      this._form.controls['IsUpdateQuantity'].setValue(false)
      this._form.controls['IsBuyMore'].setValue(false)
    }
  }

  changeIsUpdateQuantity(event: any) {
    if(event == false) {
      this._form.controls['IsBuyMore'].setValue(false)
    }
  }

  onSave(){
    let name = "ConfigCart";
    let model = this.prepareModel();
    this.isLoading = true;

    this.generalConfigService.update(name, model).pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false)).subscribe((res) => {
        this.message.success('Thao tác thành công');
    }, error => {
        this.message.error(error?.error?.message || 'Đã xảy ra lỗi')
    })
  }

  prepareModel() {
    let formModel = this._form.value;
    let model = {
        IsUpdatePartnerInfo: formModel.IsUpdatePartnerInfo as boolean,
        IsCheckout: formModel.IsCheckout as boolean,
        IsUpdateQuantity: formModel.IsUpdateQuantity as boolean,
        IsBuyMore: formModel.IsBuyMore as boolean,
        IsCancelCheckout: formModel.IsCancelCheckout as boolean,
    } as ConfigFacebookCartDTO

    return model;
  }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }

}
