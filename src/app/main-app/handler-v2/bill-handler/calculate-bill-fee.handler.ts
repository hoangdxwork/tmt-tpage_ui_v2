import { SaleSettingsDTO } from './../../dto/setting/setting-sale-online.dto';
import { TDSHelperArray } from 'tds-ui/shared/utility';
import { OrderLineV2 } from '../../dto/fastsaleorder/fastsaleorder-default.dto';
import { FormGroup} from '@angular/forms';
import { Injectable } from "@angular/core";
import { SaleSetting_V2 } from '@app/dto/setting/sale-setting-config.dto';

@Injectable()

export class CalculateBillFeeHandler {

  public fs_calcTotal(_form: FormGroup, roleConfigs: SaleSetting_V2 | any) {

    let totalQty = 0;
    let totalPrice = 0;

    let datas = _form.controls['OrderLines'].value as Array<OrderLineV2>;

    datas.forEach((x: OrderLineV2) => {
        x.Discount = x.Discount ? x.Discount : 0;

        //TODO: check config giảm giá mỗi dòng
        if(roleConfigs && !roleConfigs.GroupDiscountPerSOLine) {
            x.Discount = 0;
            x.Discount_Fixed = 0;
        }

        x.PriceTotal = (x.PriceUnit * (1 - (x.Discount || 0) / 100) - (x.Discount_Fixed || 0)) * x.ProductUOMQty;
        x.WeightTotal = Math.round(x.ProductUOMQty * x.Weight * 1000) / 1000;

        //TODO: tổng số lượng và tổng tiền tạm tính
        totalQty = totalQty + x.ProductUOMQty;
        totalPrice = totalPrice + x.PriceTotal;
    });

    //TODO: Tính giá trị tổng bao gồm ShipWeight,WeightTotal,DiscountAmount,AmountUntaxed,PaymentAmount,TotalQuantity,AmoutTotal
    this.updateTotalSummary(_form,datas,totalPrice,roleConfigs);
    this.updateQuantitySummary(_form,datas);
    //TODO: update lại Giao hàng thu tiền
    this.fs_coDAmount(_form);

    //TODO: tổng số lượng và tổng tiền tạm tính
    let result = {
      totalQtyLines: totalQty,
      totalAmountLines: totalPrice
    }

    return {...result};
  }

  public updateTotalSummary(_form:FormGroup, datas: OrderLineV2[], totalAmountLines:number, roleConfigs: any) {

    let total = 0;
    let weightTotal = 0;

    if (TDSHelperArray.hasListValue(datas)) {
      datas.forEach((x: OrderLineV2) => {
        total += x.PriceTotal;
        weightTotal += x.WeightTotal;
      });
    }

    //TODO: Gán lại khối lượng ship
    _form.controls['WeightTotal'].setValue(weightTotal);
    if (weightTotal > 0) {
      _form.controls['ShipWeight'].setValue(weightTotal * 1000);
    }

    //TODO: Gán lại tiền giảm DiscountAmount
    totalAmountLines = total;
    let discountAmount = Math.round(totalAmountLines * (_form.controls['Discount'].value / 100));
    _form.controls['DiscountAmount'].setValue(discountAmount);

    total = total - _form.controls['DiscountAmount'].value - _form.controls['DecreaseAmount'].value;
    _form.controls['AmountUntaxed'].setValue(total);

    //TODO: Tính thuế để gán lại tổng tiền AmountTotal
    this.calcTax(_form);

    //TODO: Gán lại số tiền trả PaymentAmount;
    let amountDepositSale = _form.controls['SaleOrder'].value ? _form.controls['SaleOrder'].value.AmountDeposit : 0;
    let paymentAmount = amountDepositSale ? (_form.controls['AmountTotal'].value - amountDepositSale) : _form.controls['AmountTotal'].value;

    if (!roleConfigs?.GroupAmountPaid) {
      _form.controls['PaymentAmount'].setValue(paymentAmount);
    }

    return total;
  }

  public calcTax(_form:FormGroup) {
    _form.controls['AmountTax'].setValue(0);

    if (_form.controls['Tax'].value) {
      let amountTax = Math.round(_form.controls['AmountUntaxed'].value * ((_form.controls['Tax'].value.Amount) / 100));
      _form.controls['AmountTax'].setValue(amountTax);
    }

    let amountTotal = Math.round(_form.controls['AmountUntaxed'].value + _form.controls['AmountTax'].value);
    _form.controls['AmountTotal'].setValue(amountTotal);
  }

  public updateQuantitySummary(_form:FormGroup, datas: OrderLineV2[]) {
    let total = 0;
    datas.forEach((x: OrderLineV2) => {
      if (!x.PromotionProgramId) {
        total += x.ProductUOMQty;
      }
    });

    _form.controls['TotalQuantity'].setValue(total);
  }

  public fs_coDAmount(_form: FormGroup) {
    let formModel = _form.value;
    let coDAmount = (formModel.AmountTotal + formModel.DeliveryPrice) - formModel.AmountDeposit;

    if(coDAmount >= 0){
      _form.controls['CashOnDelivery'].setValue(coDAmount);
    }
  }
}
