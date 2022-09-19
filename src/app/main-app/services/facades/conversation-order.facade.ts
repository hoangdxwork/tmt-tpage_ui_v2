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
  public onAddProductOrder$:EventEmitter<any> = new EventEmitter<any>();

  // TODO: outPut thông tin khách hàng từ comment sang tab Khách hàng
  public loadPartnerByPostComment$ = new EventEmitter<ChatomniConversationInfoDto>();

  // TODO: thông tin đơn hàng khi click khách hàng từ comment
  public loadOrderByPartnerComment$ = new EventEmitter<ChatomniConversationInfoDto>();

  // TODO: outPut thông tin khách hàng từ comment sang tab Đơn hàng
  public loadInsertFromPostFromComment$ = new EventEmitter<any>();

  // TODO:click code đơn hàng từ bài viết
  public loadOrderFromCommentPost$ = new EventEmitter<any>();

  //TODO: output thông tin đơn hàng từ comment-filter-all sang conversation-order
  public onChangeCommentsOrderByPost$ = new EventEmitter<any>();

  // TODO: output có thông tin đơn hàng khi bấn thông tin khách hàng để Disable tab đơn hàng
  public hasValueOrderCode$ = new EventEmitter<any>();

  constructor(private apiService: TCommonService,
      private partnerService: PartnerService,
      private sgRConnectionService: SignalRConnectionService,
      private auth: TAuthService) {
        super(apiService);
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

}
