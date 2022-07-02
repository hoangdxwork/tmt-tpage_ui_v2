import { Injectable } from "@angular/core";
import { FastSaleOrder_DefaultDTOV2 } from "../dto/fastsaleorder/fastsaleorder-default.dto";
import { Ship_ExtrasServiceModel } from "./dto-handler/ship-extra-service.dto";

@Injectable({
  providedIn: 'root'
})

export abstract class InitServiceHandler {

  static initService(saleModel: FastSaleOrder_DefaultDTOV2, shipExtraServices: Array<Ship_ExtrasServiceModel>, shipServices: any[]) {
    !shipExtraServices && (shipExtraServices = []);

    if (saleModel.Carrier && saleModel.Carrier.DeliveryType === 'ZTO') {
      shipServices = [
          {
            ServiceId: "0",
            ServiceName: "Express",
          },
          {
            ServiceId: "1",
            ServiceName: "Ordinary Express"
          }
      ];

      saleModel.Ship_ServiceId = saleModel.Carrier.Config_TransportId;
    }
  }
}
