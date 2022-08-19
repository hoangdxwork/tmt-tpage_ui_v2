import { Injectable } from "@angular/core";
import { ChatomniConversationInfoDto, ConversationPartnerDto } from "@app/dto/conversation-all/chatomni/chatomni-conversation-info.dto";
import { Detail_QuickSaleOnlineOrder, QuickSaleOnlineOrderModel } from "@app/dto/saleonlineorder/quick-saleonline-order.dto";
import { CRMTeamDTO } from "@app/dto/team/team.dto";
import { UserInitDTO } from "@core/dto";
import { TAuthService } from "@core/services";
import { TDSHelperArray, TDSHelperObject } from "tds-ui/shared/utility";

@Injectable()

export class CsOrder_FromConversationHandler {

    private userInit!: UserInitDTO;

    constructor(private auth: TAuthService){
      this.loadUserLogged();
    }

    getOrderFromConversation(conversationInfo: ChatomniConversationInfoDto, team: CRMTeamDTO){
      let order: QuickSaleOnlineOrderModel = {} as any;
      let partner: ConversationPartnerDto = {} as any;

      if(conversationInfo && TDSHelperObject.hasValue(conversationInfo.Partner)) {
          partner = conversationInfo.Partner;
      }

      // TODO: trường hợp có đơn hàng nháp gần nhất
      if(conversationInfo && TDSHelperObject.hasValue(conversationInfo.Order)) {
          order = {... conversationInfo.Order} as any;
          order.Details = [];

          if(TDSHelperArray.hasListValue(conversationInfo.Order?.Details)) {
              conversationInfo.Order.Details.forEach(x => {
                  let item = {
                      Id: x.Id,
                      Quantity: x.Quantity,
                      Price: x.Price,
                      ProductId: x.ProductId,
                      ProductName: x.ProductName,
                      ProductNameGet: x.ProductNameGet,
                      ProductCode: x.ProductCode,
                      UOMId: x.UOMId,
                      UOMName: x.UOMName,
                      Note: x.Note,
                      Factor: x.Factor,
                      OrderId: x.OrderId,
                      Priority: x.Priority,
                      ImageUrl: x.ImageUrl,
                      LiveCampaign_DetailId: x.LiveCampaign_DetailId,
                      IsOrderPriority: x.IsOrderPriority,
                      QuantityRegex: x.QuantityRegex
                  } as Detail_QuickSaleOnlineOrder;

                  order.Details.push(item);
              })
          }
      }
      // TODO: trường hợp ko có thì load dữ liệu mặc định từ conversationItem + partner
      else {
        //mapping thêm các trường dữ liệu thiếu, chưa xử lý

      }

      if(!order.CRMTeamId) {
          order.CRMTeamId = team.Id;
          order.CRMTeamName = team.Name;
      }

      if(!order.Telephone && (partner && partner.Phone || conversationInfo.Conversation?.Phone)) {
          order.Telephone = partner.Phone || conversationInfo.Conversation?.Phone;
      }

      if(!order.Address && partner && partner.Street) {
          order.Telephone = partner.Street;
      }

      if(!order.Email && (partner && partner.Email || conversationInfo.Conversation?.Email) ) {
          order.Email = partner.Email || conversationInfo.Conversation?.Email;
      }

      if(!order.PartnerId && partner && partner.Id) {
          order.PartnerId = partner.Id;
          order.PartnerName = partner.Name || conversationInfo.Conversation?.Name;
      }

      if(!order.UserId && this.userInit) {
          order.UserId = this.userInit.Id;
          order.User = {
              Id: this.userInit.Id,
              Name: this.userInit.Name
          } as any;
      }

      if(!order.CityCode && partner && (partner.CityCode || partner.City?.code)) {
          order.CityCode = (partner.CityCode || partner.City?.code) as any;
          order.CityName = (partner.CityName || partner.City?.name) as any;
          order.DistrictCode = (partner.DistrictCode || partner.District?.code) as any;
          order.DistrictName = (partner.DistrictName || partner.District?.name) as any;
          order.WardCode = (partner.WardCode || partner.Ward?.code) as any;
          order.WardName = (partner.WardName || partner.Ward?.code) as any;
      }

      if(!order.Facebook_ASUserId && ((partner && partner.FacebookASIds) || conversationInfo.Conversation)) {
          order.Facebook_ASUserId = partner.FacebookASIds || conversationInfo.Conversation.ConversationId;
      }

      if(!order.Facebook_UserName && conversationInfo.Conversation.Name) {
          order.Facebook_UserName = conversationInfo.Conversation.Name;
      }

      if(!order.Facebook_UserId) {
          order.Facebook_UserId = conversationInfo.Conversation.UserId;
      }

      return {...order}
    }

    loadUserLogged() {
      this.auth.getUserInit().subscribe({
        next: (res: any) => {
            this.userInit = {...res};
        }
      });
    }
}
