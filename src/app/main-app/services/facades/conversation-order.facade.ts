import { ActivityByGroup } from './../../dto/conversation/post/comment-group.dto';
import { Message } from './../../../lib/consts/message.const';
import { OrderFormHandler } from './../handlers/order-form.handler';
import { ChangeDetectorRef, EventEmitter, Injectable, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { finalize, takeUntil } from "rxjs/operators";
import { TAuthService, TCommonService, UserInitDTO } from "src/app/lib";
import { CheckConversationData, CheckConversationDTO, ConversationLastOrderDetailDTO } from "../../dto/partner/check-conversation.dto";
import { BaseSevice } from "../base.service";
import { ConversationService } from "../conversation/conversation.service";
import { CRMTeamService } from "../crm-team.service";
import { PartnerService } from "../partner.service";
import { SharedService } from "../shared.service";
import { SignalRConnectionService } from "../signalR/signalR-connection.service";
import { ConversationOrderForm, ConversationOrderProductDefaultDTO } from '../../dto/coversation-order/conversation-order.dto';
import { GeneralConfigsFacade } from "./general-config.facade";
import { ProductDTO } from "../../dto/product/product.dto";
import { FacebookCommentService } from "../facebook-comment.service";
import { SaleOnline_OrderDTO, SaleOnline_Order_DetailDTO } from "../../dto/saleonlineorder/sale-online-order.dto";
import { CheckFormHandler } from '../handlers/check-form.handler';
import { SaleOnline_OrderService } from '../sale-online-order.service';
import { FormGroup } from '@angular/forms';
import { ProductTemplateV2DTO } from '../../dto/producttemplate/product-tempalte.dto';
import { DataPouchDBDTO } from '../../dto/product-pouchDB/product-pouchDB.dto';
import { ChangeTabConversationEnum } from '../../dto/conversation/conversation.dto';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';

@Injectable({
  providedIn: 'root'
})

export class ConversationOrderFacade extends BaseSevice implements OnDestroy {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";
  private destroy$ = new Subject<void>();

  private userInit!: UserInitDTO;
  private order!: ConversationOrderForm;
  private productDefault!: ConversationOrderProductDefaultDTO | undefined;

  public onAddProductOrder = new EventEmitter<DataPouchDBDTO>();

  // Event loading tab partner, order
  public onChangeTab$ = new EventEmitter<ChangeTabConversationEnum>();

  // Event Output
  public onLastOrderUpdated$: EventEmitter<any> = new EventEmitter<any>();
  public onLastOrderCheckCvs$: EventEmitter<ConversationOrderForm> = new EventEmitter<ConversationOrderForm>();

  // TODO: Chọn làm địa chỉ, số điện thoại, ghi chú  selectOrder(type: string)
  public onSelectOrderFromMessage$: EventEmitter<any> = new EventEmitter<any>();

  public loadPartnerByPostComment$ = new EventEmitter<any>();
  public onOrderCheckPost$: EventEmitter<ConversationOrderForm> = new EventEmitter<ConversationOrderForm>();

  constructor( private apiService: TCommonService,
      private message: TDSMessageService,
      private crmTeamService: CRMTeamService,
      private service: ConversationService,
      private partnerService: PartnerService,
      private sgRConnectionService: SignalRConnectionService,
      private generalConfigsFacade: GeneralConfigsFacade,
      private facebookCommentService: FacebookCommentService,
      private orderFormHandler: OrderFormHandler,
      private checkFormHandler: CheckFormHandler,
      private saleOnline_OrderService: SaleOnline_OrderService,
      private auth: TAuthService,
      private sharedService: SharedService) {
        super(apiService);
        this.onInit();
  }

  onInit(): void {
    //TODO: Load đơn mặc định ở tab đơn hàng
    this.initialize();
    //TODO: Dùng để update realtime đơn hàng
    this.loadOrderFromSignalR();

    this.loadData();
  }

  loadData() {
    this.loadUserLogged();
    this.loadSaleConfig();
  }

  initialize() {
    this.changePartner();
  }

  loadSaleConfig() {
    this.generalConfigsFacade.getSaleConfigs().subscribe(res => {
      if(TDSHelperObject.hasValue(res?.SaleSetting)){
        let saleSetting = res.SaleSetting;

        if(TDSHelperObject.hasValue(saleSetting?.Product)) {
          this.productDefault = this.updateProductDefault(saleSetting?.Product);
        }
      }
    });
  }

  loadUserLogged() {
    this.auth.getUserInit().subscribe(res => {
      this.userInit = res || {};
    });
  }

  updateProductDefault(productSetting: ProductDTO | undefined): ConversationOrderProductDefaultDTO | undefined {
    if(productSetting) {
      let result: ConversationOrderProductDefaultDTO = {
        Note: productSetting.Note ? productSetting.Note : null,
        Price: productSetting.Price || productSetting.PriceVariant || 0,
        ProductCode: productSetting.DefaultCode,
        ProductId: productSetting.Id,
        ProductName: productSetting.Name,
        ProductNameGet: productSetting.NameGet,
        Quantity: 1,
        UOMId: productSetting.UOMId,
        UOMName: productSetting.UOMName,
      };

      return result;
    }

    return undefined;
  }

  loadOrderFromSignalR(){
    this.sgRConnectionService._onSaleOnlineOrder$.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        if(res && (res.action == "create" || res.action == "updated")) {

        }
      }, error => {
          // this.message.error('Load đơn hàng từ signalR đã xảy ra lỗi');
          console.log(`Load đơn hàng từ signalR đã xảy ra lỗi: ${error}`);
      });
  }

  changePartner() {
    this.partnerService.onLoadOrderFromTabPartner$.pipe(takeUntil(this.destroy$)).subscribe((res: CheckConversationData) => {
        // Partner có đơn hàng gần nhất LastOrder
        if(res?.LastOrder) {
          this.order = this.loadLastOrder(res.LastOrder, res);
        }
        //Không có đơn hàng gần nhất thì sử dụng order form mặc định
        else {
          this.order = this.loadOrderDefault(res);
        }

        this.onLastOrderCheckCvs$.emit(this.order);
      });
  }

  checkInfoPartner(userId: string, pageId: string): Observable<any> {
    return new Observable(observer => {
      let model = {
        UserId: userId,
        PageId: pageId
      };

      this.partnerService.checkInfo(model).subscribe(res => {
        observer.next(res);
        observer.complete();
      }, error => observer.error(error));
    });
  }

  editOrderFormPost(order: TDSSafeAny) {
    this.onChangeTab$.emit(ChangeTabConversationEnum.order);
    this.saleOnline_OrderService.getById(order.Id)
      .subscribe(res => {
        let pageId = res?.Facebook_PostId.split("_")[0];
        let psid = res?.Facebook_ASUserId || res?.Facebook_UserId;

        this.order = this.loadLastOrder(res);
        this.onOrderCheckPost$.emit(this.order);
        this.checkConversation(pageId, psid, res);
      });
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
        this.loadPartnerByComment(data, psid, postId, currentTeam?.Id)
          .subscribe(res => {
            this.checkConversation(pageId, psid, data);
          }, error => {});
      }
    }else{
      this.message.error('Không tìm thấy thông tin page')
    }
  }

  createOrderByComment(comment: TDSSafeAny, psid: string, pageId: string): Observable<any> {
    return new Observable(observer => {

      this.checkInfoPartner(psid, pageId).subscribe(infoPartner => {
        if(infoPartner?.Data) {
          // Tạo order form, update theo comment
          let formOrder = this.orderFormHandler.createOrderFormGroup();
          this.orderFormHandler.updateFormByComment(formOrder, comment, infoPartner?.Data);

          // Gán Facebook_Comments
          let fbComment = this.checkFormHandler.prepareOrderComment(comment);
          formOrder.controls.Facebook_Comments.setValue([fbComment]);

          // Chuẩn bị model
          let model = this.checkFormHandler.prepareOrder(formOrder);

          // Tạo đơn theo bình luận
          this.saleOnline_OrderService.insertFromPost(model, true).subscribe((res) => {
            this.order = this.loadLastOrder(res);
            this.onOrderCheckPost$.emit(this.order);
            this.message.success(Message.Order.UpdateSuccess);

            observer.next();
            observer.complete();
          }, error => {
            this.message.error(`${error?.error?.message}` || JSON.stringify(error));
            observer.next(error);
          });
        }
      });
    });
  }

  loadPartnerByComment(comment: TDSSafeAny, psid: string, postId: string, teamId: number): Observable<any> {
    return new Observable(observer => {

      this.facebookCommentService.getCustomersByFacebookId(psid, postId, teamId).subscribe(customer => {
        if(TDSHelperArray.hasListValue(customer?.orders)) {
          this.order = this.loadLastOrder(customer.orders[0]);
          this.onOrderCheckPost$.emit(this.order);

          observer.next();
          observer.complete();
        }
        else {
          let pageId = postId.split("_")[0];

          this.checkInfoPartner(psid, pageId).subscribe(partner => {
            this.order = this.loadOrderDefault(partner?.Data, comment);
            this.onOrderCheckPost$.emit(this.order);

            observer.next();
            observer.complete();
          });
        }
      });
    });
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

  updateOrderFormByComment(form: FormGroup, comment: any) {
    form.reset();
  }

  loadLastOrder(data: SaleOnline_OrderDTO, conversationData?: CheckConversationData): any {
    const order = conversationData?.LastOrder || data;
    const model = {} as ConversationOrderForm;

    model.Id = order.Id;
    model.Code = order.Code;
    model.LiveCampaignId = order.LiveCampaignId;
    model.Facebook_UserId = order.Facebook_UserId;
    model.Facebook_ASUserId = order.Facebook_ASUserId;
    model.Facebook_UserName = TDSHelperString.hasValueString(order.Facebook_UserName) ? order.Facebook_UserName : (conversationData?.Facebook_UserName || '');
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

    model.Details = this.updateDetail(order.Details);

    if(order.Address){
      model.Street = order.Address;
      model.City = order.CityCode ? { Code: order.CityCode, Name: order.CityName } : undefined;
      model.District = order.DistrictCode ? { Code: order.DistrictCode, Name: order.DistrictName } : undefined;
      model.Ward = order.WardCode ? { Code: order.WardCode, Name: order.WardName } : undefined;
    }

    // Nếu đơn hàng không cho địa chỉ thì gán địa chỉ partner
    else if(conversationData?.Street) {
      model.Street = conversationData.Street;
      model.City = conversationData.City;
      model.District = conversationData.District;
      model.Ward = conversationData.Ward;
    }

    model.User = order.User ? { Id: order.User?.Id, Name: order.User?.Name } : undefined;

    return model;
  }

  updateDetail(details: SaleOnline_Order_DetailDTO[]) {
    let formDetails = [] as ConversationOrderProductDefaultDTO[];

    formDetails = details.map(detail => {
      let product: ConversationOrderProductDefaultDTO = {
        Price: detail.Price || 0,
        ProductCode: detail.ProductCode,
        ProductId: detail.ProductId,
        ProductName: detail.ProductName,
        ProductNameGet: detail.ProductNameGet,
        Quantity: detail.Quantity || 0,
        UOMId: detail.UOMId || 0,
        UOMName: detail.UOMName,
        Note: detail.Note
      }

      return product;
    });

    return formDetails;
  }

  loadOrderDefault(data: CheckConversationData, dataComment?: TDSSafeAny){
    const model = this.orderDefault() as ConversationOrderForm;

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

  orderDefault() {
    let result: ConversationOrderForm = {
        Id: undefined,
        PartnerName: "",
        Facebook_ASUserId: "",
        Facebook_UserId: "",
        Facebook_UserName: "",
        Facebook_CommentId: "",
        Facebook_PostId: "",
        LiveCampaignId: "",
        Name: "",
        Code: "",
        // StatusText: "",
        Telephone: "",
        SessionIndex: 0,
        Session: 0,
        PrintCount: 0,
        PartnerId: undefined,
        CRMTeamId: undefined,
        AmountUntaxed: 0,
        AmountTax: 0,
        TotalAmount: 0,
        TotalAmountBill: 0,
        TotalQuantity: 0,
        DecreaseAmount: 0,
        PaymentAmount: 0,
        DiscountAmount: 0,
        Discount: 0,
        Tax: {},
        Email: "",
        Note: "",
        Street: "",

        City: undefined,
        District: undefined,
        Ward: undefined,
        Carrier: undefined,
        User: undefined,
        UserId: undefined,
        StatusText: "",

        Details: [],
        // tempPartner: []
    };

    return result;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
