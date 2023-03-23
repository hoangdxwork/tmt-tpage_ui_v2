import { Injectable } from "@angular/core";
import { ChatomniConversationInfoDto, ConversationPartnerDto } from "@app/dto/conversation-all/chatomni/chatomni-conversation-info.dto";
import { CRMTeamDTO } from "@app/dto/team/team.dto";
import { ConversationOrderFacade } from "@app/services/facades/conversation-order.facade";
import { TDSHelperObject, TDSHelperString } from "tds-ui/shared/utility";
import { ChatomniConversationItemDto } from "../../dto/conversation-all/chatomni/chatomni-conversation";

@Injectable()

export class CsPartner_PrepareModelHandler {

  constructor(private conversationOrderFacade: ConversationOrderFacade) {
  }

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

    if(!TDSHelperString.hasValueString(partner.Street) && TDSHelperString.hasValueString(partner.FullAddress)){
      partner.Street = partner.FullAddress;
    }

    if(TDSHelperString.hasValueString(partner.Comment)) {
      partner.Comment = this.conversationOrderFacade.prepareMessageHasPhoneBBCode(partner.Comment);
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

        City: partner?.City?.code ? {
            code: partner?.City?.code,
            name: partner?.City?.name
        } : null,

        CityCode: partner?.City?.code,
        CityName: partner?.City?.name,

        District: partner?.District?.code ? {
            code: partner?.District.code,
            name: partner?.District.name
        } : null,

        DistrictCode: partner?.District?.code,
        DistrictName: partner?.District?.name,

        Ward: partner?.Ward?.code ? {
            code: partner?.Ward?.code,
            name: partner?.Ward?.name
        } : null,

        WardCode: partner?.Ward?.code,
        WardName: partner?.Ward?.name
    } as any;

    return {...model};
  }

}
