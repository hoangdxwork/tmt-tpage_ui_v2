import { ActivityByGroup } from './../../dto/conversation/post/comment-group.dto';
import { EventEmitter, Injectable, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { TAuthService, TCommonService, UserInitDTO } from "src/app/lib";
import { CheckConversationData } from "../../dto/partner/check-conversation.dto";
import { BaseSevice } from "../base.service";
import { CRMTeamService } from "../crm-team.service";
import { PartnerService } from "../partner.service";
import { SharedService } from "../shared.service";
import { SignalRConnectionService } from "../signalR/signalR-connection.service";
import { ConversationOrderForm } from '../../dto/coversation-order/conversation-order.dto';
import { GeneralConfigsFacade } from "./general-config.facade";
import { ProductDTO } from "../../dto/product/product.dto";
import { ChangeTabConversationEnum } from '../../dto/conversation/conversation.dto';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperObject, TDSHelperString, TDSSafeAny, TDSHelperArray } from 'tds-ui/shared/utility';
import { TabPartnerCvsRequestModel } from '../../dto/conversation-partner/partner-conversation-request.dto';
import { CRMTeamDTO } from '../../dto/team/team.dto';
import { Detail_QuickSaleOnlineOrder, QuickSaleOnlineOrderModel } from '../../dto/saleonlineorder/quick-saleonline-order.dto';
import { ProductService } from '../product.service';

@Injectable({
  providedIn: 'root'
})

export class ConversationOrderFacade extends BaseSevice  {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";
  private currentTeam!: CRMTeamDTO;;
  private userInit!: UserInitDTO;

  private lastOrder!: QuickSaleOnlineOrderModel;
  private partner!: TabPartnerCvsRequestModel;
  private productDefault!: Detail_QuickSaleOnlineOrder;

  // Event loading tab partner, order
  public onChangeTab$ = new EventEmitter<ChangeTabConversationEnum>();
  // Event Output
  public onLastOrderUpdated$: EventEmitter<any> = new EventEmitter<any>();
  // output dùng để đẩy dữ liệu sang conversation-order
  public onLastOrderCheckedConversation$: EventEmitter<QuickSaleOnlineOrderModel> = new EventEmitter<QuickSaleOnlineOrderModel>();
  // TODO: Chọn làm địa chỉ, số điện thoại, ghi chú  selectOrder(type: string)
  public onSelectOrderFromMessage$: EventEmitter<any> = new EventEmitter<any>();

  public loadPartnerByPostComment$ = new EventEmitter<any>();
  public onOrderCheckPost$: EventEmitter<ConversationOrderForm> = new EventEmitter<ConversationOrderForm>();

  constructor(private apiService: TCommonService,
      private message: TDSMessageService,
      private crmTeamService: CRMTeamService,
      private partnerService: PartnerService,
      private sgRConnectionService: SignalRConnectionService,
      private generalConfigsFacade: GeneralConfigsFacade,
      private auth: TAuthService,
      private productService: ProductService,
      private sharedService: SharedService) {
        super(apiService);

        this.onInit();
  }

  onInit(): void {
    // this.loadSaleConfig();
    this.loadUserLogged();
    this.loadTeam();

    // TODO: Load đơn mặc định ở tab đơn hàng
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

          // TODO: partner có đơn hàng gần nhất LastOrder
          if(obs && obs?.LastOrder) {
              this.lastOrder = this.loadLastOrder(obs);
              this.onLastOrderCheckedConversation$.emit(this.lastOrder);
          }
          // TODO: Không có đơn hàng gần nhất thì sử dụng đơn hàng nháp gần nhất
          else {
              this.loadLastOrderDraft(obs).subscribe((res: any) => {
                  if(res) {
                      this.onLastOrderCheckedConversation$.emit(res);
                  }
              })
          }
      } else {
          this.lastOrder = this.loadCurrentPartner(obs);
          this.onLastOrderCheckedConversation$.emit(this.lastOrder);
      }
    });
  }

  loadOrderFromSignalR(){
    this.sgRConnectionService._onSaleOnlineOrder$.subscribe((res: any) => {
        if(res && (res.action == "create" || res.action == "updated")) {

          if(this.partner && this.currentTeam && this.partner.Id &&
            (this.partner.Facebook_ASUserId == res.data.facebook_ASUserId && res.data.facebook_PageId == this.currentTeam.Facebook_PageId ||
            this.partner.Facebook_ASUserId == res.data.facebook.psId && res.data.facebook.pageId == this.currentTeam.Facebook_PageId)) {

                this.partnerService.getLastOrder(this.partner.Id).subscribe((obs: any) => {
                    if(obs) {
                        this.lastOrder = { ...obs };

                        this.lastOrder.Details = [...this.lastOrder.Details, ...obs.Details];
                        this.lastOrder.PartnerId = obs.PartnerId || obs.Partner?.Id;
                        this.lastOrder.PartnerName = obs.PartnerId || obs.Partner?.Name;

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

  loadSaleConfig() {
    this.generalConfigsFacade.getSaleConfigs().subscribe(res => {
        if(TDSHelperObject.hasValue(res.SaleSetting?.Product)) {
            this.productDefault = this.createProductDefault(res.SaleSetting?.Product);
        }
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

  createProductDefault(model: ProductDTO): any {
    let x = {
        Note: model.Note,
        Price: model.Price || model.PriceVariant || 0,
        ProductCode: model.DefaultCode,
        ProductId: model.Id,
        ProductName: model.Name,
        ProductNameGet: model.NameGet,
        Quantity: 1,
        UOMId: model.UOMId,
        UOMName: model.UOMName
    } as Detail_QuickSaleOnlineOrder

    return x;
  }

  editOrderFormPost(order: TDSSafeAny) {
    // this.onChangeTab$.emit(ChangeTabConversationEnum.order);
    // this.saleOnline_OrderService.getById(order.Id)
    //   .subscribe(res => {
    //     let pageId = res?.Facebook_PostId.split("_")[0];
    //     let psid = res?.Facebook_ASUserId || res?.Facebook_UserId;

    //     this.order = this.loadLastOrder(res);
    //     this.onOrderCheckPost$.emit(this.order);
    //     this.checkConversation(pageId, psid, res);
    //   });
  }

  commentFormPost(data: ActivityByGroup, isCreateOrder: boolean) {
    let psid = data?.from?.id;
    let postId = data?.object?.id;

    if(postId){
      let pageId = postId.split("_")[0];
      let currentTeam = this.crmTeamService.getCurrentTeam();

      if(isCreateOrder === true) {
        this.onChangeTab$.emit(ChangeTabConversationEnum.order);
        this.createOrderByComment(data, psid, pageId)
          .subscribe(res => {
            this.checkConversation(pageId, psid, data);
          }, error => {});
      }
      else {
        this.onChangeTab$.emit(ChangeTabConversationEnum.partner);
        // this.loadPartnerByComment(data, psid, postId, currentTeam?.Id)
        //   .subscribe(res => {
        //     this.checkConversation(pageId, psid, data);
        //   }, error => {});
      }
    }else{
      this.message.error('Không tìm thấy thông tin page')
    }
  }

  createOrderByComment(comment: TDSSafeAny, psid: string, pageId: string): Observable<any> {
    return new Observable(observer => {

      // this.checkInfoPartner(psid, pageId).subscribe(infoPartner => {
      //   if(infoPartner?.Data) {
      //     // Tạo order form, update theo comment
      //     let formOrder = this.orderFormHandler.createOrderFormGroup();
      //     this.orderFormHandler.updateFormByComment(formOrder, comment, infoPartner?.Data);

      //     // Gán Facebook_Comments
      //     let fbComment = this.checkFormHandler.prepareOrderComment(comment);
      //     formOrder.controls.Facebook_Comments.setValue([fbComment]);

      //     // Chuẩn bị model
      //     let model = this.checkFormHandler.prepareOrder(formOrder);

      //     // Tạo đơn theo bình luận
      //     this.saleOnline_OrderService.insertFromPost(model, true).subscribe((res) => {
      //       // this.order = this.loadLastOrder(res);
      //       this.onOrderCheckPost$.emit(this.order);
      //       this.message.success(Message.Order.UpdateSuccess);

      //       observer.next();
      //       observer.complete();
      //     }, error => {
      //       this.message.error(`${error?.error?.message}` || JSON.stringify(error));
      //       observer.next(error);
      //     });
      //   }
      // });
    });
  }

  loadPartnerByComment(comment: TDSSafeAny, psid: string, postId: string, teamId: number) {
    // return new Observable(observer => {

    //   this.facebookCommentService.getCustomersByFacebookId(psid, postId, teamId).subscribe(customer => {
    //     if(TDSHelperArray.hasListValue(customer?.orders)) {
    //       this.order = this.loadLastOrder(customer.orders[0]);
    //       this.onOrderCheckPost$.emit(this.order);

    //       observer.next();
    //       observer.complete();
    //     }
    //     else {
    //       let pageId = postId.split("_")[0];

    //       this.checkInfoPartner(psid, pageId).subscribe(partner => {
    //         this.order = this.loadOrderDefault(partner?.Data, comment);
    //         this.onOrderCheckPost$.emit(this.order);

    //         observer.next();
    //         observer.complete();
    //       });
    //     }
    //   });
    // });
  }

  checkConversation(pageId: string, psid: string, dataComment?: any ) {
    this.partnerService.checkConversation(pageId, psid)
      .subscribe(res => {
        if(res?.Data && res.Success === true) {
          res.Data.Facebook_UserName = res.Data.Facebook_UserName || dataComment?.from?.name || dataComment?.Facebook_UserName;
        }

        // this.onLoadConversationPartner$.emit(res?.Data)
      });
  }

  loadLastOrder(model: TabPartnerCvsRequestModel): any {
    let x = {} as QuickSaleOnlineOrderModel;
    let order = model.LastOrder;

    x = {...order};
    x.PartnerId = order.PartnerId || order.Partner?.Id;
    x.PartnerName = order.PartnerName || order.Partner?.Name;

    x.UserId = order.UserId || order.User?.Id;
    x.UserName = order.UserName || order.User?.Name;

    x.Facebook_ASUserId = order.Facebook_UserId || model.Facebook_ASUserId;
    x.Facebook_UserName = order.Facebook_UserName || model.Facebook_UserName;

    x.Telephone = order.Telephone || model.Facebook_UserPhone;
    x.Email = order.Email || model.Email;

    if(TDSHelperArray.hasListValue(order.Details)) {
        x.Details = [ ...x.Details, ...order.Details];
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
    return x;
  }

  loadLastOrderDraft(model: TabPartnerCvsRequestModel): Observable<any> {
    let x = {} as QuickSaleOnlineOrderModel;

    x.Name = model.Name;
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

    if(TDSHelperArray.hasListValue(model.LastOrder?.Details)) {
        x.Details = [ ...model?.LastOrder.Details ];
    } else {
        x.Details = [];
    }

    return new Observable(obs => {

      if(TDSHelperString.hasValueString(model.page_id) && TDSHelperString.hasValueString(model.psid)) {

        let data = {
            UserId: model.page_id,
            PageId: model.psid
        };

        this.partnerService.checkInfo(data).subscribe((res: any) => {
            if(res?.Success && res?.Data?.Id) {

                  if(TDSHelperString.hasValueString(res.Data.Name)) {
                      x.PartnerName = res.Data.Name;
                      x.Name = res.Data.Name;
                  }

                  x.Email = res.Data.Email;
                  x.PartnerId = res.Data.Id;

                  if(TDSHelperString.hasValueString(res.Data.Street)) {
                      x.Address = res.Data.Street;
                  }
                  if(TDSHelperString.hasValueString(res.Data.Phone)) {
                      x.Telephone = res.Data.Phone;
                  }

                  obs.next(x);
                  obs.complete();
            } else {
                obs.next(x);
                obs.complete();
            }
          }, error => {
              obs.next(x);
              obs.complete();
        })
      }
    })
  }

  loadCurrentPartner(model: TabPartnerCvsRequestModel): any {

    this.partner = { ... model} as any;
    this.partner.LastOrder = { ... model.LastOrder };

    if(TDSHelperArray.hasListValue(model.LastOrder?.Details)) {
        this.partner.LastOrder.Details = [...model.LastOrder.Details];
    }

    let x = this.partner.LastOrder as QuickSaleOnlineOrderModel;

    x.Telephone = this.partner.Phone || model.Facebook_UserPhone;
    x.Name = model.Name || model.Facebook_UserName;

    x.PartnerName = model.Name || model.Facebook_UserName;
    x.Facebook_UserName = x.Facebook_UserName || model.Facebook_UserName;

    x.UserId = x.UserId || x.User?.Id;
    x.UserName = x.UserName || x.User?.Name;
    x.Facebook_ASUserId = x.Facebook_UserId || model.Facebook_ASUserId;
    x.Facebook_UserName = x.Facebook_UserName || model.Facebook_UserName;

    x.Telephone = x.Telephone || model.Facebook_UserPhone;
    x.Email = x.Email || model.Email;

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

    return x;
  }

  loadOrderDefault(data: CheckConversationData, dataComment?: TDSSafeAny){
    const model =  {} as any; //this.orderDefault() as ConversationOrderForm;

    model.Name = data.Name || "";
    model.PartnerName = data.Name || "";
    model.PartnerId = data.Id;

    model.Facebook_ASUserId = data.Facebook_ASUserId;
    model.Facebook_UserName = data.Facebook_UserName || "";
    model.Telephone = data.Phone || data.Facebook_UserPhone;
    model.Email = data.Email;
    model.Street = data.Street || data.Facebook_UserAddress;

    model.City = data?.City?.code ? { Code: data.City.code, Name: data.City.name } : undefined;
    model.District = data?.District?.code ? { Code: data.District.code, Name: data.District.name } : undefined;
    model.Ward = data?.Ward?.code ? { Code: data.Ward.code, Name: data.Ward.name } : undefined;

    model.Details = this.productDefault ?  [this.productDefault] : [];
    model.User = this.userInit ? { Id: this.userInit?.Id, Name: this.userInit?.Name } : undefined;

    if(TDSHelperObject.hasValue(dataComment)) {
      model.Facebook_CommentId  = dataComment.id;
      model.Facebook_PostId = dataComment?.object?.id;
      model.Facebook_UserName = dataComment?.from?.name;
      model.Facebook_UserId = dataComment?.from?.id;
    }

    return model;
  }
}
