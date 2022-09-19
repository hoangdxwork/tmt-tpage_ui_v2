import { Injectable } from "@angular/core";
import { ChatomniConversationInfoDto, ConversationPartnerDto } from "@app/dto/conversation-all/chatomni/chatomni-conversation-info.dto";
import { Detail_QuickSaleOnlineOrder, QuickSaleOnlineOrderModel } from "@app/dto/saleonlineorder/quick-saleonline-order.dto";
import { CRMTeamDTO } from "@app/dto/team/team.dto";
import { ProductTemplateUOMLineService } from "@app/services/product-template-uom-line.service";
import { SharedService } from "@app/services/shared.service";
import { UserInitDTO } from "@core/dto";
import { TDSHelperArray, TDSHelperObject, TDSHelperString } from "tds-ui/shared/utility";

@Injectable()

export class CsOrder_FromConversationHandler {

    private userInit!: UserInitDTO;

    constructor(private sharedService: SharedService,
      private productTemplateUOMLineService: ProductTemplateUOMLineService){
      this.loadUserLogged();
    }

    getOrderFromConversation(conversationInfo: ChatomniConversationInfoDto, team: CRMTeamDTO, type?: string){
      let order: QuickSaleOnlineOrderModel = {} as any;
      let partner: ConversationPartnerDto = {} as any;

      if(conversationInfo && TDSHelperObject.hasValue(conversationInfo.Partner)) {
          partner = conversationInfo.Partner;
      }

      // TODO: trường hợp có đơn hàng nháp gần nhất
      if(conversationInfo && TDSHelperObject.hasValue(conversationInfo.Order) && type != 'post') {
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
          let x = this.productTemplateUOMLineService.getDefaultProduct() as Detail_QuickSaleOnlineOrder;
          order.Details = [];

          if(x && x.ProductId && type != 'post') {
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
                  OrderId: null,
                  Priority: null,
                  ImageUrl: x.ImageUrl,
                  LiveCampaign_DetailId: null,
                  IsOrderPriority: false,
                  QuantityRegex: null
              } as Detail_QuickSaleOnlineOrder;

              order.Details.push(item);
          }
      }

      if(team && !order.CRMTeamId) {
          order.CRMTeamId = team.Id;
          order.CRMTeamName = team.Name;
      }

      order.Telephone = order.Telephone || partner?.Phone || conversationInfo.Conversation?.Phone;
      order.Address =  order.Address || partner?.Street as string;
      order.Email = order.Email || partner?.Email || conversationInfo.Conversation?.Email;

      order.PartnerId = order.PartnerId || conversationInfo.Partner?.Id;
      order.PartnerName = order.PartnerName || conversationInfo.Conversation.Name || partner.Name;

      if(this.userInit && !order.UserId) {
          order.UserId = this.userInit.Id;
          order.User = {
              Id: this.userInit.Id,
              Name: this.userInit.Name
          } as any;
      }

      if(!TDSHelperString.hasValueString(order.CityCode)) {
        order.CityCode = (partner?.CityCode || partner?.City?.code) as any;
        order.CityName = (partner?.CityName || partner?.City?.name) as any;
      }

      if(!TDSHelperString.hasValueString(order.DistrictCode)) {
        order.DistrictCode = (partner?.DistrictCode || partner?.District?.code) as any;
        order.DistrictName =  (partner?.DistrictName || partner?.District?.name) as any;
      }

      if(!TDSHelperString.hasValueString(order.WardCode)) {
        order.WardCode = (partner?.WardCode || partner?.Ward?.code) as any;
        order.WardName = (partner?.WardName || partner?.Ward?.code) as any;
      }

      order.Facebook_ASUserId = order.Facebook_ASUserId || conversationInfo.Conversation?.ConversationId;
      order.Facebook_UserName = order.Facebook_UserName || conversationInfo.Conversation?.Name;
      order.Facebook_UserId = order.Facebook_UserId || conversationInfo.Conversation?.UserId;

      // TODO: nếu không có đơn hàng cũ thì tính tạm tổng tiền với product mặc định
      if(!conversationInfo.Order && TDSHelperArray.hasListValue(order.Details)) {
          order.TotalAmount = 0;
          order.TotalAmount = (order.Details[0].Price * order.Details[0].Quantity);
          order.TotalQuantity = 1;
      }

      return {...order}
    }

    onSyncConversationInfoToOrder(conversationInfo: ChatomniConversationInfoDto, team: CRMTeamDTO, type: string) {
        let data = { ... this.getOrderFromConversation(conversationInfo, team, type) }
        return { ...data };
    }

    loadUserLogged() {
      this.sharedService.setUserLogged();
      this.sharedService.getUserLogged().subscribe({
        next: (res: any) => {
            this.userInit = res || {};
        }
      })
    }
}
