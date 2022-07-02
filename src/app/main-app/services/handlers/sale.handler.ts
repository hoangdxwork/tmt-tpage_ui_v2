import { ConversationOrderProductDefaultDTO } from 'src/app/main-app/dto/coversation-order/conversation-order.dto';
import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { TCommonService, UserInitDTO } from "src/app/lib";
import { TDSSafeAny } from "tds-ui/shared/utility";
import { BaseSevice } from "../base.service";
import { GeneralConfigsFacade } from "../facades/general-config.facade";

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

  constructor(private apiService: TCommonService,
    private generalConfigsFacade: GeneralConfigsFacade) {
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

    formDetail.forEach((product: ConversationOrderProductDefaultDTO) => {
      total += product.Quantity * (product.Price - product.Price*(product.Discount || 0)/100);
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
