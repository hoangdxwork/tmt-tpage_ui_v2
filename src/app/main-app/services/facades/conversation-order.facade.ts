import { DataPouchDBDTO } from 'src/app/main-app/dto/product-pouchDB/product-pouchDB.dto';
import { EventEmitter, Injectable, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { TAuthService, TCommonService, UserInitDTO } from "src/app/lib";
import { CheckConversationData } from "../../dto/partner/check-conversation.dto";
import { BaseSevice } from "../base.service";
import { CRMTeamService } from "../crm-team.service";
import { PartnerService } from "../partner.service";
import { SharedService } from "../shared.service";
import { SignalRConnectionService } from "../signalR/signalR-connection.service";
import { ConversationOrderForm } from '../../dto/coversation-order/conversation-order.dto';
import { GeneralConfigsFacade } from "./general-config.facade";
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperObject, TDSHelperString, TDSSafeAny, TDSHelperArray } from 'tds-ui/shared/utility';
import { TabPartnerCvsRequestModel } from '../../dto/conversation-partner/partner-conversation-request.dto';
import { CRMTeamDTO } from '../../dto/team/team.dto';
import { Detail_QuickSaleOnlineOrder, QuickSaleOnlineOrderModel } from '../../dto/saleonlineorder/quick-saleonline-order.dto';
import { ProductService } from '../product.service';
import { ChangeTabConversationEnum } from '@app/dto/conversation-all/chatomni/change-tab.dto';

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

  // gán mã đơn hàng last order sáng tab đơn hàng
  public onPushLastOrderCode$ = new EventEmitter<any>();

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
  public loadCreateOrderByPostComment$ = new EventEmitter<any>();

  // TODO:click code đơn hàng từ bài viết
  public clickOrderFromCommentPost$ = new EventEmitter<any>();

  public onOrderCheckPost$: EventEmitter<ConversationOrderForm> = new EventEmitter<ConversationOrderForm>();

  constructor(private apiService: TCommonService,
      private message: TDSMessageService,
      private crmTeamService: CRMTeamService,
      private partnerService: PartnerService,
      private sgRConnectionService: SignalRConnectionService,
      private generalConfigsFacade: GeneralConfigsFacade,
      private auth: TAuthService,
      private sharedService: SharedService) {
        super(apiService);

        this.onInit();
  }

  onInit(): void {
    this.loadUserLogged();
    this.loadTeam();

    // TODO: Load data mặc định ở tab đơn hàng
    this.initialize();
    // TODO: Dùng để update realtime đơn hàng
    this.loadOrderFromSignalR();
  }

  initialize() {
    this.partnerService.onLoadOrderFromTabPartner$.subscribe((obs: TabPartnerCvsRequestModel) => {

      // TODO: load dữ liệu từ coversation-parter và check dk nếu là partner mới hay cũ để mapping
      let exits = this.partner && obs && (obs.Id == this.partner.Id || obs.Facebook_ASUserId == this.partner.Facebook_ASUserId);

      if(!exits) {
          this.partner = { ... obs };

          // TODO: partner có đơn hàng nháp gần nhất LastOrder
          if(obs && obs?.LastOrder) {
              this.lastOrder = {...this.loadLastOrder(obs)};
              this.onLastOrderCheckedConversation$.emit(this.lastOrder);
          }
          // TODO: Không có đơn hàng nháp gần nhất thì tạo form mặc định
          else {
              let orderDefault = {...this.loadLastOrderDefault(obs)};
              this.onLastOrderCheckedConversation$.emit(orderDefault);
          }
      } else {
          this.lastOrder = {...this.loadCurrentPartner(obs)};debugger
          this.onLastOrderCheckedConversation$.emit(this.lastOrder);
      }
    });
  }

  loadLastOrder(model: TabPartnerCvsRequestModel): any {
    let x = {} as QuickSaleOnlineOrderModel;
    let order = model.LastOrder;

    x = {...order};
    x.PartnerId = order.PartnerId || order.Partner?.Id;
    x.PartnerName = order.PartnerName || order.Partner?.Name;
    x.Name = order.Name ||  order.PartnerName || order.Partner?.Name || model.Facebook_UserName;

    x.UserId = order.UserId || order.User?.Id;
    x.UserName = order.UserName || order.User?.Name;

    x.Facebook_ASUserId = order.Facebook_UserId || model.Facebook_ASUserId;
    x.Facebook_UserName = order.Facebook_UserName || model.Facebook_UserName;

    x.Telephone = order.Telephone || model.Facebook_UserPhone;
    x.Email = order.Email || model.Email;

    x.Note = order.Note || model.Comment;

    if(TDSHelperArray.hasListValue(order.Details)) {
        x.Details = [ ...order.Details];
    } else {
        x.Details = []
    }

    if(TDSHelperString.hasValueString(model.Street) && !TDSHelperString.hasValueString(order.Address)) {
      x.Address = model.Street;
      if(model.City?.code) {
          x.CityCode = model.City.code;
          x.CityName = model.City.name;
      }
      if(model.District?.code) {
          x.DistrictCode = model.District.code;
          x.DistrictName = model.District.name;
      }
      if(model.Ward?.code) {
          x.WardCode = model.Ward.code;
          x.WardName = model.Ward.name;
      }
    }

    return {...x};
  }

  loadLastOrderDefault(model: TabPartnerCvsRequestModel) {
    let x = {} as QuickSaleOnlineOrderModel;

    x.Name = model.Name || model.Facebook_UserName;
    x.PartnerId = model.Id;
    x.PartnerName = model.Name;
    x.Facebook_ASUserId = model.Facebook_ASUserId;
    x.Facebook_UserName = model.Facebook_UserName;
    x.Telephone = model.Phone || model.Facebook_UserPhone;
    x.Email = model.Email;
    x.Address = model.Street || model.Facebook_UserAddress;

    if(model.City?.code) {
        x.CityCode = model.City?.code;
        x.CityName = model.City?.name
    }
    if(model.District?.code) {
        x.DistrictCode = model.District.code;
        x.DistrictName = model.District.name;
    }
    if(model.Ward?.code) {
        x.WardCode = model.Ward.code;
        x.WardName = model.Ward.name;
    }

    if(this.userInit) {
        x.UserId = this.userInit?.Id;
        x.UserName = this.userInit?.Name;
    }

    x.Note = model.Comment;

    // TODO: Xử lý gán sản phẩm mặc định từ cầu hình tại đây
    if(TDSHelperArray.hasListValue(model.LastOrder?.Details)) {
        x.Details = [ ...model?.LastOrder.Details ];
    } else {
        x.Details = [];
    }

    return {...x};

    // return new Observable(obs => {

    //   if(TDSHelperString.hasValueString(model.page_id) && TDSHelperString.hasValueString(model.psid)) {

    //     let data = {
    //         UserId: model.psid,
    //         PageId: model.page_id
    //     };

    //     this.partnerService.checkInfo(data).subscribe((res: any) => {
    //         if(res && res.Success && res.Data?.Id) {

    //             if(TDSHelperString.hasValueString(res.Data.Name)) {
    //                 x.PartnerName = res.Data.Name;
    //                 x.Name = res.Data.Name;
    //             }

    //             x.Email = res.Data.Email;
    //             x.PartnerId = res.Data.Id;

    //             if(TDSHelperString.hasValueString(res.Data.Street)) {
    //                 x.Address = res.Data.Street;
    //             }
    //             if(TDSHelperString.hasValueString(res.Data.Phone)) {
    //                 x.Telephone = res.Data.Phone;
    //             }

    //             obs.next({...x});
    //             obs.complete();
    //         } else {
    //             obs.next({...x});
    //             obs.complete();
    //         }
    //       }, error => {
    //           obs.next(x);
    //           obs.complete();
    //     })
    //   }
    // })
  }

  loadCurrentPartner(model: TabPartnerCvsRequestModel): any {debugger

    this.partner = { ... model} as any;
    this.partner.LastOrder = { ... model.LastOrder };

    if(TDSHelperArray.hasListValue(model.LastOrder?.Details)) {
        this.partner.LastOrder.Details = [...model.LastOrder.Details];
    }

    let x = this.partner.LastOrder as QuickSaleOnlineOrderModel;

    x.Telephone = this.partner.Phone || model.Facebook_UserPhone;
    x.Name = model.Name || model.Facebook_UserName || x.Partner?.Name || x.PartnerName;

    x.PartnerName = model.Name || model.Facebook_UserName;
    x.Facebook_UserName = x.Facebook_UserName || model.Facebook_UserName;

    x.UserId = x.UserId || x.User?.Id;
    x.UserName = x.UserName || x.User?.Name;
    x.Facebook_ASUserId = x.Facebook_UserId || model.Facebook_ASUserId;
    x.Facebook_UserName = x.Facebook_UserName || model.Facebook_UserName;

    x.Telephone = x.Telephone || model.Facebook_UserPhone;
    x.Email = x.Email || model.Email;

    x.Note = x.Note || model.Comment;

    if(TDSHelperArray.hasListValue(this.partner?.LastOrder?.Details)) {
        x.Details = [ ... this.partner.LastOrder.Details ]
    } else {
        x.Details = [];
    }

    if(TDSHelperString.hasValueString(model.Street) && !TDSHelperString.hasValueString(x.Address)) {
      x.Address = model.Street;
      if(model.City?.code) {
          x.CityCode = model.City.code;
          x.CityName = model.City.name;
      }
      if(model.District?.code) {
          x.DistrictCode = model.District.code;
          x.DistrictName = model.District.name;
      }
      if(model.Ward?.code) {
          x.WardCode = model.Ward.code;
          x.WardName = model.Ward.name;
      }
    }

    return {...x};
  }

  // loadOrderDefault(data: CheckConversationData, dataComment?: TDSSafeAny){
  //   const model =  {} as any; //this.orderDefault() as ConversationOrderForm;

  //   model.Name = data.Name || "";
  //   model.PartnerName = data.Name || "";
  //   model.PartnerId = data.Id;

  //   model.Facebook_ASUserId = data.Facebook_ASUserId;
  //   model.Facebook_UserName = data.Facebook_UserName || "";
  //   model.Telephone = data.Phone || data.Facebook_UserPhone;
  //   model.Email = data.Email;
  //   model.Street = data.Street || data.Facebook_UserAddress;

  //   model.City = data?.City?.code ? { Code: data.City.code, Name: data.City.name } : undefined;
  //   model.District = data?.District?.code ? { Code: data.District.code, Name: data.District.name } : undefined;
  //   model.Ward = data?.Ward?.code ? { Code: data.Ward.code, Name: data.Ward.name } : undefined;

  //   model.Details = this.productDefault ?  [this.productDefault] : [];
  //   model.User = this.userInit ? { Id: this.userInit?.Id, Name: this.userInit?.Name } : undefined;

  //   if(TDSHelperObject.hasValue(dataComment)) {
  //     model.Facebook_CommentId  = dataComment.id;
  //     model.Facebook_PostId = dataComment?.object?.id;
  //     model.Facebook_UserName = dataComment?.from?.name;
  //     model.Facebook_UserId = dataComment?.from?.id;
  //   }

  //   return {...model};
  // }

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
    this.auth.getUserInit().subscribe(res => {
        if(res) {
            this.userInit = res;
        }
    });
  }

  loadTeam() {
    this.currentTeam = this.crmTeamService.getCurrentTeam() as any;
  }

}
