import { Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { AshipGetInfoConfigProviderDto } from "src/app/main-app/dto/carrierV2/aship-info-config-provider-data.dto";
import { CalculateFeeInsuranceInfoResponseDto } from "src/app/main-app/dto/carrierV2/delivery-carrier-response.dto";

@Injectable({
  providedIn: 'root'
})

export class UpdateShipmentDetailAshipHandler {

  public updateShipmentDetailAship(configsProviderDataSource: AshipGetInfoConfigProviderDto[], insuranceInfo: CalculateFeeInsuranceInfoResponseDto | null,  _form: FormGroup, fb: FormBuilder) {

    let _ashipForm =  _form.controls['ShipmentDetailsAship'] as FormGroup;
    let _configForm = _ashipForm.controls["ConfigsProvider"] as FormArray;

    _ashipForm.controls['InsuranceInfo'].setValue(insuranceInfo);

    // TODO: update new value
    configsProviderDataSource.forEach((config: any) => {

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
          fb.array(config.ConfigsValue.map((item: any) => {
              return fb.group({
                  Id: item.Id,
                  Name: item.Name
              })
          }))
          : fb.array([])
      }))
    })
  }
}
