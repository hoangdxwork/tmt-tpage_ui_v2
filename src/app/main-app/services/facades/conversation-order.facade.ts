import { DataPouchDBDTO } from 'src/app/main-app/dto/product-pouchDB/product-pouchDB.dto';
import { EventEmitter, Injectable, OnDestroy, OnInit } from "@angular/core";
import { TAuthService, TCommonService, UserInitDTO } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { CRMTeamService } from "../crm-team.service";
import { PartnerService } from "../partner.service";
import { SignalRConnectionService } from "../signalR/signalR-connection.service";
import { TDSHelperObject, TDSHelperString, TDSSafeAny, TDSHelperArray } from 'tds-ui/shared/utility';
import { TabPartnerCvsRequestModel } from '../../dto/conversation-partner/partner-conversation-request.dto';
import { CRMTeamDTO } from '../../dto/team/team.dto';
import { Detail_QuickSaleOnlineOrder, QuickSaleOnlineOrderModel } from '../../dto/saleonlineorder/quick-saleonline-order.dto';
import { ChangeTabConversationEnum } from '@app/dto/conversation-all/chatomni/change-tab.dto';
import { ChatomniConversationInfoDto, ConversationPartnerDto } from '@app/dto/conversation-all/chatomni/chatomni-conversation-info.dto';

@Injectable()

export class ConversationOrderFacade extends BaseSevice  {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";

  private currentTeam!: CRMTeamDTO;;
  private userInit!: UserInitDTO;

  private lastOrder!: QuickSaleOnlineOrderModel;
  private partner!: TabPartnerCvsRequestModel;

  // Event loading tab partner, order
  public onChangeTab$ = new EventEmitter<ChangeTabConversationEnum>();

  // Event Output
  public onLastOrderUpdated$: EventEmitter<any> = new EventEmitter<any>();

  // output dùng để đẩy dữ liệu sang conversation-order
  public onLastOrderCheckedConversation$: EventEmitter<QuickSaleOnlineOrderModel> = new EventEmitter<QuickSaleOnlineOrderModel>();

  // TODO: Chọn làm địa chỉ, số điện thoại, ghi chú  selectOrder(type: string)
  public onSelectOrderFromMessage$: EventEmitter<any> = new EventEmitter<any>();

  // TODO: chọn sản phẩm từ tds-conversation sang tab đơn hàng
  public onAddProductOrder$:EventEmitter<DataPouchDBDTO> = new EventEmitter<DataPouchDBDTO>();

  // TODO: outPut thông tin khách hàng từ comment sang tab đơn hàng
  public onLoadedCommentByUser$:EventEmitter<TDSSafeAny> = new EventEmitter<TDSSafeAny>();

  // TODO: outPut thông tin khách hàng từ comment sang tab Khách hàng
  public loadPartnerByPostComment$ = new EventEmitter<any>();

  // TODO: outPut thông tin khách hàng từ comment sang tab Đơn hàng
  public loadInsertFromPostFromComment$ = new EventEmitter<any>();

  // TODO:click code đơn hàng từ bài viết
  public loadOrderFromCommentPost$ = new EventEmitter<any>();

  constructor(private apiService: TCommonService,
      private partnerService: PartnerService,
      private sgRConnectionService: SignalRConnectionService,
      private auth: TAuthService) {
        super(apiService);

        this.loadUserLogged();
  }

  prepareConversationOrder(conversationInfo: ChatomniConversationInfoDto, team: CRMTeamDTO){
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

  loadOrderFromSignalR(){
    this.sgRConnectionService._onSaleOnlineOrder$.subscribe((res: any) => {
        if(res && (res.action == "create" || res.action == "updated")) {

          if(this.partner && this.currentTeam && this.partner.Id &&
            (this.partner.Facebook_ASUserId == res.data.facebook_ASUserId && res.data.facebook_PageId == this.currentTeam.ChannelId ||
            this.partner.Facebook_ASUserId == res.data.facebook.psId && res.data.facebook.pageId == this.currentTeam.ChannelId)) {

                this.partnerService.getLastOrder(this.partner.Id).subscribe((obs: any) => {
                    if(obs) {
                        this.lastOrder = {...obs};

                        this.lastOrder.Details = [...obs.Details];
                        this.lastOrder.PartnerId = obs.PartnerId || obs.Partner?.Id;
                        this.lastOrder.PartnerName = obs.PartnerName || obs.Partner?.Name;

                    } else {
                      this.lastOrder && (delete this.lastOrder.Id)
                      this.lastOrder && (delete this.lastOrder.Code)
                    }

                    this.onLastOrderCheckedConversation$.emit(this.lastOrder);
                })
          }
        }
      }, error => {
          console.log(`Load đơn hàng từ signalR đã xảy ra lỗi: ${error}`);
      });
  }

  loadUserLogged() {
    this.auth.getUserInit().subscribe({
      next: (res: any) => {
          this.userInit = {...res};
      }
    });
  }

}
