import { Injectable } from "@angular/core";
import { FastSaleOrder_DefaultDTOV2 } from "../dto/fastsaleorder/fastsaleorder-default.dto";
import { Ship_ExtrasServiceModel } from "./dto-handler/ship-extra-service.dto";

@Injectable({
  providedIn: 'root'
})

export abstract class CalcServiceDefaultHandler {

  public static calcServiceDefault(saleModel: FastSaleOrder_DefaultDTOV2, shipExtraServices: Array<Ship_ExtrasServiceModel>){debugger
      if (saleModel.Carrier) {
        switch (saleModel.Carrier?.DeliveryType) {
          case 'ViettelPost':
            saleModel.Ship_ServiceId = saleModel.Carrier?.ViettelPost_ServiceId;

            if (saleModel.Ship_Extras && saleModel.Ship_Extras.IsDropoff) {debugger
              shipExtraServices.push({
                ServiceId: "GNG",
                ServiceName: "Gửi tại bưu cục(Giảm 10% cước)",
                Fee: 0,
                IsSelected: true,
                TotalFee: null,
                Type: null,
                ExtraMoney: null,
              });
            }
            if (saleModel.Ship_Extras && saleModel.Ship_Extras.ServiceCustoms) {debugger
              saleModel.Ship_Extras.ServiceCustoms.forEach(x => {
                shipExtraServices.push({
                  ServiceId: x.ServiceId,
                  ServiceName: x.Name,
                  Fee: 0,
                  IsSelected: x.IsDefault,
                  TotalFee: null,
                  Type: null,
                  ExtraMoney: null,
                });
              })
            }
            if (saleModel.Ship_Extras && saleModel.Ship_Extras.IsCollectMoneyGoods) {
              shipExtraServices.push({
                ServiceId: "XMG",
                ServiceName: "Thu tiền xem hàng",
                Fee: 0,
                IsSelected: true,
                TotalFee: null,
                Type: null,
                ExtraMoney: null,
              });
            }
            break;
          case 'GHN':
            saleModel.Ship_ServiceId = saleModel.Carrier?.GHN_ServiceId;debugger
            if (saleModel.Ship_Extras && saleModel.Ship_Extras.IsDropoff) {
              shipExtraServices.push(
                {
                  ServiceId: "53337",
                  ServiceName: "Gửi hàng tại điểm",
                  Fee: 0,
                  IsSelected: true,
                  TotalFee: null,
                  Type: null,
                  ExtraMoney: null,
                  });
            }
            break;
          case 'MyVNPost':
            saleModel.Ship_ServiceId = saleModel.Carrier?.ViettelPost_ServiceId;
            if (saleModel.Ship_Extras && saleModel.Ship_Extras.IsPackageViewable) {
              shipExtraServices.push(
                {
                  ServiceId: "IsPackageViewable",
                  ServiceName: "Cho xem hàng?",
                  Fee: 0,
                  IsSelected: true,
                  TotalFee: null,
                  Type: null,
                  ExtraMoney: null,
                });
            }
            break;
          case 'OkieLa':
            if (saleModel.Ship_Extras && saleModel.Ship_Extras.IsPackageViewable) {
              shipExtraServices.push(
                {
                  ServiceId: "check_before_accept",
                  ServiceName: "Cho xem hàng?",
                  Fee: 0,
                  IsSelected: true,
                  TotalFee: null,
                  Type: null,
                  ExtraMoney: null,
                });
            }
            if (saleModel.Ship_Extras && saleModel.Ship_Extras.Is_Fragile) {
              shipExtraServices.push(
                {
                  ServiceId: "is_fragile",
                  ServiceName: "Hàng dễ vỡ",
                  Fee: 0,
                  IsSelected: true,
                  TotalFee: null,
                  Type: null,
                  ExtraMoney: null,
                });
            }
            break;
          case 'DHL':
            if (saleModel.Ship_Extras && saleModel.Ship_Extras.IsPackageViewable) {
              shipExtraServices.push(
                {
                  ServiceId: "OBOX",
                  ServiceName: "Cho khách xem hàng?",
                  Fee: 0,
                  IsSelected: true,
                  TotalFee: null,
                  Type: null,
                  ExtraMoney: null,
                });
            }
            break;
        }
      }

      //TODO: Bảo hiểm hàng hóa
      if (saleModel.Ship_Extras && saleModel.Ship_Extras.IsInsurance) {

        // if (!saleModel.Ship_InsuranceFee) {
        //   this._form.controls['Ship_InsuranceFee'].setValue(saleModel.Ship_Extras.InsuranceFee || saleModel.AmountTotal);
        // }

        switch (saleModel.Carrier?.DeliveryType) {
          case "MyVNPost":
            shipExtraServices.push(
              {
                ServiceId: "OrderAmountEvaluation",
                ServiceName: "Khai giá",
                Fee: 0,
                IsSelected: true, TotalFee: null,
                Type: null,
                ExtraMoney: null,
              });
            break;
          case "GHTK":
            shipExtraServices.push(
              {
                ServiceId: "16",
                ServiceName: "Bảo hiểm hàng hóa",
                Fee: 0,
                IsSelected: true,
                TotalFee: null,
                Type: null,
                ExtraMoney: null,
              });
            break;
          case "ViettelPost":
            shipExtraServices.push(
              {
                ServiceId: "GBH",
                ServiceName: "Bảo hiểm",
                Fee: 0,
                IsSelected: true,
                TotalFee: null,
                Type: null,
                ExtraMoney: null,
              });
            break;
        }
      }
    }
}
