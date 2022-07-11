import { ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { InitSaleDTO } from './../../../../dto/setting/setting-sale-online.dto';
import { Component, Input, OnInit, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { Subject, Observable, takeUntil, finalize, map } from 'rxjs';
import { ConversationMatchingItem } from 'src/app/main-app/dto/conversation-all/conversation-all.dto';
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
import { TpageAddProductComponent } from 'src/app/main-app/shared/tpage-add-product/tpage-add-product.component';
import { TpageConfigProductComponent } from 'src/app/main-app/shared/tpage-config-product/tpage-config-product.component';
import { ModalTaxComponent } from '../modal-tax/modal-tax.component';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { Detail_QuickSaleOnlineOrder, QuickSaleOnlineOrderModel } from 'src/app/main-app/dto/saleonlineorder/quick-saleonline-order.dto';
import { FastSaleOrder_DefaultDTOV2 } from 'src/app/main-app/dto/fastsaleorder/fastsaleorder-default.dto';
import { Ship_ExtrasServiceModel } from 'src/app/main-app/commands/dto-handler/ship-extra-service.dto';
import { InitOkieLaHandler } from 'src/app/main-app/commands/init-okila.handler';
import { InitServiceHandler } from 'src/app/main-app/commands/init-service.handler';
import { InitInfoOrderDeliveryHandler } from 'src/app/main-app/commands/init-inforder-delivery.handler';
import { DeliveryCarrierDTOV2 } from 'src/app/main-app/dto/delivery-carrier.dto';
import { CalcServiceDefaultHandler } from 'src/app/main-app/commands/calc-service-default.handler';
import { PrepareCalculateFeeV2Handler } from 'src/app/main-app/commands/prepare-calculateFeeV2-model.handler';
import { ValidateInsuranceFeeHandler } from 'src/app/main-app/commands/validate-insurance-fee.dto';
import { formatNumber } from '@angular/common';
import { SelectShipServiceHandler } from 'src/app/main-app/commands/select-ship-service.handler';
import { TAuthService, UserInitDTO } from 'src/app/lib';
import { TACheckboxChange } from 'tds-ui/tds-checkbox';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { PrepareSaleModelHandler } from 'src/app/main-app/commands/prepare-salemodel.handler';
import { TDSNotificationService } from 'tds-ui/notification';
import { GetInventoryDTO, ProductTemplateDTO } from 'src/app/main-app/dto/product/product.dto';
import { SuggestCitiesDTO, SuggestDistrictsDTO, SuggestWardsDTO } from 'src/app/main-app/dto/suggest-address/suggest-address.dto';
import { ResultCheckAddressDTO } from 'src/app/main-app/dto/address/address.dto';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { ODataProductDTOV2, ProductDTOV2 } from 'src/app/main-app/dto/product/odata-product.dto';
import { FilterObjDTO, OdataProductService } from 'src/app/main-app/services/mock-odata/odata-product.service';
import { ProductService } from 'src/app/main-app/services/product.service';
import { ConversationPartnerHandler } from '../conversation-partner/conversation-partner.handler';
import { ConversationOrderHandler } from './conversation-order.handler';

@Component({
    selector: 'conversation-order',
    templateUrl: './conversation-order.component.html',
})

export class ConversationOrderComponent  implements OnInit, OnDestroy {

  @Input() data!: ConversationMatchingItem;
  @Input() team!: CRMTeamDTO;

  isLoading: boolean = false;
  isEditPartner: boolean = false;
  isEnableCreateOrder: boolean = false;
  isEnableInsuranceFee: boolean = false;

  textSearchProduct!: string;
  isLoadingProduct: boolean = false;

  lstUser!: Array<ApplicationUserDTO>;
  lstCarriers!: Observable<DeliveryCarrierDTOV2[]>;

  // saleModel!: FastSaleOrderRestDTO;
  shipExtraServices: Ship_ExtrasServiceModel[] = [];
  saleConfig!: InitSaleDTO;
  shipServices: any[] = [];

  visibleIndex: number = -1;
  keyFilterUser: string = '';
  isOpenCarrier = false;

  quickOrderModel!: QuickSaleOnlineOrderModel;
  saleModel!: FastSaleOrder_DefaultDTOV2;
  enableInsuranceFee: boolean = false;
  userInit!: UserInitDTO;
  lstProductSearch: ProductDTOV2[] = [];

  delivery_types = ["fixed", "base_on_rule", "VNPost"];
  carrierTypeInsurance = ["MyVNPost", "GHN", "GHTK", "ViettelPost", "NinjaVan", "HolaShip"];
  apiDeliveries = ['GHTK', 'ViettelPost', 'GHN', 'TinToc', 'SuperShip', 'FlashShip', 'OkieLa', 'MyVNPost', 'DHL', 'FulltimeShip', 'JNT', 'BEST', 'EMS', 'AhaMove', 'Snappy', 'NhatTin', 'HolaShip', 'ZTO', 'FastShip', 'Shopee', 'GHSV'];

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

  private destroy$ = new Subject<void>();
  lstInventory!: GetInventoryDTO;

  constructor(private message: TDSMessageService,
    private conversationOrderFacade: ConversationOrderFacade,
    private applicationUserService: ApplicationUserService,
    private modal: TDSModalService,
    private generalConfigsFacade: GeneralConfigsFacade,
    private deliveryCarrierService: DeliveryCarrierService,
    private auth: TAuthService,
    private odataProductService: OdataProductService,
    private cdRef: ChangeDetectorRef,
    private productService: ProductService,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private fastSaleOrderService: FastSaleOrderService,
    private notification: TDSNotificationService,
    private orderPrintService: OrderPrintService,
    private printerService: PrinterService,
    private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit(): void {
    this.loadData();

    this.loadSaleConfig();
    this.loadUsers();
    this.loadUserLogged();
    this.lstCarriers = this.loadCarrier();
  }

  loadData() {
    this.validateData();
    this.conversationOrderFacade.onLastOrderCheckedConversation$.pipe(takeUntil(this.destroy$)).subscribe((res: QuickSaleOnlineOrderModel) => {
        this.quickOrderModel = { ... res };
        this.mappingAddress(this.quickOrderModel);

        if(TDSHelperString.hasValueString(this.quickOrderModel.Code)){
          this.conversationOrderFacade.onPushLastOrderCode$.emit(this.quickOrderModel.Code);
        }
    })
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
    let model = { Type: 'invoice' };
    this.isLoading = true;
    this.fastSaleOrderService.defaultGetV2({model: model}).pipe(takeUntil(this.destroy$)).subscribe(res => {
      delete res["@odata.context"];

      this.saleModel = res;
      if (res.DateInvoice) {
        res.DateInvoice = new Date(res.DateInvoice);
      }
      if (res.DateOrderRed) {
        res.DateOrderRed = new Date(res.DateOrderRed);
      }
      if (res.ReceiverDate) {
        res.ReceiverDate = new Date(res.ReceiverDate);
      }

      // Khởi tạo saleModel mặc định
      this.saleModel = Object.assign({
          AmountTotal: 0,
          CashOnDelivery: 0,
          ShipWeight: 100,
          DeliveryPrice: 0,
      }, this.saleModel);

      if (this.saleModel.Carrier && this.saleModel.Carrier.Extras) {
          this.saleModel.Ship_Extras = this.saleModel.Carrier.Extras;
          //gán giá trị bảo hiểm
          if (this.saleModel.Ship_Extras)
          this.saleModel.Ship_InsuranceFee = this.saleModel.Ship_Extras.IsInsurance ? this.saleModel.Ship_Extras.InsuranceFee ? this.saleModel.Ship_Extras.InsuranceFee : this.quickOrderModel.TotalAmount : 0;
      }

      if (this.saleModel.Ship_ServiceExtrasText) {
        let shipExtra = JSON.parse(this.saleModel.Ship_ServiceExtrasText) as any[];

        this.shipExtraServices = [];
        shipExtra.map(item => {
        this.shipExtraServices.push({
              ServiceId: item.Id,
              ServiceName: item.Name,
              Fee: 0,
              TotalFee: 0,
              IsSelected: true,
              Type: item.Type,
              ExtraMoney: item.ExtraMoney,
          });
          if (item.Id === 'OrderAmountEvaluation' || item.Id === "16" || item.Id === "GBH" || item.Id === "NinjaVan" || item.Id === "BEST_Insurance" || item.Id === "Snappy_Insurance" || item.Id === "HolaShip_Insurance" || item.Id === "JNT_Insurance" || item.Id === "FastShip_Insurance" || item.Id === "Shopee_Insurance" || item.Id === "GHSV_Insurance" || item.Id === "SHIP60_Insurance") {
            this.enableInsuranceFee = true;
          }
        });
      }

      InitOkieLaHandler.initOkieLa(this.saleModel, this.shipExtraServices);
      InitServiceHandler.initService(this.saleModel, this.shipExtraServices, this.shipServices);
      InitInfoOrderDeliveryHandler.initInfoOrderDelivery(this.saleModel, this.quickOrderModel, this.shipExtraServices, this.enableInsuranceFee);

      this.computeAmountTotal();
      this.updateCoDAmount();

      this.saleModel.CompanyId = this.saleModel.CompanyId || this.quickOrderModel.CompanyId || this.saleConfig?.SaleSetting?.CompanyId;
      this.isLoading = false;
    }, error => {
      this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
      this.isLoading = false;
    });
  }

  validateData(){
    (this.quickOrderModel as any) = null;
    (this.saleModel as any) = null;
  }

  onEnableCreateOrder(event: TACheckboxChange) {
    if(event.checked == true && !this.saleModel) {
        this.loadSaleModel();
    }
  }

  updateCoDAmount() {
    if (this.saleModel) {
      let coDAmount = this.quickOrderModel.TotalAmount + this.saleModel.DeliveryPrice - this.saleModel.AmountDeposit;
      this.saleModel.CashOnDelivery = coDAmount;
    }
  }

  computeAmountTotal() {
    let totalAmount = 0;
    let totalQuantity = 0;

    this.quickOrderModel.Details.map((item) => {
        totalAmount += (item.Price * item.Quantity);
        totalQuantity += (item.Quantity);
    });

    this.quickOrderModel.TotalAmount = totalAmount;
    this.quickOrderModel.TotalQuantity = totalQuantity;

    if(this.saleModel) {
      let discountAmount = Math.round(totalAmount * (this.saleModel.Discount / 100));
      this.saleModel.DiscountAmount = discountAmount;

      totalAmount = totalAmount -this.saleModel.DiscountAmount - this.saleModel.DecreaseAmount;
      this.saleModel.AmountUntaxed = totalAmount;

      //TODO: Tính thuế để gán lại tổng tiền AmountTotal
      this.calcTax();

      if(!this.saleConfig?.SaleSetting?.GroupAmountPaid) {
        //TODO: Gán lại số tiền trả PaymentAmount;
        let amountDepositSale = this.saleModel.SaleOrder ? this.saleModel.SaleOrder?.AmountDeposit : 0;
        let paymentAmount = amountDepositSale ? (this.saleModel.AmountTotal - amountDepositSale) : this.saleModel.AmountTotal;

        this.saleModel.PaymentAmount = paymentAmount;
      }

      this.saleModel.TotalQuantity = totalQuantity;
    }
  }

  calcTax() {
    this.saleModel.AmountTax = 0;
    if(this.saleModel.Tax) {
      let amountTax = Math.round(this.saleModel.AmountUntaxed * ((this.saleModel.Tax?.Amount) / 100));
      this.saleModel.AmountTax = amountTax;
    }

    let amountTotal = Math.round(this.saleModel.AmountUntaxed + this.saleModel.AmountTax);
    this.saleModel.AmountTotal = amountTotal;
  }

  loadUsers() {
    this.applicationUserService.getActive().pipe(takeUntil(this.destroy$)).subscribe(res => {
        this.lstUser = [...res.value];
    });
  }

  loadUserLogged() {
    this.auth.getUserInit().pipe(takeUntil(this.destroy$)).subscribe(res => {
        if(res) {
            this.userInit = res || {};
            if(this.userInit?.Company?.Id) {
              this.loadInventoryWarehouseId(this.userInit?.Company?.Id);
            }
        }
    })
  }

  loadSaleConfig() {
    this.generalConfigsFacade.getSaleConfigs().pipe(takeUntil(this.destroy$)).subscribe(res => {
        this.saleConfig = res;
    });
  }

  loadCarrier() {
    return this.deliveryCarrierService.get().pipe(map(res => res.value));
  }

  onVisibleChange(){
    this.isOpenCarrier = true;
  }

  onChangeCarrier(event: DeliveryCarrierDTOV2) {
    if(event && event.Id === this.saleModel.CarrierId) {
      return;
    }

    this.shipServices = [];
    this.shipExtraServices = [];

    this.enableInsuranceFee =false;
    this.saleModel.Ship_InsuranceFee = null;
    this.saleModel.Ship_ServiceId = '';
    this.saleModel.Ship_ServiceName = '';
    delete this.saleModel.CustomerDeliveryPrice;

    this.saleModel.Carrier = event;
    this.saleModel.CarrierId = event.Id;

    let deliveryPrice = event.Config_DefaultFee ||  0;
    if (this.saleModel.DeliveryPrice != deliveryPrice) {
        this.saleModel.DeliveryPrice = deliveryPrice;
        this.computeAmountTotal();
    }

    this.saleModel.ShipWeight = event.Config_DefaultWeight || 100;
    if (event.ExtrasText) {
        this.saleModel.Ship_Extras = JSON.parse(event.ExtrasText);
    }

    //Check giá trị mặc định trước khi gửi
    !this.shipExtraServices && (this.shipExtraServices = []);
    CalcServiceDefaultHandler.calcServiceDefault(this.saleModel, this.shipExtraServices);

    InitOkieLaHandler.initOkieLa(this.saleModel , this.shipExtraServices);
    InitServiceHandler.initService(this.saleModel, this.shipExtraServices, this.shipServices);
    InitInfoOrderDeliveryHandler.initInfoOrderDelivery(this.saleModel, this.quickOrderModel, this.shipExtraServices, this.enableInsuranceFee);

    this.calculateFee(this.saleModel.Carrier).catch(e => {
      console.log(e);
    });
  }

  calculateFee(item: any) {
    this.isLoading = true;
    let promise = new Promise((resolve, reject) => {

      if (this.apiDeliveries.includes(item.DeliveryType)) {
          // check insuranceFee để hiện thị Giá trị hàng hóa = tổng hóa đơn
          let exist = ValidateInsuranceFeeHandler.validateInsuranceFee(this.saleModel, this.shipExtraServices);
          if (exist) {
              this.enableInsuranceFee = true;

              //gán giá trị bảo hiểm"
              if (!this.saleModel.Ship_InsuranceFee) {
                this.saleModel.Ship_InsuranceFee = this.saleModel.Ship_Extras.InsuranceFee || this.quickOrderModel.TotalAmount;
              }
          }

          let model = PrepareCalculateFeeV2Handler.prepareCalculateFeeV2(this.saleModel, this.quickOrderModel, this.shipExtraServices, this.userInit, this.enableInsuranceFee);

          this.fastSaleOrderService.calculateFeeV2(model).pipe(takeUntil(this.destroy$)).subscribe((response: any) => {

            this.message.info(`Đối tác ${item.Name} có phí vận chuyển: ${formatNumber(Number(response.TotalFee), 'en-US', '1.0-0')} đ`);
            // Cập nhật lại phí ship (đối tác)
            this.saleModel.CustomerDeliveryPrice = response.TotalFee;

            if (response.Services && response.Services.length > 0) {
                this.shipServices = response.Services;
                this.selectShipService(this.shipServices[0]);
            }

            this.isLoading = false;
            resolve(response);

          }, error => {
              this.isLoading = false;
              this.message.error(error.error_description || error.message || error.error?.message);
          })
      } else {
          this.isLoading = false;
      }
    })

    return promise;
  }

  selectShipService(item: any) {
    this.saleModel.Ship_ServiceId = item.ServiceId;
    this.saleModel.Ship_ServiceName = item.ServiceName;

    this.saleModel.CustomerDeliveryPrice = item.TotalFee;
    SelectShipServiceHandler.selectShipService(this.saleModel, this.shipExtraServices, item);
  }

  onSelectShipServiceId(event: any) {
    this.selectShipService(event);
    if (this.saleModel.Carrier?.DeliveryType === 'GHN') {
        this.onUpdateInsuranceFee();
    }
  }

  onUpdateInsuranceFee() {
    this.calculateFeeRequest();
  }

  calcFee(): any {
    if (!this.saleModel.Carrier || !this.saleModel.Carrier.Id) {
      return this.message.error(Message.Carrier.EmptyCarrier);
    }

    this.calculateFee(this.saleModel.Carrier).catch(e => {
      console.log(e);
    });
  }

  calculateFeeRequest() {
    if(this.saleModel.Carrier){
        this.calculateFee(this.saleModel.Carrier)
          .then((res: any) => {
            if (res.Costs && res.Costs.length > 0) {
                res.Costs.map((x: any) => {
                    let exist = this.shipExtraServices.filter((s: any) => s.ServiceId === x.ServiceId)[0];
                    if (exist) {
                        exist.Fee = x.TotalFee;
                    }
                })
            } else {
                let exist = this.shipExtraServices.filter((s: any) => s.ServiceId === '16')[0];
                if (exist) {
                    exist.Fee = 0;
                }
            }
      }).catch(e => {
        console.log(e);
      });
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

  signAmountTotalToInsuranceFee() {
    this.saleModel.Ship_InsuranceFee = this.quickOrderModel.TotalAmount;
    if (this.saleModel.Carrier && this.saleModel.Carrier.DeliveryType == 'NinjaVan') {
        return;
    }
    this.onUpdateInsuranceFee();
  }

  updateInsuranceFeeEqualAmountTotal() {
    if (this.saleModel && this.saleModel.Ship_Extras && this.saleModel.Ship_Extras.IsInsurance && this.saleModel.Ship_Extras.IsInsuranceEqualTotalAmount) {
        this.saleModel.Ship_InsuranceFee = this.quickOrderModel.TotalAmount;
    }
  }

  onCheckExtraService(item: any) {
    this.updateInsuranceFeeEqualAmountTotal();
    if (item.ServiceId === "16" || item.ServiceId === "GBH" || item.ServiceId === "Snappy_Insurance" || item.ServiceId === "JNT_Insurance") {
        this.enableInsuranceFee = item.IsSelected;

        if (!this.saleModel.Ship_InsuranceFee) {
            this.saleModel.Ship_InsuranceFee = this.saleModel.Ship_Extras.InsuranceFee || this.saleModel.AmountTotal;
        }

        this.calculateFeeRequest();
    } else if (this.saleModel.Carrier?.DeliveryType === "MyVNPost" && item.ServiceId === "OrderAmountEvaluation") {
        this.enableInsuranceFee = item.IsSelected;

        if (!this.saleModel.Ship_InsuranceFee) {
            this.saleModel.Ship_InsuranceFee = this.saleModel.Ship_Extras.InsuranceFee || this.saleModel.AmountTotal;
        }

        this.calculateFeeRequest();

    } else if (this.saleModel.Carrier?.DeliveryType === "NinjaVan" || this.saleModel.Carrier?.DeliveryType === "BEST" ||
        this.saleModel.Carrier?.DeliveryType === "HolaShip" || this.saleModel.Carrier?.DeliveryType === "JNT" ||
        this.saleModel.Carrier?.DeliveryType === "FastShip" || item.ServiceId === "Shopee_Insurance" ||
        this.saleModel.Carrier?.DeliveryType === "GHSV" || this.saleModel.Carrier?.DeliveryType === "SHIP60") {

          this.saleModel.Ship_InsuranceFee = InitInfoOrderDeliveryHandler.getInsuranceFee(this.saleModel, this.quickOrderModel);
            this.enableInsuranceFee = item.IsSelected;
            if (!item.IsSelected) {
                this.saleModel.Ship_InsuranceFee = 0;
            }
    } else {
        let service = this.shipServices.filter(x => x.ServiceId === this.saleModel.Ship_ServiceId)[0];
        let totalFee = 0;
        if (service) {
            totalFee = service.TotalFee;

            if (this.shipExtraServices) {
                this.shipExtraServices.map(x => {
                    if (x.IsSelected) {
                        totalFee += (x.Fee || 0);
                    }
                });
            }

            this.saleModel.CustomerDeliveryPrice = totalFee;
        }
        if (item.ServiceId === "XMG" && this.saleModel.Carrier?.DeliveryType === "ViettelPost" && item.IsSelected == true) {
            item.ExtraMoney = (this.saleModel.Ship_Extras && this.saleModel.Ship_Extras.IsCollectMoneyGoods && this.saleModel.Ship_Extras.CollectMoneyGoods) ? this.saleModel.Ship_Extras.CollectMoneyGoods : totalFee || this.saleModel.CustomerDeliveryPrice;
        }
    }
  }


  onSave(type: string): any {
      let model = ConversationOrderHandler.prepareInsertFromMessage(this.quickOrderModel);

      if(this.isEnableCreateOrder) {
        if (!TDSHelperArray.hasListValue(this.quickOrderModel.Details)) {
            this.notification.warning( 'Không thể tạo hóa đơn', 'Đơn hàng chưa có chi tiết');
            return false;
        }

        if (this.saleModel.Carrier && !this.quickOrderModel.PartnerId) {
            if (!this.quickOrderModel.Telephone) {
                this.notification.warning( 'Không thể tạo hóa đơn', 'Vui lòng thêm điện thoại');
                return false;
            }
            if (!this.quickOrderModel.Address) {
                this.notification.warning( 'Không thể tạo hóa đơn', 'Vui lòng thêm địa chỉ');
                return false;
            }
            if (!this.quickOrderModel.CityCode) {
                this.notification.warning( 'Không thể tạo hóa đơn', 'Vui lòng thêm tỉnh/ thành phố');
                return false;
            }
            if(this.saleModel.Carrier && (this.saleModel.Carrier.DeliveryType === "ViettelPost" || this.saleModel.Carrier.DeliveryType === "GHN" || this.saleModel.Carrier.DeliveryType === "TinToc" || this.saleModel.Carrier.DeliveryType === "FlashShip")){
                this.confirmShipService(this.saleModel.Carrier);
            }
        }

        PrepareSaleModelHandler.prepareSaleModel(this.saleModel, this.quickOrderModel, this.shipExtraServices);
      }

      this.saleOnline_OrderService.insertFromMessage({ model: model }).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
          if(this.isEnableCreateOrder) {
              if(!this.enableInsuranceFee) {
                this.saleModel.Ship_InsuranceFee = 0;
              }
              // call api tạo hóa đơn
              this.createFastSaleOrder(this.saleModel, type);
          } else {
              this.orderPrintService.printId(res.Id, this.quickOrderModel);
              this.isLoading = false;
              this.message.success('Cập nhật đơn hàng thành công');
          }
        }, error => {
            this.isLoading = false;
            if(TDSHelperString.hasValueString(error.error?.message)) {
                this.message.error(`${error?.error?.message}`);
            } else {
                this.message.error('Đã xảy ra lỗi');
            }
      })
  }

  createFastSaleOrder(data: FastSaleOrder_DefaultDTOV2, type: string) {
    this.fastSaleOrderService.saveV2(data, true).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        if(res && res.Success == true) {

            this.shipServices = [];
            this.shipExtraServices = [];
            delete this.saleModel.Ship_ServiceId;
            delete this.saleModel.Ship_ServiceName;

            let printTemplateDefault = ["OkieLa", "DHL", "GHN", "TinToc", "ZTO"];

            if(res.Message) {
                this.message.warning(res.Message);
            } else {
                this.message.success('Cập nhật đơn hàng và tạo hóa đơn thành công');
            }

            let obs: TDSSafeAny;
            if(type == 'print') {
              obs = this.printerService.printUrl(`/fastsaleorder/print?ids=${res.Data.Id}`);
            }

            if(type == 'print_ship') {
              if (this.saleModel.Carrier && this.saleModel.Carrier?.IsPrintCustom && printTemplateDefault.includes(this.saleModel.Carrier?.DeliveryType)) {
                  obs = this.printerService.printIP(`odata/fastsaleorder/OdataService.PrintShip`, { ids: [res.Data.Id]})
              } else {
                obs = this.printerService.printUrl(`/fastsaleorder/printshipthuan?ids=${res.Data.Id}`);
              }
            }

            if (TDSHelperObject.hasValue(obs)) {
                obs.pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
                    this.printerService.printHtml(res);

                }, (error: TDSSafeAny) => {
                    if(error?.error?.message) {
                      this.message.error(error?.error?.message);
                    }
                });
            }

        } else {
            this.message.error(res.Message);
        }

        this.isLoading = false;
      }, error => {

          this.message.success('Cập nhật đơn hàng thành công');
          this.notification.error( 'Tạo hóa đơn thất bại', error.error?.message);
          this.isLoading = false
      });
  }

  confirmShipService(carrier: TDSSafeAny) {
    this.modal.info({
      title: 'Cảnh báo',
      content: 'Đối tác chưa có dịch vụ bạn hãy bấm [Ok] để tìm dịch vụ.\nHoặc [Cancel] để tiếp tục.\nSau khi tìm dịch vụ bạn hãy xác nhận lại."',
      onOk: () => this.calculateFee(carrier).catch((err) => { console.log(err);}),
      onCancel:()=>{},
      okText: "Ok",
      cancelText: "Cancel"
    });
  }

  showModalAddProduct() {
    const modal = this.modal.create({
        title: 'Thêm sản phẩm',
        content: TpageAddProductComponent,
        size: "xl",
        viewContainerRef: this.viewContainerRef,
        componentParams: {
          typeComponent: null,
        }
    })

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe(result => {
        if(TDSHelperObject.hasValue(result)) {

            let data = result[0] as ProductTemplateDTO;
            let x: Detail_QuickSaleOnlineOrder = {
              Quantity: 1,
              Price: data.ListPrice,
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

            this.quickOrderModel.Details.push(x);

            this.computeAmountTotal();
            this.updateCoDAmount();
        }
    })
  }

  showModalAddPromotion(){
    // this.modal.create({
    //   title: 'Chọn khuyến mãi',
    //   content: ModalApplyPromotionComponent,
    //   size: "lg",
    //   viewContainerRef: this.viewContainerRef
    // });
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
        title: 'Danh sách sản phẩm',
        content: ModalListProductComponent,
        viewContainerRef: this.viewContainerRef,
        size: 'xl'
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe((res: DataPouchDBDTO) =>{
      if(TDSHelperObject.hasValue(res)) {
          this.selectProduct(res);
      }
    });
  }

  selectProduct(item: DataPouchDBDTO) {
    let exist = this.quickOrderModel.Details.filter(a => a.Id === item.Id)[0];
    if(!exist) {
      let x: Detail_QuickSaleOnlineOrder = {
          Quantity: 1,
          Price: item.Price,
          ProductId: item.ProductTmplId,
          ProductName: item.Name,
          ProductNameGet: item.NameGet,
          ProductCode: item.DefaultCode,
          UOMId: item.UOMId,
          UOMName: item.UOMName,
          Note: null,
          Factor: item.Factor,
          OrderId: this.quickOrderModel.Id,
          ImageUrl: item.ImageUrl,
          Priority: 0,
      } as Detail_QuickSaleOnlineOrder;
      this.quickOrderModel.Details.push(x);

    } else {
      exist.Quantity = exist.Quantity + 1;
    }

    this.computeAmountTotal();
    this.updateCoDAmount();
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
          this.computeAmountTotal();
      }
    });
  }

  visibleChange($event: TDSSafeAny) {
    console.log($event)
  }

  closePriceDetail() {
    this.visibleIndex = -1;
  }

  changeShipWeight() {
      if(!this.saleModel.Carrier && !this.saleModel.CarrierId) {
          this.message.error('Vui lòng chọn đối tác giao hàng');
      }

      let model = this.saleModel.Carrier;
      this.calculateFee(model).then((res: any) => {
        if (res?.Costs) {
          res.Costs.map((x: any) => {
            let exist = this.shipExtraServices.filter((x: any) => x.ServiceId === x.ServiceId)[0];
            if (exist) {
              exist.Fee = x.TotalFee;
            }
          });
        }
      }).catch((e: any) => {
        console.log(e);
      });
  }

  changeDeliveryPrice(event: any) {
    if(event) {
      this.saleModel.DeliveryPrice = event;
      this.updateCoDAmount();
    }
  }

  changeDiscount(event: any) {
    if (event) {
      this.computeAmountTotal();
    }
  }

  changeDecreaseAmount(event: any) {
    if (event) {
      this.computeAmountTotal();
    }
  }

  changeAmountDeposit(event: any) {
    if(event) {
      this.saleModel.AmountDeposit = event;
      this.updateCoDAmount();
    }
  }

  onChangePrice(event: any, item: Detail_QuickSaleOnlineOrder, index: number) {
    this.visibleIndex = index;
    let exit = this.quickOrderModel.Details[index]?.Id == item.Id;

    if(exit) {
        this.quickOrderModel.Details[index].Price = event;
        this.computeAmountTotal();
        this.updateCoDAmount();
    }
  }

  onChangeQuantity(event: any, item: Detail_QuickSaleOnlineOrder, index: number) {
    let exit = this.quickOrderModel.Details[index]?.Id == item.Id;

    if(exit) {
        this.quickOrderModel.Details[index].Quantity = event;
        this.computeAmountTotal();
        this.updateCoDAmount();
    }
  }

  onRemoveProduct(item: Detail_QuickSaleOnlineOrder, index: number) {
    let exit = this.quickOrderModel.Details[index]?.Id == item.Id;
    if(exit) {
        this.quickOrderModel.Details.splice(index,1);
        this.computeAmountTotal();
        this.updateCoDAmount();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    let pageSize = 20;
    let pageIndex = 1;

    let filters = this.odataProductService.buildFilter(filterObj);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters);

    this.odataProductService.getView(params).pipe(takeUntil(this.destroy$)).pipe(finalize(()=>{ this.isLoadingProduct = false; }))
    .subscribe((res: ODataProductDTOV2) => {
        this.lstProductSearch = [...res.value]
    },err=>{
        this.message.error(err.error? err.error.message: Message.CanNotLoadData);
    });
  }

  loadInventoryWarehouseId(warehouseId: number) {
    this.productService.getInventoryWarehouseId(warehouseId).pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.lstInventory = res;
    });
  }

  pushItemProduct(item: any) {
  }

  onLoadSuggestion(item: ResultCheckAddressDTO) {
    ConversationOrderHandler.onLoadSuggestion(item, this.quickOrderModel);
  }

  mappingAddress(data: QuickSaleOnlineOrderModel) {
    if (data && data.CityCode) {
      this._cities = {
        code: data.CityCode,
        name: data.CityName
      }
    }
    if (data && data.DistrictCode) {
      this._districts = {
        cityCode: data.CityCode,
        cityName: data.CityName,
        code: data.DistrictCode,
        name: data.DistrictName
      }
    }
    if (data && data.WardCode) {
      this._wards = {
        cityCode: data.CityCode,
        cityName: data.CityName,
        districtCode: data.DistrictCode,
        districtName: data.DistrictCode,
        code: data.WardCode,
        name: data.WardName
      }
    }
    if (data && (data.Address)) {
      this._street = data.Address;
    }
  }

}
