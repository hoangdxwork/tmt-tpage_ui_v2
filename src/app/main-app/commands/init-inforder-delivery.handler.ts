import { Injectable } from "@angular/core";
import { FastSaleOrder_DefaultDTOV2 } from "../dto/fastsaleorder/fastsaleorder-default.dto";
import { QuickSaleOnlineOrderModel } from "../dto/saleonlineorder/quick-saleonline-order.dto";
import { Ship_ExtrasServiceModel } from "./dto-handler/ship-extra-service.dto";

@Injectable({
  providedIn: 'root'
})

export abstract class InitInfoOrderDeliveryHandler{

  static initInfoOrderDelivery(saleModel: FastSaleOrder_DefaultDTOV2, quickOrderModel: QuickSaleOnlineOrderModel,
      shipExtraServices: Array<Ship_ExtrasServiceModel>, enableInsuranceFee: boolean) {

      if (saleModel.Carrier && saleModel.Carrier.DeliveryType === 'NinjaVan' && saleModel.Ship_Extras) {
          let insuranceFee = this.getInsuranceFee(saleModel, quickOrderModel);
          shipExtraServices = [];
          shipExtraServices.push({
              ServiceId: "NinjaVan",
              ServiceName: "Khai giá hàng hóa",
              Fee: insuranceFee,
              TotalFee: null,
              IsSelected: null,
              Type: null,
              ExtraMoney: null,
          })

          enableInsuranceFee = saleModel.Ship_Extras.IsInsurance ? saleModel.Ship_Extras.IsInsurance : false;
          saleModel.Ship_InsuranceFee = insuranceFee;
      }

      if (saleModel.Carrier && saleModel.Carrier.DeliveryType == 'BEST' && saleModel.Ship_Extras) {
        shipExtraServices = [];
        let insuranceFee = this.getInsuranceFee(saleModel, quickOrderModel);

        shipExtraServices.push({
            ServiceId: "BEST_Insurance",
            ServiceName: "Bảo hiểm hàng hóa",
            Fee: insuranceFee,
            TotalFee: null,
            IsSelected: saleModel.Ship_Extras.IsInsurance ? saleModel.Ship_Extras.IsInsurance : false,
            Type: null,
            ExtraMoney: null,
        })
        enableInsuranceFee = saleModel.Ship_Extras.IsInsurance ? saleModel.Ship_Extras.IsInsurance : false;
        saleModel.Ship_InsuranceFee = insuranceFee;
      }

      if (saleModel.Carrier && saleModel.Carrier.DeliveryType == 'HolaShip' && saleModel.Ship_Extras) {
          let insuranceFee = this.getInsuranceFee(saleModel, quickOrderModel);

          shipExtraServices.push({
              ServiceId: "HolaShip_Insurance",
              ServiceName: "Bảo hiểm hàng hóa",
              Fee: insuranceFee,
              TotalFee: null,
              IsSelected: saleModel.Ship_Extras.IsInsurance ? saleModel.Ship_Extras.IsInsurance : false,
              Type: null,
              ExtraMoney: null,
          })
          enableInsuranceFee = saleModel.Ship_Extras.IsInsurance ? saleModel.Ship_Extras.IsInsurance : false;
          saleModel.Ship_InsuranceFee = insuranceFee;
      }
      if (saleModel.Carrier && saleModel.Carrier.DeliveryType == 'JNT' && saleModel.Ship_Extras) {
          saleModel.Ship_InsuranceFee = this.getInsuranceFee(saleModel, quickOrderModel);
      }
      if (saleModel.Carrier && saleModel.Carrier.DeliveryType == 'FastShip' && saleModel.Ship_Extras) {
          shipExtraServices = [];
          let insuranceFee = this.getInsuranceFee(saleModel, quickOrderModel);

          shipExtraServices.push({
              ServiceId: "FastShip_Insurance",
              ServiceName: "Bảo hiểm hàng hóa",
              Fee: insuranceFee,
              TotalFee: null,
              IsSelected: saleModel.Ship_Extras.IsInsurance ? saleModel.Ship_Extras.IsInsurance : false,
              Type: null,
              ExtraMoney: null,
          })

          enableInsuranceFee = saleModel.Ship_Extras.IsInsurance ? saleModel.Ship_Extras.IsInsurance : false;
          saleModel.Ship_InsuranceFee = insuranceFee;
      }
      if (saleModel.Carrier && saleModel.Carrier.DeliveryType == 'Shopee' && saleModel.Ship_Extras) {
          shipExtraServices = [];
          let insuranceFee = this.getInsuranceFee(saleModel, quickOrderModel);

          shipExtraServices.push({
              ServiceId: "Shopee_Insurance",
              ServiceName: "Bảo hiểm hàng hóa",
              Fee: insuranceFee,
              TotalFee: null,
              IsSelected: saleModel.Ship_Extras.IsInsurance ? saleModel.Ship_Extras.IsInsurance : false,
              Type: null,
              ExtraMoney: null,
          })

          enableInsuranceFee = saleModel.Ship_Extras.IsInsurance ? saleModel.Ship_Extras.IsInsurance : false;
          saleModel.Ship_InsuranceFee = insuranceFee;
      }

      if (saleModel.Carrier && saleModel.Carrier.DeliveryType == 'GHSV' && saleModel.Ship_Extras) {
          shipExtraServices = [];
          let insuranceFee = this.getInsuranceFee(saleModel, quickOrderModel);

          shipExtraServices.push({
              ServiceId: "GHSV_Insurance",
              ServiceName: "Bảo hiểm hàng hóa",
              Fee: insuranceFee,
              TotalFee: null,
              IsSelected: saleModel.Ship_Extras.IsInsurance ? saleModel.Ship_Extras.IsInsurance : false,
              Type: null,
              ExtraMoney: null,
          })

          enableInsuranceFee = saleModel.Ship_Extras.IsInsurance ? saleModel.Ship_Extras.IsInsurance : false;
          saleModel.Ship_InsuranceFee = insuranceFee;
      }
      if (saleModel.Carrier && saleModel.Carrier.DeliveryType == 'SHIP60' && saleModel.Ship_Extras) {
          shipExtraServices = [];
          let insuranceFee = this.getInsuranceFee(saleModel, quickOrderModel);

          shipExtraServices.push({
              ServiceId: "SHIP60_Insurance",
              ServiceName: "Bảo hiểm hàng hóa",
              Fee: insuranceFee,
              TotalFee: null,
              IsSelected: saleModel.Ship_Extras.IsInsurance ? saleModel.Ship_Extras.IsInsurance : false,
              Type: null,
              ExtraMoney: null,
          })

          enableInsuranceFee = saleModel.Ship_Extras.IsInsurance ? saleModel.Ship_Extras.IsInsurance : false;
          saleModel.Ship_InsuranceFee = insuranceFee;
      }
  }

  static getInsuranceFee(saleModel: FastSaleOrder_DefaultDTOV2, quickOrderModel: QuickSaleOnlineOrderModel) {
    let insuranceFee = 0;
    if (saleModel.Ship_Extras.IsInsurance) {
        if (saleModel.Ship_Extras.IsInsuranceEqualTotalAmount) {
            insuranceFee = quickOrderModel.TotalAmount;
        } else if (saleModel.Ship_Extras.InsuranceFee) {
            insuranceFee = saleModel.Ship_Extras.InsuranceFee;
        } else {
            insuranceFee = quickOrderModel.TotalAmount;
        }
    }
    return insuranceFee;
  }

}
