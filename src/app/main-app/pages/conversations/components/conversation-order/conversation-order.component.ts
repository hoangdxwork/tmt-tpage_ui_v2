import { ModalAddAddressV2Component } from './../modal-add-address-v2/modal-add-address-v2.component';
import { ChatomniEventEmiterService } from '@app/app-constants/chatomni-event/chatomni-event-emiter.service';
import { ProductTemplateUOMLineService } from './../../../../services/product-template-uom-line.service';
import { ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { InitSaleDTO, SaleOnlineSettingDTO } from './../../../../dto/setting/setting-sale-online.dto';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { takeUntil, finalize } from 'rxjs';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { ConversationOrderFacade } from 'src/app/main-app/services/facades/conversation-order.facade';
import { ApplicationUserService } from 'src/app/main-app/services/application-user.service';
import { ApplicationUserDTO } from 'src/app/main-app/dto/account/application-user.dto';
import { GeneralConfigsFacade } from 'src/app/main-app/services/facades/general-config.facade';
import { DeliveryCarrierService } from 'src/app/main-app/services/delivery-carrier.service';
import { Message } from 'src/app/lib/consts/message.const';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { OrderPrintService } from 'src/app/main-app/services/print/order-print.service';
import { PrinterService } from 'src/app/main-app/services/printer.service';
import { ModalListProductComponent } from '../modal-list-product/modal-list-product.component';
import { DataPouchDBDTO } from 'src/app/main-app/dto/product-pouchDB/product-pouchDB.dto';
import { ModalProductTemplateComponent } from '@app/shared/tpage-add-product/modal-product-template.component';
import { TpageConfigProductComponent } from 'src/app/main-app/shared/tpage-config-product/tpage-config-product.component';
import { ModalTaxComponent } from '../modal-tax/modal-tax.component';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { Detail_QuickSaleOnlineOrder, QuickSaleOnlineOrderModel } from 'src/app/main-app/dto/saleonlineorder/quick-saleonline-order.dto';
import { FastSaleOrder_DefaultDTOV2, ShipServiceExtra } from 'src/app/main-app/dto/fastsaleorder/fastsaleorder-default.dto';
import { DeliveryCarrierDTOV2 } from 'src/app/main-app/dto/delivery-carrier.dto';
import { formatNumber } from '@angular/common';
import { TAuthService, UserInitDTO } from 'src/app/lib';
import { TDSCheckboxChange } from 'tds-ui/tds-checkbox';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { TDSNotificationService } from 'tds-ui/notification';
import { GetInventoryDTO } from 'src/app/main-app/dto/product/product.dto';
import { SuggestCitiesDTO, SuggestDistrictsDTO, SuggestWardsDTO } from 'src/app/main-app/dto/suggest-address/suggest-address.dto';
import { ResultCheckAddressDTO } from 'src/app/main-app/dto/address/address.dto';
import { ODataProductDTOV2, ProductDTOV2 } from 'src/app/main-app/dto/product/odata-product.dto';
import { FilterObjDTO, OdataProductService } from 'src/app/main-app/services/mock-odata/odata-product.service';
import { ProductService } from 'src/app/main-app/services/product.service';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { ChatomniConversationItemDto } from 'src/app/main-app/dto/conversation-all/chatomni/chatomni-conversation';
import { CsOrder_SuggestionHandler } from 'src/app/main-app/handler-v2/chatomni-csorder/prepare-suggestions.handler';
import { CsOrder_PrepareModelHandler, InsertFromPostDto } from 'src/app/main-app/handler-v2/chatomni-csorder/prepare-order.handler';
import { CalculateFeeInsuranceInfoResponseDto, CalculateFeeServiceResponseDto } from '@app/dto/carrierV2/delivery-carrier-response.dto';
import { AshipGetInfoConfigProviderDto } from '@app/dto/carrierV2/aship-info-config-provider-data.dto';
import { CalculatorListFeeDTO } from '@app/dto/fastsaleorder/calculate-listFee.dto';
import { SO_ComputeCaclHandler } from '@app/handler-v2/order-handler/compute-cacl.handler';
import { CompanyCurrentDTO } from '@app/dto/configs/company-current.dto';
import { CalculateFeeAshipHandler } from '@app/handler-v2/aship-v2/calcfee-aship.handler';
import { PrepareModelFeeV2Handler } from '@app/handler-v2/aship-v2/prepare-model-feev2.handler';
import { SelectShipServiceV2Handler } from '@app/handler-v2/aship-v2/select-shipservice-v2.handler';
import { UpdateShipExtraHandler } from '@app/handler-v2/aship-v2/update-shipextra.handler';
import { UpdateShipServiceExtrasHandler } from '@app/handler-v2/aship-v2/update-shipservice-extras.handler';
import { UpdateShipmentDetailAshipHandler } from '@app/handler-v2/aship-v2/shipment-detail-aship.handler';
import { TDSDestroyService } from 'tds-ui/core/services';
import { SharedService } from '@app/services/shared.service';
import { CreateFastSaleOrderDTO } from '@app/dto/saleonlineorder/create-fastsaleorder.dto';
import { ProductTemplateV2DTO } from '@app/dto/product-template/product-tempalte.dto';
import { ChatomniDataItemDto } from '@app/dto/conversation-all/chatomni/chatomni-data.dto';
import { OdataSaleOnline_Facebook_CommentDto, SaleOnline_Facebook_CommentDto } from '@app/dto/coversation-order/saleonline-facebook-comment.dto';
import { FacebookCommentService } from '@app/services/facebook-comment.service';
import { SO_PrepareFastSaleOrderHandler } from '@app/handler-v2/order-handler/prepare-fastsaleorder.handler';
import { ChatomniConversationInfoDto, ConversationPartnerDto } from '@app/dto/conversation-all/chatomni/chatomni-conversation-info.dto';
import { CsOrder_FromConversationHandler } from '@app/handler-v2/chatomni-csorder/order-from-conversation.handler';

@Component({
  selector: 'conversation-order',
  templateUrl: './conversation-order.component.html',
  providers: [ TDSDestroyService ]
})

export class ConversationOrderComponent implements OnInit, OnChanges {

  @Input() conversationInfo!: ChatomniConversationInfoDto | null;
  @Input() team!: CRMTeamDTO;
  @Input() type!: string;

  isLoading: boolean = false;
  isEditPartner: boolean = false;
  isEnableCreateOrder: boolean = false;
  isEnableInsuranceFee: boolean = false;

  textSearchProduct!: string;
  isLoadingProduct: boolean = false;

  lstUser!: Array<ApplicationUserDTO>;
  users!: Array<ApplicationUserDTO>;
  lstCarrier!: DeliveryCarrierDTOV2[];

  saleConfig!: InitSaleDTO;

  visibleIndex: number = -1;
  keyFilterUser: string = '';
  isOpenCarrier = false;

  quickOrderModel!: QuickSaleOnlineOrderModel;
  saleModel!: FastSaleOrder_DefaultDTOV2;
  enableInsuranceFee: boolean = false;
  userInit!: UserInitDTO;
  lstProductSearch: ProductDTOV2[] = [{} as any];

  //TODO: dữ liệu aship v2
  shipExtraServices: ShipServiceExtra[] = [];
  shipServices: CalculateFeeServiceResponseDto[] = [];
  lstCalcFee!: CalculatorListFeeDTO[];
  configsProviderDataSource: Array<AshipGetInfoConfigProviderDto> = [];
  insuranceInfo!: CalculateFeeInsuranceInfoResponseDto | null;
  extraMoney: number = 0;
  companyCurrents!: CompanyCurrentDTO;
  visibleShipExtraMoney: boolean = false;

  numberWithCommas =(value:TDSSafeAny) =>{
    if(value != null) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return value
  };

  parserComas = (value: TDSSafeAny) =>{
    if(value != null) {
      return TDSHelperString.replaceAll(value,',','');
    }
    return value
  };

  _cities!: SuggestCitiesDTO;
  _districts!: SuggestDistrictsDTO;
  _wards!: SuggestWardsDTO;
  _street!: string;

  lstInventory!: GetInventoryDTO;
  so_FacebookComments!: SaleOnline_Facebook_CommentDto[];
  saleOnlineSettings!: SaleOnlineSettingDTO;
  insertFromPostModel!: InsertFromPostDto;

  constructor(private message: TDSMessageService,
    private conversationOrderFacade: ConversationOrderFacade,
    private csOrder_FromConversationHandler: CsOrder_FromConversationHandler,
    private applicationUserService: ApplicationUserService,
    private modal: TDSModalService,
    private generalConfigsFacade: GeneralConfigsFacade,
    private deliveryCarrierService: DeliveryCarrierService,
    private auth: TAuthService,
    private partnerService: PartnerService,
    private odataProductService: OdataProductService,
    private cdRef: ChangeDetectorRef,
    private productService: ProductService,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private fastSaleOrderService: FastSaleOrderService,
    private notification: TDSNotificationService,
    private orderPrintService: OrderPrintService,
    private printerService: PrinterService,
    private sharedService: SharedService,
    private csOrder_SuggestionHandler: CsOrder_SuggestionHandler,
    private calcFeeAshipHandler: CalculateFeeAshipHandler,
    private computeCaclHandler: SO_ComputeCaclHandler,
    private prepareModelFeeV2Handler: PrepareModelFeeV2Handler,
    private selectShipServiceV2Handler: SelectShipServiceV2Handler,
    private updateShipExtraHandler: UpdateShipExtraHandler,
    private updateShipServiceExtrasHandler: UpdateShipServiceExtrasHandler,
    private updateShipmentDetailAshipHandler: UpdateShipmentDetailAshipHandler,
    private so_PrepareFastSaleOrderHandler: SO_PrepareFastSaleOrderHandler,
    private csOrder_PrepareModelHandler: CsOrder_PrepareModelHandler,
    private viewContainerRef: ViewContainerRef,
    private facebookCommentService: FacebookCommentService,
    private destroy$: TDSDestroyService,
    private productTemplateUOMLineService: ProductTemplateUOMLineService,
    private omniEventEmiter: ChatomniEventEmiterService) {
  }

  ngOnInit(): void {
    if(this.conversationInfo && this.team && this.type) {
        this.loadData(this.conversationInfo);
    }

    this.loadSaleConfig();
    this.loadSaleOnineSettingConfig();
    this.loadUsers();
    this.loadUserLogged();
    this.loadCurrentCompany();
    this.loadCarrier();

    this.onSelectOrderFromMessage();
    this.eventEmitter();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes["conversationInfo"] && !changes["conversationInfo"].firstChange) {
        this.validateData();

        let x = {...changes["conversationInfo"].currentValue};
        this.loadData(x);
    }
  }

  eventEmitter(){
    // TODO: thêm mới sản phẩm
    this.conversationOrderFacade.onAddProductOrder$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.selectProduct(res);
          let index = this.quickOrderModel.Details.findIndex(x=> x.ProductId == res.Id && x.UOMId == res.UOMId);

          if(index > -1){
              this.notification.success(`Đã thêm ${this.quickOrderModel.Details[index].Quantity} / ${res.UOMName} `,
              `${res.NameGet} \n => Tổng tiền: ${this.quickOrderModel.TotalAmount}`)
          }
      }
    });

    // TODO: cập nhật đơn hàng từ conversation-partner
    this.partnerService.onLoadOrderFromTabPartner$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (partner: ConversationPartnerDto) => {
          this.quickOrderModel = {...this.csOrder_FromConversationHandler.updateOrderFromTabPartner(this.quickOrderModel, partner)}
      }
    })

    //TODO: tạo đơn hàng từ comment bài viết, sử dụng insertFromPost
    this.conversationOrderFacade.loadInsertFromPostFromComment$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniDataItemDto) => {
        if(res) {
            this.validateData();

            this.insertFromPostModel = this.csOrder_PrepareModelHandler.prepareInsertFromPost(res, this.saleOnlineSettings, this.companyCurrents) as InsertFromPostDto;
            if(!this.insertFromPostModel.UserId) {
                this.insertFromPostModel.UserId = this.userInit.Id;
            }

            //TODO: thực hiện call API insertfrompost ,ko tạo hóa đơn
            this.insertFromPost(this.insertFromPostModel, res);

            this.facebookCommentService.saleOnline_Facebook_Comment(res.UserId, res.ObjectId).pipe(takeUntil(this.destroy$)).subscribe({
              next: (comments: OdataSaleOnline_Facebook_CommentDto) => {
                  if(comments && comments.value) {
                      this.so_FacebookComments = [...comments.value];
                  }
              }
            });
        }
      }
    })

    // TODO: load thông tin đơn hàng khi click mã đơn hàng từ danh sách comment bài viết
    this.conversationOrderFacade.loadOrderFromCommentPost$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        if(res && res.orderId && res.comment) {

            this.validateData();
            this.conversationInfo = res.comment as ChatomniConversationInfoDto;

            this.insertFromPostModel = this.csOrder_PrepareModelHandler.prepareInsertFromPost(res.comment, this.saleOnlineSettings, this.companyCurrents) as InsertFromPostDto;
            if(!this.insertFromPostModel.UserId) {
                this.insertFromPostModel.UserId = this.userInit.Id;
            }

            this.isLoading = true;
            this.saleOnline_OrderService.getById(res.orderId).pipe(takeUntil(this.destroy$)).subscribe({
              next: (obs: any) => {
                  if(obs) {
                      delete obs['@odata.context'];
                      this.quickOrderModel = {...obs};
                      this.mappingAddress(this.quickOrderModel);
                  }
                  this.isLoading = false;
              },
              error: (error: any) => {
                  this.isLoading = false;
                  this.message.error(`${error?.error?.message}` || 'Load thông tin đơn hàng đã xảy ra lỗi');
              }
            })
        }
      }
    })

    //TODO: Cập nhật địa chỉ từ tds-conversation-item-v2 khi lưu chọn địa chỉ
    this.omniEventEmiter.selectAddressEmiter$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (result: ResultCheckAddressDTO)=>{
        let data = this.csOrder_SuggestionHandler.onLoadSuggestion(result, this.quickOrderModel);
          this.quickOrderModel = data;
          this.mappingAddress(this.quickOrderModel);
      }
    })
  }

  loadData(conversationInfo: ChatomniConversationInfoDto) {
    this.validateData();

    this.quickOrderModel = {...this.csOrder_FromConversationHandler.getOrderFromConversation(conversationInfo, this.team)};
    this.mappingAddress(this.quickOrderModel);
  }

  onSelectOrderFromMessage() {
    this.conversationOrderFacade.onSelectOrderFromMessage$.pipe(takeUntil(this.destroy$)).subscribe(res => {

        if(res && TDSHelperString.hasValueString(res.phone) ) {
            this.quickOrderModel.Telephone = res.phone;
        }
        if(res && TDSHelperString.hasValueString(res.address)) {
            this.quickOrderModel.Address = res.address;
        }
        if(res && TDSHelperString.hasValueString(res.note)) {
            let text = (this.quickOrderModel.Note || "") + ((this.quickOrderModel.Note || "").length > 0 ? '\n' + res.note : res.note);
            this.quickOrderModel.Note = text;
        }
    })
  }

  loadSaleModel() {
    this.isLoading = true;
    let model = { Type: 'invoice' };

    this.fastSaleOrderService.defaultGetV2({model: model}).pipe(takeUntil(this.destroy$)).subscribe(res => {
        if(res) {
            delete res["@odata.context"];

            res.DateInvoice = new Date();
            this.saleModel = res;

            // Khởi tạo saleModel mặc định
            this.saleModel = Object.assign({
                AmountTotal: 0,
                CashOnDelivery: 0,
                ShipWeight: 100,
                DeliveryPrice: 0
            }, this.saleModel);

            this.saleModel = this.so_PrepareFastSaleOrderHandler.so_prepareFastSaleOrder(this.saleModel, this.quickOrderModel);
            this.coDAmount();
            this.calcTotal();

            this.loadConfigProvider(this.saleModel);
            this.isLoading = false;
        }
    }, error => {
        this.isLoading = false;
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'ĝã xảy ra lỗi');
    });
  }

  loadCurrentCompany() {
    this.sharedService.getCurrentCompany().pipe(takeUntil(this.destroy$)).subscribe((res: CompanyCurrentDTO) => {
        this.companyCurrents = res;
    }, error => {
        this.message.error(error?.error?.message || 'Load thông tin công ty mặc định đã xảy ra lỗi!');
    });
  }

  //Load thông tin ship aship
  loadConfigProvider(data: FastSaleOrder_DefaultDTOV2) {
    if (data.Carrier && data.Carrier.ExtraProperties) {

      let _shipmentDetailsAship = (JSON.parse(data.Carrier.ExtraProperties) ?? [])?.filter((x: AshipGetInfoConfigProviderDto) => !x.IsHidden) as Array<AshipGetInfoConfigProviderDto>;
      this.insuranceInfo = data.ShipmentDetailsAship?.InsuranceInfo || null;

      this.configsProviderDataSource = _shipmentDetailsAship.map(x => {
          let detailConfig = data.ShipmentDetailsAship?.ConfigsProvider.find(y => y.ConfigName == x.ConfigName);

          x.ConfigValue = detailConfig ? detailConfig.ConfigValue : x.ConfigValue;
          return x;
      });
    }
  }

  onEnableCreateOrder(event: TDSCheckboxChange) {
    this.isEnableCreateOrder = event.checked;

    if(event.checked == true && !this.saleModel) {
        this.loadSaleModel();
    }
  }

  coDAmount() {
    if(this.saleModel) {
        let cashOnDelivery = this.computeCaclHandler.so_coDAmount(this.saleModel, this.quickOrderModel);
        this.saleModel.CashOnDelivery = cashOnDelivery;
    }
  }

  calcTax() {
    if(this.saleModel) {
        let tax = this.computeCaclHandler.so_calcTax(this.saleModel);
        this.saleModel.AmountTax = tax.AmountTax;
        this.saleModel.AmountTotal = tax.AmountTotal;
    }
  }

  calcTotal() {
    let data = this.computeCaclHandler.so_calcTotal((this.saleModel || null), this.quickOrderModel, this.saleConfig);

    this.quickOrderModel = data.quickOrderModel;
    if(this.saleModel) {
       this.saleModel = data.saleModel as FastSaleOrder_DefaultDTOV2;
    }
  }

  loadUsers() {
    this.applicationUserService.getActive().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.users = [...res.value];
          this.lstUser = [...res.value];
      },
      error: (error: any) => {
          this.message.error(`${error?.error?.message}`);
      }
    });
  }

  loadUserLogged() {
    this.auth.getUserInit().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.userInit =  {...res};
          if(this.userInit?.Company?.Id) {
              this.loadInventoryWarehouseId(this.userInit?.Company?.Id);
          }
      },
      error: (error: any) => {
        this.message.error(`${error?.error?.message}`);
      }
    })
  }

  loadSaleConfig() {
    this.generalConfigsFacade.getSaleConfigs().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.saleConfig = {...res};
      },
      error: (error: any) => {
          this.message.error(`${error?.error?.message}`);
      }
    });
  }

  loadSaleOnineSettingConfig() {
    this.generalConfigsFacade.getSaleOnineSettingConfig().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
            this.saleOnlineSettings = {...res};
      },
      error: (error: any) => {
          this.message.error(`${error?.error?.message}`);
      }
    });
  }

  loadCarrier() {
    this.deliveryCarrierService.get().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.lstCarrier = [...res.value];
      },
      error: (error: any) => {
          this.message.error(`${error?.error?.message}`);
      }
    })
  }

  onVisibleChange(){
    this.isOpenCarrier = true;
  }

  onChangeCarrierV2(event: DeliveryCarrierDTOV2) {
    this.shipServices = []; // dịch vụ
    this.shipExtraServices = [];
    this.insuranceInfo = null;
    this.configsProviderDataSource = [];

    this.saleModel.Ship_InsuranceFee = 0;
    this.saleModel.Ship_ServiceId = null;
    this.saleModel.Ship_ServiceName = null;
    this.saleModel.Ship_Extras = null;
    this.saleModel.CustomerDeliveryPrice = 0;

    this.saleModel.DeliveryPrice = 0;
    this.saleModel.Ship_ServiceExtras = [];

    this.saleModel.Carrier = event;
    this.saleModel.CarrierId = event?.Id;

    //TODO: Cập nhật giá trị ship mặc định
    let deliveryPrice = event?.Config_DefaultFee || this.companyCurrents?.ShipDefault || 0;
    if(this.saleModel.DeliveryPrice != deliveryPrice) {
        this.saleModel.DeliveryPrice = deliveryPrice;
        this.coDAmount();
    }

    this.saleModel.ShipWeight = event?.Config_DefaultFee || this.companyCurrents?.WeightDefault || 100;

    if (TDSHelperString.hasValueString(event?.ExtrasText)) {
        this.saleModel.Ship_Extras = JSON.parse(event.ExtrasText);
    }

    if(event) {
        this.calcFee();
    }
  }

  onEditPartner() {
    this.isEditPartner = !this.isEditPartner;
  }

  changeUser(user:ApplicationUserDTO){
    if(user) {
      this.quickOrderModel.UserId = user.Id;
      this.quickOrderModel.UserName = user.Name;
      this.quickOrderModel.User = {
          Id: user.Id,
          Name: user.Name
      };

      if(this.saleModel) {
        this.saleModel.UserId = user.Id;
        this.saleModel.UserName = user.Name;
        this.saleModel.User = {
            Id: user.Id,
            Name: user.Name
        }
      }
    }
  }

  assignUser(){
  }

  searchUser(){
    let data = this.users;
    let key = this.keyFilterUser;
    if (TDSHelperString.hasValueString(key)) {
      key = TDSHelperString.stripSpecialChars(key.trim());
    }
    data = data.filter((x) =>
      (x.Name && TDSHelperString.stripSpecialChars(x.Name.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(key.toLowerCase())) !== -1))
    this.lstUser = data
  }

  calcFee() {
    if(!this.saleModel.Carrier) {
      this.message.error('Vui lòng chờn đối tác giao hàng')
    }

    let model = this.saleModel.Carrier as any;
    this.calculateFeeAship(model);
  }

  onSelectShipServiceId(event: any) {
    this.selectShipServiceV2(event)
  }

  signAmountTotalToInsuranceFee(): any  {
    this.saleModel.Ship_InsuranceFee = this.saleModel.AmountTotal;
    this.onUpdateInsuranceFee();
  }

  updateInsuranceFeeEqualAmountTotal() {
    if (this.saleModel && this.saleModel.Ship_Extras) {

      if(this.saleModel.Ship_Extras.IsInsuranceEqualTotalAmount) {
          this.saleModel.Ship_InsuranceFee = this.quickOrderModel.TotalAmount;
      } else {
          this.saleModel.Ship_InsuranceFee = this.saleModel.Ship_Extras?.InsuranceFee || 0;
      }
    }
  }

  onUpdateWeight() {
    this.calcFee();
  }

  onUpdateInsuranceFee() {
    this.calcFee();
  }

  //TODO: xử ly giống insertfrommessage
  insertFromPost(model: InsertFromPostDto, comment: ChatomniDataItemDto) {
    this.isLoading = true;
    this.saleOnline_OrderService.insertFromPost(model, true).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res: any) => {

            delete res['@odata.context'];
            this.quickOrderModel = {...res};

            //TODO: trường hợp tạo lần đầu thì gọi in phiếu
            if(res.IsCreated) {
                // Check lại hàm này
                let fbid = model.Facebook_ASUserId;
                this.saleOnline_OrderService.setCommentOrder(res, fbid);

                if(!this.saleOnlineSettings.isDisablePrint) {
                    this.orderPrintService.printOrder(res, comment.Message);
                }

                this.message.success('Tạo đơn hàng thành công');
            }
            else
            if(!this.saleOnlineSettings.isDisablePrint && this.saleOnlineSettings.isPrintMultiTimes) {
                this.orderPrintService.printOrder(res, comment.Message);
                this.message.success('Cập nhật đơn hàng thành công');
            }

            this.isLoading = false;
        },
        error: (error: any) => {
            this.isLoading = false;
            this.message.error(`${error?.error?.message}` || 'ĝã xảy ra lỗi');
        }
    })
  }

  onInsertFromPost(formAction?: string, type?: string): any {
    let model1 = this.insertFromPostModel;
    let model2 = this.csOrder_PrepareModelHandler.prepareInsertFromMessage(this.quickOrderModel, this.team);

    let model = Object.assign({}, model1, model2);
    if(formAction) {
        model.FormAction = formAction;
    }

    let fs_model = {} as FastSaleOrder_DefaultDTOV2;
    if(this.isEnableCreateOrder && this.saleModel) {
        fs_model = {...this.prepareCsFastSaleOrder(model)};

        if (!TDSHelperArray.hasListValue(fs_model.OrderLines)) {
            this.notification.warning('Không thể tạo hóa đơn', 'Đơn hàng chưa có chi tiết');
            return false;
        }
        if (!TDSHelperString.hasValueString(fs_model.Phone)) {
            this.notification.warning('Không thể tạo hóa đơn', 'Vui lòng thêm điện thoại');
            return false;
        }
        if (!TDSHelperString.hasValueString(fs_model.Address)) {
            this.notification.warning('Không thể tạo hóa đơn', 'Vui lòng thêm địa chỉ');
            return false;
        }
    }

    this.saleOnline_OrderService.insertFromPost(model, true).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          delete res['@odata.context'];
          this.quickOrderModel = {...res};

          if(!this.isEnableCreateOrder && type == 'print') {
              this.orderPrintService.printOrder(res);
          }

          if(this.isEnableCreateOrder) {
              // call api tạo hóa đơn
              fs_model.SaleOnlineIds = [res.Id];
              this.createFastSaleOrder(fs_model, type);
          } else {
              this.isLoading = false;
              this.message.success('Cập nhật đơn hàng thành công');
          }

          // TODO: lưu thành công thì đẩy dữ update sang tab conversation-partner
          this.partnerService.onLoadPartnerFromTabOrder$.emit(this.quickOrderModel);
      },
      error: (error: any) => {
          this.isLoading = false;
          this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi');
      }
    })
  }

  onSave(formAction?: string, type?: string): any {
    let model = this.csOrder_PrepareModelHandler.prepareInsertFromMessage(this.quickOrderModel, this.team);
    if(TDSHelperString.hasValueString(formAction)) {
        model.FormAction = formAction;
    }

    let fs_model = {} as FastSaleOrder_DefaultDTOV2;
    if(this.isEnableCreateOrder && this.saleModel) {
        fs_model = {...this.prepareCsFastSaleOrder(model)};

        if (!TDSHelperArray.hasListValue(fs_model.OrderLines)) {
            this.notification.warning('Không thể tạo hóa đơn', 'Đơn hàng chưa có chi tiết');
            return false;
        }
        if (!TDSHelperString.hasValueString(fs_model.Phone)) {
            this.notification.warning('Không thể tạo hóa đơn', 'Vui lòng thêm điện thoại');
            return false;
        }
        if (!TDSHelperString.hasValueString(fs_model.Address)) {
            this.notification.warning('Không thể tạo hóa đơn', 'Vui lòng thêm địa chỉ');
            return false;
        }
    }

    this.saleOnline_OrderService.insertFromMessage({ model: model }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          if(!this.isEnableCreateOrder && type) {
              this.orderPrintService.printId(res.Id, this.quickOrderModel);
          }

          if(this.isEnableCreateOrder) {
              // call api tạo hóa đơn
              fs_model.SaleOnlineIds = [res.Id];
              this.createFastSaleOrder(fs_model, type);
          }
          else {
              this.isLoading = false;
              if(model.Id && model.Code) {
                  this.message.success('Cập nhật đơn hàng thành công');
              } else {
                  this.message.success('Tạo đơn hàng thành công');
              }
          }

          // TODO: lưu thành công thì đẩy dữ update sang tab conversation-partner
          this.partnerService.onLoadPartnerFromTabOrder$.emit(this.quickOrderModel);
      },
      error: (error: any) => {
          this.isLoading = false;
          this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'ĝã xảy ra lỗi');
      }
    })
  }

  createFastSaleOrder(fs_model: FastSaleOrder_DefaultDTOV2, type?: string) {
    this.fastSaleOrderService.saveV2(fs_model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {

          // TODO: Tạo hóa đơn thành công
          if(res?.Success) {
              this.shipServices = [];
              this.shipExtraServices = [];
              delete this.saleModel.Ship_ServiceId;
              delete this.saleModel.Ship_ServiceName;

              if(res.Message) {
                  this.notification.warning('Tạo hóa đơn thành công', res.Message);
              }
          }

          // TODO: trường hợp gửi vận đơn lỗi
          if(!res?.Success && res.Message) {
              this.notification.warning('Lỗi gửi vận đơn', res.Message);
          }

          if(res && !res.Message ) {
            this.notification.success('Tạo hóa đơn thành công', `Hóa đơn của bạn là ${res.Data.Number}`);
          }

          if(type && res) {
              this.printOrder(type, res);
          }

          this.isLoading = false;
          this.isEnableCreateOrder = false;
          this.saleModel = {} as any;
      },
      error: (error: any) => {
          this.isLoading = false;
          if(this.quickOrderModel.Id) {
              this.message.success('Cập nhật đơn hàng thành công');
          } else {
              this.message.success('Tạo đơn hàng thành công');
          }

          this.notification.error('Tạo hóa đơn thất bại', error.error?.message);
      }
    });
  }

  prepareCsFastSaleOrder(model: any): any {
    //TODO: gán model cho tạo hóa đơn
    let fs_model = {} as FastSaleOrder_DefaultDTOV2;

    this.updateShipExtras();
    this.updateShipServiceExtras();
    this.updateShipmentDetailsAship();

    fs_model = this.so_PrepareFastSaleOrderHandler.so_prepareFastSaleOrder(this.saleModel, this.quickOrderModel);
    fs_model.FormAction = model.FormAction;

    return {...fs_model};
  }

  printOrder(type?: string, res?: CreateFastSaleOrderDTO) {
    let obs: TDSSafeAny;
    if(type == 'print') {
        obs = this.printerService.printUrl(`/fastsaleorder/print?ids=${res?.Data.Id}`);
    }

    if(type == 'printShip') {
      if (this.saleModel.Carrier) {
          obs = this.printerService.printIP(`odata/fastsaleorder/OdataService.PrintShip`, { ids: [res?.Data.Id]})
      } else {
          obs = this.printerService.printUrl(`/fastsaleorder/printshipthuan?ids=${res?.Data.Id}`);
      }
    }

    if (obs) {
      obs.pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
          this.printerService.printHtml(res);

      }, (error: TDSSafeAny) => {
          if(error?.error?.message) {
              this.notification.error( 'Lỗi in phiếu', error?.error?.message);
          }
      });
    }
  }

  // confirmShipService(carrier: TDSSafeAny) {
  //   this.modal.info({
  //     title: 'Cảnh báo',
  //     content: 'ĝối tác chưa có dịch vụ bạn hãy bấm [Ok] để tìm dịch vụ.\nHoặc [Cancel] để tiếp tục.\nSau khi tìm dịch vụ bạn hãy xác nhận lại."',
  //     onOk: () => this.calculateFee(carrier).catch((err) => { console.log(err);}),
  //     onCancel:()=>{},
  //     okText: "Ok",
  //     cancelText: "Cancel"
  //   });
  // }

  showModalAddProduct() {
    const modal = this.modal.create({
        title: 'Thêm sản phẩm',
        content: ModalProductTemplateComponent,
        size: "xl",
        viewContainerRef: this.viewContainerRef,
        componentParams: {
          typeComponent: null,
        }
    })

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe(result => {
        if(TDSHelperObject.hasValue(result)) {

            let data = result[0] as ProductTemplateV2DTO;
            let x: Detail_QuickSaleOnlineOrder = this.mappingDetailQuickSaleOnlineOrder(data, 'create_template');
            this.quickOrderModel.Details = [...this.quickOrderModel.Details, x];

            this.coDAmount();
            this.calcTotal();
        }
    })
  }

  mappingDetailQuickSaleOnlineOrder(data: any, type?: string){ //check lại dữ liệu

    //data sẽ là ProductDTOV2 | ProductTemplateV2DTO
    let model : Detail_QuickSaleOnlineOrder = {
      Quantity: 1,
      Price: data.Price,
      ProductId: data.Id,
      ProductName: data.Name,
      ProductNameGet: data.NameGet,
      ProductCode: data.DefaultCode,
      UOMId: data.UOMId,
      UOMName: data.UOMName,
      Note: null,
      Factor: 1,
      OrderId: this.quickOrderModel.Id,
      ImageUrl: data.ImageUrl,
      Priority: 0,
    } as Detail_QuickSaleOnlineOrder;

    // TODO: trường hợp thêm mới từ product-template
    if(type == 'create_template') {
      model.ProductId = data.VariantFirstId;
      model.Price = data.ListPrice;
    }

    return {...model};
  }

  showModalAddPromotion(){
    // this.modal.create({
    //   title: 'Chờn khuyến mãi',
    //   content: ModalApplyPromotionComponent,
    //   size: "lg",
    //   viewContainerRef: this.viewContainerRef
    // });

    this.message.info('Tính năng chưa khả dụng');
  }

  showModalConfigProduct() {
    this.modal.create({
        title: 'Chờn bảng giá',
        content: TpageConfigProductComponent,
        size: "lg",
        viewContainerRef: this.viewContainerRef
    });
  }

  showModalListProduct(){
    const modal = this.modal.create({
        title: 'Chờn sản phẩm',
        content: ModalListProductComponent,
        viewContainerRef: this.viewContainerRef,
        size: 'xl'
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe((res: DataPouchDBDTO) =>{
      if(TDSHelperObject.hasValue(res)) {
          // this.selectProduct(res);
      }
    });
  }

  selectProduct(item: DataPouchDBDTO) {
    let index = this.quickOrderModel.Details.findIndex(x => x.ProductId === item.Id && x.UOMId == item.UOMId);
    if(index < 0) {
      let data = {...item} as ProductDTOV2;

      let x = this.mappingDetailQuickSaleOnlineOrder(data) ;
      this.quickOrderModel.Details = [...this.quickOrderModel.Details, ...[x]];
    } else {
      this.quickOrderModel.Details[index].Quantity += 1;
    }

    this.coDAmount();
    this.calcTotal();
  }

  showModalTax() {
    const modal = this.modal.create({
      title: 'Danh sách thuế',
      content: ModalTaxComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'lg',
      componentParams: {
        currentTax: this.saleModel.Tax
      }
    });

    modal.afterClose.subscribe(res => {
      if(res) {
          this.saleModel.Tax = res;
          this.saleModel.TaxId = res.Id;

          this.calcTotal();
      }
    });
  }

  visibleChange($event: TDSSafeAny) {
    console.log($event)
  }

  closePriceDetail() {
    this.visibleIndex = -1;
  }

  changeShipWeight(value: number) {
    this.saleModel.ShipWeight = value;
    this.calcFee();
  }

  changeDeliveryPrice(event: any) {
    if(event) {
      this.saleModel.DeliveryPrice = event;
      this.coDAmount();
    }
  }

  changeDiscount(event: any) {
    if (event) {
      this.saleModel.Discount = event;
      this.calcTotal();
    }
  }

  changeDecreaseAmount(event: any) {
    if (event) {
      this.saleModel.DecreaseAmount = event;
      this.calcTotal();
    }
  }

  changeAmountDeposit(event: any) {
    if(event) {
      this.saleModel.AmountDeposit = event;
      this.coDAmount();
    }
  }

  changeIsSelectedEx(event: any, i: number) {
    this.shipExtraServices[i]!.IsSelected = event;
  }

  openPopoverShipExtraMoney(value: number) {
    this.extraMoney = value;
    this.visibleShipExtraMoney = true;
  }

  closePopoverShipExtraMoney() {
    this.visibleShipExtraMoney = false;
  }

  onChangePrice(event: any, item: Detail_QuickSaleOnlineOrder, index: number) {
    this.visibleIndex = index;
    let exit = this.quickOrderModel.Details[index]?.Id == item.Id;

    if(exit) {
        this.quickOrderModel.Details[index].Price = event;
        this.coDAmount();
        this.calcTotal();
    }
  }

  onRemoveProduct(item: Detail_QuickSaleOnlineOrder, index: number) {
    let exit = this.quickOrderModel.Details[index]?.Id == item.Id;
    if(exit) {
        this.quickOrderModel.Details.splice(index,1);
        this.coDAmount();
        this.calcTotal();
    }
  }

  closeSearchProduct(){
    this.textSearchProduct = '';
  }

  onSearchProduct(event: any) {
    let text = this.textSearchProduct;
    this.loadProduct(text);
  }

  loadProduct(textSearch: string) {
    this.isLoadingProduct = true;

    let filterObj: FilterObjDTO = {
      searchText: textSearch,
    }
    let top = 20;
    let skip = 0;

    this.productTemplateUOMLineService.getProductUOMLine(skip, top, textSearch)
      .pipe(takeUntil(this.destroy$)).pipe(finalize(()=> this.isLoadingProduct = false ))
      .subscribe((res: ODataProductDTOV2) => {
           this.lstProductSearch = [...res.value]
      },err =>{
        this.message.error(err.error? err.error.message: Message.CanNotLoadData);
    });
  }

  loadInventoryWarehouseId(warehouseId: number) {
    this.productService.getInventoryWarehouseId(warehouseId).pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.lstInventory = res;
    });
  }

  pushItemProduct(data: ProductDTOV2) {
    let index = this.quickOrderModel.Details.findIndex(x => x.ProductId === data.Id && x.UOMId == data.UOMId);
    if (index < 0){
        let item = this.mappingDetailQuickSaleOnlineOrder(data);

        this.quickOrderModel.Details = [...this.quickOrderModel.Details, item];
    } else{
        this.quickOrderModel.Details[index].Quantity += 1;
    }

    this.closeSearchProduct();
    this.calcTotal();
    this.coDAmount();
  }

  mappingAddress(data: QuickSaleOnlineOrderModel) {
    let x = this.csOrder_SuggestionHandler.mappingAddress(data);

    this._cities = x._cities;
    this._districts = x._districts;
    this._wards = x._wards;
    this._street = x._street;
  }

  plus(item: Detail_QuickSaleOnlineOrder, index: number) {
    let exit = this.quickOrderModel.Details[index]?.Id == item.Id;

    if(exit) {
        this.quickOrderModel.Details[index].Quantity++;
        this.coDAmount();
        this.calcTotal();
    }
  }

  minus(item: Detail_QuickSaleOnlineOrder, index: number) {
    let exit = this.quickOrderModel.Details[index]?.Id == item.Id;

    if(exit) {
        this.quickOrderModel.Details[index].Quantity--;
        if(this.quickOrderModel.Details[index].Quantity < 1) {
          this.quickOrderModel.Details[index].Quantity == 1;
        }

        this.coDAmount();
        this.calcTotal();
    }
  }

  changeShip_InsuranceFee(value: number) {
    this.saleModel.Ship_InsuranceFee = value;
  }

  changeShipExtraMoney(event: any) {
    let idx = this.shipExtraServices.findIndex((f: any) => f.ServiceId === 'XMG');
    this.shipExtraServices[idx].ExtraMoney = this.extraMoney;
    this.calcFee();

    this.visibleShipExtraMoney = false;
  }

  prepareModelFeeV2() {
      let companyId = this.saleConfig.configs.CompanyId;

      let model = this.prepareModelFeeV2Handler.so_prepareModelFeeV2(this.shipExtraServices, this.saleModel, this.quickOrderModel,  companyId, this.insuranceInfo );
      return model;
  }

  calculateFeeAship(event: DeliveryCarrierDTOV2): any {
    if(!this.saleModel.Carrier) {
        return this.message.error('Vui lòng chờ đối tác giao hàng');
    }

    if (!this.saleModel) {
        return this.message.error('Vui lòng chờ nhập khối lượng');
    }

    let model = this.prepareModelFeeV2();
    this.isLoading = true;

    this.calcFeeAshipHandler.calculateFeeAship(model, event, this.configsProviderDataSource).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          if(res && !res.error) {

              this.configsProviderDataSource = [...res.configs];

              this.insuranceInfo = res.data?.InsuranceInfo ?? null;
              this.shipServices = res.data?.Services ?? [];

              if(TDSHelperArray.hasListValue(this.shipServices)) {
                  let svDetail = this.shipServices[0] as CalculateFeeServiceResponseDto;
                  this.selectShipServiceV2(svDetail);

                  this.message.success(`Đối tác ${event.Name} có phí vận chuyển: ${formatNumber(Number(svDetail.TotalFee), 'en-US', '1.0-0')} đ`);
              }
          }
          else {
              this.message.error(res.error? res.error.message: 'Lỗi chọn đối tác');
          }

          this.isLoading = false;
      },
      error: (error: any) => {
          this.isLoading = false;
          this.message.error(error.error.message || error.error.error_description);
      }
    })

  }

  selectShipServiceV2(x: CalculateFeeServiceResponseDto) {
    let data = this.selectShipServiceV2Handler.so_selectShipServiceV2(x, this.shipExtraServices, this.saleModel);
    this.saleModel = data.saleModel;

    this.shipExtraServices = [];
    this.shipExtraServices = data.shipExtraServices;
  }

  // TODO: cập nhật giá xem hàng
  updateShipExtras() {
      this.saleModel = this.updateShipExtraHandler.so_updateShipExtraHandler(this.shipExtraServices, this.saleModel);
  }

  // TODO: cập nhật danh sách dịch vụ
  updateShipServiceExtras() {
    if (this.shipExtraServices) {
      this.saleModel = this.updateShipServiceExtrasHandler.so_updateShipServiceExtras(this.shipExtraServices, this.saleModel);
    }
  }

  // TODO: cập nhật danh sách cấu hình aship
  updateShipmentDetailsAship() {
    if (this.configsProviderDataSource) {
      this.saleModel = this.updateShipmentDetailAshipHandler.so_updateShipmentDetailAship(this.configsProviderDataSource, this.insuranceInfo, this.saleModel);
    }
  }

  showModalSuggestAddress(){
    let modal =  this.modal.create({
        title: 'Thêm địa chỉ',
        content: ModalAddAddressV2Component,
        size: "lg",
        viewContainerRef: this.viewContainerRef,
        componentParams: {
          _cities : this._cities,
          _districts: this._districts,
          _wards: this._wards,
          _street: this._street,
          isSelectAddress: true
        }
      });

    modal.afterClose.subscribe({
      next: (result: ResultCheckAddressDTO) => {
        if(result){
          let data = this.csOrder_SuggestionHandler.onLoadSuggestion(result, this.quickOrderModel);
          this.quickOrderModel = data;
          this.mappingAddress(this.quickOrderModel);
        }
      }
    })
  }

  validateData(){
    this.isEditPartner = false;
    (this.conversationInfo as any) = null;
    (this.quickOrderModel as any) = null;
    (this.saleModel as any) = null;
    (this._cities as any) = null;
    (this._districts as any) = null;
    (this._wards as any) = null;
    (this._street as any) = null;
  }

}
