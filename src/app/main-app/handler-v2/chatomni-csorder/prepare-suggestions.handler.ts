import { Injectable } from "@angular/core";
import { ResultCheckAddressDTO } from "../../dto/address/address.dto";
import { QuickSaleOnlineOrderModel } from "../../dto/saleonlineorder/quick-saleonline-order.dto";
import { SuggestCitiesDTO, SuggestDistrictsDTO, SuggestWardsDTO } from "../../dto/suggest-address/suggest-address.dto";

@Injectable()

export class CsOrder_SuggestionHandler {

  _cities!: SuggestCitiesDTO;
  _districts!: SuggestDistrictsDTO;
  _wards!: SuggestWardsDTO;
  _street!: string;

  public onLoadSuggestion(item: ResultCheckAddressDTO, quickOrderModel: QuickSaleOnlineOrderModel) {debugger
    quickOrderModel.Address = item.Address;

    quickOrderModel.CityCode = item.CityCode;
    quickOrderModel.CityName = item.CityName;

    quickOrderModel.DistrictCode = item.DistrictCode;
    quickOrderModel.DistrictName = item.DistrictName;

    quickOrderModel.WardCode = item.WardCode;
    quickOrderModel.WardName = item.WardName;

    return {...quickOrderModel};
  }

  validateData(){
    (this._cities as any) = null;
    (this._districts as any) = null;
    (this._wards as any) = null;
    (this._street as any) = null;
  }

  public mappingAddress(data: QuickSaleOnlineOrderModel) {
    this.validateData();
    if (data && data.CityCode) {
      this._cities = {
          code: data.CityCode,
          name: data.CityName
      }
    }

    if (data && data.DistrictCode) {
      this._districts = {
          cityCode: data.CityCode,
          cityName: data.CityName,
          code: data.DistrictCode,
          name: data.DistrictName
      }
    }

    if (data && data.WardCode) {
      this._wards = {
          cityCode: data.CityCode,
          cityName: data.CityName,
          districtCode: data.DistrictCode,
          districtName: data.DistrictCode,
          code: data.WardCode,
          name: data.WardName
      }
    }

    if (data && (data.Address)) {
      this._street = data.Address;
    }

    return {
      _cities: this._cities,
      _districts: this._districts,
      _wards: this._wards,
      _street: this._street
    }
  }

}
