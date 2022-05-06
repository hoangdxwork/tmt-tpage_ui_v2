import { EventEmitter, Injectable, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { TCommonService } from "src/app/lib";
import { TDSHelperString, TDSMessageService } from "tmt-tang-ui";
import { CheckConversationData, ConversationLastOrder } from "../../dto/partner/check-conversation.dto";
import { BaseSevice } from "../base.service";
import { ConversationService } from "../conversation/conversation.service";
import { CRMTeamService } from "../crm-team.service";
import { ConversationFacebookState } from "../facebook-state/conversation-fb.state";
import { PartnerService } from "../partner.service";
import { SharedService } from "../shared.service";
import { SignalRConnectionService } from "../signalR/signalR-connection.service";
import { ConversationOrderForm } from '../../dto/coversation-order/conversation-order.dto';

@Injectable({
  providedIn: 'root'
})

export class ConversationOrderFacade extends BaseSevice implements OnInit, OnDestroy {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";
  private order!: ConversationOrderForm;
  private destroy$ = new Subject();
  public onLastOrderUpdated$: EventEmitter<any> = new EventEmitter<any>();
  public onLastOrderCheckCvs$: EventEmitter<any> = new EventEmitter<any>();

  constructor(private apiService: TCommonService,
      private fbState: ConversationFacebookState,
      private message: TDSMessageService,
      private crmTeamService: CRMTeamService,
      private service: ConversationService,
      private partnerService: PartnerService,
      private sgRConnectionService: SignalRConnectionService,
      private sharedService: SharedService) {
        super(apiService);
  }

  ngOnInit(): void {
    //TODO: Load đơn mặc định ở tab đơn hàng
    this.initialize();
    //TODO: Dùng để update realtime đơn hàng
    this.loadOrderFromSignalR();
  }

  loadOrderFromSignalR(){
    this.sgRConnectionService._onSaleOnlineOrder$.pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if(res && (res.action == "create" || res.action == "updated")) {

        }
    }, error => {
        this.message.error('Load đơn hàng từ signalR đã xảy ra lỗi');
    })
  }

  initialize() {
    this.partnerService.onLoadOrderFromTabPartner.pipe(takeUntil(this.destroy$))
      .subscribe((res: CheckConversationData) => {
        //TODO: thông tin đơn hàng gần nhất LastOrder
        if(res && res.LastOrder) {
          this.order = this.loadLastOrder(res);
        }
        //TODO: Không có đơn hàng gần nhất thì lưu thông partner vào _form mặc định
        else {
          this.order = this.loadOrderDefault(res);
        }
        this.onLastOrderCheckCvs$.emit(this.order);
    })
  }

  loadLastOrder(data: CheckConversationData): any {
    const order = data.LastOrder;
    const model = {} as ConversationOrderForm;
      model.Id = order.Id;
      model.Code = order.Code;
      model.LiveCampaignId = order.LiveCampaignId;
      model.Facebook_UserId = order.Facebook_UserId;
      model.Facebook_ASUserId = order.Facebook_ASUserId;
      model.Facebook_UserName = TDSHelperString.hasValueString(order.Facebook_UserName) ? order.Facebook_UserName : data.Facebook_UserName;
      model.Facebook_CommentId = order.Facebook_CommentId;
      model.Facebook_PostId = order.Facebook_PostId;
      model.PartnerId = order.PartnerId || order.Partner?.Id;
      model.PartnerName = order.PartnerName || order.Partner?.Name;
      model.Name = order.Name;
      model.Email = order.Email;
      model.TotalAmount = order.TotalAmount;
      model.TotalQuantity = order.TotalQuantity;

      model.UserId = order.UserId;
      model.Telephone = order.Telephone;
      model.Note = order.Note;
      model.CRMTeamId = order.CRMTeamId;
      model.PrintCount = order.PrintCount;
      model.Session = order.Session;
      model.SessionIndex = order.SessionIndex;
      model.StatusText = order.StatusText;
      model.Details = [];

      if(order.Address){
        model.Street = order.Address;
        model.City = order.CityCode ? { code: order.CityCode, name: order.CityName } : {}
        model.District = order.DistrictCode ? { code: order.DistrictCode, name: order.DistrictName } : {};
        model.Ward = order.WardCode ? { code: order.WardCode, name: order.WardName } : {};
      }
      //TODO: nếu đơn hàng không cho địa chỉ thì gán địa chỉ khách hàng
      else if(data.Street) {

      }

      model.User = { Id: order.UserId, Name: order.UserName };


    return model;
  }

  loadOrderDefault(data: CheckConversationData){

    const model = {} as ConversationOrderForm;
    return model;
  }

  prepareModel(data: any){

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
