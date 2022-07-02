import { Ship_ExtrasServiceModel } from './../../../../commands/dto-handler/ship-extra-service.dto';
import { DeliveryCarrierDTOV2 } from './../../../../dto/delivery-carrier.dto';
import { FilterObjDTO, OdataProductService } from './../../../../services/mock-odata/odata-product.service';
import { CommonService } from 'src/app/main-app/services/common.service';
import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { TAuthService } from 'src/app/lib';
import { UserInitDTO } from 'src/app/lib/dto';
import { DataSuggestionDTO, ResultCheckAddressDTO } from 'src/app/main-app/dto/address/address.dto';
import { SaleOnline_FacebookCommentService } from 'src/app/main-app/services/sale-online-facebook-comment.service';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { ProductService } from 'src/app/main-app/services/product.service';
import { GetInventoryDTO } from 'src/app/main-app/dto/product/product.dto';
import { ApplicationUserService } from 'src/app/main-app/services/application-user.service';
import { ApplicationUserDTO } from 'src/app/main-app/dto/account/application-user.dto';
import { TpageAddProductComponent } from 'src/app/main-app/shared/tpage-add-product/tpage-add-product.component';
import { Message } from 'src/app/lib/consts/message.const';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { DeliveryCarrierService } from 'src/app/main-app/services/delivery-carrier.service';
import { finalize, map } from 'rxjs/operators';
import { SuggestCitiesDTO, SuggestDistrictsDTO, SuggestWardsDTO } from 'src/app/main-app/dto/suggest-address/suggest-address.dto';
import { TDSHelperArray, TDSHelperObject, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TACheckboxChange } from 'tds-ui/tds-checkbox';
import { SaleOnline_Order_V2DTO } from 'src/app/main-app/dto/saleonlineorder/saleonline-order-v2.dto';
import { CreateFastSaleOrderDTO } from 'src/app/main-app/dto/saleonlineorder/create-fastsaleorder.dto';
import { CommentsOfOrderDTO } from 'src/app/main-app/dto/saleonlineorder/comment-of-order.dto';
import { Detail_QuickSaleOnlineOrder, QuickSaleOnlineOrderModel } from 'src/app/main-app/dto/saleonlineorder/quick-saleonline-order.dto';
import { FastSaleOrder_DefaultDTOV2 } from 'src/app/main-app/dto/fastsaleorder/fastsaleorder-default.dto';
import { PartnerStatusDTO } from 'src/app/main-app/dto/saleonlineorder/get-partner-status.dto';
import { formatNumber } from '@angular/common';
import { InitServiceHandler } from 'src/app/main-app/commands/init-service.handler';
import { InitOkieLaHandler } from 'src/app/main-app/commands/init-okila.handler';
import { InitInfoOrderDeliveryHandler } from 'src/app/main-app/commands/init-inforder-delivery.handler';
import { PrepareCalculateFeeV2Handler } from 'src/app/main-app/commands/prepare-calculateFeeV2-model.handler';
import { ValidateInsuranceFeeHandler } from 'src/app/main-app/commands/validate-insurance-fee.dto';
import { SelectShipServiceHandler } from 'src/app/main-app/commands/select-ship-service.handler';
import { GeneralConfigsFacade } from 'src/app/main-app/services/facades/general-config.facade';
import { CalcServiceDefaultHandler } from 'src/app/main-app/commands/calc-service-default.handler';
import { InitSaleDTO } from 'src/app/main-app/dto/setting/setting-sale-online.dto';
import { TDSNotificationService } from 'tds-ui/notification';
import { OrderPrintService } from 'src/app/main-app/services/print/order-print.service';
import { PrinterService } from 'src/app/main-app/services/printer.service';
import { PrepareSaleModelHandler } from 'src/app/main-app/commands/prepare-salemodel.handler';

@Component({
  selector: 'edit-order',
  templateUrl: './edit-order.component.html'
})

export class EditOrderComponent implements OnInit, AfterViewInit {

  @Input() dataItem!: SaleOnline_Order_V2DTO;

  dataSuggestion!: DataSuggestionDTO;
  userInit!: UserInitDTO;
  lstComment: CommentsOfOrderDTO[] = [];
  isEnableCreateOrder: boolean = false;
  enableInsuranceFee: boolean = false;
  isLoading: boolean = false;

  quickOrderModel!: QuickSaleOnlineOrderModel;
  saleModel!: FastSaleOrder_DefaultDTOV2;

  lstPartnerStatus: any[] = []
  // Giá trị này phải khởi tạo = []
  shipExtraServices: Ship_ExtrasServiceModel[] = [];
  shipServices: any[] = [];

  _cities!: SuggestCitiesDTO;
  _districts!: SuggestDistrictsDTO;
  _wards!: SuggestWardsDTO;
  _street!: string;

  // numberWithCommas = (value: number) => `${value} đ`;
  // parserComas = (value: string) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  numberWithCommas =(value:TDSSafeAny) =>{
    if(value != null)
    {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
    return value
  } ;
  parserComas = (value: TDSSafeAny) =>{
    if(value != null)
    {
      return TDSHelperString.replaceAll(value,',','');
    }
    return value
  };

  delivery_types = ["fixed", "base_on_rule", "VNPost"];
  carrierTypeInsurance = ["MyVNPost", "GHN", "GHTK", "ViettelPost", "NinjaVan", "HolaShip"];
  apiDeliveries = ['GHTK', 'ViettelPost', 'GHN', 'TinToc', 'SuperShip', 'FlashShip', 'OkieLa', 'MyVNPost', 'DHL', 'FulltimeShip', 'JNT', 'BEST', 'EMS', 'AhaMove', 'Snappy', 'NhatTin', 'HolaShip', 'ZTO', 'FastShip', 'Shopee', 'GHSV'];

  lstCarriers!: Observable<DeliveryCarrierDTOV2[]>;
  lstInventory!: GetInventoryDTO;
  lstUser!: Array<ApplicationUserDTO>;
  stateReports!: PartnerStatusDTO[];
  destroy$ = new Subject<void>();
  saleConfig!: InitSaleDTO;

  constructor(private modal: TDSModalService,
    private modalRef: TDSModalRef,
    private cdRef: ChangeDetectorRef,
    private auth: TAuthService,
    private notification: TDSNotificationService,
    private message: TDSMessageService,
    private printerService: PrinterService,
    private orderPrintService: OrderPrintService,
    private viewContainerRef: ViewContainerRef,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private saleOnline_FacebookCommentService: SaleOnline_FacebookCommentService,
    private productService: ProductService,
    private applicationUserService: ApplicationUserService,
    private commonService: CommonService,
    private fastSaleOrderService: FastSaleOrderService,
    private generalConfigsFacade: GeneralConfigsFacade,
    private odataProductService: OdataProductService,
    private deliveryCarrierService: DeliveryCarrierService) {
  }

  ngOnInit(): void {
    if(this.dataItem) {
      // Thông tin đơn hàng
      this.loadData();

      this.loadUserInfo();
      this.lstCarriers = this.loadCarrier();
      this.loadUser();
      this.loadPartnerStatus();
      this.loadSaleConfig();
    }
  }

  loadData() {
    this.isLoading = true;
    let id = this.dataItem.Id;
    this.saleOnline_OrderService.getById(id).pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false)).subscribe((res: any) => {
      delete res['@odata.context'];
      this.quickOrderModel = res;

      if(res.Facebook_PostId && res.CRMTeamId && res.Facebook_ASUserId) {
          this.commentsOfOrder(res.Facebook_PostId, res.CRMTeamId, res.Facebook_ASUserId);
      }
    }, error => {
      this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Load đơn hàng đã xảy ra lỗi')
    });
  }

  loadSaleModel() {
    let model = { Type: 'invoice' };
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
            DeliveryPrice: 0
        }, this.saleModel);

        if (this.saleModel.Carrier && this.saleModel.Carrier.Extras) {
            this.saleModel.Ship_Extras = this.saleModel.Carrier.Extras;
            //gán giá trị bảo hiểm
            if (this.saleModel.Ship_Extras)
            this.saleModel.Ship_InsuranceFee = this.saleModel.Ship_Extras.IsInsurance ? this.saleModel.Ship_Extras.InsuranceFee ? this.saleModel.Ship_Extras.InsuranceFee : this.quickOrderModel.TotalAmount : 0;
        }

        if (this.saleModel.Carrier) {
          // this.getStatusPartner();
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

        this.coDAmount();

    }, error => {
      this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
    });
  }

  loadCarrier() {
    return this.deliveryCarrierService.get().pipe(map(res => res.value));
  }

  loadSaleConfig() {
    this.generalConfigsFacade.getSaleConfigs().subscribe(res => {
      this.saleConfig = res;
    });
  }

  onEnableCreateOrder(event: TACheckboxChange) {
    if(event.checked == true && !this.saleModel) {
        this.loadSaleModel();
    }
  }

  onSearchProduct(event: any) {
    let text = event.target.value;
    this.loadProduct(text);
  }

  onAddProduct() {
    const modal = this.modal.create({
        title: 'Thêm sản phẩm',
        content: TpageAddProductComponent,
        size: 'xl',
        viewContainerRef: this.viewContainerRef,
        componentParams: {}
    });

    modal.componentInstance?.onLoadedProductSelect.subscribe(result => {
      if(TDSHelperObject.hasValue(result)) {

        let item: Detail_QuickSaleOnlineOrder = {
            Id: null,
            Quantity: 1,
            Price: result.ListPrice,
            ProductId: result.Id,
            ProductName: result.Name,
            ProductNameGet: result.NameGet,
            ProductCode: result.DefaultCode,
            UOMId: result.UOMId,
            UOMName: result.UOMName,
            Note: null,
            Factor: 1,
            OrderId: this.dataItem.Id,
            Priority: 0,
            ImageUrl: result.ImageUrl,
            LiveCampaign_DetailId: this.quickOrderModel.LiveCampaignId,
            IsOrderPriority: false,
            QuantityRegex: null
        }

        this.quickOrderModel.Details.push(item);
        this.calcTotal();
        this.coDAmount();
      }
    });
  }

  confirmShipService(carrier: TDSSafeAny) {
    this.modal.info({
      title: 'Cảnh báo',
      content: 'Đối tác chưa có dịch vụ bạn hãy bấm [Ok] để tìm dịch vụ.\nHoặc [Cancel] để tiếp tục.\nSau khi tìm dịch vụ bạn hãy xác nhận lại."',
      onOk: () => this.calculateFee(carrier),
      onCancel:()=>{},
      okText:"Đồng ý",
      cancelText:"Hủy"
    });
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
        this.coDAmount();
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

    this.calculateFee(this.saleModel.Carrier);
  }

  calcFee(): any {
    if (!this.saleModel.Carrier || !this.saleModel.Carrier.Id) {
      return this.message.error(Message.Carrier.EmptyCarrier);
    }

    this.calculateFee(this.saleModel.Carrier);
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

  signAmountTotalToInsuranceFee() {
    this.saleModel.Ship_InsuranceFee = this.quickOrderModel.TotalAmount;
    if (this.saleModel.Carrier && this.saleModel.Carrier.DeliveryType == 'NinjaVan') {
        return;
    }
    this.onUpdateInsuranceFee();
  }

  onUpdateWeight() {
    this.calculateFeeRequest();
  }

  onUpdateInsuranceFee() {
    this.calculateFeeRequest();
  }

  commentsOfOrder(fb_PostId: string, teamId: any, fb_ASUserId: string) {
    this.saleOnline_FacebookCommentService.getCommentsOfOrder(fb_PostId, teamId, fb_ASUserId)
      .pipe(takeUntil(this.destroy$)).subscribe(data => {
          if(data) {
              this.lstComment = data.filter((x: any) => x.message != '');
          }
    });
  }

  onChangePrice() {
    this.calcTotal();
    this.coDAmount();
  }

  onChangeQuantity() {
    this.calcTotal();
    this.coDAmount();
  }

  onRemoveProduct(product: TDSSafeAny, index: number) {
    this.calcTotal();
    this.coDAmount();
  }

  calcTotal() {
    let totalAmount = 0;
    let totalQuantity = 0;

    this.quickOrderModel.Details.map((item) => {
        totalAmount += (item.Price * item.Quantity);
        totalQuantity += (item.Quantity);
    });

    this.quickOrderModel.TotalAmount = totalAmount;
    this.quickOrderModel.TotalQuantity = totalQuantity;
  }

  coDAmount() {
    if (this.saleModel) {
      let coDAmount = this.quickOrderModel.TotalAmount + this.saleModel.DeliveryPrice - this.saleModel.AmountDeposit;
      this.saleModel.CashOnDelivery = coDAmount;
    }
  }

  onSave(type: string): any {
      let model = this.quickOrderModel;
      let id = this.dataItem.Id;

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
          }

          PrepareSaleModelHandler.prepareSaleModel(this.saleModel, this.quickOrderModel, this.shipExtraServices);
      }

      this.isLoading = true;
      this.saleOnline_OrderService.update(id, model)
        .pipe(takeUntil(this.destroy$)).subscribe((res: any): any => {

              if(this.isEnableCreateOrder) {
                  if(!this.enableInsuranceFee) {
                    this.saleModel.Ship_InsuranceFee = 0;
                  }
                  // call api tạo hóa đơn
                  this.createFastSaleOrder(this.saleModel, type);
            } else {
                this.orderPrintService.printId(this.dataItem.Id, this.quickOrderModel);
                this.isLoading = false
            }
      }, error => {

          this.isLoading = false
          this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
      });
  }

  createFastSaleOrder(data: FastSaleOrder_DefaultDTOV2, type: string) {
    this.fastSaleOrderService.createFastSaleOrder(data).pipe(takeUntil(this.destroy$))
      .subscribe((res: CreateFastSaleOrderDTO) => {
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
                      this.onCancel();

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

  onCancel() {
    this.modalRef.destroy(null);
  }

  loadUserInfo() {
    this.auth.getUserInit().pipe(takeUntil(this.destroy$)).subscribe(res => {
        this.userInit = res || {};
        if(this.userInit?.Company?.Id) {
            this.loadInventoryWarehouseId(this.userInit?.Company?.Id);
        }
    })
  }

  loadInventoryWarehouseId(warehouseId: number) {
    this.productService.getInventoryWarehouseId(warehouseId).pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.lstInventory = res;
    });
  }

  loadProduct(textSearch: string) {
    let filterObj: FilterObjDTO = {
      searchText: textSearch,
    }
    let pageSize = 20;
    let pageIndex = 1;

    let filters = this.odataProductService.buildFilter(filterObj);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters);

    this.odataProductService.getView(params).subscribe((res: TDSSafeAny) => {
    });
  }

  loadUser() {
    this.applicationUserService.getActive().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.lstUser = [...res.value];
    });
  }

  loadPartnerStatus() {
    this.commonService.getPartnerStatus().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.lstPartnerStatus = res;
    });
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

  updateInsuranceFeeEqualAmountTotal() {
    if (this.saleModel && this.saleModel.Ship_Extras && this.saleModel.Ship_Extras.IsInsurance && this.saleModel.Ship_Extras.IsInsuranceEqualTotalAmount) {
        this.saleModel.Ship_InsuranceFee = this.quickOrderModel.TotalAmount;
    }
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
      });
    }
  }

  calculateFee(item: any) {
    this.isLoading = true;
    let promise = new Promise((resolve, reject) => {

      if(this.isEnableCreateOrder == false) {
        return;
      }

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
            this.cdRef.detectChanges();
          }, error => {
              this.isLoading = false;
              this.message.error(error.error_description || error.message);
              reject(error);
              this.cdRef.detectChanges();
          })
      } else {
          this.isLoading = false;
          this.cdRef.detectChanges();
      }
    })

    return promise;
  }

  ngAfterViewInit (): void {
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
