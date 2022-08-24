import { Injectable } from "@angular/core";
import { ChatomniConversationInfoDto, ConversationPartnerDto } from "@app/dto/conversation-all/chatomni/chatomni-conversation-info.dto";
import { Detail_QuickSaleOnlineOrder, QuickSaleOnlineOrderModel } from "@app/dto/saleonlineorder/quick-saleonline-order.dto";
import { CRMTeamDTO } from "@app/dto/team/team.dto";
import { ProductTemplateUOMLineService } from "@app/services/product-template-uom-line.service";
import { UserInitDTO } from "@core/dto";
import { TAuthService } from "@core/services";
import { TDSHelperArray, TDSHelperObject } from "tds-ui/shared/utility";

@Injectable()

export class CsOrder_FromConversationHandler {

    private userInit!: UserInitDTO;

    constructor(private auth: TAuthService,
      private productTemplateUOMLineService: ProductTemplateUOMLineService){
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
          let x = this.productTemplateUOMLineService.getDefaultProduct() as  Detail_QuickSaleOnlineOrder;
          order.Details = [];

          if(x && x.ProductId) {
              let item = {
                  Id: null,
                  Quantity: 1,
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
          }
      }

      if(!order.CRMTeamId && team) {
          order.CRMTeamId = team.Id;
          order.CRMTeamName = team.Name;
      }

      if(!order.Telephone && (partner && partner.Phone || conversationInfo.Conversation?.Phone)) {
          order.Telephone = partner.Phone || conversationInfo.Conversation?.Phone;
      }

      if(!order.Address && partner && partner.Street) {
          order.Address = partner.Street;
      }

      if(!order.Email && (partner && partner.Email || conversationInfo.Conversation?.Email) ) {
          order.Email = partner.Email || conversationInfo.Conversation?.Email;
      }

      if(!order.PartnerId && partner && partner.Id) {
          order.PartnerId = partner.Id;
      }

      if(!order.PartnerName && conversationInfo.Conversation.Name) {
          order.PartnerName = conversationInfo.Conversation.Name;
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

      // TODO: nếu không có đơn hàng cũ thì tính tạm tổng tiền với product mặc định
      if(!conversationInfo.Order && TDSHelperArray.hasListValue(order.Details)) {
          order.TotalAmount = 0;
          order.TotalAmount = (order.Details[0].Price * order.Details[0].Quantity);
          order.TotalQuantity = 1;
      }

      return {...order}
    }

    updateOrderFromTabPartner(quickOrderModel: QuickSaleOnlineOrderModel, partner: ConversationPartnerDto) {

      if(partner.Name) {
          quickOrderModel.PartnerName = partner.Name;
      }

      if(partner.Phone) {
          quickOrderModel.Telephone = partner.Phone;
      }

      if(partner.Email) {
          quickOrderModel.Email = partner.Email;
      }

      if(partner.Street) {
          quickOrderModel.Address = partner.Street;
      }

      if(partner && (partner.CityCode || partner.City?.code)) {
          quickOrderModel.CityCode = (partner.CityCode || partner.City?.code) as any;
          quickOrderModel.CityName = (partner.CityName || partner.City?.name) as any;
          quickOrderModel.DistrictCode = (partner.DistrictCode || partner.District?.code) as any;
          quickOrderModel.DistrictName = (partner.DistrictName || partner.District?.name) as any;
          quickOrderModel.WardCode = (partner.WardCode || partner.Ward?.code) as any;
          quickOrderModel.WardName = (partner.WardName || partner.Ward?.code) as any;
      }

      return {...quickOrderModel};
    }

    loadUserLogged() {
      this.auth.getUserInit().subscribe({
        next: (res: any) => {
            this.userInit = {...res};
        }
      });
    }
}
