import { Injectable } from "@angular/core";
import { ChatomniConversationInfoDto, ConversationPartnerDto } from "@app/dto/conversation-all/chatomni/chatomni-conversation-info.dto";
import { CRMTeamDTO } from "@app/dto/team/team.dto";
import { TDSHelperObject, TDSHelperString } from "tds-ui/shared/utility";
import { ChatomniConversationItemDto } from "../../dto/conversation-all/chatomni/chatomni-conversation";
import { QuickSaleOnlineOrderModel } from "../../dto/saleonlineorder/quick-saleonline-order.dto";

@Injectable()

export class CsPartner_PrepareModelHandler {

  public getPartnerFromConversation(conversationInfo: ChatomniConversationInfoDto, team: CRMTeamDTO) {
    let partner: ConversationPartnerDto = {} as any;

    if(conversationInfo && conversationInfo.Partner) {
        partner = {...conversationInfo.Partner};
    }

    if(!partner.Name && conversationInfo && conversationInfo.Conversation?.Name) {
        partner.Name = conversationInfo.Conversation.Name;
    }

    if(!partner.Phone && conversationInfo && conversationInfo.Conversation?.Phone) {
        partner.Phone = conversationInfo.Conversation.Phone;
    }

    if(!partner.Email && conversationInfo && conversationInfo.Conversation?.Email) {
        partner.Email = conversationInfo.Conversation.Email;
    }

    if(!partner.FacebookASIds && conversationInfo && conversationInfo.Conversation?.ConversationId) {
        partner.FacebookASIds = conversationInfo.Conversation.ConversationId;
    }

    if(!partner.FacebookPSId && conversationInfo && conversationInfo.Conversation?.ConversationId) {
        partner.FacebookPSId = conversationInfo.Conversation.ConversationId;
    }

    if(!TDSHelperObject.hasValue(partner.City) && partner.CityCode) {
        partner.City = {
            code: partner.CityCode,
            name: partner.CityName
        } as any
    }

    if(!TDSHelperObject.hasValue(partner.District) && partner.DistrictCode) {
        partner.District = {
            code: partner.DistrictCode,
            name: partner.DistrictName
        } as any
    }

    if(!TDSHelperObject.hasValue(partner.Ward) && partner.WardCode) {
      partner.Ward = {
          code: partner.WardCode,
          name: partner.WardName
      } as any
    }

    return {...partner};
  }

  public prepareModel(partner: ConversationPartnerDto, item: ChatomniConversationItemDto) {
    let  model = {
        Id: item.PartnerId || partner?.Id || 0,
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

  // public updatePartnerModel(partner: ConversationPartnerDto, x: CreateOrUpdatePartnerModel) {

  //   partner.Name = x.Name;
  //   partner.Comment = x.Comment;
  //   partner.Phone = x.Phone;
  //   partner.Street = x.Street;

  //   if(x.City?.code || x.CityCode) {
  //     partner.City = {
  //         code: x.City.code || x.CityCode,
  //         name: x.City.name || x.CityName
  //     }

  //     partner.CityCode = x.CityCode || x.City?.code;
  //     partner.CityName = x.CityName || x.City?.name;

  //   } else {
  //     partner.City = null;
  //   }

  //   if(x.District?.code || x.DistrictCode) {
  //       partner.District = {
  //           code: x.District.code || x.DistrictCode,
  //           name: x.District.name || x.DistrictName
  //       } as any;

  //       partner.DistrictCode = x.DistrictCode || x.District?.code;
  //       partner.DistrictName = x.DistrictName || x.District?.name;

  //   } else {
  //     partner.District = null;
  //   }

  //   if(x.Ward?.code || x.WardCode) {
  //     partner.Ward = {
  //         code: x.Ward.code || x.WardCode,
  //         name: x.Ward.name || x.WardName
  //     } as any;

  //     partner.WardCode = x.WardCode || x.Ward?.code;
  //     partner.WardName = x.WardName || x.Ward?.name;
  //   } else {
  //     partner.Ward = null;
  //   }

  //   return {...partner};
  // }

  public loadPartnerFromTabOrder(partner: ConversationPartnerDto, order: QuickSaleOnlineOrderModel) {

    if(!partner.Name && order.PartnerName ) {
        partner.Name = order.PartnerName;
    }

    if(!partner.Phone && order.Telephone) {
        partner.Phone = order.Telephone;
    }

    if(!partner.Email && order.Email) {
        partner.Email = order.Email;
    }

    if(!partner.Comment && order.Note) {
        partner.Comment = order.Note;
    }

    if(!partner.Street && order.Address) {
      partner.Street = order.Address;
    }

    if(order.CityCode && !partner.City) {
      partner.City = {
          code: order.CityCode,
          name: order.CityName
      }
      partner.CityCode = order.CityCode;
      partner.CityName = order.CityName;
    }

    if(order.DistrictCode && !partner.District) {
        partner.District = {
            code: order.DistrictCode,
            name: order.DistrictName
        } as any;

        partner.DistrictCode = order.DistrictCode;
        partner.DistrictName = order.DistrictName;
    }

    if(order.WardCode && !partner.Ward) {
      partner.Ward = {
          code: order.WardCode,
          name: order.WardName
      } as any;

      partner.WardCode = order.WardCode;
      partner.WardName = order.WardName;
    }

    return {...partner};
  }
}
