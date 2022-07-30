import { Injectable } from "@angular/core";
import { ResultCheckAddressDTO } from "../../dto/address/address.dto";
import { TabPartnerCvsRequestModel } from "../../dto/conversation-partner/partner-conversation-request.dto";
import { SuggestCitiesDTO, SuggestDistrictsDTO, SuggestWardsDTO } from "../../dto/suggest-address/suggest-address.dto";

@Injectable({
  providedIn: 'root'
})

export class CsPartner_SuggestionHandler {

  _cities!: SuggestCitiesDTO;
  _districts!: SuggestDistrictsDTO;
  _wards!: SuggestWardsDTO;
  _street!: string;

  public onLoadSuggestion(item: ResultCheckAddressDTO, partner: TabPartnerCvsRequestModel) {
    partner.City = item.CityCode ? {
        code: item.CityCode,
        name: item.CityName
    } : null;

    partner.District = item.DistrictCode ? {
        code: item.DistrictCode,
        name: item.DistrictName
    } : null;

    partner.Ward = item.WardCode ? {
        code: item.WardCode,
        name: item.WardName
    } : null;

    partner.Street = item.Address;

    return partner;
  }


  public mappingAddress(partner: TabPartnerCvsRequestModel) {
    if (partner && partner.City?.code) {
        this._cities = {
            code: partner.City.code,
            name: partner.City.name
        }
    }

    if (partner && partner.District?.code) {
        this._districts = {
            cityCode: partner.City?.code,
            cityName: partner.City?.name,
            code: partner.District.code,
            name: partner.District.name
        }
    }

    if (partner && partner.Ward?.code) {
        this._wards = {
            cityCode: partner.City?.code,
            cityName: partner.City?.name,
            districtCode: partner.District.code,
            districtName: partner.District.name,
            code: partner.Ward?.code,
            name: partner.Ward?.name
        }
    }

    if (partner && (partner.Street)) {
        this._street = partner.Street;
    }

    return {
      _cities: this._cities || null,
      _districts: this._districts || null,
      _wards: this._wards || null,
      _street: this._street
    }
  }
}
