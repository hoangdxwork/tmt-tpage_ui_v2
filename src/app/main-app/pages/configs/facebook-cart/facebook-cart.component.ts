import { TDSDestroyService } from 'tds-ui/core/services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AutoInteractionDTO } from 'src/app/main-app/dto/configs/general-config.dto';
import { TDSMessageService } from 'tds-ui/message';
import { Subject, takeUntil, finalize } from 'rxjs';
import { GeneralConfigService } from 'src/app/main-app/services/general-config.service';
import { ConfigFacebookCartDTO } from 'src/app/main-app/dto/configs/facebook-cart/config-facebook-cart.dto';

@Component({
  selector: 'facebook-cart',
  templateUrl: './facebook-cart.component.html',
  host: {
    class: 'w-full h-full flex'
  }
})

export class FacebookCartComponent implements OnInit {

  _form!: FormGroup;
  isLoading: boolean = false;
  dataModel!: ConfigFacebookCartDTO;

  constructor(private fb: FormBuilder,
    private generalConfigService: GeneralConfigService,
    private message: TDSMessageService,
    private destroy$: TDSDestroyService) {
      this.createForm();
  }

  createForm() {
    this._form = this.fb.group({
      IsApplyConfig: [false],
      IsUpdatePartnerInfo: [false],
      IsCheckout: [false],
      IsUpdateQuantity: [false],
      IsBuyMore: [false],
      IsCancelCheckout: [false],
      IsUpdate: [false],
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

    this.generalConfigService.getByName(name).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: any) => {
        this.dataModel = res;
        this.updateForm(res);
        this.isLoading = false;
      }, 
      error:(err) => {
        this.isLoading = false;
          this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
      }
    })
  }

  applyConfig(event:boolean){
    if(!event){
      this._form.controls["IsUpdatePartnerInfo"].setValue(false);
      this._form.controls["IsCheckout"].setValue(false);
      this._form.controls["IsUpdateQuantity"].setValue(false);
      this._form.controls["IsBuyMore"].setValue(false);
      this._form.controls["IsCancelCheckout"].setValue(false);
      this._form.controls["IsUpdate"].setValue(false);

    }
  }

  onSave(){
    let name = "ConfigCart";
    let model = this.prepareModel();
    this.isLoading = true;

    this.generalConfigService.update(name, model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.message.success('Cập nhật cấu hình giỏ hàng thành công');
      },
      error: (error: any) => {
        this.isLoading = false;
        this.message.error(error?.error?.message || 'Đã xảy ra lỗi')
      }
    })
  }

  prepareModel() {
    let formModel = this._form.value;
    let model = {
        IsApplyConfig: formModel.IsApplyConfig as boolean,
        IsUpdatePartnerInfo: formModel.IsUpdatePartnerInfo as boolean,
        IsCheckout: formModel.IsCheckout as boolean,
        IsUpdateQuantity: formModel.IsUpdateQuantity as boolean,
        IsBuyMore: formModel.IsBuyMore as boolean,
        IsCancelCheckout: formModel.IsCancelCheckout as boolean,
        IsUpdate: formModel.IsUpdate as boolean,
    } as ConfigFacebookCartDTO

    return model;
  }
}
