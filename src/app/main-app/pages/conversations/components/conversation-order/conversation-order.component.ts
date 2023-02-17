import { InventoryChangeType, StoragePriceListItemsDto } from './../../../../dto/product-pouchDB/product-pouchDB.dto';
import { ProductTemplateFacade } from '@app/services/facades/product-template.facade';
import { CRMTeamType } from 'src/app/main-app/dto/team/chatomni-channel.dto';
import { SocketOnEventService, SocketEventSubjectDto } from '@app/services/socket-io/socket-onevent.service';
import { ModalAddAddressV2Component } from './../modal-add-address-v2/modal-add-address-v2.component';
import { ProductTemplateUOMLineService } from './../../../../services/product-template-uom-line.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, NgZone, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { SaleOnlineSettingDTO } from './../../../../dto/setting/setting-sale-online.dto';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { takeUntil, pipe, Observable, map } from 'rxjs';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { ConversationOrderFacade } from 'src/app/main-app/services/facades/conversation-order.facade';
import { ApplicationUserService } from 'src/app/main-app/services/application-user.service';
import { ApplicationUserDTO } from 'src/app/main-app/dto/account/application-user.dto';
import { Message } from 'src/app/lib/consts/message.const';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { OrderPrintService } from 'src/app/main-app/services/print/order-print.service';
import { PrinterService } from 'src/app/main-app/services/printer.service';
import { ModalListProductComponent } from '../modal-list-product/modal-list-product.component';
import { DataPouchDBDTO, KeyCacheIndexDBDTO, SyncCreateProductTemplateDto } from 'src/app/main-app/dto/product-pouchDB/product-pouchDB.dto';
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
import { UserInitDTO } from 'src/app/lib';
import { TDSCheckboxChange } from 'tds-ui/tds-checkbox';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { TDSNotificationService } from 'tds-ui/notification';
import { GetInventoryDTO } from 'src/app/main-app/dto/product/product.dto';
import { SuggestCitiesDTO, SuggestDistrictsDTO, SuggestWardsDTO } from 'src/app/main-app/dto/suggest-address/suggest-address.dto';
import { ODataProductDTOV2, ProductDTOV2 } from 'src/app/main-app/dto/product/odata-product.dto';
import { ProductService } from 'src/app/main-app/services/product.service';
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
import { SaleOnline_Facebook_CommentDto } from '@app/dto/coversation-order/saleonline-facebook-comment.dto';
import { SO_PrepareFastSaleOrderHandler } from '@app/handler-v2/order-handler/prepare-fastsaleorder.handler';
import { ChatomniConversationInfoDto } from '@app/dto/conversation-all/chatomni/chatomni-conversation-info.dto';
import { CsOrder_FromConversationHandler } from '@app/handler-v2/chatomni-csorder/order-from-conversation.handler';
import { ChatomniConversationFacade } from '@app/services/chatomni-facade/chatomni-conversation.facade';
import { ConversationPostEvent } from '@app/handler-v2/conversation-post/conversation-post.event';
import { CRMTeamService } from '@app/services/crm-team.service';
import { SaleSettingConfigDto_V2 } from '@app/dto/setting/sale-setting-config.dto';
import { NgxVirtualScrollerDto } from '@app/dto/conversation-all/ngx-scroll/ngx-virtual-scroll.dto';
import { ChatmoniSocketEventName } from '@app/services/socket-io/soketio-event';
import { ProductIndexDBService } from '@app/services/product-indexdb.service';
import { OnSocketOnSaleOnline_OrderDto } from '@app/dto/socket-io/chatomni-on-order.dto';
import { ChatomniConversationService } from '@app/services/chatomni-service/chatomni-conversation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DeliveryCarrierV2Service } from '@app/services/delivery-carrier-v2.service';
import { SuggestAddressDto, SuggestAddressService } from '@app/services/suggest-address.service';

@Component({
  selector: 'conversation-order',
  templateUrl: './conversation-order.component.html',
  styleUrls: ['./conversation-order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TDSDestroyService ]
})

export class ConversationOrderComponent implements OnInit, OnChanges, OnDestroy {

  @Input() conversationInfo!: ChatomniConversationInfoDto | null;
  @Input() team!: CRMTeamDTO;
  @Input() type!: string;
  @Input() reponsiveDesktop: boolean = true;

  isLoading: boolean = false;
  isEditPartner: boolean = false;
  isEnableCreateOrder: boolean = false;
  isEnableInsuranceFee: boolean = false;

  textSearchProduct!: string;
  innerTextDebounce!: string;
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
  lstProductSearch: ProductDTOV2[] = [];

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

  indClick: number = -1;
  lstVariants:  ProductDTOV2[] = [];
  isLoadingSelect: boolean = false;
  countUOMLine: number = 0;
  pageSize = 20;
  pageIndex = 1;
  isLoadingNextdata: boolean = false;
  clickPrint: string = '';
  tiktokUniqueId: any = null;

  suggestData: Observable<any> = new Observable<any>();

  numberWithCommas = (value:TDSSafeAny) => {
    if(value != null){
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return value;
  };

  parserComas = (value: TDSSafeAny) => {
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
  insertFromPostModel!: InsertFromPostDto | any;
  response: any;
  inventories: any;

  disableSyncOrder: boolean = false; //dùng cho bài viết
  commentPost!: ChatomniDataItemDto; //dùng cho bài viết
  indexDbStorage!: DataPouchDBDTO[];

  noteWhenNoId!: string | TDSSafeAny;
  syncTimer: any;

  constructor(private message: TDSMessageService,
    private conversationOrderFacade: ConversationOrderFacade,
    private csOrder_FromConversationHandler: CsOrder_FromConversationHandler,
    private applicationUserService: ApplicationUserService,
    private modal: TDSModalService,
    private deliveryCarrierService: DeliveryCarrierV2Service,
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
    private suggestService: SuggestAddressService,
    private chatomniConversationService: ChatomniConversationService,
    private ngZone: NgZone,
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
    private destroy$: TDSDestroyService,
    private route: ActivatedRoute,
    private chatomniConversationFacade: ChatomniConversationFacade,
    private productTemplateFacade: ProductTemplateFacade,
    private productTemplateUOMLineService: ProductTemplateUOMLineService,
    private socketOnEventService: SocketOnEventService,
    private productIndexDBService: ProductIndexDBService) {
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
    this.loadDeliveryCarrier();
    this.productIndexDB();

    this.onEventEmitter();
    this.onEventSocket();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes["conversationInfo"] && !changes["conversationInfo"].firstChange) {
        let x = {...changes["conversationInfo"].currentValue};
        this.loadData(x);
    }
  }

  onEventSocket(){
    this.socketOnEventService.onEventSocket().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: SocketEventSubjectDto) => {
        if(!res) return;

        switch(res?.EventName) {
            case ChatmoniSocketEventName.onCreatedSaleOnline_Order:
              let fbCreated = {...res?.Data} as OnSocketOnSaleOnline_OrderDto;
              let exit1 = res && fbCreated && fbCreated.Data?.Facebook_PostId == this.quickOrderModel?.Facebook_PostId
                && fbCreated.Data.Facebook_ASUserId == this.quickOrderModel?.Facebook_ASUserId && this.type == 'post';

              if(!exit1) break;
              // TODO: cập nhật mã đơn hàng sau khi tạo đơn hàng
              this.conversationOrderFacade.hasValueOrderCode$.emit(fbCreated?.Data?.Code);
            break;

            case ChatmoniSocketEventName.onDeleteSaleOnline_Order:
              let fbDelete = {...res?.Data} as OnSocketOnSaleOnline_OrderDto;
              let exist2 = res && fbDelete && fbDelete.Data?.Facebook_PostId == this.quickOrderModel?.Facebook_PostId
              && fbDelete.Data.Facebook_ASUserId == this.quickOrderModel?.Facebook_ASUserId && this.type == 'post';

              if(!exist2) break;
              // TODO: xóa mã đơn hàng sau khi tạo hóa đơn
              this.conversationOrderFacade.hasValueOrderCode$.emit(null);
            break;
        }

        this.cdRef.detectChanges();
      }
    })
  }

  onEventEmitter(){
    this.onSelectOrderFromMessage();

    this.conversationOrderFacade.onAddProductOrder$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.selectProduct(res);
          let index = this.quickOrderModel.Details?.findIndex(x => x.ProductId == res.Id && x.UOMId == res.UOMId) as number;

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
          if(!res) return;

          this.validateData();
          if(!TDSHelperObject.hasValue(this.team)) {
            this.team = this.crmTeamService.getCurrentTeam() as CRMTeamDTO;
          }

          let channelType = this.team?.Type;
          this.isEnableCreateOrder = false;
          this.commentPost = res;

          switch(channelType) {
            case CRMTeamType._Facebook:
                this.insertFromPostModel = {...this.csOrder_PrepareModelHandler.prepareInsertFromPost(res, this.saleOnlineSettings, this.companyCurrents)} as InsertFromPostDto;
              break;

            case CRMTeamType._TShop:
                this.insertFromPostModel = {...this.csOrder_PrepareModelHandler.prepareInsertFromChannelComment(res, this.saleOnlineSettings, this.companyCurrents)} as InsertFromPostDto;
              break;

            case CRMTeamType._UnofficialTikTok:
                this.insertFromPostModel = {...this.csOrder_PrepareModelHandler.prepareInsertFromTiktokComment(res, this.saleOnlineSettings, this.companyCurrents)} as InsertFromPostDto;
                this.tiktokUniqueId = res.Data?.uniqueId;
              break;
          }

          this.insertFromPostModel.UserId = this.userInit?.Id;
          this.onSavePost(null, 'print');
          this.cdRef.detectChanges();
      }
    })

    // TODO: load thông tin đơn hàng khi click mã đơn hàng từ danh sách comment bài viết
    this.conversationOrderFacade.loadOrderFromCommentPost$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        if(res.orderId && res.comment) {
            this.validateData();

            if(!TDSHelperObject.hasValue(this.team)) {
              this.team = this.crmTeamService.getCurrentTeam() as CRMTeamDTO;
            }

            let channelType = this.team.Type;
            if(channelType == CRMTeamType._UnofficialTikTok) {
                this.tiktokUniqueId = res.comment?.Data?.uniqueId;
            }

            res.comment = res.comment as ChatomniDataItemDto;
            this.insertFromPostModel = {...this.csOrder_PrepareModelHandler.prepareInsertFromPost(res.comment, this.saleOnlineSettings, this.companyCurrents)} as InsertFromPostDto;
            this.insertFromPostModel.UserId = this.userInit?.Id;

            this.isLoading = true;
            this.saleOnline_OrderService.getById(res.orderId).pipe(takeUntil(this.destroy$)).subscribe({
              next: (obs: any) => {
                  delete obs['@odata.context'];

                  this.quickOrderModel = {...obs};
                  if(this.quickOrderModel && TDSHelperString.hasValueString(this.quickOrderModel.Note)) {
                    this.quickOrderModel.Note = this.conversationOrderFacade.prepareMessageHasPhoneBBCode(this.quickOrderModel.Note);
                  }

                  this.mappingAddress(this.quickOrderModel);
                  this.postEvent.spinLoadingTab$.emit(false);

                  this.isLoading = false;
                  this.cdRef.detectChanges();
              },
              error: (error: any) => {
                  this.postEvent.spinLoadingTab$.emit(false);
                  this.isLoading = false;

                  this.message.error(`${error?.error?.message}`);
                  this.cdRef.detectChanges();
              }
            })
        }
      }
    });

    // TODO: đồng bộ dữ liệu khi lưu bên tab khách hàng
    this.chatomniConversationFacade.onSyncConversationOrder$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (info: ChatomniConversationInfoDto) => {

          let order = this.quickOrderModel;
          this.validateData();

          if(this.type != 'post') {
              this.quickOrderModel = {...this.csOrder_FromConversationHandler.onSyncOrderFromCsAll(info, this.team, this.type)};
          } else {
              this.quickOrderModel = {...this.csOrder_FromConversationHandler.onSyncOrderFromCsPost(info, this.team, order)};
          }

          this.mappingAddress(this.quickOrderModel);
          this.checkSelectNote();
          this.cdRef.detectChanges();
      }
    })

    //TODO: load tồn kho cho sản phẩm mới tạo
    this.productTemplateFacade.onStockChangeProductQty$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (obs: any) => {
        if(obs !== InventoryChangeType._TAB_ORDER) return;
        let warehouseId = this.companyCurrents?.DefaultWarehouseId;

        if(warehouseId > 0) {
          this.productService.lstInventory = null;
          this.productService.apiInventoryWarehouseId(warehouseId).pipe(takeUntil(this.destroy$)).subscribe({
            next: (res: any) => {
                if(res) {
                    this.inventories = {};
                    this.inventories = res;
                }

                if(this.response) {
                    this.mappingProduct(this.response);
                }
            },
            error: (err: any) => {
                this.message.error(err?.error?.message);
                if(this.response) {
                    this.mappingProduct(this.response);
                }
            }
          });
        }
      }
    })
  }

  loadData(conversationInfo: ChatomniConversationInfoDto) {
    this.validateData();
    this.isLoading = true;

    this.quickOrderModel = {...this.csOrder_FromConversationHandler.getOrderFromConversation(conversationInfo, this.team)};
    this.mappingAddress(this.quickOrderModel);

    this.isLoading = false;
    this.cdRef.detectChanges();
  }

  onSelectOrderFromMessage() {
    this.conversationOrderFacade.onSelectOrderFromMessage$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (obs: any) => {

          switch (obs.type) {
            case 'phone':
                this.quickOrderModel.Telephone = obs.value;
            break;

            case 'address':
                if(obs.value && TDSHelperObject.hasValue(obs.value)) {
                  let data = {...this.csOrder_SuggestionHandler.onLoadSuggestion(obs.value, this.quickOrderModel)};
                  this.quickOrderModel = data;
                  this.mappingAddress(this.quickOrderModel);
                  this.cdRef.detectChanges();
                }
            break;

            case 'note':
                let text = (this.quickOrderModel.Note || "") + ((this.quickOrderModel.Note || "").length > 0 ? '\n' + obs.value : obs.value);
                this.quickOrderModel.Note = text;
            break;
          }

          this.updateOrder(obs.type);
      }
    })
  }

  updateOrder(type: string) {
    let id = this.quickOrderModel.Id as string;
    if(!id) {
        this.noteWhenNoId = this.quickOrderModel.Note;
        this.cdRef.detectChanges();
        return;
    }

    this.isLoading = true;
    this.saleOnline_OrderService.getById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          delete res['@odata.context'];
          let model = {...res} as QuickSaleOnlineOrderModel;

          switch (type) {
            case 'phone':
                model.Telephone = this.quickOrderModel.Telephone;
            break;
            case 'address':
                model.Address = this.quickOrderModel.Address;
                model.CityCode = this.quickOrderModel.CityCode;
                model.CityName = this.quickOrderModel.CityName;
                model.DistrictCode = this.quickOrderModel.DistrictCode;
                model.DistrictName = this.quickOrderModel.DistrictName;
                model.WardCode = this.quickOrderModel.WardCode;
                model.WardName = this.quickOrderModel.WardName;
            break;
            case 'note':
                model.Note = this.quickOrderModel.Note;
            break;
            case 'confirm':
              model.Address = this.quickOrderModel.Address;
              model.CityCode = this.quickOrderModel.CityCode;
              model.CityName = this.quickOrderModel.CityName;
              model.DistrictCode = this.quickOrderModel.DistrictCode;
              model.DistrictName = this.quickOrderModel.DistrictName;
              model.WardCode = this.quickOrderModel.WardCode;
              model.WardName = this.quickOrderModel.WardName;
            break;
          }

          this.saleOnline_OrderService.update(id, model).pipe(takeUntil(this.destroy$)).subscribe({
            next: (order: any) => {
                this.isLoading = false;

                if(type == 'confirm') {
                    this.message.success('Lưu địa chỉ đơn hàng thành công');
                }

                let csid = model.Facebook_ASUserId;
                this.onSyncConversationPartner(csid);
                this.cdRef.detectChanges();
            },
            error: error => {
                this.isLoading = false;
                this.message.error(error?.error?.message);
                this.cdRef.detectChanges();
            }
          })
      },
      error: error => {
          this.isLoading = false;
          this.message.error(error?.error?.message);
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
          this.message.error(`${error?.error?.message}`);
          this.cdRef.detectChanges();
      }
    });
  }

  loadCurrentCompany() {
    this.sharedService.apiCurrentCompany().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: CompanyCurrentDTO) => {
        this.companyCurrents = res;

        let warehouseId = this.companyCurrents.DefaultWarehouseId;
        if(warehouseId > 0) {
          this.loadInventoryWarehouseId(warehouseId);
        }
      },
      error: (error: any) => {
        this.message.error(error?.error?.message);
      }
    });
  }

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

    if(event.checked == true) {
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
        let tax = {...this.computeCaclHandler.so_calcTax(this.saleModel, this.saleConfig)};
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
    this.applicationUserService.setUserActive();
    this.applicationUserService.getUserActive().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
          this.users = [...res];
          this.lstUser = [...res];
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

  loadDeliveryCarrier(){
    this.deliveryCarrierService.setDeliveryCarrier();
    this.deliveryCarrierService.getDeliveryCarrier().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: TDSSafeAny) => {
        this.lstCarrier = [...res.value];
      },
      error: error =>{
        this.message.error(error?.error?.message || Message.CanNotLoadData);
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

  onChangeConfigValue(event: any, configName: string){
    this.configsProviderDataSource.map(x => {

      if(x.ConfigName === configName) {
        x.ConfigValue = event;
      }
    })
  }

  searchUser(){
    let data = this.users;
    let key = this.keyFilterUser;

    if (TDSHelperString.hasValueString(key)) {
      key = TDSHelperString.stripSpecialChars(key.trim());
    }

    data = data.filter((x) => (x.Name && TDSHelperString.stripSpecialChars(x.Name.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(key.toLowerCase())) !== -1));
    this.lstUser = data;
  }

  calcFee() {
    let model = this.saleModel.Carrier as any;
    this.calculateFeeAship(model);
  }

  onSelectShipServiceId(serviceId: string) {
    if(serviceId) {
      let exist = this.shipServices.filter((x: any) => x.ServiceId === serviceId)[0];
      if(exist) {
         this.selectShipServiceV2(exist)
      }
    }
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

  onSavePost(formAction?: string | null, type?: string, _click_print?: any): any {
    let printOrder = !this.isEnableCreateOrder && _click_print == '_click_print' && type == 'print';
    if(printOrder) {
        this.clickPrint = '_click_print';
    }

    let model1 = this.insertFromPostModel;
    let model2= {} as any;
    this.team = this.crmTeamService.getCurrentTeam() as any;

    if(model1 && this.quickOrderModel) {
        model2 = {...this.csOrder_PrepareModelHandler.prepareInsertFromMessage(this.quickOrderModel, this.team)}; // ưu tiên lấy dữ liệu đơn hàng làm model
    }

    let model = Object.assign({}, model1, model2) as any;
    if(!TDSHelperString.hasValueString(model.Facebook_PostId)) {
        model.Facebook_PostId = this.route.snapshot.queryParams['post_id'];
    }

    model.FormAction = formAction;
    if(this.validateModelFastSalesOrder(model) == 0) return;

    this.isLoading = true;
    let channelType = this.team.Type;

    this.ngZone.run(() => {
      this.saleOnline_OrderService.apiInsertFromComment(model, true, channelType).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            delete res['@odata.context'];
            res.FormAction = formAction;
            if(res && TDSHelperString.hasValueString(res.Note)) {
              res.Note = this.conversationOrderFacade.prepareMessageHasPhoneBBCode(res.Note);
            }

            this.mappingAddress(res);
            this.disableSyncOrder = true;

            this.prepareResponseSaleOnline(res, type);
            this.cdRef.detectChanges();
        },
        error: (error: any) => {
            this.isLoading = false;
            this.postEvent.isLoadingInsertFromPost$.emit(false);
            this.postEvent.spinLoadingTab$.emit(false);

            this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi');
            this.cdRef.detectChanges();
        }
      })
    })
  }

  onSave(formAction?: string, type?: string, _click_print?: any): any {
    let printOrder = !this.isEnableCreateOrder && _click_print == '_click_print' && type == 'print';
    if(printOrder) {
        this.clickPrint = '_click_print';
    }

    this.team = this.crmTeamService.getCurrentTeam() as CRMTeamDTO;
    let model = {...this.csOrder_PrepareModelHandler.prepareInsertFromMessage(this.quickOrderModel, this.team)};
    model.FormAction = formAction;

    if(this.validateModelFastSalesOrder(model) == 0) return;

    let channelType = this.team.Type;
    this.isLoading = true;

    this.ngZone.run(() => {
        this.saleOnline_OrderService.apiInsertFromMessage({model: model}, channelType).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res: any) => {
              delete res['@odata.context'];
              res.FormAction = formAction;
              if(res && TDSHelperString.hasValueString(res.Note)) {
                res.Note = this.conversationOrderFacade.prepareMessageHasPhoneBBCode(res.Note);
              }

              this.prepareResponseSaleOnline(res, type);
              this.cdRef.detectChanges();
          },
          error: (error: any) => {
              this.isLoading = false;
              this.message.error(`${error?.error?.message}`);
              this.cdRef.detectChanges();
          }
        })
    })
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

          // TODO: gọi lại request để mapping tồn kho sản phẩm
          if(fs_model && fs_model.FormAction == 'SaveAndOpen' || fs_model.FormAction == 'SaveAndPrint') {
            let warehouseId = this.companyCurrents?.DefaultWarehouseId;
            if(warehouseId > 0) {
                this.productService.lstInventory = null;
                this.loadInventoryWarehouseId(warehouseId);
            }
          }

          this.shipServices = [];
          this.shipExtraServices = [];
          this.saleModel = {} as any;
          this.enableInsuranceFee = false;
          this.isEnableCreateOrder = false;
          this.isCalculateFeeAship = false;
          this.isEnableCalcFee = false;
          this.isEqualAmountInsurance = false;

          let csid = this.quickOrderModel.Facebook_ASUserId;
          this.onSyncConversationPartner(csid, 'FastSaleOrder');

          delete this.quickOrderModel.Id;
          delete this.quickOrderModel.Code;
          this.quickOrderModel.Details = [];

          this.isLoading = false;
          this.cdRef.detectChanges();
      },
      error: (error: any) => {
          this.isLoading = false;
          this.isEnableCalcFee = false;
          this.isEqualAmountInsurance = false;

          this.notification.error('Tạo hóa đơn thất bại', error.error?.message);
          this.cdRef.detectChanges();
      }
    })
  }

  prepareCsFastSaleOrder(order: QuickSaleOnlineOrderModel): any {
    let fs_model = {} as FastSaleOrder_DefaultDTOV2;

    this.updateShipExtras();
    this.updateShipServiceExtras();
    this.updateShipmentDetailsAship();

    fs_model = {...this.so_PrepareFastSaleOrderHandler.so_prepareFastSaleOrder(this.saleModel, order)};
    fs_model.CompanyId = this.companyCurrents?.CompanyId;
    fs_model.FormAction = order.FormAction;

    // TODO check cấu hình ghi chú in
    fs_model.Comment = '';
    // let printNote = this.saleConfig && this.saleConfig.SaleSetting && this.saleConfig.SaleSetting.GroupSaleOnlineNote;
    // if(!printNote) {
    //     fs_model.Comment = '';
    // }

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
      this.message.info('Đang thao tác in phiếu...');
      obs.pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
          this.printerService.printHtml(res);
      }, (error: TDSSafeAny) => {
          if(error?.error?.message) {
              this.notification.error( 'Lỗi in phiếu', error?.error?.message);
          }
      });
    }
  }

  showModalAddProduct() {
    const modal = this.modal.create({
        title: 'Thêm sản phẩm',
        content: ModalProductTemplateComponent,
        size: "xl",
        viewContainerRef: this.viewContainerRef,
        componentParams:{
          type: InventoryChangeType._TAB_ORDER
        }
    })

    modal.afterClose.pipe(takeUntil(this.destroy$)).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          if(!res) return;
          this.response = {...res} as SyncCreateProductTemplateDto;
      }
    })
  }

  mappingProduct(response: any) {
    this.indexDbStorage = [...response.cacheDbStorage];

    if(response.type === 'select' && response.productTmpl) {
      const product = response.productTmpl as ProductTemplateV2DTO;
      let x!:DataPouchDBDTO;

      if(product.VariantFirstId) {
        x = this.indexDbStorage?.find((x: DataPouchDBDTO) => x.Id == product.VariantFirstId && x.UOMId == product.UOMId && x.Active) as DataPouchDBDTO;
      } else {
        let items = this.indexDbStorage?.filter((x: DataPouchDBDTO) => x.ProductTmplId == product.Id && x.UOMId == product.UOMId && x.Active) as DataPouchDBDTO[];
        x = items[0];
      }

      if(!x) {
        this.message.error('Sản phẩm đã bị xóa hoặc hết hiệu lực');
        return;
      }

      let data: Detail_QuickSaleOnlineOrder = this.mappingDetailQuickSaleOnlineOrder(x);
      this.quickOrderModel.Details = [...this.quickOrderModel.Details, ...[data]];

      this.calcTotal();
      this.coDAmount();
      this.cdRef.detectChanges();
    }
  }

  mappingDetailQuickSaleOnlineOrder(data: any, type?: string){ //check lại dữ liệu

    //data sẽ là ProductDTOV2 | ProductTemplateV2DTO
    let model: Detail_QuickSaleOnlineOrder = {
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
    if(type == 'template') {
      model.ProductId = data.VariantFirstId;
      model.Price = data.ListPrice;
    }

    return {...model};
  }

  showModalAddPromotion(){
    this.message.info('Tính năng chưa khả dụng');
  }

  showModalConfigProduct() {
    const modal = this.modal.create({
        title: 'Chọn bảng giá',
        content: TpageConfigProductComponent,
        size: "lg",
        viewContainerRef: this.viewContainerRef
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: StoragePriceListItemsDto) => {
            this.productIndexDB();
        }
    })
  }

  showModalListProduct(){
    const modal = this.modal.create({
        title: 'Chọn sản phẩm',
        content: ModalListProductComponent,
        viewContainerRef: this.viewContainerRef,
        size: 'lg',
        bodyStyle: {
          padding: '0px'
        },
    });
  }

  selectProduct(item: DataPouchDBDTO) {
    let index = this.quickOrderModel.Details?.findIndex(x => x.ProductId === item.Id && x.UOMId == item.UOMId && item.Active) as number;
    if(Number(index) < 0) {
        let data = {...item} as ProductDTOV2;
        let x = this.mappingDetailQuickSaleOnlineOrder(data) ;
        this.quickOrderModel.Details = [...this.quickOrderModel.Details, ...[x]];
    } else {
        this.quickOrderModel.Details[index].Quantity += 1;
    }

    this.closeSearchProduct();
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

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe(res => {
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

  onRemoveProduct(item: Detail_QuickSaleOnlineOrder) {
    let index = this.quickOrderModel.Details?.findIndex(x => x.ProductId == item.ProductId && x.UOMId == item.UOMId);

    if(index >= 0) {
        this.quickOrderModel.Details?.splice(index,1);
        this.calcTotal();
        this.coDAmount();
    }
  }

  closeSearchProduct(){
    this.textSearchProduct = '';
    this.innerTextDebounce = '';
  }

  onSearchProduct(event: any) {
    if(!this.textSearchProduct) {
      this.innerTextDebounce = '';
      return;
    }

    this.isLoadingProduct = true;
    setTimeout(() => {
      this.isLoadingProduct = false;
      this.cdRef.detectChanges();
    }, 150);

    this.innerTextDebounce = TDSHelperString.stripSpecialChars(this.textSearchProduct.toLocaleLowerCase().trim())
  }

  loadProduct(textSearch: string) {
    this.isLoadingProduct = true;

    this.productTemplateUOMLineService.getProductUOMLine(this.pageIndex, this.pageSize, textSearch).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ODataProductDTOV2) => {
        this.countUOMLine = res['@odata.count'] as number;
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
        this.lstInventory = {...res};
        this.cdRef.detectChanges();
      },
      error: (err: any) => {
        this.message.error(err.error? err.error.message: 'Không thể tải dữ liệu tồn kho');
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

    } else {
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
    let exsit = index >= 0 && this.quickOrderModel.Details[index].ProductId == item.ProductId && this.quickOrderModel.Details[index].UOMId == item.UOMId;

    if(exsit) {
        this.quickOrderModel.Details[index].Quantity++;
        this.calcTotal();
        this.coDAmount();
    }
  }

  minus(item: Detail_QuickSaleOnlineOrder, index: number) {
    let exsit = index >= 0 && this.quickOrderModel.Details[index].ProductId == item.ProductId && this.quickOrderModel.Details[index].UOMId == item.UOMId;

    if(exsit) {
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

              if(this.shipServices && this.shipServices.length > 0) {
                  let x = this.shipServices.filter((x: any) => x.ServiceId === model.ServiceId)[0];
                  if(x) {
                      this.selectShipServiceV2(x);
                      this.message.success(`Đối tác ${event.Name} có phí vận chuyển: ${formatNumber(Number(x.TotalFee), 'en-US', '1.0-0')} đ`);
                  } else {
                      let item = this.shipServices[0] as CalculateFeeServiceResponseDto;
                      this.selectShipServiceV2(item);
                      this.message.success(`Đối tác ${event.Name} có phí vận chuyển: ${formatNumber(Number(item.TotalFee), 'en-US', '1.0-0')} đ`);
                }
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
          isSelectAddress: true,
          isSelectAddressConversation: true
        }
      });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe({
      next: (result: TDSSafeAny) => {
        if(result){
            let data = {...this.csOrder_SuggestionHandler.onLoadSuggestion(result.value, this.quickOrderModel)};
            this.quickOrderModel = {...data};
            this.mappingAddress(this.quickOrderModel);

            if(result.type == 'confirm') {
              this.updateOrder(result.type);
            }
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
    this.insertFromPostModel = {} as any;
    (this.quickOrderModel as any) = null;
    (this.saleModel as any) = null;
    (this._cities as any) = null;
    (this._districts as any) = null;
    (this._wards as any) = null;
    (this._street as any) = null;
    this.commentPost = null as any;
    this.disableSyncOrder = false;
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

  vsEndUOMLine(event: NgxVirtualScrollerDto) {
    if(this.isLoadingProduct || this.isLoadingNextdata) {
        return;
    }

    let exisData = this.lstProductSearch && this.lstProductSearch.length > 0 && event && event.scrollStartPosition > 0;
    if(exisData) {
      const vsEnd = Number(this.lstProductSearch.length - 1) == Number(event.endIndex) && this.pageIndex >= 1 && Number(this.lstProductSearch.length) < this.countUOMLine;
      if(vsEnd) {
          this.nextDataUOMLine();
      }
    }
  }

  nextDataUOMLine() {
    this.isLoadingNextdata = true;
    this.pageIndex += 1;
    this.productTemplateUOMLineService.getProductUOMLine(this.pageIndex, this.pageSize, this.textSearchProduct).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          if(res && res.value) {
            this.lstProductSearch = [...this.lstProductSearch, ...res.value];
          }

          this.isLoadingNextdata = false;
          this.cdRef.detectChanges();
      },
      error: (error: any) => {
        this.isLoadingNextdata = false;
        this.message.error(`${error?.error?.message}`);
        this.cdRef.detectChanges();
      }
    })
  }

  notiOrderFromMessage(type: string) {
    switch (type) {
      case 'phone':
        this.message.info('Chọn làm số điện thoại thành công');
      break;
      case 'address':
        this.message.info('Chọn làm địa chỉ thành công');
      break;
      case 'note':
        this.message.info('Chọn làm ghi chú thành công');
      break;
    }
  }

  productIndexDB() {
    this.isLoadingProduct = true;
    this.indexDbStorage = [];

    this.productIndexDBService.setCacheDBRequest();
    this.productIndexDBService.getCacheDBRequest().pipe(takeUntil(this.destroy$)).subscribe({
        next:(res: KeyCacheIndexDBDTO) => {
            if(!res) return;
            this.indexDbStorage = [...res?.cacheDbStorage || []];

            let priceListItems = this.productIndexDBService.getSessionStoragePriceListItems() as StoragePriceListItemsDto;
            if(priceListItems && priceListItems.Value) {
                this.indexDbStorage?.map((x: DataPouchDBDTO) => {
                    if(x.SaleOK && ! x.IsDiscount) {
                        let price = priceListItems.Value[`${x.ProductTmplId}_${x.UOMId}`];
                        if (price) {
                          if (!x.OldPrice) {
                              x.OldPrice = x.Price;
                          }
                          x.Price = price;
                        } else {
                          if (x.OldPrice >= 0) {
                              x.Price = x.OldPrice;
                          }
                        }
                    }
                  })
            }

            if(this.quickOrderModel?.Details && this.quickOrderModel?.Details.length > 0) {
              this.quickOrderModel?.Details.map((x: Detail_QuickSaleOnlineOrder) => {
                  let index = this.indexDbStorage.findIndex(y => y.Id == x.ProductId && y.UOMId == x.UOMId);

                  if(Number(index) >= 0) {
                    x.Price = this.indexDbStorage[Number(index)].Price;
                  }
              })

              this.calcTotal();
              this.coDAmount();
            }

            this.isLoadingProduct = false;
            this.cdRef.detectChanges();
        },
        error:(err) => {
            this.isLoadingProduct = false;
            this.message.error(err?.error?.message || Message.Product.CanNotLoadData);
            this.cdRef.detectChanges();
        }
    })
  }

  trackByIndex(_: number, data: DataPouchDBDTO): number {
    return data.Id;
  }

  onChangeQuantity(event: any, item: any){
    let index = this.quickOrderModel?.Details?.findIndex(x => x.ProductId == item.ProductId && x.UOMId == item.UOMId);

    if(event && Number(index) >= 0) {
        this.quickOrderModel.Details[Number(index)].Quantity = Number(event);
    }

    if(!event && Number(index) >= 0) {
      this.quickOrderModel.Details[Number(index)].Quantity = 1;
      this.quickOrderModel.Details[Number(index)] = {...this.quickOrderModel.Details[Number(index)]};
    }

    this.calcTotal();
    this.coDAmount();
  }

  onCreateFastSaleOrder(order: QuickSaleOnlineOrderModel, type?: string) {
    let orderId = order.Id as string;
    let fs_model = {} as FastSaleOrder_DefaultDTOV2;

    fs_model = {...this.prepareCsFastSaleOrder(order)};
    fs_model.SaleOnlineIds = [orderId];
    fs_model.PartnerId = order.PartnerId;

    this.createFastSaleOrder(fs_model, type);
  }

  onQuickSaleOnlineOrder(order: QuickSaleOnlineOrderModel, type?: string) {
    this.conversationOrderFacade.hasValueOrderCode$.emit(order.Code);

    let csid = order.Facebook_ASUserId;
    this.onSyncConversationPartner(csid);

    if(order.IsCreated) {
        this.message.success('Tạo đơn hàng thành công');
    } else {
        this.message.success('Cập nhật đơn hàng thành công');
    }

    let id = order.Id as string;
    let message = this.type == 'post' ? this.commentPost?.Message : null;

    // Tiktok khi print gán uid là UniqueId
    let channelType = this.team?.Type;
    if(channelType == CRMTeamType._UnofficialTikTok) {
        order.Facebook_UserId = this.tiktokUniqueId;
    }

    if(this.clickPrint == '_click_print') {
      this.orderPrintService.printId(id, this.quickOrderModel, message);
      this.clickPrint = '';
    } else {
      let print = type && !this.saleOnlineSettings?.isDisablePrint;
      if(!print) return;

      if(order.IsCreated) {
          this.orderPrintService.printId(id, this.quickOrderModel, message);
      } else
        if(this.saleOnlineSettings?.isPrintMultiTimes) {
            this.orderPrintService.printId(id, this.quickOrderModel, message);
      }
    }
  }

  prepareResponseSaleOnline(order: QuickSaleOnlineOrderModel, type?: string) {
    this.quickOrderModel = {...order};

    if(this.isEnableCreateOrder) {
        this.onCreateFastSaleOrder(this.quickOrderModel, type);
    } else {
        this.onQuickSaleOnlineOrder(this.quickOrderModel, type);
    }
  }

  validateModelFastSalesOrder(model: any) {
    if(this.isEnableCreateOrder == false) {
        return 1;
    }

    if (!TDSHelperArray.hasListValue(model.Details)) {
        this.notification.warning('Không thể tạo hóa đơn', 'Đơn hàng chưa có chi tiết');
        return 0;
    }
    if (!TDSHelperString.hasValueString(model.Telephone)) {
        this.notification.warning('Không thể tạo hóa đơn', 'Vui lòng thêm điện thoại');
        return 0;
    }
    if (!TDSHelperString.hasValueString(model.Address)) {
        this.notification.warning('Không thể tạo hóa đơn', 'Vui lòng thêm địa chỉ');
        return 0;
    }

    if (!TDSHelperString.hasValueString(model.CityCode) || !TDSHelperString.hasValueString(model.DistrictCode)) {
        this.notification.warning('Không thể tạo hóa đơn', 'City: Hãy nhập Tỉnh/thành phố; District: Hãy nhập Quận/huyện');
        return 0;
    }

    //TODO: trường hợp đối tác đã có mà chưa call lại hàm tính phí aship
    if(this.isCalculateFeeAship == false && this.saleModel.Carrier) {
        this.notification.info(`Đối tác ${this.saleModel.Carrier.Name}`, 'Đang tính lại ship đối tác, vui lòng thao tác lại sau khi thành công');
        let carrier = this.saleModel.Carrier as any;
        this.calculateFeeAship(carrier);
        return 0;
    }

    return 1;
  }

  onSyncConversationPartner(csid: any, type?: string) {
    this.destroyTimer();
    this.syncTimer = setTimeout(() => {
      this.chatomniConversationService.getInfo(this.team.Id, csid).pipe(takeUntil(this.destroy$)).subscribe({
          next: (info: ChatomniConversationInfoDto) => {
              this.chatomniConversationFacade.onSyncConversationInfo$.emit(info);
              this.chatomniConversationFacade.onSyncConversationPartner$.emit(info);

              if(type == 'FastSaleOrder') {
                  this.chatomniConversationFacade.onSyncConversationOrder$.emit(info);
              }

              this.postEvent.spinLoadingTab$.emit(false);
              this.postEvent.isLoadingInsertFromPost$.emit(false);

              this.isLoading = false;
              this.cdRef.detectChanges();
          },
          error: (error: any) => {
              this.postEvent.spinLoadingTab$.emit(false);
              this.postEvent.isLoadingInsertFromPost$.emit(false);

              this.isLoading = false;
              this.message.error(error?.error?.message);
              this.cdRef.detectChanges();
          }
      })
    }, 350);
  }

  destroyTimer() {
    if (this.syncTimer) {
      clearTimeout(this.syncTimer);
    }
  }

  checkSelectNote() {
    //TODO: khi chưa có đơn, mà khách hàng chọn comment ghi chú thì gán tạm trên giao diện
    if(TDSHelperString.hasValueString(this.noteWhenNoId)) {
      this.quickOrderModel.Note = this.noteWhenNoId;
    }
    delete this.noteWhenNoId;
  }

  ngOnDestroy(): void {
    this.destroyTimer();
  }


  onSearchSuggestion(event: any) {
    if(!TDSHelperString.hasValueString(event)) return;

    this.quickOrderModel.Address = event;
    event = TDSHelperString.stripSpecialChars(event).trim().toLocaleLowerCase();

    this.suggestData = this.suggestService.suggest(event)
      .pipe(takeUntil(this.destroy$)).pipe(map(x => ([...x?.data || []])));
  }

  onSelectSuggestion(event: SuggestAddressDto) {
    if(event) {
      this.quickOrderModel.Address = event.Address;
      this._street = event.Address;

      this.quickOrderModel.CityCode = event.CityCode;
      this.quickOrderModel.CityName = event.CityName;
      this._cities = {
        code: event.CityCode,
        name: event.CityName
      }

      this.quickOrderModel.DistrictCode = event.DistrictCode;
      this.quickOrderModel.DistrictName = event.DistrictName;
      this._districts = {
        code: event.DistrictCode,
        name: event.DistrictName,
        cityName: event.CityCode,
        cityCode: event.CityName
      }

      this.quickOrderModel.WardCode = event.WardCode;
      this.quickOrderModel.WardName = event.WardName;
      this._wards = {
        code: event.WardCode,
        name: event.WardName,
        cityName: event.CityCode,
        cityCode: event.CityName,
        districtCode: event.DistrictCode,
        districtName: event.DistrictName
      }
    }
  }
}
