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

  ngOnInit(): void {
    this.loadData();
  }

  createForm() {
    this._form = this.fb.group({
      IsApplyConfig: [false],// Bật cho phép áp dụng cấu hình giỏ hàng - Chỉ xem

      IsUpdatePartnerInfo: [false],// Cập nhật thông tin khách hàng
      IsUpdateQuantity: [false],// Cập nhật số lượng
      IsCheckout: [false],// Cho phép thanh toán
      IsBuyMore: [false], // Cho phép mua thêm

      IsUpdate: [false],// Cho phép cập nhật giỏ hàng
      IsCancelCheckout: [false],// Cho phép hủy thanh toán (xóa đơn hàng)

      IsUpdateNote: [false],// Cập nhật ghi chú
      IsRemoveProduct: [false],//Cho phép xóa sản phẩm mua được
      IsRemoveProductInValid: [false],// Cho phép xóa sản phẩm không hợp lệ (Không mua được)
      IsDisplayInventory: [false],// Cho phép hiện tồn kho
      IsMergeOrder: [false]// Cho phép khách hàng gộp phiếu bán hàng trên giỏ hàng
    })
  }

  updateForm(data: ConfigFacebookCartDTO) {
    this._form.patchValue(data);

    if(data.IsApplyConfig == true) {
      this._form.controls["IsUpdatePartnerInfo"].disable();
      this._form.controls["IsUpdateQuantity"].disable();
      this._form.controls["IsCheckout"].disable();
      this._form.controls["IsCancelCheckout"].disable();
      this._form.controls["IsBuyMore"].disable();
      this._form.controls["IsUpdateNote"].disable();
      this._form.controls["IsRemoveProduct"].disable();
      this._form.controls["IsRemoveProductInValid"].disable();
      this._form.controls["IsDisplayInventory"].disable();
      this._form.controls["IsMergeOrder"].disable();
    }
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

  applyConfig(event: boolean){
    if(event == true) {
      this._form.controls["IsUpdatePartnerInfo"].setValue(false);
      this._form.controls["IsUpdatePartnerInfo"].disable();

      this._form.controls["IsUpdateQuantity"].setValue(false);
      this._form.controls["IsUpdateQuantity"].disable();

      this._form.controls["IsCheckout"].setValue(false);
      this._form.controls["IsCheckout"].disable();

      this._form.controls["IsCancelCheckout"].setValue(false);
      this._form.controls["IsCancelCheckout"].disable();

      this._form.controls["IsBuyMore"].setValue(false);
      this._form.controls["IsBuyMore"].disable();

      this._form.controls["IsUpdateNote"].setValue(false);
      this._form.controls["IsUpdateNote"].disable();

      this._form.controls["IsRemoveProduct"].setValue(false);
      this._form.controls["IsRemoveProduct"].disable();

      this._form.controls["IsRemoveProductInValid"].setValue(false);
      this._form.controls["IsRemoveProductInValid"].disable();

      this._form.controls["IsDisplayInventory"].setValue(false);
      this._form.controls["IsDisplayInventory"].disable();

      this._form.controls["IsMergeOrder"].setValue(false);
      this._form.controls["IsMergeOrder"].disable();

    } else {

      this._form.controls["IsUpdatePartnerInfo"].setValue(true);
      this._form.controls["IsUpdatePartnerInfo"].enable();

      this._form.controls["IsUpdateQuantity"].setValue(true);
      this._form.controls["IsUpdateQuantity"].enable();

      this._form.controls["IsCheckout"].setValue(true);
      this._form.controls["IsCheckout"].enable();

      this._form.controls["IsCancelCheckout"].setValue(true);
      this._form.controls["IsCancelCheckout"].enable();

      this._form.controls["IsBuyMore"].setValue(true);
      this._form.controls["IsBuyMore"].enable();

      this._form.controls["IsUpdateNote"].setValue(true);
      this._form.controls["IsUpdateNote"].enable();

      this._form.controls["IsRemoveProduct"].setValue(true);
      this._form.controls["IsRemoveProduct"].enable();

      this._form.controls["IsRemoveProductInValid"].setValue(true);
      this._form.controls["IsRemoveProductInValid"].enable();

      this._form.controls["IsDisplayInventory"].setValue(true);
      this._form.controls["IsDisplayInventory"].enable();

      this._form.controls["IsMergeOrder"].setValue(false);
      this._form.controls["IsMergeOrder"].enable();
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

    let exist = this._form.controls["IsUpdatePartnerInfo"].value == false
        && this._form.controls["IsCheckout"].value == false
        && this._form.controls["IsUpdateQuantity"].value == false
        && this._form.controls["IsBuyMore"].value == false

    if(exist) {
        formModel.IsUpdate = false;
    } else {
        formModel.IsUpdate = true;
    }

    let model = {
        IsApplyConfig: formModel.IsApplyConfig as boolean,

        IsUpdatePartnerInfo: formModel.IsUpdatePartnerInfo as boolean,
        IsUpdateQuantity: formModel.IsUpdateQuantity as boolean,
        IsCheckout: formModel.IsCheckout as boolean,
        IsBuyMore: formModel.IsBuyMore as boolean,

        IsCancelCheckout: formModel.IsCancelCheckout as boolean,
        IsUpdate: formModel.IsUpdate as boolean,
        IsUpdateNote: formModel.IsUpdateNote as boolean,
        IsRemoveProduct: formModel.IsRemoveProduct as boolean,
        IsRemoveProductInValid: formModel.IsRemoveProductInValid as boolean,
        IsDisplayInventory: formModel.IsDisplayInventory as boolean,
        IsMergeOrder: formModel.IsMergeOrder as boolean
    } as ConfigFacebookCartDTO

    return model;
  }
}
