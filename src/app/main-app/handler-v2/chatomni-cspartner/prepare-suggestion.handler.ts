import { Injectable } from "@angular/core";
import { ConversationPartnerDto } from "@app/dto/conversation-all/chatomni/chatomni-conversation-info.dto";
import { ResultCheckAddressDTO } from "../../dto/address/address.dto";
import { SuggestCitiesDTO, SuggestDistrictsDTO, SuggestWardsDTO } from "../../dto/suggest-address/suggest-address.dto";

@Injectable()

export class CsPartner_SuggestionHandler {

  _cities!: SuggestCitiesDTO;
  _districts!: SuggestDistrictsDTO;
  _wards!: SuggestWardsDTO;
  _street!: string;

  public onLoadSuggestion(item: ResultCheckAddressDTO, partner: ConversationPartnerDto) {

    partner.CityCode = item.CityCode || null;
    partner.CityName = item.CityName || null;

    partner.City = item.CityCode ? {
        code: item.CityCode,
        name: item.CityName
    } : null as any;

    partner.DistrictCode = item.DistrictCode || null;
    partner.DistrictName = item.DistrictName || null;

    partner.District = item.DistrictCode ? {
        code: item.DistrictCode,
        name: item.DistrictName,
    } : null as any;

    partner.WardCode = item.WardCode || null;
    partner.WardName = item.WardName || null;

    partner.Ward = item.WardCode ? {
        code: item.WardCode,
        name: item.WardName,
    } : null as any;

    partner.Street = item.Address || null;

    return {...partner};
  }

  public mappingAddress(partner: ConversationPartnerDto) {
    if (partner && partner.City?.code) {
        this._cities = {
            code: (partner.CityCode || partner.City?.code) as any,
            name: (partner.CityName || partner.City?.name) as any
        }
    }

    if (partner && partner.District?.code) {
        this._districts = {
            cityCode: (partner.CityCode || partner.City?.code) as any,
            cityName: (partner.CityName || partner.City?.name) as any,
            code: (partner.DistrictCode || partner.District?.code) as any,
            name: (partner.DistrictName || partner.District?.name) as any
        }
    }

    if (partner && partner.Ward?.code) {
        this._wards = {
            cityCode:  (partner.CityCode || partner.City?.code) as any,
            cityName: (partner.CityName || partner.City?.name) as any,
            districtCode: (partner.DistrictCode || partner.District?.code) as any,
            districtName: (partner.DistrictName || partner.District?.name) as any,
            code: (partner.WardCode || partner.Ward?.code) as any,
            name: (partner.WardName || partner.Ward?.name) as any,
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
