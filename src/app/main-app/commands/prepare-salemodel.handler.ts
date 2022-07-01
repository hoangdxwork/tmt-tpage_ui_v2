import { Injectable } from "@angular/core";
import { UserInitDTO } from "src/app/lib";
import { FastSaleOrder_DefaultDTOV2 } from "../dto/fastsaleorder/fastsaleorder-default.dto";
import { QuickSaleOnlineOrderModel } from "../dto/saleonlineorder/quick-saleonline-order.dto";
import { Ship_ExtrasServiceModel } from "./dto-handler/ship-extra-service.dto";

@Injectable({
  providedIn: 'root'
})

export abstract class PrepareSaleModelHandler {

  static prepareSaleModel(saleModel: FastSaleOrder_DefaultDTOV2, quickOrderModel: QuickSaleOnlineOrderModel, shipExtraServices: Array<Ship_ExtrasServiceModel>,
    userInit: UserInitDTO, isEnableCreateOrder: boolean, enableInsuranceFee: boolean): any {

    if(isEnableCreateOrder) {
      saleModel.PartnerId = quickOrderModel.PartnerId;

      let model = {
          PartnerId: quickOrderModel.PartnerId,
          CompanyId: saleModel.CompanyId || userInit?.Company?.Id,
          CarrierId: saleModel.Carrier?.Id,
          ServiceId: saleModel.Ship_ServiceId || null,
          InsuranceFee: saleModel.Ship_InsuranceFee || 0,
          ShipWeight: saleModel.ShipWeight,
          CashOnDelivery: saleModel.CashOnDelivery,
          ServiceExtras: [] as any[],
          Ship_InsuranceFee: saleModel.Ship_InsuranceFee,
          Ship_Receiver: {} as any
      } as any;

      shipExtraServices || (shipExtraServices = []);
      shipExtraServices.map(x => {
          if (x.IsSelected) {
              model.ServiceExtras.push({
                  Id: x.ServiceId,
                  Name: x.ServiceName,
                  Fee: x.Fee,
                  Type: x.Type,
                  ExtraMoney: x.ExtraMoney,
                  Pickup_Time: x.Pickup_Time,
                  Pickup_Time_Range_Id: x.Pickup_Time_Range_Id,
              });
          }
      });

      if (!saleModel.Ship_Extras && saleModel.Carrier && saleModel.Carrier.Extras) {
        saleModel.Ship_Extras = saleModel.Carrier.Extras;
      }
      if (!enableInsuranceFee) {
          model.Ship_InsuranceFee = 0;
      } else {
          if (!model.Ship_InsuranceFee) {
              if (saleModel.Ship_Extras) {
                  model.Ship_InsuranceFee = saleModel.Ship_Extras.IsInsurance ? saleModel.Ship_Extras.InsuranceFee ? saleModel.Ship_Extras.InsuranceFee : quickOrderModel.TotalAmount : 0;
              } else {
                  model.Ship_InsuranceFee = saleModel.AmountTotal;
              }
          }
      }
      if (quickOrderModel.Address) {
          model.Ship_Receiver = {
              Name: quickOrderModel.Name,
              Street: quickOrderModel.Address,
              Phone: quickOrderModel.Telephone,
              City: quickOrderModel.CityCode ? {
                  code: quickOrderModel.CityCode,
                  name: quickOrderModel.CityName
              } : null,
              District: quickOrderModel.DistrictCode ? {
                  code: quickOrderModel.DistrictCode,
                  name: quickOrderModel.DistrictName
              } : null,
              Ward: quickOrderModel.WardCode ? {
                  code: quickOrderModel.WardCode,
                  name: quickOrderModel.WardName
              } : null
          };
      }

      return model;
    }

  }

}
