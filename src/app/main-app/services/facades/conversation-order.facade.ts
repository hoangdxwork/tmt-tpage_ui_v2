import { EventEmitter, Injectable, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { TAuthService, TCommonService, UserInitDTO } from "src/app/lib";
import { TDSHelperObject, TDSHelperString, TDSMessageService } from "tmt-tang-ui";
import { CheckConversationData, ConversationLastOrder, ConversationLastOrderDetailDTO } from "../../dto/partner/check-conversation.dto";
import { BaseSevice } from "../base.service";
import { ConversationService } from "../conversation/conversation.service";
import { CRMTeamService } from "../crm-team.service";
import { PartnerService } from "../partner.service";
import { SharedService } from "../shared.service";
import { SignalRConnectionService } from "../signalR/signalR-connection.service";
import { ConversationOrderForm, ConversationOrderProductDefaultDTO } from '../../dto/coversation-order/conversation-order.dto';
import { GeneralConfigsFacade } from "./general-config.facade";
import { ProductDTO } from "../../dto/product/product.dto";

@Injectable({
  providedIn: 'root'
})

export class ConversationOrderFacade extends BaseSevice implements OnDestroy {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";
  private destroy$ = new Subject();

  private userInit!: UserInitDTO;
  private order!: ConversationOrderForm;
  private productDefault!: ConversationOrderProductDefaultDTO;

  public onLastOrderUpdated$: EventEmitter<any> = new EventEmitter<any>();
  public onLastOrderCheckCvs$: EventEmitter<ConversationOrderForm> = new EventEmitter<ConversationOrderForm>();

  constructor(private apiService: TCommonService,
      private message: TDSMessageService,
      private crmTeamService: CRMTeamService,
      private service: ConversationService,
      private partnerService: PartnerService,
      private sgRConnectionService: SignalRConnectionService,
      private generalConfigsFacade: GeneralConfigsFacade,
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
          this.productDefault = this.updateProductDefault(saleSetting.Product);
        }

      }
    });
  }

  loadUserLogged() {
    this.auth.getUserInit().subscribe(res => {
      this.userInit = res || {};
    });
  }

  updateProductDefault(productSetting: ProductDTO) {
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

  loadOrderFromSignalR(){
    this.sgRConnectionService._onSaleOnlineOrder$.pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if(res && (res.action == "create" || res.action == "updated")) {

        }
      }, error => {
          // this.message.error('Load đơn hàng từ signalR đã xảy ra lỗi');
          console.log(`Load đơn hàng từ signalR đã xảy ra lỗi: ${error}`);
      });
  }

  changePartner() {
    this.partnerService.onLoadOrderFromTabPartner
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: CheckConversationData) => {
        // Partner có đơn hàng gần nhất LastOrder
        if(res && res.LastOrder) {
          this.order = this.loadLastOrder(res);
        }
        //Không có đơn hàng gần nhất thì sử dụng order form mặc định
        else {
          this.order = this.loadOrderDefault(res);
        }

        this.onLastOrderCheckCvs$.emit(this.order);
      });
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

    model.Details = this.updateDetail(order.Details);

    if(order.Address){
      model.Street = order.Address;
      model.City = order.CityCode ? { Code: order.CityCode, Name: order.CityName } : undefined;
      model.District = order.DistrictCode ? { Code: order.DistrictCode, Name: order.DistrictName } : undefined;
      model.Ward = order.WardCode ? { Code: order.WardCode, Name: order.WardName } : undefined;
    }
    // Nếu đơn hàng không cho địa chỉ thì gán địa chỉ partner
    else if(data.Street) {
      model.Street = data.Street;
      model.City = data.City;
      model.District = data.District;
      model.Ward = data.Ward;
    }

    model.User = order.User ? { Id: order.User?.Id, Name: order.User?.Name } : undefined;

    return model;
  }

  updateDetail(details: ConversationLastOrderDetailDTO[]) {
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

  loadOrderDefault(data: CheckConversationData){
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

    return model;
  }

  prepareModel(data: any){

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
