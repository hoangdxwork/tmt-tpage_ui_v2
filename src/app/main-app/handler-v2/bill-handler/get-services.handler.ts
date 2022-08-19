import { FastSaleOrder_DefaultDTOV2, ShipServiceExtra } from '../../dto/fastsaleorder/fastsaleorder-default.dto';
import { Injectable } from "@angular/core";

@Injectable()

export class GetServiceHandler {

  public getShipService(data: FastSaleOrder_DefaultDTOV2){
    if (data.Ship_ServiceId) {
      let result = {
        ServiceId: data.Ship_ServiceId,
        ServiceName: data.Ship_ServiceName,
        TotalFee: data.CustomerDeliveryPrice,
        InsuranceFee: 0,
        Extras: []
      }

      return {...result};
    }
    return null
  }

  public getShipExtrasService(data: FastSaleOrder_DefaultDTOV2){
    if (data.Ship_ServiceExtras && data.Ship_ServiceExtras.length > 0) {
      let shipExtraServices: ShipServiceExtra[] = [];

      for (let item of data.Ship_ServiceExtras) {
        shipExtraServices.push({
            Id: item.Id,
            Name: item.Name,
            Fee: item.Fee || 0,
            Type: item.Type,
            ExtraMoney: item.ExtraMoney,
            IsSelected: true as boolean,
        });
      }

      return [...shipExtraServices];
    }
    return [];
  }
}
