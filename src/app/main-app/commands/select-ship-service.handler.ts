import { Injectable } from "@angular/core";
import { FastSaleOrder_DefaultDTOV2 } from "../dto/fastsaleorder/fastsaleorder-default.dto";
import { Ship_ExtrasServiceModel } from "./dto-handler/ship-extra-service.dto";

@Injectable({
  providedIn: 'root'
})

export abstract class SelectShipServiceHandler {

    static selectShipService(saleModel: FastSaleOrder_DefaultDTOV2, shipExtraServices: Array<Ship_ExtrasServiceModel>, item: any) {

      let temps = [] as any[];
      if (shipExtraServices) {
          temps = shipExtraServices.map(x => x);
      }

      if (item.Extras && item.Extras.length > 0) {

         shipExtraServices = item.Extras;
         let listServiceTemp = [] as any[];

          temps.map(x => {
              var exist = shipExtraServices.filter(s => s.ServiceId === x.ServiceId)[0];
              if (exist) {
                  exist.IsSelected = x.IsSelected;
                  //check cấu hình thu tiền xem hàng mặc định
                  if (exist.ServiceId == 'XMG' && saleModel.Carrier?.DeliveryType == 'ViettelPost' && exist.IsSelected == true) {
                      exist.ExtraMoney = (saleModel.Ship_Extras && saleModel.Ship_Extras.IsCollectMoneyGoods && saleModel.Ship_Extras.CollectMoneyGoods) ? saleModel.Ship_Extras.CollectMoneyGoods : saleModel.CustomerDeliveryPrice;
                  }
              } else {
                listServiceTemp.push(x);
              }
          });

          if (listServiceTemp)
              listServiceTemp.forEach(x => {
              shipExtraServices.push(x);
          });

      } else {
          shipExtraServices = [];
      }
    }
}
