import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FastSaleOrder_DefaultDTOV2, ShipServiceExtra } from "src/app/main-app/dto/fastsaleorder/fastsaleorder-default.dto";

@Injectable({
  providedIn: 'root'
})

export class UpdateShipExtraHandler {

  public updateShipExtraHandler(shipExtraServices: ShipServiceExtra[], _form: FormGroup) {
    let model = _form.value as FastSaleOrder_DefaultDTOV2;
    if (shipExtraServices && model.Ship_Extras) {

      shipExtraServices.forEach((x: ShipServiceExtra) => {
        if (x.Id === 'XMG') {
            model.Ship_Extras!.CollectMoneyGoods = x.ExtraMoney;
            model.Ship_Extras!.IsCollectMoneyGoods = true;
        }
      })

      // TODO: cập nhật phí bảo hiểm
      model.Ship_Extras.InsuranceFee = model.Ship_InsuranceFee;
    }
  }

  public so_updateShipExtraHandler(shipExtraServices: ShipServiceExtra[], saleModel: FastSaleOrder_DefaultDTOV2) {

    if (shipExtraServices && saleModel.Ship_Extras) {

      shipExtraServices.forEach((x: ShipServiceExtra) => {
        if (x.Id === 'XMG') {
            saleModel.Ship_Extras!.CollectMoneyGoods = x.ExtraMoney;
            saleModel.Ship_Extras!.IsCollectMoneyGoods = true;
        }
      })

      // TODO: cập nhật phí bảo hiểm
      saleModel.Ship_Extras.InsuranceFee = saleModel.Ship_InsuranceFee;
    }

    return {...saleModel};
  }

}
