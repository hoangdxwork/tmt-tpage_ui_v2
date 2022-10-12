
import { DeliveryCarrierV2Service } from './../../../../services/delivery-carrier-v2.service';
import { CRMTeamType } from 'src/app/main-app/dto/team/chatomni-channel.dto';
import { ChatmoniSocketEventName } from './../../../../services/socket-io/soketio-event';
import { SocketOnEventService, SocketEventSubjectDto } from '@app/services/socket-io/socket-onevent.service';
import { ModalAddAddressV2Component } from './../modal-add-address-v2/modal-add-address-v2.component';
import { ChatomniEventEmiterService } from '@app/app-constants/chatomni-event/chatomni-event-emiter.service';
import { ProductTemplateUOMLineService } from './../../../../services/product-template-uom-line.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { InitSaleDTO, SaleOnlineSettingDTO } from './../../../../dto/setting/setting-sale-online.dto';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { takeUntil, map } from 'rxjs';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { ConversationOrderFacade } from 'src/app/main-app/services/facades/conversation-order.facade';
import { ApplicationUserService } from 'src/app/main-app/services/application-user.service';
import { ApplicationUserDTO } from 'src/app/main-app/dto/account/application-user.dto';
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
import { ProductService } from 'src/app/main-app/services/product.service';
import { PartnerService } from 'src/app/main-app/services/partner.service';
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
import { ChatomniConversationInfoDto } from '@app/dto/conversation-all/chatomni/chatomni-conversation-info.dto';
import { CsOrder_FromConversationHandler } from '@app/handler-v2/chatomni-csorder/order-from-conversation.handler';
import { ChatomniConversationService } from '@app/services/chatomni-service/chatomni-conversation.service';
import { ChatomniObjectFacade } from '@app/services/chatomni-facade/chatomni-object.facade';
import { ChatomniConversationFacade } from '@app/services/chatomni-facade/chatomni-conversation.facade';
import { ConversationPostEvent } from '@app/handler-v2/conversation-post/conversation-post.event';
import { CRMTeamService } from '@app/services/crm-team.service';
import { SaleSettingConfigDto_V2 } from '@app/dto/setting/sale-setting-config.dto';

@Component({
  selector: 'conversation-order',
  templateUrl: './conversation-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TDSDestroyService ]
})

export class ConversationOrderComponent implements OnInit, OnChanges {

  @Input() conversationInfo!: ChatomniConversationInfoDto | null;
  @Input() syncConversationInfo!: ChatomniConversationInfoDto;
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

  saleConfig!: SaleSettingConfigDto_V2;

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
  priceValue: number = 0;
  companyCurrents!: CompanyCurrentDTO;
  visibleShipExtraMoney: boolean = false;
  isCalculateFeeAship: boolean = false;

  isEqualAmountInsurance: boolean = false;
  delivery_calcfee = ["fixed", "base_on_rule", "VNPost"];
  isEnableCalcFee: boolean = false;

  numberWithCommas = (value:TDSSafeAny) => {
    if(value != null){
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return value;
  } ;

  parserComas = (value: TDSSafeAny) =>{
    if(value != null){
      return TDSHelperString.replaceAll(value,'.','');
    }
    return value;
  };

  _cities!: SuggestCitiesDTO;
  _districts!: SuggestDistrictsDTO;
  _wards!: SuggestWardsDTO;
  _street!: string;

  lstInventory!: GetInventoryDTO;
  so_FacebookComments!: SaleOnline_Facebook_CommentDto[];
  saleOnlineSettings!: SaleOnlineSettingDTO;
  insertFromPostModel!: InsertFromPostDto;

  isUpdated: boolean = true;//dùng cho bài viết

  constructor(private message: TDSMessageService,
    private conversationOrderFacade: ConversationOrderFacade,
    private csOrder_FromConversationHandler: CsOrder_FromConversationHandler,
    private applicationUserService: ApplicationUserService,
    private chatomniObjectFacade: ChatomniObjectFacade,
    private modal: TDSModalService,
    private deliveryCarrierService: DeliveryCarrierService,
    private postEvent: ConversationPostEvent,
    private cdRef: ChangeDetectorRef,
    private crmTeamService: CRMTeamService,
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
    private chatomniConversationFacade: ChatomniConversationFacade,
    private productTemplateUOMLineService: ProductTemplateUOMLineService,
    private omniEventEmiter: ChatomniEventEmiterService,
    private socketOnEventService: SocketOnEventService,
    private deliveryCarrierV2Service: DeliveryCarrierV2Service) {
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
    this.onEventSocket();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes["conversationInfo"] && !changes["conversationInfo"].firstChange) {
        let x = {...changes["conversationInfo"].currentValue};
        this.loadData(x);
    }

    // TODO: không cập nhật đơn hàng khi thực hiện insertFromPost
    if(changes['syncConversationInfo'] && !changes['syncConversationInfo'].firstChange && this.isUpdated) {
        let data = {...changes['syncConversationInfo'].currentValue} as ChatomniConversationInfoDto;
        this.onSyncConversationInfo(data);
    }

    // TODO: gán lại update sau khi insertFromPost
    if(!this.isUpdated) {
        this.isUpdated = true;
    }
  }

  onEventSocket(){
    this.socketOnEventService.onEventSocket().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: SocketEventSubjectDto) => {
        if( res.Data?.Facebook_PageId && this.conversationInfo && this.conversationInfo?.Conversation?.UserId == res.Data.Facebook_ASUserId && res.EventName == ChatmoniSocketEventName.onUpdate ) {
            this.conversationInfo.Order = {...res.Data?.Data};
            this.loadData(this.conversationInfo);
            this.cdRef.detectChanges();
        }
      }
    })
  }

  eventEmitter(){
    // TODO: thêm mới sản phẩm
    this.conversationOrderFacade.onAddProductOrder$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.selectProduct(res);
          let index = this.quickOrderModel.Details.findIndex(x=> x.ProductId == res.Id && x.UOMId == res.UOMId) as number;

          if(Number(index) > -1){
              if(res.DiscountSale > 0) {
                this.quickOrderModel.Details[index].Discount = res.DiscountSale;
              }
              this.notification.success(`Đã thêm ${this.quickOrderModel.Details[index].Quantity} / ${res.UOMName} `,
              `${res.NameGet} \n => Tổng tiền: ${this.quickOrderModel.TotalAmount}`)
          }

          this.cdRef.detectChanges();
      }
    });

    //TODO: tạo đơn hàng từ comment bài viết, sử dụng insertFromPost
    this.conversationOrderFacade.loadInsertFromPostFromComment$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniDataItemDto) => {
        if(res) {
            this.validateData();

            this.team = this.crmTeamService.getCurrentTeam() as CRMTeamDTO;
            let type = this.team?.Type;

            switch(type) {
                case CRMTeamType._Facebook:

                    this.insertFromPostModel = {...this.csOrder_PrepareModelHandler.prepareInsertFromPost(res, this.saleOnlineSettings, this.companyCurrents)} as InsertFromPostDto;
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
                  break;

                case CRMTeamType._TShop:

                    this.insertFromPostModel = {...this.csOrder_PrepareModelHandler.prepareInsertFromChannelComment(res, this.saleOnlineSettings, this.companyCurrents)} as InsertFromPostDto;
                    if(!this.insertFromPostModel.UserId) {
                        this.insertFromPostModel.UserId = this.userInit.Id;
                    }

                    //TODO: thực hiện call API insertfrompost ,ko tạo hóa đơn
                    this.insertFromChannelComment(this.insertFromPostModel, res);
                  break;
            }
            this.cdRef.detectChanges();
        }
      }
    })

    // TODO: load thông tin đơn hàng khi click mã đơn hàng từ danh sách comment bài viết
    this.conversationOrderFacade.loadOrderFromCommentPost$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        if(res && res.orderId && res.comment) {

            this.validateData();

            this.insertFromPostModel = {...this.csOrder_PrepareModelHandler.prepareInsertFromPost(res.comment, this.saleOnlineSettings, this.companyCurrents)} as InsertFromPostDto;
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

                  // TODO: gán sự kiện loading cho tab conversation-post
                  this.postEvent.spinLoadingTab$.emit(false);

                  this.isLoading = false;
                  this.cdRef.detectChanges();
              },
              error: (error: any) => {
                  // TODO: gán sự kiện loading cho tab conversation-post
                  this.postEvent.spinLoadingTab$.emit(false);

                  this.isLoading = false;
                  this.message.error(`${error?.error?.message}` || 'Load thông tin đơn hàng đã xảy ra lỗi');
                  this.cdRef.detectChanges();
              }
            })
        }
      }
    })

    //TODO: Cập nhật địa chỉ từ tds-conversation-item-v2 khi lưu chọn địa chỉ
    this.omniEventEmiter.selectAddressEmiter$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ResultCheckAddressDTO)=>{
          let data = this.csOrder_SuggestionHandler.onLoadSuggestion(res, this.quickOrderModel);
          this.quickOrderModel = data;
          this.mappingAddress(this.quickOrderModel);
          this.cdRef.detectChanges();
      }
    })

    // TODO: Thông tin đơn hàng sau khi click thông tin khách hàng ở comment bài viết
    this.conversationOrderFacade.loadOrderByPartnerComment$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniConversationInfoDto) => {
          this.loadData(res);
      }
    })
  }

  loadData(conversationInfo: ChatomniConversationInfoDto) {
    this.validateData();

    this.quickOrderModel = {...this.csOrder_FromConversationHandler.getOrderFromConversation(conversationInfo, this.team)};
    this.mappingAddress(this.quickOrderModel);
    this.cdRef.detectChanges();
  }

  onSyncConversationInfo(conversationInfo: ChatomniConversationInfoDto) {
    this.quickOrderModel = {...this.csOrder_FromConversationHandler.onSyncConversationInfoToOrder(conversationInfo, this.team, this.type)};
    this.mappingAddress(this.quickOrderModel);
    this.cdRef.detectChanges();
  }

  onSelectOrderFromMessage() {
    this.conversationOrderFacade.onSelectOrderFromMessage$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {

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

          this.cdRef.detectChanges();
      }
    })
  }

  loadSaleModel() {
    this.isLoading = true;
    let model = { Type: 'invoice' };

    this.fastSaleOrderService.setDefaultV2({ model: model });
    this.fastSaleOrderService.getDefaultV2().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          if(res) {
            delete res['@odata.context'];
            res.DateInvoice = new Date();
            this.saleModel = res as FastSaleOrder_DefaultDTOV2;

            // Khởi tạo saleModel mặc định
            this.saleModel = Object.assign({
                AmountTotal: 0,
                CashOnDelivery: 0,
                ShipWeight: 100,
                DeliveryPrice: 0
            }, this.saleModel);

            this.saleModel = {...this.so_PrepareFastSaleOrderHandler.so_prepareFastSaleOrder(this.saleModel, this.quickOrderModel)};

            this.calcTotal();
            this.coDAmount();

            this.loadConfigProvider(this.saleModel);

            this.handleIsEqualAmountInsurance();
            this.prepareCalcFeeButton();
          }

          this.isLoading = false;
          this.cdRef.detectChanges();
      },
      error: (error: any) => {
          this.isLoading = false;
          this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'ĝã xảy ra lỗi');
          this.cdRef.detectChanges();
      }
    });
  }

  loadCurrentCompany() {
    this.sharedService.setCurrentCompany();
    this.sharedService.getCurrentCompany().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: CompanyCurrentDTO) => {
        this.companyCurrents = res;

        if(this.companyCurrents.DefaultWarehouseId) {
          this.loadInventoryWarehouseId(this.companyCurrents.DefaultWarehouseId);
        }
      },
      error: (error: any) => {
        this.message.error(error?.error?.message || 'Load thông tin công ty mặc định đã xảy ra lỗi!');
      }
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
    this.visibleIndex = -1;

    if(event.checked == true && !this.saleModel) {
        this.loadSaleModel();
    }
  }

  coDAmount() {
    if(this.saleModel) {
        let cashOnDelivery = this.computeCaclHandler.so_coDAmount(this.saleModel);
        this.saleModel.CashOnDelivery = Number(cashOnDelivery);
    }
  }

  calcTax() {
    if(this.saleModel) {
        let tax = {...this.computeCaclHandler.so_calcTax(this.saleModel)};
        this.saleModel.AmountTax = tax.AmountTax;
        this.saleModel.AmountTotal = tax.AmountTotal;
    }
  }

  calcTotal() {
    let data = {...this.computeCaclHandler.so_calcTotal((this.saleModel || null), this.quickOrderModel, this.saleConfig)};

    this.quickOrderModel = {...data.quickOrderModel};
    if(this.saleModel) {
       this.saleModel = {...data.saleModel} as FastSaleOrder_DefaultDTOV2;
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
    this.sharedService.setUserLogged();
    this.sharedService.getUserLogged().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.userInit = res || {};
      }
    })
  }

  loadSaleConfig() {
    this.sharedService.setSaleConfig();
    this.sharedService.getSaleConfig().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.saleConfig = {...res};
      }
    })
  }

  loadSaleOnineSettingConfig() {
    this.sharedService.setSaleOnlineSettingConfig();
    this.sharedService.getSaleOnlineSettingConfig().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.saleOnlineSettings = {...res};
      }
    })
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
    if(!event && this.saleModel) {
      this.saleModel.Carrier = null;
      this.saleModel.CarrierId = null;
      return;
    }

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

    this.saleModel.ShipWeight = event?.Config_DefaultWeight || this.companyCurrents?.WeightDefault || 100;

    if (TDSHelperString.hasValueString(event?.ExtrasText)) {
        this.saleModel.Ship_Extras = JSON.parse(event.ExtrasText);
        this.updateInsuranceFeeEqualAmountTotal();
    }

    if(event) {
        this.calcFee();
    }

    this.prepareCalcFeeButton();
    this.cdRef.detectChanges();
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
    let model = this.saleModel.Carrier as any;
    this.calculateFeeAship(model);
  }

  onSelectShipServiceId(event: any) {
    this.selectShipServiceV2(event)
  }

  signAmountTotalToInsuranceFee(): any  {
    this.saleModel.Ship_InsuranceFee = this.saleModel.AmountTotal;
    this.handleIsEqualAmountInsurance();
    this.onUpdateInsuranceFee();
  }

  updateInsuranceFeeEqualAmountTotal() {
    if (this.saleModel && this.saleModel.Ship_Extras) {
      if (this.saleModel.Ship_Extras.IsInsuranceEqualTotalAmount) {
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

          // TODO: gán sự kiện loading cho tab conversation-post
          this.postEvent.spinLoadingTab$.emit(false);

          this.isLoading = false;

          this.quickOrderModel = {...res};
          this.mappingAddress(this.quickOrderModel);

          //TODO: trường hợp tạo lần đầu thì gọi in phiếu
          if(res.IsCreated) {

              if(!this.saleOnlineSettings.isDisablePrint) {
                  this.orderPrintService.printId(res.Id, this.quickOrderModel, comment.Message);
              }

              //TODO: truyền thông tin đơn hàng vừa tạo về comment-filter-all
              this.conversationOrderFacade.onChangeCommentsOrderByPost$.emit({type: 'addCode', data: res});

              // TODO: cập nhật mã đơn hàng lên tab
              this.conversationOrderFacade.hasValueOrderCode$.emit(res.Code);
              this.message.success('Tạo đơn hàng thành công');

          } else {

            if(!this.saleOnlineSettings.isDisablePrint && this.saleOnlineSettings.isPrintMultiTimes) {
                this.orderPrintService.printId(res.Id, this.quickOrderModel, comment.Message);
                this.message.success('Cập nhật đơn hàng thành công');
            }

            // TODO: check gán lại cho partner các thông tin nếu có, không update lại đơn hàng, dùng ở conversation-post
            this.chatomniConversationFacade.onSyncConversationInfo$.emit(comment.UserId);

            // TODO: cập nhật mã đơn hàng lên tab
            if(TDSHelperString.hasValueString(res.code)) {
              this.conversationOrderFacade.hasValueOrderCode$.emit(res.Code);
            }

            this.isUpdated = false;
          }

          // TODO: đẩy sự kiện qua conversation-order-list cập nhật lại danh sách đơn hàng
          this.chatomniObjectFacade.loadListOrderFromCreateOrderComment$.emit(true);
          this.cdRef.detectChanges();
      },
      error: (error: any) => {
          this.isLoading = false;

          // TODO: gán sự kiện loading cho tab conversation-post
          this.postEvent.spinLoadingTab$.emit(false);

          this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi');
          this.cdRef.detectChanges();
      }
    })
  }

  onInsertFromPost(formAction?: string, type?: string): any {
    let model1 = this.insertFromPostModel;
    if(!TDSHelperObject.hasValue(this.team) && !this.team?.Id) {
        this.team = this.crmTeamService.getCurrentTeam() as any;
    }

    let model2 = {...this.csOrder_PrepareModelHandler.prepareInsertFromMessage(this.quickOrderModel, this.team)};

    let model = Object.assign({}, model1, model2) as any;
    if(formAction) {
        model.FormAction = formAction;
    }

    if(this.isEnableCreateOrder) {
      if (!TDSHelperArray.hasListValue(model.Details)) {
          this.notification.warning('Không thể tạo hóa đơn', 'Đơn hàng chưa có chi tiết');
          return false;
      }
      if (!TDSHelperString.hasValueString(model.Telephone)) {
          this.notification.warning('Không thể tạo hóa đơn', 'Vui lòng thêm điện thoại');
          return false;
      }
      if (!TDSHelperString.hasValueString(model.Address)) {
          this.notification.warning('Không thể tạo hóa đơn', 'Vui lòng thêm địa chỉ');
          return false;
      }

      //TODO: trường hợp đối tác đã có mà chưa call lại hàm tính phí aship
      if(!this.isCalculateFeeAship && this.saleModel.Carrier) {
          this.notification.info(`Đối tác ${this.saleModel.Carrier.Name}`, 'Đang tính lại ship đối tác, vui lòng thao tác lại sau khi thành công');
          let carrier = this.saleModel.Carrier as any;
          this.calculateFeeAship(carrier);
          return;
      }
    }

    this.isLoading = true;
    this.saleOnline_OrderService.insertFromPost(model, true).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          delete res['@odata.context'];
          this.quickOrderModel = {...res};

          this.mappingAddress(this.quickOrderModel);
          this.quickOrderModel.FormAction = formAction;

          // TODO: gán trường discount cho trường hợp tạo phiếu bán hàng
          // if(TDSHelperArray.isArray(this.quickOrderModel.Details)){
          //   this.quickOrderModel.Details.map((x : Detail_QuickSaleOnlineOrder)=> {
          //     let exist = this.quickOrderModel.Details.filter(a => a.ProductId == x.ProductId && a.UOMId == x.UOMId)[0];

          //     if(exist) {
          //       x.Discount = exist.Discount;
          //     }
          //   })
          // }

          if(!this.isEnableCreateOrder && type == 'print') {
              this.orderPrintService.printId(res.Id, this.quickOrderModel);
          }

          if(this.isEnableCreateOrder) {
              let fs_model = {} as FastSaleOrder_DefaultDTOV2;
              fs_model = {...this.prepareCsFastSaleOrder(this.quickOrderModel)};

              // call api tạo hóa đơn
              fs_model.SaleOnlineIds = [res.Id];
              fs_model.PartnerId = res.PartnerId;
              this.createFastSaleOrder(fs_model, type);

          } else {
              this.isLoading = false;
              this.message.success('Cập nhật đơn hàng thành công');

              // TODO: đẩy sự kiện qua conversation-order-list cập nhật lại danh sách đơn hàng
              this.chatomniObjectFacade.loadListOrderFromCreateOrderComment$.emit(true);

              // TODO: check gán lại cho partner các thông tin nếu có, không update lại đơn hàng
              this.isUpdated = false;
              this.chatomniConversationFacade.onSyncConversationInfo$.emit(res.Facebook_ASUserId);
          }

          this.cdRef.detectChanges();
      },
      error: (error: any) => {
          this.isLoading = false;
          this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi');
          this.cdRef.detectChanges();
      }
    })
  }

  insertFromChannelComment(model: InsertFromPostDto, comment: ChatomniDataItemDto) {
    this.isLoading = true;
    this.saleOnline_OrderService.insertFromChannelComment(model, true).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res: any) => {
          delete res['@odata.context'];

          // TODO: gán sự kiện loading cho tab conversation-post
          this.postEvent.spinLoadingTab$.emit(false);

          this.isLoading = false;
          this.quickOrderModel = {...res};
          this.mappingAddress(this.quickOrderModel);

          //TODO: trường hợp tạo lần đầu thì gọi in phiếu
          if(res.IsCreated) {

              if(!this.saleOnlineSettings.isDisablePrint) {
                  this.orderPrintService.printId(res.Id, this.quickOrderModel, comment.Message);
              }

              //TODO: truyền thông tin đơn hàng vừa tạo về comment-filter-all
              this.conversationOrderFacade.onChangeCommentsOrderByPost$.emit({type: 'addCode', data: res});

              // TODO: cập nhật mã đơn hàng lên tab
              this.conversationOrderFacade.hasValueOrderCode$.emit(res.Code);
              this.message.success('Tạo đơn hàng thành công');

          } else {

            if(!this.saleOnlineSettings.isDisablePrint && this.saleOnlineSettings.isPrintMultiTimes) {
                this.orderPrintService.printId(res.Id, this.quickOrderModel, comment.Message);
                this.message.success('Cập nhật đơn hàng thành công');
            }

            // TODO: check gán lại cho partner các thông tin nếu có, không update lại đơn hàng, dùng ở conversation-post
            this.chatomniConversationFacade.onSyncConversationInfo$.emit(comment.UserId);

            // TODO: cập nhật mã đơn hàng lên tab
            if(TDSHelperString.hasValueString(res.code)) {
              this.conversationOrderFacade.hasValueOrderCode$.emit(res.Code);
            }

            this.isUpdated = false;
          }

          // TODO: đẩy sự kiện qua conversation-order-list cập nhật lại danh sách đơn hàng
          this.chatomniObjectFacade.loadListOrderFromCreateOrderComment$.emit(true);
          this.cdRef.detectChanges();
      },
      error: (error: any) => {
          this.isLoading = false;

          // TODO: gán sự kiện loading cho tab conversation-post
          this.postEvent.spinLoadingTab$.emit(false);

          this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi');
          this.cdRef.detectChanges();
      }
    })
  }

  onInsertFromChannelComment(formAction?: string, type?: string): any {
    let model1 = this.insertFromPostModel;
    if(!TDSHelperObject.hasValue(this.team) && !this.team?.Id) {
        this.team = this.crmTeamService.getCurrentTeam() as any;
    }

    let model2 = {...this.csOrder_PrepareModelHandler.prepareInsertFromMessage(this.quickOrderModel, this.team)};

    let model = Object.assign({}, model1, model2) as any;
    if(formAction) {
        model.FormAction = formAction;
    }

    if(this.isEnableCreateOrder) {
      if (!TDSHelperArray.hasListValue(model.Details)) {
          this.notification.warning('Không thể tạo hóa đơn', 'Đơn hàng chưa có chi tiết');
          return false;
      }
      if (!TDSHelperString.hasValueString(model.Telephone)) {
          this.notification.warning('Không thể tạo hóa đơn', 'Vui lòng thêm điện thoại');
          return false;
      }
      if (!TDSHelperString.hasValueString(model.Address)) {
          this.notification.warning('Không thể tạo hóa đơn', 'Vui lòng thêm địa chỉ');
          return false;
      }

      //TODO: trường hợp đối tác đã có mà chưa call lại hàm tính phí aship
      if(!this.isCalculateFeeAship && this.saleModel.Carrier) {
          this.notification.info(`Đối tác ${this.saleModel.Carrier.Name}`, 'Đang tính lại ship đối tác, vui lòng thao tác lại sau khi thành công');
          let carrier = this.saleModel.Carrier as any;
          this.calculateFeeAship(carrier);
          return;
      }
    }

    this.isLoading = true;
    this.saleOnline_OrderService.insertFromChannelComment(model, true).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          delete res['@odata.context'];
          this.quickOrderModel = {...res};

          this.mappingAddress(this.quickOrderModel);
          this.quickOrderModel.FormAction = formAction;

          if(!this.isEnableCreateOrder && type == 'print') {
              this.orderPrintService.printId(res.Id, this.quickOrderModel);
          }

          if(this.isEnableCreateOrder) {
              let fs_model = {} as FastSaleOrder_DefaultDTOV2;
              fs_model = {...this.prepareCsFastSaleOrder(this.quickOrderModel)};

              // call api tạo hóa đơn
              fs_model.SaleOnlineIds = [res.Id];
              fs_model.PartnerId = res.PartnerId;
              this.createFastSaleOrder(fs_model, type);

          } else {
              this.isLoading = false;
              this.message.success('Cập nhật đơn hàng thành công');

              // TODO: đẩy sự kiện qua conversation-order-list cập nhật lại danh sách đơn hàng
              this.chatomniObjectFacade.loadListOrderFromCreateOrderComment$.emit(true);

              // TODO: check gán lại cho partner các thông tin nếu có, không update lại đơn hàng
              this.isUpdated = false;
              this.chatomniConversationFacade.onSyncConversationInfo$.emit(res.Facebook_ASUserId);
          }

          this.cdRef.detectChanges();
      },
      error: (error: any) => {
          this.isLoading = false;
          this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi');
          this.cdRef.detectChanges();
      }
    })
  }

  onSave(formAction?: string, type?: string): any {

    let model = {...this.csOrder_PrepareModelHandler.prepareInsertFromMessage(this.quickOrderModel, this.team)};

    if(TDSHelperString.hasValueString(formAction)) {
        model.FormAction = formAction;
    }

    if(this.isEnableCreateOrder) {
        if (!TDSHelperArray.hasListValue(model.Details)) {
            this.notification.warning('Không thể tạo hóa đơn', 'Đơn hàng chưa có chi tiết');
            return false;
        }
        if (!TDSHelperString.hasValueString(model.Telephone)) {
            this.notification.warning('Không thể tạo hóa đơn', 'Vui lòng thêm điện thoại');
            return false;
        }
        if (!TDSHelperString.hasValueString(model.Address)) {
            this.notification.warning('Không thể tạo hóa đơn', 'Vui lòng thêm địa chỉ');
            return false;
        }

        if (!TDSHelperString.hasValueString(model.CityCode) || !TDSHelperString.hasValueString(model.DistrictCode)) {
            this.notification.warning('Không thể tạo hóa đơn', 'Tỉnh/Thành phố là bắt buộc');
            return false;
        }

        //TODO: trường hợp đối tác đã có mà chưa call lại hàm tính phí aship
        if(!this.isCalculateFeeAship && this.saleModel.Carrier) {
            this.notification.info(`Đối tác ${this.saleModel.Carrier.Name}`, 'Đang tính lại ship đối tác, vui lòng thao tác lại sau khi thành công');
            let carrier = this.saleModel.Carrier as any;
            this.calculateFeeAship(carrier);
            return;
        }
    }

    this.isLoading = true;
    switch(this.team.Type) {
      case CRMTeamType._Facebook:
        this.saleOnline_OrderService.insertFromMessage({ model: model }).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res: any) => {

              delete res['@odata.context'];
              // TODO: gán trường discount cho trường hợp tạo phiếu bán hàng
              // if(TDSHelperArray.isArray(res.Details)){
              //   res.Details.map((x : Detail_QuickSaleOnlineOrder)=> {
              //     let exist = this.quickOrderModel.Details.filter(a => a.ProductId == x.ProductId && a.UOMId == x.UOMId)[0];

              //     if(exist) {
              //       x.Discount = exist.Discount;
              //     }
              //   })
              // }

              this.quickOrderModel = {...res};
              this.quickOrderModel.FormAction = formAction;

              if(!this.isEnableCreateOrder && type) {
                  this.orderPrintService.printId(res.Id, this.quickOrderModel);
              }

              if(this.isEnableCreateOrder) {
                  let fs_model = {} as FastSaleOrder_DefaultDTOV2;
                  fs_model = {...this.prepareCsFastSaleOrder(this.quickOrderModel)};

                  // call api tạo hóa đơn
                  fs_model.SaleOnlineIds = [res.Id];
                  fs_model.PartnerId = res.PartnerId;
                  this.createFastSaleOrder(fs_model, type);

              } else {
                  this.isLoading = false;

                  if (model.Id || model.Code) {
                      this.message.success('Cập nhật đơn hàng thành công');
                  } else {
                      this.message.success('Tạo đơn hàng thành công');
                  }

                  // TODO: cập nhật mã đơn hàng lên tab
                  this.conversationOrderFacade.hasValueOrderCode$.emit(res.Code);

                  // TODO: gọi sự kiện đồng bộ dữ liệu qua conversation-all, đẩy xuống ngOnChanges
                  this.chatomniConversationFacade.onSyncConversationInfo$.emit();
              }

              this.cdRef.detectChanges();
          },
          error: (error: any) => {
              this.isLoading = false;
              this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi');
              this.cdRef.detectChanges();
          }
        })
      break;

      case CRMTeamType._TShop:
        this.saleOnline_OrderService.insertFromChannelMessage({ model: model }).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res: any) => {

              delete res['@odata.context'];
              // res.Details.map((x : Detail_QuickSaleOnlineOrder)=> {
              //   let exist = this.quickOrderModel.Details.filter(a => a.ProductId == x.ProductId && a.UOMId == x.UOMId)[0];

              //   if(exist) {
              //     x.Discount = exist.Discount;
              //   }
              // })

              this.quickOrderModel = {...res};
              this.quickOrderModel.FormAction = formAction;

              if(!this.isEnableCreateOrder && type) {
                  this.orderPrintService.printId(res.Id, this.quickOrderModel);
              }

              if(this.isEnableCreateOrder) {
                  let fs_model = {} as FastSaleOrder_DefaultDTOV2;
                  fs_model = {...this.prepareCsFastSaleOrder(this.quickOrderModel)};

                  // call api tạo hóa đơn
                  fs_model.SaleOnlineIds = [res.Id];
                  fs_model.PartnerId = res.PartnerId;
                  this.createFastSaleOrder(fs_model, type);

              } else {
                  this.isLoading = false;

                  if (model.Id || model.Code) {
                      this.message.success('Cập nhật đơn hàng thành công');
                  } else {
                      this.message.success('Tạo đơn hàng thành công');
                  }

                  // TODO: cập nhật mã đơn hàng lên tab
                  this.conversationOrderFacade.hasValueOrderCode$.emit(res.Code);

                  // TODO: gọi sự kiện đồng bộ dữ liệu qua conversation-all, đẩy xuống ngOnChanges
                  this.chatomniConversationFacade.onSyncConversationInfo$.emit();
              }

              this.cdRef.detectChanges();
          },
          error: (error: any) => {
              this.isLoading = false;
              this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi');
              this.cdRef.detectChanges();
          }
        })
      break;
    }
  }

  createFastSaleOrder(fs_model: FastSaleOrder_DefaultDTOV2, type?: string) {
    this.fastSaleOrderService.saveV2(fs_model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {

          // TODO: Tạo hóa đơn thành công
          if(res?.Success && res.Message) {
              this.notification.warning('Tạo hóa đơn thành công', res.Message);
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

          this.shipServices = [];
          this.shipExtraServices = [];
          this.saleModel = {} as any;
          this.enableInsuranceFee = false;
          this.isEnableCreateOrder = false;
          this.isCalculateFeeAship = false;
          this.isEnableCalcFee = false;
          this.isEqualAmountInsurance = false

          // TODO: trường hợp bài viết và all xử lí khác nhau
          if(this.type == 'post') {
              // TODO: nếu là bài viết sau khi thanh toán, sẽ load lại đơn hàng kế tiếp theo postid
              // this.loadOrderByPostId(this.comment.ObjectId, this.comment.UserId);

              //TODO: truyền thông tin đơn hàng vừa tạo về comment-filter-all
              this.conversationOrderFacade.onChangeCommentsOrderByPost$.emit({type: 'deleteCode', data: this.quickOrderModel});
              this.conversationOrderFacade.hasValueOrderCode$.emit(null);

              // TODO: đẩy sự kiện qua conversation-order-list cập nhật lại danh sách đơn hàng nếu là từ comment bài viết
              this.chatomniObjectFacade.loadListOrderFromCreateOrderComment$.emit(true);

              delete this.quickOrderModel.Id;
              delete this.quickOrderModel.Code;
              this.quickOrderModel.Details = [];
              this.isLoading = false;
          } else {

              this.quickOrderModel = {} as any;
              // TODO: gọi sự kiện đồng bộ dữ liệu qua conversation-all, đẩy xuống ngOnChanges
              this.chatomniConversationFacade.onSyncConversationInfo$.emit();
              this.isLoading = false;
          }

          this.cdRef.detectChanges();
      },
      error: (error: any) => {
          this.isLoading = false;
          this.isEnableCalcFee = false;
          this.isEqualAmountInsurance = false;

          if(this.quickOrderModel.Id) {
              this.message.success('Cập nhật đơn hàng thành công');
          } else {
              this.message.success('Tạo đơn hàng thành công');
          }

          this.notification.error('Tạo hóa đơn thất bại', error.error?.message);
          this.cdRef.detectChanges();
      }
    });
  }

  prepareCsFastSaleOrder(model: QuickSaleOnlineOrderModel): any {
    //TODO: gán model cho tạo hóa đơn
    let fs_model = {} as FastSaleOrder_DefaultDTOV2;

    this.updateShipExtras();
    this.updateShipServiceExtras();
    this.updateShipmentDetailsAship();

    fs_model = {...this.so_PrepareFastSaleOrderHandler.so_prepareFastSaleOrder(this.saleModel, this.quickOrderModel)};
    fs_model.CompanyId = this.companyCurrents?.CompanyId;
    fs_model.FormAction = model.FormAction;

    return {...fs_model};
  }

  printOrder(type?: string, res?: CreateFastSaleOrderDTO) {
    let obs: TDSSafeAny;
    if(type == 'print') {
        obs = this.printerService.printUrl(`/fastsaleorder/print?ids=${[Number(res?.Data.Id)]}`);
    }

    if(type == 'printShip') {
        let url = `/fastsaleorder/PrintShipThuan?ids=${[Number(res?.Data.Id)]}`;
        if (Number(this.saleModel.CarrierId) > 0) {
          url = `${url}&carrierid=${this.saleModel.CarrierId}`;
        }
        obs = this.printerService.printUrl(url);
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

  loadOrderByPostId(postId: string, userId: string) {
    this.saleOnline_OrderService.getOrderByPostId(postId, userId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: QuickSaleOnlineOrderModel) => {
          // TODO: nếu có đơn hàng thì gán lại đơn hàng, else gán lại thông tin cơ bản
          if(res && res.Id) {
              this.quickOrderModel = {} as any;
              this.quickOrderModel = res;
              this.mappingAddress(this.quickOrderModel);
          } else {
              delete this.quickOrderModel.Id;
              delete this.quickOrderModel.Code;
              this.quickOrderModel.Details = [];
          }

          this.isLoading = false;
          this.cdRef.detectChanges();
      },
      error: (error: any) => {
          this.isLoading = false;
          this.message.error(`${error?.error?.message}`);
          this.cdRef.detectChanges();
      }
    })
  }

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

    modal.afterClose.pipe(takeUntil(this.destroy$)).pipe(takeUntil(this.destroy$)).subscribe(result => {
        if(TDSHelperObject.hasValue(result)) {

            let data = result[0] as ProductTemplateV2DTO;
            let x: Detail_QuickSaleOnlineOrder = this.mappingDetailQuickSaleOnlineOrder(data, 'create_template');
            this.quickOrderModel.Details = [...this.quickOrderModel.Details, ...[x]];

            this.calcTotal();
            this.coDAmount();
        }
        this.cdRef.detectChanges();
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
      // Discount: 0 //data.DiscountSale
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
    //   title: 'Chọn khuyến mãi',
    //   content: ModalApplyPromotionComponent,
    //   size: "lg",
    //   viewContainerRef: this.viewContainerRef
    // });

    this.message.info('Tính năng chưa khả dụng');
  }

  showModalConfigProduct() {
    this.modal.create({
        title: 'Chọn bảng giá',
        content: TpageConfigProductComponent,
        size: "lg",
        viewContainerRef: this.viewContainerRef
    });
  }

  showModalListProduct(){
    const modal = this.modal.create({
        title: 'Chọn sản phẩm',
        content: ModalListProductComponent,
        viewContainerRef: this.viewContainerRef,
        size: 'xl',
        bodyStyle: {
          padding: '0px'
        },
    });
  }

  selectProduct(item: DataPouchDBDTO) {
    let index = this.quickOrderModel.Details.findIndex(x => x.ProductId === item.Id && x.UOMId == item.UOMId) as number;
    if(Number(index) < 0) {
        let data = {...item} as ProductDTOV2;
        let x = this.mappingDetailQuickSaleOnlineOrder(data) ;
        this.quickOrderModel.Details = [...this.quickOrderModel.Details, ...[x]];
    } else {
        this.quickOrderModel.Details[index].Quantity += 1;
    }

    this.calcTotal();
    this.coDAmount();
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
          //Trường hợp tax = 0 thì không gán tax lại
          if(res.Id === 0) {
              delete  this.saleModel.Tax;
              delete  this.saleModel.TaxId;
          } else {
              this.saleModel.Tax = res;
              this.saleModel.TaxId = res.Id;
          }

          this.calcTotal();
          this.coDAmount();

         this.cdRef.detectChanges();
      }
    });
  }

  changeShipWeight() {
    if(this.saleModel.Carrier) {
      this.calcFee();
    }
  }

  changeDeliveryPrice(event: any) {
    if (Number(event) >= 0) {
      this.saleModel.DeliveryPrice = Number(event);
      this.coDAmount();
    }
  }

  changeCashOnDelivery(event: any) {
    if (Number(event) >= 0) {
      this.saleModel.CashOnDelivery = Number(event);
    }
  }

  changeDiscount(event: any) {
    if (Number(event) >= 0) {
      this.saleModel.Discount = Number(event);
      this.calcTotal();
      this.coDAmount();
    }
  }

  changeDecreaseAmount(event: any) {
    if (Number(event) >= 0) {
      this.saleModel.DecreaseAmount = Number(event);
      this.calcTotal();
      this.coDAmount();
    }
  }

  changeAmountDeposit(event: any) {
    if (Number(event) >= 0) {
      this.saleModel.AmountDeposit = Number(event);
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

  openPopover(event:boolean, price:number, index:number){
    if(event){
      this.visibleIndex = index;
      this.priceValue = Number(price);
    }
  }

  approvePrice(item: Detail_QuickSaleOnlineOrder, index: number) {
    this.visibleIndex = -1;

    let exit = this.quickOrderModel.Details[index]?.Id == item.Id;
    if(exit) {
        this.quickOrderModel.Details[index].Price = this.priceValue;
        this.calcTotal();
        this.coDAmount();
    }
  }

  closePriceDetail() {
    this.visibleIndex = -1;
  }

  onRemoveProduct(item: Detail_QuickSaleOnlineOrder, index: number) {
    let exit = this.quickOrderModel.Details[index]?.Id == item.Id;
    if(exit) {
        this.quickOrderModel.Details.splice(index,1);
        this.calcTotal();
        this.coDAmount();
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

    let top = 20;
    let skip = 0;

    this.isLoadingProduct = false;
    this.productTemplateUOMLineService.getProductUOMLine(skip, top, textSearch).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ODataProductDTOV2) => {
        this.lstProductSearch = [...res.value];
        this.isLoadingProduct = false;
        this.cdRef.detectChanges();
      },
      error: (err: any) => {
         this.isLoadingProduct = false;
         this.message.error(err.error? err.error.message: Message.CanNotLoadData);
         this.cdRef.detectChanges();
      }
    });
  }

  loadInventoryWarehouseId(warehouseId: number) {
    this.productService.setInventoryWarehouseId(warehouseId);
    this.productService.getInventoryWarehouseId().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.lstInventory = res;
        this.cdRef.detectChanges();
      },
      error: (err: any) => {
        this.message.error(err.error? err.error.message: Message);
        this.cdRef.detectChanges();
      }
    });
  }

  pushItemProduct(data: ProductDTOV2) {
    let index = this.quickOrderModel.Details?.findIndex(x => x.ProductId === data.Id && x.UOMId == data.UOMId) as number;
    if (Number(index) >= 0) {
        if(data.DiscountSale > 0) {
          this.quickOrderModel.Details[index].Discount = data.DiscountSale;
        }
        this.quickOrderModel.Details[index].Quantity += 1;

    } else{
        let item = this.mappingDetailQuickSaleOnlineOrder(data);
        this.quickOrderModel.Details = [...(this.quickOrderModel.Details || []), ...[item]];
    }

    this.closeSearchProduct();
    this.calcTotal();
    this.coDAmount();
  }

  mappingAddress(data: QuickSaleOnlineOrderModel) {
    let x = {...this.csOrder_SuggestionHandler.mappingAddress(data)};

    this._cities = x._cities;
    this._districts = x._districts;
    this._wards = x._wards;
    this._street = x._street;
  }

  plus(item: Detail_QuickSaleOnlineOrder, index: number) {
    let exit = this.quickOrderModel.Details[index]?.Id == item.Id;

    if(exit) {
        this.quickOrderModel.Details[index].Quantity++;
        this.calcTotal();
        this.coDAmount();
    }
  }

  minus(item: Detail_QuickSaleOnlineOrder, index: number) {
    let exit = this.quickOrderModel.Details[index]?.Id == item.Id;

    if(exit) {
        this.quickOrderModel.Details[index].Quantity--;
        if(this.quickOrderModel.Details[index].Quantity < 1) {
          this.quickOrderModel.Details[index].Quantity == 1;
        }
        this.calcTotal();
        this.coDAmount();
    }
  }

  changeShip_InsuranceFee(event: number) {
    if (Number(event) >= 0) {
      this.saleModel.Ship_InsuranceFee = Number(event);
    }
  }

  changeShipExtraMoney(event: any) {
    if(event && TDSHelperArray.hasListValue(this.shipExtraServices)) {
        let idx = this.shipExtraServices?.findIndex((f: any) => f.ServiceId === 'XMG');
        this.shipExtraServices[idx].ExtraMoney = this.extraMoney;
        this.calcFee();

        this.visibleShipExtraMoney = false;
    }
  }

  prepareModelFeeV2() {
      let companyId = this.companyCurrents.CompanyId;

      let model = {...this.prepareModelFeeV2Handler.so_prepareModelFeeV2(this.shipExtraServices, this.saleModel, this.quickOrderModel,  companyId, this.insuranceInfo )};
      return model;
  }

  calculateFeeAship(event: DeliveryCarrierDTOV2): any {
    if(!this.saleModel.Carrier) {
        return this.message.error('Vui lòng chọn đối tác giao hàng');
    }

    if (!this.saleModel.ShipWeight) {
        return this.message.error('Vui lòng chọn nhập khối lượng');
    }

    let model = {...this.prepareModelFeeV2()};
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

          if(res && res.error?.message) {
            this.message.error(res.error.message);
          }

          this.isLoading = false;
          this.isCalculateFeeAship = true;
          this.cdRef.detectChanges();
      },
      error: (error: any) => {
          this.isLoading = false;
          this.message.error(error?.error?.message || error?.error?.error_description);
          this.cdRef.detectChanges();
      }
    })
  }

  selectShipServiceV2(x: CalculateFeeServiceResponseDto) {
    let data = {...this.selectShipServiceV2Handler.so_selectShipServiceV2(x, this.shipExtraServices, this.saleModel)};
    this.saleModel = data.saleModel;

    this.shipExtraServices = [];
    this.shipExtraServices = data.shipExtraServices;
  }

  // TODO: cập nhật giá xem hàng
  updateShipExtras() {
      this.saleModel = {...this.updateShipExtraHandler.so_updateShipExtraHandler(this.shipExtraServices, this.saleModel)};
  }

  // TODO: cập nhật danh sách dịch vụ
  updateShipServiceExtras() {
    if (this.shipExtraServices) {
      this.saleModel = {...this.updateShipServiceExtrasHandler.so_updateShipServiceExtras(this.shipExtraServices, this.saleModel)};
    }
  }

  // TODO: cập nhật danh sách cấu hình aship
  updateShipmentDetailsAship() {
    if (this.configsProviderDataSource) {
      this.saleModel = {...this.updateShipmentDetailAshipHandler.so_updateShipmentDetailAship(this.configsProviderDataSource, this.insuranceInfo, this.saleModel)};
    }
  }

  showModalSuggestAddress(){
    let modal =  this.modal.create({
        title: 'Sửa địa chỉ',
        content: ModalAddAddressV2Component,
        size: "lg",
        viewContainerRef: this.viewContainerRef,
        componentParams: {
          _cities : this._cities,
          _districts: this._districts,
          _wards: this._wards,
          _street: this.quickOrderModel.Address,
          isSelectAddress: true
        }
      });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe({
      next: (result: ResultCheckAddressDTO) => {
        if(result){
            let data = {...this.csOrder_SuggestionHandler.onLoadSuggestion(result, this.quickOrderModel)};
            this.quickOrderModel = {...data};
            this.mappingAddress(this.quickOrderModel);
        }
        this.cdRef.detectChanges();
      }
    })
  }

  changeNote(event: any) {
    if(event && event.target && this.quickOrderModel) {
      let value = event.target.value;
      this.quickOrderModel.Note = value;
    }
  }

  validateData(){
    this.isEditPartner = false;
    this.isEnableCreateOrder = false;
    (this.conversationInfo as any) = null;
    (this.quickOrderModel as any) = null;
    (this.saleModel as any) = null;
    (this._cities as any) = null;
    this.isEnableCreateOrder = false;
    (this._districts as any) = null;
    (this._wards as any) = null;
    (this._street as any) = null;
  }

  handleIsEqualAmountInsurance() {
    if(this.saleModel && this.isEnableCreateOrder) {
      let aship = this.saleModel.ShipmentDetailsAship;
      let extras = this.saleModel.Ship_Extras as any;

      if (aship && aship.InsuranceInfo && aship.InsuranceInfo.IsInsurance) {
          if (extras && extras.IsInsuranceEqualTotalAmount) {
              this.isEqualAmountInsurance = (this.saleModel.AmountTotal || 0) == (this.saleModel.Ship_InsuranceFee || 0);
          } else {
              this.isEqualAmountInsurance = (extras?.InsuranceFee || 0) == (this.saleModel.Ship_InsuranceFee || 0);
          }
      } else {
          this.isEqualAmountInsurance = false;
      }
    }
  }

  prepareCalcFeeButton() {
    let carrier = this.saleModel?.Carrier;
    if (carrier && !this.delivery_calcfee.includes(carrier.DeliveryType)) {
        this.isEnableCalcFee = true;
    } else {
        this.isEnableCalcFee = false;
    }
  }
}
