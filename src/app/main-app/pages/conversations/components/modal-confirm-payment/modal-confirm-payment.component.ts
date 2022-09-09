import { TDSSafeAny, TDSHelperString } from 'tds-ui/shared/utility';
import { TDSMessageService } from 'tds-ui/message';
import { FastSaleOrder_DefaultDTOV2 } from './../../../../dto/fastsaleorder/fastsaleorder-default.dto';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { paymentMethodDTO } from './../../../../dto/conversation-bill/conversation-bill.dto';
import { CommonService } from './../../../../services/common.service';
import { Component, Input, OnInit } from '@angular/core';
import { TDSModalRef } from 'tds-ui/modal';

@Component({
  selector: 'app-modal-confirm-payment',
  templateUrl: './modal-confirm-payment.component.html'
})
export class ModalConfirmPaymentComponent implements OnInit {
  @Input() data!: FastSaleOrder_DefaultDTOV2;

  paymentMethodOptions!: paymentMethodDTO[];
  _form!: FormGroup;

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

  constructor(
    private modal: TDSModalRef,
    private fb: FormBuilder,
    private commonService: CommonService,
    private message: TDSMessageService
  ) { 
    this.createForm();
  }

  ngOnInit(): void {
    this.updateForm();
    
    this.commonService.shopPaymentProviders$.subscribe(res=>{
      this.paymentMethodOptions = res;
    });
  }

  createForm() {
    this._form = this.fb.group({
      PaymentMethod: [null, [Validators.required]],
      CashOnDelivery: [null, Validators.required],
    });
  }

  updateForm(){
    this._form.controls.PaymentMethod.setValue("zalopay");
    this._form.controls.CashOnDelivery.setValue(this.data.CashOnDelivery);
  }

  prepareModel(): any {
    var model = this.data;
    var payment = this.paymentMethodOptions.filter(x => x.Value == this._form.value.PaymentMethod);
    model.PaymentMethod = payment[0] ? payment[0].Value : "";
    model.CashOnDelivery = this._form.value.CashOnDelivery;
    model.AmountTotal = Number(model.CashOnDelivery) + Number(model.DiscountAmount) + Number(model.DeliveryPrice);

    return model;
  }

  cancel(){
    this.modal.destroy(null)
  }

  onSave() {
    if(this._form.controls.PaymentMethod.invalid){
      this.message.warning('Vui lòng chọn Phương thức thanh toán');
      return
    }
    if(this._form.controls.CashOnDelivery.invalid){
      this.message.warning('Vui lòng nhập số tiền thanh toán');
      return
    }
    var model = this.prepareModel();
    this.message.success('Cập nhật phương thức thanh toán thành công.');
    this.modal.destroy(model);
  }

}
