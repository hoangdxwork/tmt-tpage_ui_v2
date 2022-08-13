import { TDSSafeAny } from 'tds-ui/shared/utility';
import { FormGroup } from '@angular/forms';
import { ResultCheckAddressDTO } from './../../dto/address/address.dto';
import { Injectable } from "@angular/core";

@Injectable()

export class PrepareSuggestionsBillHandler {

  public mappingAddress(data: TDSSafeAny) {
    let cities;
    let districts;
    let wards;
    let street;

    if (data && data.Ship_Receiver?.City?.code) {
      cities = {
        code: data.Ship_Receiver.City.code,
        name: data.Ship_Receiver.City.name
      }
    }
    if (data && data.Ship_Receiver?.District?.code) {
      districts = {
        cityCode: data.Ship_Receiver.City?.code,
        cityName: data.Ship_Receiver.City?.name,
        code: data.Ship_Receiver.District.code,
        name: data.Ship_Receiver.District.name
      }
    }
    if (data && data.Ship_Receiver?.Ward?.code) {
      wards = {
        cityCode: data.Ship_Receiver.City?.code,
        cityName: data.Ship_Receiver.City?.name,
        districtCode: data.Ship_Receiver.District?.code,
        districtName: data.Ship_Receiver.District?.name,
        code: data.Ship_Receiver.Ward.code,
        name: data.Ship_Receiver.Ward.name
      }
    }
    if (data && data.Ship_Receiver?.Street) {
      street = data.Ship_Receiver.Street;
    }

    let result = {
      _cities: cities,
      _districts: districts,
      _wards: wards,
      _street: street
    };

    return {...result};
  }

  public onLoadSuggestion(_form: FormGroup, item: ResultCheckAddressDTO) {
    _form.controls['ReceiverAddress'].setValue(item.Address);
    _form.controls['Ship_Receiver'].patchValue({
      Street: item.Address ? item.Address : null,
      City: item.CityCode ? { code: item.CityCode, name: item.CityName } : null,
      District: item.DistrictCode ? { code: item.DistrictCode, name: item.DistrictName } : null,
      Ward: item.WardCode ? { code: item.WardCode, name: item.WardName } : null
    });
  }
}
