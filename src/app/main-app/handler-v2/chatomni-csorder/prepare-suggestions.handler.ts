import { Injectable } from "@angular/core";
import { ResultCheckAddressDTO } from "../../dto/address/address.dto";
import { QuickSaleOnlineOrderModel } from "../../dto/saleonlineorder/quick-saleonline-order.dto";
import { SuggestCitiesDTO, SuggestDistrictsDTO, SuggestWardsDTO } from "../../dto/suggest-address/suggest-address.dto";

@Injectable({
  providedIn: 'root'
})

export class CsOrder_SuggestionHandler {

  _cities!: SuggestCitiesDTO;
  _districts!: SuggestDistrictsDTO;
  _wards!: SuggestWardsDTO;
  _street!: string;

  public onLoadSuggestion(item: ResultCheckAddressDTO, quickOrderModel: QuickSaleOnlineOrderModel) {
    quickOrderModel.Address = item.Address ? item.Address : quickOrderModel.Address;

    quickOrderModel.CityCode = item.CityCode ? item.CityCode : quickOrderModel.CityCode;
    quickOrderModel.CityName = item.CityName ? item.CityName : quickOrderModel.CityName;

    quickOrderModel.DistrictCode = item.DistrictCode ? item.DistrictCode : quickOrderModel.DistrictCode;
    quickOrderModel.DistrictName = item.DistrictName ? item.DistrictName : quickOrderModel.DistrictName;

    quickOrderModel.WardCode = item.WardCode ? item.WardCode : quickOrderModel.WardCode;
    quickOrderModel.WardName = item.WardName ? item.WardName : quickOrderModel.WardName;

    return quickOrderModel;
  }

  public mappingAddress(data: QuickSaleOnlineOrderModel) {
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
      _cities: this._cities || null,
      _districts: this._districts || null,
      _wards: this._wards || null,
      _street: this._street
    }
  }

}
