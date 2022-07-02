import { Injectable } from "@angular/core";
import { FastSaleOrder_DefaultDTOV2 } from "../dto/fastsaleorder/fastsaleorder-default.dto";
import { Ship_ExtrasServiceModel } from "./dto-handler/ship-extra-service.dto";

@Injectable({
  providedIn: 'root'
})

export abstract class InitOkieLaHandler {

  static initOkieLa(saleModel: FastSaleOrder_DefaultDTOV2, shipExtraServices: Array<Ship_ExtrasServiceModel>) {

    !shipExtraServices && (shipExtraServices = []);
    if (saleModel.Carrier && saleModel.Carrier.DeliveryType === 'OkieLa' && shipExtraServices.length === 0) {
      shipExtraServices = [
          {
            ServiceId: "is_fragile",
            ServiceName: "Hàng dễ vỡ?",
            Fee: null,
            TotalFee: null,
            IsSelected: null,
            Type: null,
            ExtraMoney: null,
          },
          {
            ServiceId: "check_before_accept",
            ServiceName: "Cho khách xem hàng?",
            Fee: null,
            TotalFee: null,
            IsSelected: null,
            Type: null,
            ExtraMoney: null,
          }
      ];
    }
  }
}
