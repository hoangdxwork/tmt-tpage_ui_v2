import { Injectable } from "@angular/core";
import { FastSaleOrder_DefaultDTOV2 } from "src/app/main-app/dto/fastsaleorder/fastsaleorder-default.dto";
import { Detail_QuickSaleOnlineOrder, QuickSaleOnlineOrderModel } from "src/app/main-app/dto/saleonlineorder/quick-saleonline-order.dto";
import { InitSaleDTO } from "src/app/main-app/dto/setting/setting-sale-online.dto";

@Injectable()

export class SO_ComputeCaclHandler {

  // TODO: Dùng cho đơn hàng
  public so_coDAmount(saleModel: FastSaleOrder_DefaultDTOV2): any {

    let coDAmount = saleModel.AmountTotal + saleModel.DeliveryPrice - saleModel.AmountDeposit;
    saleModel.CashOnDelivery = Number(coDAmount);

    return saleModel.CashOnDelivery;
  }

  public so_calcTax(saleModel: FastSaleOrder_DefaultDTOV2){

    saleModel.AmountTax = 0;

    if(saleModel.Tax) {
        let amountTax = Math.round(saleModel.AmountUntaxed * ((saleModel.Tax?.Amount) / 100));
        saleModel.AmountTax = amountTax;
    }

    let amountTotal = Math.round(saleModel.AmountUntaxed + saleModel.AmountTax);
    saleModel.AmountTotal = amountTotal;

    return {
      AmountTax: saleModel.AmountTax || 0,
      AmountTotal: saleModel.AmountTotal || 0
    };
  }

  public so_calcTotal(saleModel: FastSaleOrder_DefaultDTOV2 | null, quickOrderModel: QuickSaleOnlineOrderModel, saleConfig: InitSaleDTO) {
    let totalAmount = 0;
    let totalQuantity = 0;

    quickOrderModel.Details.map((x: Detail_QuickSaleOnlineOrder) => {
        totalAmount += (x.Price * x.Quantity);
        totalQuantity += (x.Quantity);
    });

    quickOrderModel.TotalAmount = totalAmount;
    quickOrderModel.TotalQuantity = totalQuantity;

    if(saleModel) {
        let discountAmount = Math.round(totalAmount * (saleModel.Discount / 100));
        saleModel.DiscountAmount = discountAmount;

        totalAmount = totalAmount - saleModel.DiscountAmount - saleModel.DecreaseAmount;
        saleModel.AmountUntaxed = totalAmount;

        //TODO: Tính thuế để gán lại tổng tiền AmountTotal
        let tax = this.so_calcTax(saleModel);
        saleModel.AmountTax = tax.AmountTax;
        saleModel.AmountTotal = tax.AmountTotal;

        if(!saleConfig?.SaleSetting?.GroupAmountPaid) {
            //TODO: Gán lại số tiền trả PaymentAmount;
            let amountDepositSale = saleModel.SaleOrder ? saleModel.SaleOrder?.AmountDeposit : 0;
            let paymentAmount = amountDepositSale ? (saleModel.AmountTotal - amountDepositSale) : saleModel.AmountTotal;

            saleModel.PaymentAmount = paymentAmount;
      }

      saleModel.TotalQuantity = totalQuantity;
    }

    return {
        saleModel: saleModel || null,
        quickOrderModel: quickOrderModel
    };
  }

}
