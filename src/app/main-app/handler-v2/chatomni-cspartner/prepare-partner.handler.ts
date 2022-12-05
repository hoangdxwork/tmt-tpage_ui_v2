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
        FacebookId: partner.FacebookId || item.ConversationId,

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

}
