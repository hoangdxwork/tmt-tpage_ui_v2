import { formatNumber } from "@angular/common";
import { EventEmitter, Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Observable } from "rxjs";
import { TAPIDTO, TApiMethodType, TAuthService, TCommonService, UserInitDTO } from "src/app/lib";
import { TDSMessageService } from "tds-ui/message";
import { TDSSafeAny } from "tds-ui/shared/utility";
import { BaseSevice } from "../base.service";
import { CommonService } from "../common.service";
import { GeneralConfigsFacade } from "../facades/general-config.facade";
import { FastSaleOrderService } from "../fast-sale-order.service";
import { CarrierHandler } from "./carier.handler";
import { CheckFormHandler } from "./check-form.handler";

@Injectable({
  providedIn: 'root'
})
export class SaleHandler extends BaseSevice {
  protected prefix: string = "";
  protected table: string = "";
  protected baseRestApi: string = "";

  userInit!: UserInitDTO;
  companyId: TDSSafeAny;
  saleConfig: TDSSafeAny;

  constructor(
    private apiService: TCommonService,
    private auth: TAuthService,
    private message: TDSMessageService,
    private carrierHandler: CarrierHandler,
    private checkFormHandler: CheckFormHandler,
    private fastSaleOrderService: FastSaleOrderService,
    private generalConfigsFacade: GeneralConfigsFacade
  ) {
    super(apiService);
    this.initialize();
  }

  initialize() {
    this.generalConfigsFacade.getSaleConfigs().subscribe(res => {
      this.saleConfig = res?.SaleSetting;
    });
  }

  updateTotalAmount(orderForm: FormGroup) {
    let formValue = orderForm.value;

    let formDetail = formValue.Details;
    let discount = formValue.Discount;

    let total = 0;
    let totalQty = 0;
    let amountTax = 0;
    let decreaseAmount = formValue.DecreaseAmount;

    formDetail.forEach((product: TDSSafeAny) => {
      total += product.Quantity * product.Price;
      totalQty += product.Quantity;
    });

    let discountAmount = Math.round(total * (discount / 100));
    let totalAmount = total;
    let amountUntaxed = total - discountAmount - decreaseAmount;

    orderForm.controls.DiscountAmount.setValue(discountAmount);
    orderForm.controls.TotalAmount.setValue(totalAmount);
    orderForm.controls.AmountUntaxed.setValue(amountUntaxed);

    if(formValue.Tax && formValue.Tax.Id) {
      amountTax = Math.round(
        amountUntaxed * (formValue.Tax.Amount / 100)
      );
    }

    orderForm.controls.AmountTax.setValue(amountTax);
    let totalAmountBill = amountUntaxed + amountTax;
    orderForm.controls.TotalAmountBill.setValue(amountUntaxed + amountTax);
    orderForm.controls.TotalQuantity.setValue(totalQty);

    if (this.saleConfig?.GroupAmountPaid !== true) {
      orderForm.controls.PaymentAmount.setValue(totalAmountBill);
    }
    else {
      orderForm.controls.PaymentAmount.setValue(0);
    }
  }

}
