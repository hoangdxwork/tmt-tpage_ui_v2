import { Injectable } from "@angular/core";
import { ResultCheckAddressDTO } from "src/app/main-app/dto/address/address.dto";
import { ConversationMatchingItem } from "src/app/main-app/dto/conversation-all/conversation-all.dto";
import { CreateOrUpdatePartnerModel } from "src/app/main-app/dto/conversation-partner/create-update-partner.dto";
import { TabPartnerCvsRequestModel } from "src/app/main-app/dto/conversation-partner/partner-conversation-request.dto";
import { QuickSaleOnlineOrderModel } from "src/app/main-app/dto/saleonlineorder/quick-saleonline-order.dto";
import { TDSHelperString } from "tds-ui/shared/utility";

@Injectable({
  providedIn: 'root'
})

export abstract class ConversationPartnerHandler {

  static onLoadSuggestion(item: ResultCheckAddressDTO, partner: TabPartnerCvsRequestModel) {
    partner.City = item.CityCode ? {
      code: item.CityCode,
      name: item.CityName
    } : null
    partner.District = item.DistrictCode ? {
      code: item.DistrictCode,
      name: item.DistrictName
    } : null
    partner.Ward = item.WardCode ? {
      code: item.WardCode,
      name: item.WardName
    } : null

    partner.Street = item.Address;
  }

  static prepareModel(partner: TabPartnerCvsRequestModel, dataModel: ConversationMatchingItem) {
    let  model = {
      Id: partner?.Id,
      StatusText: partner?.StatusText,
      Name: partner?.Name,
      Phone: partner?.Phone,
      PhoneReport: partner?.PhoneReport,
      Email: partner?.Email,
      Comment: partner?.Comment,
      Street: partner?.Street,

      FacebookASIds: partner?.Facebook_ASUserId || (dataModel.partner_id == partner?.Id ? dataModel.id : null),
      FacebookId: (dataModel.partner_id == partner?.Id ? dataModel.id : null),

      City: partner.City?.code ? {
        code: partner.City.code,
        name: partner.City.name
      } : null,

      District: partner.District?.code ? {
        code: partner.District.code,
        name: partner.District.name
      } : null,

      Ward: partner.Ward?.code ? {
        code: partner.Ward.code,
        name: partner.Ward.name
      } : null,
    }

    return model;
  }

  static mappingPartnerModel(partner: TabPartnerCvsRequestModel, x: CreateOrUpdatePartnerModel) {

    partner.Name = x.Name;
    partner.Comment = x.Comment;
    partner.Phone = x.Phone;
    partner.Street = x.Street;

    if(x.City?.code || x.CityCode) {
      partner.City = {
        code: x.City.code || x.CityCode,
        name: x.City.name || x.CityName
      }
    } else {
      partner.City = null;
    }

    if(x.District?.code || x.DistrictCode) {
      partner.District = {
        code: x.District.code || x.DistrictCode,
        name: x.District.name || x.DistrictName
      }
    } else {
      partner.District = null;
    }

    if(x.Ward?.code || x.WardCode) {
      partner.Ward = {
        code: x.Ward.code || x.WardCode,
        name: x.Ward.name || x.WardName
      }
    } else {
      partner.Ward = null;
    }

  }

  static loadPartnerFromTabOrder(partner: TabPartnerCvsRequestModel, order: QuickSaleOnlineOrderModel) {
    if(TDSHelperString.hasValueString(order.PartnerName)) {
      partner.Name = order.PartnerName;
    }
    if(TDSHelperString.hasValueString(order.Telephone)) {
      partner.Phone = order.Telephone;
    }
    if(TDSHelperString.hasValueString(order.Email)) {
      partner.Email = order.Email;
    }
    if(TDSHelperString.hasValueString(order.Note)) {
      partner.Comment = order.Note;
    }
    if(TDSHelperString.hasValueString(order.Address)) {
      partner.Street = order.Address;
    }
    if(TDSHelperString.hasValueString(order.CityCode)) {
      partner.City = {
        code: order.CityCode,
        name: order.CityName
      }
    }
    if(TDSHelperString.hasValueString(order.DistrictCode)) {
      partner.District = {
        code: order.DistrictCode,
        name: order.DistrictName
      }
    }
    if(TDSHelperString.hasValueString(order.WardCode)) {
      partner.Ward = {
        code: order.WardCode,
        name: order.WardName
      }
    }
  }

}
