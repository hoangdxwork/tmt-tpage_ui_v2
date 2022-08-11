
import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { CalculateFeeInsuranceInfoResponseDto, CalculateFeeServiceExtrasResponseDto, CalculateFeeServiceResponseDto } from "src/app/main-app/dto/carrierV2/delivery-carrier-response.dto";
import { FastSaleOrder_DefaultDTOV2, ShipServiceExtra } from "src/app/main-app/dto/fastsaleorder/fastsaleorder-default.dto";
import { TDSHelperArray } from "tds-ui/shared/utility";


@Injectable({
  providedIn: 'root'
})

export class SelectShipServiceV2Handler {

  public selectShipServiceV2(data: CalculateFeeServiceResponseDto, shipExtraServices: ShipServiceExtra[], _form: FormGroup): any {

      _form.controls['Ship_ServiceId'].setValue(data.ServiceId);
      _form.controls['Ship_ServiceName'].setValue(data.ServiceName);
      _form.controls['CustomerDeliveryPrice'].setValue(data.TotalFee);

      let formModel = _form.value;
      let temps: ShipServiceExtra[] = [];

      if(TDSHelperArray.hasListValue(shipExtraServices)) {
          temps = shipExtraServices.map(x => x) as ShipServiceExtra[];
      }

      if(TDSHelperArray.hasListValue(data.Extras)) {

        shipExtraServices = [];
        data.Extras.map((x: CalculateFeeServiceExtrasResponseDto) => {

            // TODO: nếu là dịch vụ cũ thì isselect dữ liệu
            let exist = temps?.filter(t => t.Id == x.ServiceId)[0] as ShipServiceExtra;

            if(exist && exist.Id == 'XMG' && formModel.Carrier?.DeliveryType == 'ViettelPost' && exist.IsSelected) {
              exist.ExtraMoney = (formModel.Ship_Extras && formModel.Ship_Extras.IsCollectMoneyGoods && formModel.Ship_Extras.CollectMoneyGoods) ? formModel.Ship_Extras.CollectMoneyGoods : formModel.CustomerDeliveryPrice || null;
            }

            let item: ShipServiceExtra = {
                Id: x.ServiceId,
                Name: x.ServiceName,
                Fee: x.Fee || 0,
                Type: exist ? exist.Type : null,
                ExtraMoney: exist ? exist.ExtraMoney : null,
                OrderTime: exist ? exist.OrderTime : null,
                IsSelected: exist ? exist.IsSelected : false
            }

            shipExtraServices.push(item);
      })

      return shipExtraServices;
    }
  }

  public so_selectShipServiceV2(data: CalculateFeeServiceResponseDto, shipExtraServices: ShipServiceExtra[], saleModel: FastSaleOrder_DefaultDTOV2): any {

    saleModel.Ship_ServiceId = data.ServiceId;
    saleModel.Ship_ServiceName = data.ServiceName;
    saleModel.CustomerDeliveryPrice = data.TotalFee;

    let temps: ShipServiceExtra[] = [];

    if(TDSHelperArray.hasListValue(shipExtraServices)) {
        temps = shipExtraServices.map(x => x) as ShipServiceExtra[];
    }

    if(TDSHelperArray.hasListValue(data.Extras)) {

        shipExtraServices = [];
        data.Extras.forEach((x: CalculateFeeServiceExtrasResponseDto) => {

            // TODO: nếu là dịch vụ cũ thì isselect dữ liệu
            const exist = temps?.filter(t => t.Id == x.ServiceId)[0] as ShipServiceExtra;

            if(exist && exist.Id == 'XMG' && saleModel.Carrier?.DeliveryType == 'ViettelPost' && exist.IsSelected) {
                exist.ExtraMoney = (saleModel.Ship_Extras && saleModel.Ship_Extras.IsCollectMoneyGoods && saleModel.Ship_Extras.CollectMoneyGoods) ? saleModel.Ship_Extras.CollectMoneyGoods : saleModel.CustomerDeliveryPrice || null;
            }

            let item: ShipServiceExtra = {
              Id: exist?.Id || x.ServiceId,
              Name: exist?.Name ||  x.ServiceName,
              Fee: exist?.Fee || x.Fee || 0,
              Type: exist?.Type || null,
              ExtraMoney: exist?.ExtraMoney || null,
              OrderTime: exist?.OrderTime || null,
              IsSelected: exist?.IsSelected || false
            }

            shipExtraServices.push(item);
        })
    }

    return { saleModel, shipExtraServices };
  }
}
