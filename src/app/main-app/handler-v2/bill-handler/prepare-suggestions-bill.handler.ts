import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { FormGroup } from '@angular/forms';
import { ResultCheckAddressDTO } from './../../dto/address/address.dto';
import { Injectable } from "@angular/core";

@Injectable()

export class PrepareSuggestionsBillHandler {

  public mappingAddress(data: TDSSafeAny) {
    let cities: any;
    let districts: any;
    let wards: any;
    let street: any = '';

    if (data && data.Ship_Receiver?.City?.code) {
      cities = {
        code: data.Ship_Receiver.City.code || null,
        name: data.Ship_Receiver.City.name || null
      }
    }
    if (data && data.Ship_Receiver?.District?.code) {
      districts = {
        cityCode: data.Ship_Receiver.City?.code || null,
        cityName: data.Ship_Receiver.City?.name || null,
        code: data.Ship_Receiver.District.code || null,
        name: data.Ship_Receiver.District.name || null
      }
    }
    if (data && data.Ship_Receiver?.Ward?.code) {
      wards = {
        cityCode: data.Ship_Receiver.City?.code || null,
        cityName: data.Ship_Receiver.City?.name || null,
        districtCode: data.Ship_Receiver.District?.code || null,
        districtName: data.Ship_Receiver.District?.name || null,
        code: data.Ship_Receiver.Ward.code || null,
        name: data.Ship_Receiver.Ward.name || null
      }
    }
    
    if (data && data.Ship_Receiver?.Street) {
      street = data.Ship_Receiver.Street || '';
    }

    let result = {
      _cities: cities || null,
      _districts: districts || null,
      _wards: wards || null,
      _street: street
    };

    return {...result};
  }

  public onLoadSuggestion(_form: FormGroup, item: ResultCheckAddressDTO) {
    if(!TDSHelperString.hasValueString(item.Address)) {
      _form.controls['ReceiverAddress'].setValue(item.Address);
    }

    _form.controls['Ship_Receiver'].patchValue({
        Street: item.Address ? item.Address : '',
        City: item.CityCode ? { code: item.CityCode, name: item.CityName } : null,
        District: item.DistrictCode ? { code: item.DistrictCode, name: item.DistrictName } : null,
        Ward: item.WardCode ? { code: item.WardCode, name: item.WardName } : null
    });
  }
}
