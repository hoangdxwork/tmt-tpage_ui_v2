import { Injectable } from "@angular/core";
import { FastSaleOrder_DefaultDTOV2 } from "../dto/fastsaleorder/fastsaleorder-default.dto";
import { Ship_ExtrasServiceModel } from "./dto-handler/ship-extra-service.dto";

@Injectable({
  providedIn: 'root'
})

export abstract class ValidateInsuranceFeeHandler {

  static validateInsuranceFee(saleModel: FastSaleOrder_DefaultDTOV2, shipExtraServices: Array<Ship_ExtrasServiceModel>) {
    if (!shipExtraServices) {
      shipExtraServices = [];
    }

    let exist: any = null;
    if (saleModel.Carrier?.DeliveryType === "MyVNPost") {
        exist = shipExtraServices.filter(x => x.ServiceId === "OrderAmountEvaluation")[0];
        return (exist || { IsSelected: false }).IsSelected;
    } else if (saleModel.Carrier?.DeliveryType === "GHN" || saleModel.Carrier?.DeliveryType === "GHTK") {
        exist = shipExtraServices.filter(x => x.ServiceId === "16")[0];
        return (exist || { IsSelected: false }).IsSelected;
    } else if (saleModel.Carrier?.DeliveryType === "ViettelPost") {
        exist = shipExtraServices.filter(x => x.ServiceId === "GBH")[0];
        return (exist || { IsSelected: false }).IsSelected;
    } else if (saleModel.Carrier?.DeliveryType === "Snappy") {
        exist = shipExtraServices.filter(x => x.ServiceId === "Snappy_Insurance")[0];
        return (exist || { IsSelected: false }).IsSelected;
    } else if (saleModel.Carrier?.DeliveryType === "JNT") {
        exist = shipExtraServices.filter(x => x.ServiceId === "JNT_Insurance")[0];
        return (exist || { IsSelected: false }).IsSelected;
    }

    return false;
  }

}
