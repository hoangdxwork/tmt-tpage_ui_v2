
import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { CalculateFeeInsuranceInfoResponseDto } from "src/app/main-app/dto/carrierV2/delivery-carrier-response.dto";
import { FastSaleOrder_DefaultDTOV2, ShipServiceExtra } from "src/app/main-app/dto/fastsaleorder/fastsaleorder-default.dto";


@Injectable({
  providedIn: 'root'
})

export class PrepareModelFeeV2Handler {

    public prepareModelFeeV2(shipExtraServices: ShipServiceExtra[], _form: FormGroup, companyId: number, insuranceInfo: CalculateFeeInsuranceInfoResponseDto | null) {

      let formModel = _form.value as FastSaleOrder_DefaultDTOV2;
      let model: any = {
          PartnerId: formModel.Partner?.Id,
          CompanyId: formModel.Company?.Id || companyId,
          CarrierId: formModel.Carrier?.Id,
          ServiceId: formModel.Ship_ServiceId || null,
          InsuranceFee: formModel.Ship_InsuranceFee || 0,
          ShipWeight: formModel.ShipWeight,
          CashOnDelivery: formModel.CashOnDelivery,
          ServiceExtras: [],
          Ship_Receiver: {}
      }

      shipExtraServices || (shipExtraServices = []);
      shipExtraServices.map((x: ShipServiceExtra) => {
          if (x.IsSelected) {
              model.ServiceExtras.push({
                Id: x.Id,
                Name: x.Name,
                Fee: x.Fee || 0,
                Type: x.Type,
                ExtraMoney: x.ExtraMoney
              });
          }
      })

      if (!formModel.Ship_Extras && formModel.Carrier && formModel.Carrier.Extras) {
          _form.controls['Ship_Extras'].setValue(formModel.Carrier.Extras);
      }

      if (!insuranceInfo?.IsInsurance) {
          model.Ship_InsuranceFee = 0;
      } else {
          if (!model.Ship_InsuranceFee) {
              if (formModel.Ship_Extras) {
                  model.Ship_InsuranceFee = formModel.Ship_Extras.InsuranceFee || formModel.AmountTotal;
              } else {
                  model.Ship_InsuranceFee = formModel.AmountTotal;
              }
          }
      }

      if (formModel.Ship_Receiver) {
          model.Ship_Receiver = {
              Name: formModel.Ship_Receiver.Name,
              Street: formModel.Ship_Receiver.Street,
              Phone: formModel.Ship_Receiver.Phone,

              City: formModel.Ship_Receiver.City?.code ? {
                  code: formModel.Ship_Receiver.City?.code,
                  name: formModel.Ship_Receiver.City?.name
              } : null,

              District: formModel.Ship_Receiver.District?.code ? {
                  code: formModel.Ship_Receiver.District?.code,
                  name: formModel.Ship_Receiver.District?.name
              } : null,

              Ward: formModel.Ship_Receiver.Ward?.code ? {
                  code: formModel.Ship_Receiver.Ward?.code,
                  name: formModel.Ship_Receiver.Ward?.name
              } : null
          }
      }

      return model;
    }
}
