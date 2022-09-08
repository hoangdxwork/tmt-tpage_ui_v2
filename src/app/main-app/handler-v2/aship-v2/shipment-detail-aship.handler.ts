import { Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { AshipGetInfoConfigProviderDto } from "src/app/main-app/dto/carrierV2/aship-info-config-provider-data.dto";
import { CalculateFeeInsuranceInfoResponseDto } from "src/app/main-app/dto/carrierV2/delivery-carrier-response.dto";
import { FastSaleOrder_DefaultDTOV2 } from "src/app/main-app/dto/fastsaleorder/fastsaleorder-default.dto";

@Injectable({
  providedIn: 'root'
})

export class UpdateShipmentDetailAshipHandler {

  public updateShipmentDetailAship(configsProviderDataSource: AshipGetInfoConfigProviderDto[], insuranceInfo: CalculateFeeInsuranceInfoResponseDto | null, _form: FormGroup, fb: FormBuilder) {

    let _ashipForm = _form.controls['ShipmentDetailsAship'] as FormGroup;
    let _configForm = _ashipForm.controls["ConfigsProvider"] as FormArray;

    _ashipForm.controls['InsuranceInfo'].setValue(insuranceInfo);

    // TODO: update new value
    configsProviderDataSource?.forEach((config: any) => {

      _configForm.push(fb.group({

        ConfigName: config.ConfigName,
        Type: config.Type,
        InputType: config.InputType,
        IsRequried: config.IsRequried,
        IsHidden: config.IsHidden,
        Description: config.Description,
        DisplayName: config.DisplayName,
        ConfigValue: config.ConfigValue,

        ConfigsValue: config.ConfigsValue ?
          fb.array(config.ConfigsValue?.map((item: any) => {
            return fb.group({
              Id: item.Id,
              Name: item.Name
            })
          }))
          : fb.array([])
      }))
    })
  }

  public so_updateShipmentDetailAship(configsProviderDataSource: AshipGetInfoConfigProviderDto[], insuranceInfo: CalculateFeeInsuranceInfoResponseDto | null, saleModel: FastSaleOrder_DefaultDTOV2) {

    saleModel.ShipmentDetailsAship = {
      InsuranceInfo: insuranceInfo as any,
      ConfigsProvider: []
    }

    configsProviderDataSource?.map(x => {

      let item = {
        ConfigName: x.ConfigName,
        Type: x.Type,
        InputType: x.InputType,
        IsRequried: x.IsRequried,
        IsHidden: x.IsHidden,
        Description: x.Description,
        DisplayName: x.DisplayName,
        ConfigValue: x.ConfigValue,

        ConfigsValue: x.ConfigsValue ?
          x.ConfigsValue.map(t => {
            return {
              Id: t.Id,
              Name: t.Name,
            }
          }) : []
      }

        saleModel.ShipmentDetailsAship?.ConfigsProvider?.push(item);
    })

    return {...saleModel};
  }
}
