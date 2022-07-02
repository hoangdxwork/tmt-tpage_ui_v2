import { Injectable } from "@angular/core";
import { UserInitDTO } from "src/app/lib";
import { TDSMessageService } from "tds-ui/message";
import { TDSHelperArray } from "tds-ui/shared/utility";
import { FastSaleOrder_DefaultDTOV2, OrderLineV2 } from "../dto/fastsaleorder/fastsaleorder-default.dto";
import { QuickSaleOnlineOrderModel } from "../dto/saleonlineorder/quick-saleonline-order.dto";
import { Ship_ExtrasServiceModel } from "./dto-handler/ship-extra-service.dto";

@Injectable({
  providedIn: 'root'
})

export abstract class PrepareSaleModelHandler {

  static prepareSaleModel(saleModel: FastSaleOrder_DefaultDTOV2, quickOrderModel: QuickSaleOnlineOrderModel,
    shipExtraServices: Array<Ship_ExtrasServiceModel>): any {

      if (saleModel.Carrier && (saleModel.Carrier.DeliveryType === "ViettelPost" || saleModel.Carrier.DeliveryType === "GHN" || saleModel.Carrier.DeliveryType === "TinToc" || saleModel.Carrier.DeliveryType === "FlashShip")) {
        if (saleModel.Carrier.DeliveryType === "GHN") {
            saleModel.Ship_ServiceId = saleModel.Ship_ServiceId ||saleModel.Carrier.GHN_ServiceId;
        } else if (saleModel.Carrier.DeliveryType === "ViettelPost" || saleModel.Carrier.DeliveryType === "TinToc" || saleModel.Carrier.DeliveryType === "FlashShip") {
            saleModel.Ship_ServiceId = saleModel.Ship_ServiceId || saleModel.Carrier.ViettelPost_ServiceId;
        }
      }

      saleModel.PartnerId = quickOrderModel.PartnerId;
      if (shipExtraServices) {
          saleModel.Ship_ServiceExtras = [];

          shipExtraServices.map(x => {
              if (x.IsSelected) {
                  saleModel.Ship_ServiceExtras.push({
                      Id: x.ServiceId,
                      Name: x.ServiceName,
                      Fee: (x.Fee || 0),
                      Type: x.Type,
                      ExtraMoney: x.ExtraMoney
                  });
              }
          });
      }

      // Gán id của đơn hàng
      saleModel.SaleOnlineIds = [quickOrderModel.Id];
      saleModel.OrderLines = [];

      quickOrderModel.Details.map(x => {
        let item = {
            ProductId: x.ProductId,
            ProductUOMId: x.UOMId,
            ProductUOMQty: x.Quantity,
            PriceUnit: x.Price,
            Discount: 0,
            Discount_Fixed: 0,
            Type: "fixed",
            PriceSubTotal: x.Price * x.Quantity,
            Note: x.Note
        } as OrderLineV2;

        saleModel.OrderLines.push(item);
      })

      if (saleModel.Carrier && saleModel.Carrier.DeliveryType == 'NinjaVan') {
          saleModel.Ship_ServiceId = 'Standard';
          saleModel.Ship_ServiceName = 'Tiêu chuẩn';
      }
  }

}
