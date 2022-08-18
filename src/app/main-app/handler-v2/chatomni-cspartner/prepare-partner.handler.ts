import { Injectable } from "@angular/core";
import { ConversationPartnerDto } from "@app/dto/conversation-all/chatomni/chatomni-conversation-info.dto";
import { TDSHelperString } from "tds-ui/shared/utility";
import { ChatomniConversationItemDto } from "../../dto/conversation-all/chatomni/chatomni-conversation";
import { CreateOrUpdatePartnerModel } from "../../dto/conversation-partner/create-update-partner.dto";
import { QuickSaleOnlineOrderModel } from "../../dto/saleonlineorder/quick-saleonline-order.dto";

@Injectable()

export class CsPartner_PrepareModelHandler {

  public prepareModel(partner: ConversationPartnerDto, item: ChatomniConversationItemDto) {
    let  model = {
        Id: item.PartnerId || partner?.Id,
        StatusText: partner?.StatusText,
        Name: partner?.Name,
        Phone: partner?.Phone,
        PhoneReport: partner?.PhoneReport,
        Email: partner?.Email,
        Comment: partner?.Comment,
        Street: partner?.Street,

        FacebookASIds: item.ConversationId,
        FacebookId: partner.FacebookId,

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

    return {...model};
  }

  public updatePartnerModel(partner: ConversationPartnerDto, x: CreateOrUpdatePartnerModel) {

    partner.Name = x.Name;
    partner.Comment = x.Comment;
    partner.Phone = x.Phone;
    partner.Street = x.Street;

    if(x.City?.code || x.CityCode) {
      partner.City = {
          code: x.City.code || x.CityCode,
          name: x.City.name || x.CityName
      }

      partner.CityCode = x.CityCode || x.City?.code;
      partner.CityName = x.CityName || x.City?.name;

    } else {
      partner.City = null;
    }

    if(x.District?.code || x.DistrictCode) {
        partner.District = {
            code: x.District.code || x.DistrictCode,
            name: x.District.name || x.DistrictName
        } as any;

        partner.DistrictCode = x.DistrictCode || x.District?.code;
        partner.DistrictName = x.WardName || x.District?.name;

    } else {
      partner.District = null;
    }

    if(x.Ward?.code || x.WardCode) {
      partner.Ward = {
          code: x.Ward.code || x.WardCode,
          name: x.Ward.name || x.WardName
      } as any;

      partner.WardCode = x.WardCode || x.Ward?.code;
      partner.WardName = x.WardName || x.Ward?.name;
    } else {
      partner.Ward = null;
    }

    return {...partner};
  }

  public loadPartnerFromTabOrder(partner: ConversationPartnerDto, order: QuickSaleOnlineOrderModel) {

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
      } as any;
    }

    if(TDSHelperString.hasValueString(order.WardCode)) {
      partner.Ward = {
          code: order.WardCode,
          name: order.WardName
      } as any;
    }

    return {...partner};
  }
}
