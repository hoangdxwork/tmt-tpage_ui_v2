import { ProductTemplateOUMLineService } from '../../../../services/product-template-uom-line.service';
import { ODataProductDTOV2, ProductDTOV2 } from '../../../../dto/product/odata-product.dto';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { PartnerStatusDTO } from 'src/app/main-app/dto/partner/partner.dto';
import { DeliveryCarrierDTOV2 } from '../../../../dto/delivery-carrier.dto';
import { CommonService } from 'src/app/main-app/services/common.service';
import { ChangeDetectorRef, Component, Input, OnInit, ViewContainerRef } from '@angular/core';
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
import { Subject, takeUntil } from 'rxjs';
import { DeliveryCarrierService } from 'src/app/main-app/services/delivery-carrier.service';
import { finalize } from 'rxjs/operators';
import { SuggestCitiesDTO, SuggestDistrictsDTO, SuggestWardsDTO } from 'src/app/main-app/dto/suggest-address/suggest-address.dto';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSCheckboxChange } from 'tds-ui/tds-checkbox';
import { CreateFastSaleOrderDTO } from 'src/app/main-app/dto/saleonlineorder/create-fastsaleorder.dto';
import { CommentsOfOrderDTO } from 'src/app/main-app/dto/saleonlineorder/comment-of-order.dto';
import { Detail_QuickSaleOnlineOrder, QuickSaleOnlineOrderModel } from 'src/app/main-app/dto/saleonlineorder/quick-saleonline-order.dto';
import { FastSaleOrder_DefaultDTOV2, ShipServiceExtra } from 'src/app/main-app/dto/fastsaleorder/fastsaleorder-default.dto';
import { formatNumber } from '@angular/common';
import { GeneralConfigsFacade } from 'src/app/main-app/services/facades/general-config.facade';
import { InitSaleDTO } from 'src/app/main-app/dto/setting/setting-sale-online.dto';
import { TDSNotificationService } from 'tds-ui/notification';
import { OrderPrintService } from 'src/app/main-app/services/print/order-print.service';
import { PrinterService } from 'src/app/main-app/services/printer.service';
import { CalculateFeeInsuranceInfoResponseDto, CalculateFeeServiceResponseDto } from 'src/app/main-app/dto/carrierV2/delivery-carrier-response.dto';
import { CalculatorListFeeDTO } from 'src/app/main-app/dto/fastsaleorder/calculate-listFee.dto';
import { AshipGetInfoConfigProviderDto } from 'src/app/main-app/dto/carrierV2/aship-info-config-provider-data.dto';
import { PrepareModelFeeV2Handler } from 'src/app/main-app/handler-v2/aship-v2/prepare-model-feev2.handler';
import { SelectShipServiceV2Handler } from 'src/app/main-app/handler-v2/aship-v2/select-shipservice-v2.handler';
import { SharedService } from 'src/app/main-app/services/shared.service';
import { CompanyCurrentDTO } from 'src/app/main-app/dto/configs/company-current.dto';
import { UpdateShipExtraHandler } from 'src/app/main-app/handler-v2/aship-v2/update-shipextra.handler';
import { UpdateShipServiceExtrasHandler } from 'src/app/main-app/handler-v2/aship-v2/update-shipservice-extras.handler';
import { UpdateShipmentDetailAshipHandler } from 'src/app/main-app/handler-v2/aship-v2/shipment-detail-aship.handler';
import { SO_ComputeCaclHandler } from 'src/app/main-app/handler-v2/order-handler/compute-cacl.handler';
import { CalculateFeeAshipHandler } from '@app/handler-v2/aship-v2/calcfee-aship.handler';
import { CsOrder_SuggestionHandler } from '@app/handler-v2/chatomni-csorder/prepare-suggestions.handler';
import { Router } from '@angular/router';
import { SO_PrepareFaseSaleOrderHandler } from '@app/handler-v2/order-handler/prepare-fastsaleorder.handler';

@Component({
  selector: 'edit-order-v2',
  templateUrl: './edit-order-v2.component.html'
})

export class EditOrderV2Component implements OnInit {

  @Input() dataItem!: QuickSaleOnlineOrderModel;

  dataSuggestion!: DataSuggestionDTO;
  userInit!: UserInitDTO;
  lstComment: CommentsOfOrderDTO[] = [];
  isEnableCreateOrder: boolean = false;
  isLoading: boolean = false;

  quickOrderModel!: QuickSaleOnlineOrderModel;
  saleModel!: FastSaleOrder_DefaultDTOV2;

  lstPartnerStatus: any[] = [];
  lstProductSearch: ProductDTOV2[] = [];
  textSearchProduct!: string;
  isLoadingProduct: boolean = false;

  //TODO: dữ liệu aship v2
  shipExtraServices: ShipServiceExtra[] = [];
  shipServices: CalculateFeeServiceResponseDto[] = [];
  lstCalcFee!: CalculatorListFeeDTO[];
  configsProviderDataSource: Array<AshipGetInfoConfigProviderDto> = [];
  insuranceInfo!: CalculateFeeInsuranceInfoResponseDto | null;
  extraMoney: number = 0;

  visiblePopoverDiscount: boolean = false;
  visiblePopoverTax: boolean = false;
  visibleDiscountLines: boolean = false;
  visibleShipExtraMoney: boolean = false;

  _cities!: SuggestCitiesDTO | null;
  _districts!: SuggestDistrictsDTO | null;
  _wards!: SuggestWardsDTO | null;
  _street!: string;

  selectedIndex: number = 0;

  numberWithCommas =(value:TDSSafeAny) =>{
    if(value != null) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }
    return value
  }
  parserComas = (value: TDSSafeAny) =>{
    if(value != null) {
      return TDSHelperString.replaceAll(value,',','');
    }
    return value
  };

  lstCarrier!: DeliveryCarrierDTOV2[];
  lstInventory!: GetInventoryDTO;
  lstUser!: Array<ApplicationUserDTO>;
  stateReports!: PartnerStatusDTO[];
  destroy$ = new Subject<void>();
  saleConfig!: InitSaleDTO;
  companyCurrents!: CompanyCurrentDTO;

  constructor(private modal: TDSModalService,
    private cdRef: ChangeDetectorRef,
    private modalRef: TDSModalRef,
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
    private deliveryCarrierService: DeliveryCarrierService,
    private prepareModelFeeV2Handler: PrepareModelFeeV2Handler,
    private selectShipServiceV2Handler: SelectShipServiceV2Handler,
    private updateShipExtraHandler: UpdateShipExtraHandler,
    private updateShipServiceExtrasHandler: UpdateShipServiceExtrasHandler,
    private updateShipmentDetailAshipHandler: UpdateShipmentDetailAshipHandler,
    private computeCaclHandler: SO_ComputeCaclHandler,
    private calcFeeAshipHandler: CalculateFeeAshipHandler,
    private csOrder_SuggestionHandler: CsOrder_SuggestionHandler,
    private so_PrepareFaseSaleOrderHandler: SO_PrepareFaseSaleOrderHandler,
    private partnerService: PartnerService,
    private sharedService: SharedService,
    private productTemplateOUMLineService: ProductTemplateOUMLineService,
    private router: Router) {
  }

  ngOnInit(): void {
    if(this.dataItem) {
      this.loadData();
      this.loadUserInfo();
      this.loadUser();
      this.loadPartnerStatus();
      this.loadSaleConfig();
    }

    this.loadCarrier();
    this.loadCurrentCompany();
  }

  loadData() {
    this.quickOrderModel = this.dataItem;
    this.mappingAddress(this.quickOrderModel);

    let postId = this.quickOrderModel.Facebook_PostId;
    let teamId = this.quickOrderModel.CRMTeamId;
    let asId = this.quickOrderModel.Facebook_ASUserId;

    if(postId && teamId && asId) {
        this.commentsOfOrder(postId, teamId, asId);
    }
  }

  loadSaleModel() {
    this.isLoading = true;
    let model = { Type: 'invoice' };

    this.fastSaleOrderService.defaultGetV2({model: model}).pipe(takeUntil(this.destroy$)).subscribe(res => {
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

        this.saleModel = this.so_PrepareFaseSaleOrderHandler.so_prepareFaseSaleOrder(this.saleModel, this.quickOrderModel);
        this.coDAmount();
        this.calcTotal();

        this.loadConfigProvider(this.saleModel);

        this.isLoading = false;
    }, error => {
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
    });
  }

  //Load thông tin ship aship
  loadConfigProvider(data: FastSaleOrder_DefaultDTOV2) {
    if (data.CarrierId && data.Carrier) {
      let _shipmentDetailsAship = (JSON.parse(data.Carrier.ExtraProperties) ?? [])?.filter((x: AshipGetInfoConfigProviderDto) => !x.IsHidden) as Array<AshipGetInfoConfigProviderDto>;

      this.insuranceInfo = data.ShipmentDetailsAship?.InsuranceInfo || null;

      this.configsProviderDataSource = _shipmentDetailsAship.map(x => {

          let detailConfig = data.ShipmentDetailsAship?.ConfigsProvider.find(y => y.ConfigName == x.ConfigName);
          x.ConfigValue = detailConfig ? detailConfig.ConfigValue : x.ConfigValue;

          return x;
      });
    }
  }

  loadCurrentCompany() {
    this.sharedService.getCurrentCompany().pipe(takeUntil(this.destroy$)).subscribe((res: CompanyCurrentDTO) => {
      this.companyCurrents = res;
    }, error => {
      this.message.error(error?.error?.message || 'Load thông tin công ty mặc định đã xảy ra lỗi!');
    });
  }

  onLoadSuggestion(item: ResultCheckAddressDTO) {
    let data = this.csOrder_SuggestionHandler.onLoadSuggestion(item, this.quickOrderModel);
    this.quickOrderModel = data;
  }

  mappingAddress(data: QuickSaleOnlineOrderModel) {
    let x = this.csOrder_SuggestionHandler.mappingAddress(data);

    this._cities = x._cities || null;
    this._districts = x._districts || null;
    this._wards = x._wards || null;
    this._street = x._street;
  }

  loadCarrier() {
      this.deliveryCarrierService.get().pipe(takeUntil(this.destroy$)).subscribe(res => {
          this.lstCarrier = [...res.value];
      })
  }

  loadSaleConfig() {
    this.generalConfigsFacade.getSaleConfigs().pipe(takeUntil(this.destroy$)).subscribe(res => {
        this.saleConfig = res;
    }, err => {
        this.message.error(err?.error?.message || 'Không thể tải cấu hình bán hàng');
    });
  }

  onEnableCreateOrder(event: TDSCheckboxChange) {
    this.isEnableCreateOrder = event.checked;

    if(event.checked == true && !this.saleModel) {
        this.loadSaleModel();
    }
  }

  onSearchProduct(event: any) {
    let text = this.textSearchProduct;
    this.loadProduct(text);
  }

  closeSearchProduct(){
    this.textSearchProduct = '';
  }

  selectProduct(data: ProductDTOV2){
    let index = this.quickOrderModel.Details.findIndex(x => x.ProductId === data.Id && x.UOMId === data.UOMPOId);
    if (index < 0){
        let item = {
            Factor: data.Factor,
            Price: data.Price,
            ProductId: data.Id,
            Note: data?.Note || null,
            ProductName: data.Name,
            ProductNameGet: data.NameGet,
            ProductCode: data.DefaultCode,
            Quantity: 1,
            UOMId: data.UOMId,
            UOMName: data.UOMName,
        } as Detail_QuickSaleOnlineOrder;

        this.quickOrderModel.Details.push(item);
    } else{
        this.quickOrderModel.Details[index].Quantity += 1;
    }

    this.closeSearchProduct();
    this.calcTotal();
    this.coDAmount();
  }

  onAddProduct() {
    const modal = this.modal.create({
        title: 'Thêm sản phẩm',
        content: TpageAddProductComponent,
        size: 'xl',
        viewContainerRef: this.viewContainerRef,
        componentParams: {
          typeComponent: null,
        }
    });

    modal.afterClose.subscribe(result => {
      if(TDSHelperObject.hasValue(result)) {
        let data = result[0];
        let item = {
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
            Priority: 0,
            ImageUrl: result.ImageUrl,
        } as Detail_QuickSaleOnlineOrder;

        this.quickOrderModel.Details.push(item);
        this.calcTotal();
        this.coDAmount();
      }
    })
  }

  confirmShipService(carrier: TDSSafeAny) {
    this.modal.info({
      title: 'Cảnh báo',
      content: 'Đối tác chưa có dịch vụ bạn hãy bấm [Ok] để tìm dịch vụ.\nHoặc [Cancel] để tiếp tục.\nSau khi tìm dịch vụ bạn hãy xác nhận lại."',
      onOk: () => this.calcFee(),
      onCancel:()=>{},
      okText: "OK",
      cancelText: "Cancel"
    });
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

  calcFee() {
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

  onUpdateWeight() {
    this.calcFee();
  }

  onUpdateInsuranceFee() {
    this.calcFee();
  }

  commentsOfOrder(fb_PostId: string, teamId: any, fb_ASUserId: string) {
    this.saleOnline_FacebookCommentService.getCommentsOfOrder(fb_PostId, teamId, fb_ASUserId)
        .pipe(takeUntil(this.destroy$)).subscribe(data => {
            if(data) {
                this.lstComment = data.filter((x: any) => x.message != '');
            }
    }, err => {
      this.message.error(err?.error?.message || Message.ErrorOccurred);
    });
  }

  addComment(comment:string){
    if(this.quickOrderModel.Note?.includes(comment)){
      this.quickOrderModel.Note = this.quickOrderModel.Note.replace(comment,'');
    } else{
      if(this.quickOrderModel.Note){
        this.quickOrderModel.Note = this.quickOrderModel.Note.concat(comment);
      }else{
        this.quickOrderModel.Note = comment;
      }
    }
  }

  onChangePrice(value: number, index: number) {
    if(value >= 0){
        this.quickOrderModel.Details[index].Price = value;
        this.calcTotal();
        this.coDAmount();
    }
  }

  onChangeQuantity(value: number, index: number) {
    if(value >= 0) {
      this.quickOrderModel.Details[index].Quantity = value;
      this.calcTotal();
      this.coDAmount();
    }
  }

  onRemoveProduct(product: Detail_QuickSaleOnlineOrder, index: number) {
    const modal = this.modal.error({
      title: 'Xóa sản phẩm',
      content: 'Bạn có muốn xóa sản phẩm khỏi danh sách',
      onOk: () => {
        modal.close();

        this.quickOrderModel.Details.splice(index, 1);
        this.calcTotal();
        this.coDAmount();

      },
      onCancel:() => {
        modal.close();
      },
      okText:"Xóa",
      cancelText:"Đóng"
    });
  }

  calcTotal() {
    let data = this.computeCaclHandler.so_calcTotal(this.saleModel, this.quickOrderModel, this.saleConfig);
    this.saleModel = data.saleModel;
    this.quickOrderModel = data.quickOrderModel;
  }

  calcTax() {
    let tax = this.computeCaclHandler.so_calcTax(this.saleModel);
    this.saleModel.AmountTax = tax.AmountTax;
    this.saleModel.AmountTotal = tax.AmountTotal;
  }

  coDAmount() {
    let cashOnDelivery = this.computeCaclHandler.so_coDAmount(this.saleModel, this.quickOrderModel);
    this.saleModel.CashOnDelivery = cashOnDelivery;
  }

  onSave(type?: string): any {
    let model = this.quickOrderModel;
    let id = this.quickOrderModel.Id as string;

    if(TDSHelperString.hasValueString(type)) {
        this.saleModel.FormAction = type;
        this.quickOrderModel.FormAction = type;
    }

    if(this.isEnableCreateOrder) {
        if (!TDSHelperArray.hasListValue(this.saleModel.OrderLines)) {
            this.notification.warning( 'Không thể tạo hóa đơn', 'Đơn hàng chưa có chi tiết');
            return false;
        }

        if (!this.saleModel.Phone) {
            this.notification.warning('Không thể tạo hóa đơn', 'Vui lòng thêm điện thoại');
            return false;
        }

        if (!this.saleModel.Address) {
            this.notification.warning('Không thể tạo hóa đơn', 'Vui lòng thêm địa chỉ');
            return false;
        }

        // if(this.saleModel.Carrier && (this.saleModel.Carrier.DeliveryType === "ViettelPost" || this.saleModel.Carrier.DeliveryType === "GHN" || this.saleModel.Carrier.DeliveryType === "TinToc" || this.saleModel.Carrier.DeliveryType === "FlashShip")){
        //   this.confirmShipService(this.saleModel.Carrier);
        // }

        this.updateShipExtras();
        this.updateShipServiceExtras();
        this.updateShipmentDetailsAship();
    }

    this.isLoading = true;
    this.saleOnline_OrderService.update(id, model).subscribe((res: any): any => {

        this.message.success('Cập nhật đơn hàng thành công');

        if(!this.isEnableCreateOrder && type) {
            this.orderPrintService.printId(id, this.quickOrderModel);
        }

        if(this.isEnableCreateOrder) {
            // call api tạo hóa đơn
            this.createFastSaleOrder(this.saleModel, type);
        } else {
          this.isLoading = false;
          this.modalRef.destroy(null);
        }

    }, error => {
        this.isLoading = false;
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');

        setTimeout(() => {
            this.modalRef.destroy(null);
        }, 5 * 1000)
    });
  }

  createFastSaleOrder(data: FastSaleOrder_DefaultDTOV2, type?: string) {

    let model = this.so_PrepareFaseSaleOrderHandler.so_prepareFaseSaleOrder(data, this.quickOrderModel);

    this.fastSaleOrderService.createFastSaleOrder(model).subscribe((res: CreateFastSaleOrderDTO) => {

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
            this.notification.warning( 'Lỗi gửi vận đơn', res.Message);
        }

        if(res && !res.Message ) {
          this.notification.success('Tạo hóa đơn thành công', `Hóa đơn của bạn là ${res.Data.Number}`);
        }

        if(type) {
            this.printOrder(type, res);
        } else {
            this.modalRef.destroy(null);
        }

        this.isLoading = false;

    }, error => {
        this.isLoading = false;
        this.notification.error('Tạo hóa đơn thất bại', error.error?.message);
    });
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
          this.onCancel();

      }, (error: TDSSafeAny) => {
          if(error?.error?.message) {
              this.notification.error( 'Lỗi in phiếu', error?.error?.message);
          }
          this.onCancel();
      });
    }
  }

  onCancel() {
    this.modalRef.destroy(null);
  }

  loadUserInfo() {
    this.auth.getUserInit().pipe(takeUntil(this.destroy$)).subscribe(res => {
        if(res) {
            this.userInit = res || {};
            if(this.userInit?.Company?.Id) {
                this.loadInventoryWarehouseId(this.userInit?.Company?.Id);
            }
        }
    }, err => {
        this.message.error(err?.error?.message || 'Không thể tải thông tin user');
    })
  }

  loadInventoryWarehouseId(warehouseId: number) {
    this.productService.getInventoryWarehouseId(warehouseId).pipe(takeUntil(this.destroy$)).subscribe(res => {
        this.lstInventory = res;
    }, err => {
        this.message.error(err?.error?.message || 'Không thể tải thông tin kho hàng');
    });
  }

  loadProduct(textSearch: string) {
    this.isLoadingProduct = true;
    let top = 20;
    let skip = 0;

    this.productTemplateOUMLineService.getProductUOMLine(skip, top, textSearch)
      .pipe(takeUntil(this.destroy$)).pipe(finalize(()=> this.isLoadingProduct = false ))
      .subscribe((res: ODataProductDTOV2) => {
           this.lstProductSearch = [...res.value]
      },err =>{
          this.message.error(err?.error?.message || 'Không thể tải danh sách sản phẩm');
    });
  }

  loadUser() {
    this.applicationUserService.getActive().pipe(takeUntil(this.destroy$)).subscribe(res => {
        this.lstUser = [...res.value];
    },  err => {
        this.message.error(err?.error?.message || 'Không thể tải danh sách user');
    });
  }

  loadPartnerStatus() {
    this.commonService.getPartnerStatus().pipe(takeUntil(this.destroy$)).subscribe(res => {
        this.lstPartnerStatus = res;
    }, err=>{
        this.message.error(err?.error?.message || 'Không thể tải danh sách trạng thái khách hàng');
    });
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

  selectStatus(status: PartnerStatusDTO) {
    if(this.quickOrderModel.PartnerId) {
      let data = {
        status: `${status.value}_${status.text}`
      }

      this.partnerService.updateStatus(this.quickOrderModel.PartnerId, data).subscribe(res => {
          this.message.success(Message.Partner.UpdateStatus);
          this.quickOrderModel.Partner.StatusText = status.text;
      },err=>{
          this.message.error(err.error ? err.error.message : 'Cập nhật trạng thái thất bại');
      });
    }
    else {
      this.message.error(Message.PartnerNotInfo);
    }
  }

  getStatusColor(statusText: string | undefined) {
    if(TDSHelperArray.hasListValue(this.lstPartnerStatus)) {
      let value = this.lstPartnerStatus.find(x => x.text == statusText);
      if(value) return value.value;
      else return '#e5e7eb';
    }
    else return '#e5e7eb';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  calculateFeeAship(event: DeliveryCarrierDTOV2): any {
    if(!this.saleModel.Carrier) {
        return this.message.error('Vui lòng chọn  đối tác giao hàng');
    }

    if (!this.saleModel) {
        return this.message.error('Vui lòng chọn nhập khối lượng');
    }

    let model = this.prepareModelFeeV2();
    this.isLoading = true;

    this.calcFeeAshipHandler.calculateFeeAship(model, event, this.configsProviderDataSource).pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
          if(res) {

            if(!TDSHelperString.isString(res)){
              this.configsProviderDataSource = [...res.configs];

              this.insuranceInfo = res.data?.InsuranceInfo || null;
              this.shipServices = res.data?.Services || [];

              if(TDSHelperArray.hasListValue(this.shipServices)) {

                  let x = this.shipServices[0] as CalculateFeeServiceResponseDto;
                  this.selectShipServiceV2(x);

                  this.message.success(`Đối tác ${event.Name} có phí vận chuyển: ${formatNumber(Number(x.TotalFee), 'en-US', '1.0-0')} đ`);
              }

            } else {
              this.message.error(res);
            }
          }

          this.isLoading = false;
          this.cdRef.markForCheck();
      }, error => {
          this.isLoading = false;
          this.message.error(error.error.message || error.error.error_description);
          this.cdRef.markForCheck();
      })
  }

  selectShipServiceV2(x: CalculateFeeServiceResponseDto) {
    let data = this.selectShipServiceV2Handler.so_selectShipServiceV2(x, this.shipExtraServices, this.saleModel);

    this.saleModel = data.saleModel;

    this.shipExtraServices = [];
    this.shipExtraServices = data.shipExtraServices;
  }

  prepareModelFeeV2() {
    let companyId = this.saleConfig.configs?.CompanyId;

    let model = this.prepareModelFeeV2Handler.so_prepareModelFeeV2(this.shipExtraServices, this.saleModel, this.quickOrderModel, companyId, this.insuranceInfo);
    return model;
  }

  openPopoverShipExtraMoney(value: number) {
    this.extraMoney = value;
    this.visibleShipExtraMoney = true;
  }

  closePopoverShipExtraMoney() {
    this.visibleShipExtraMoney = false;
  }

  changeIsSelectedEx(event: any, i: number) {
    this.shipExtraServices[i]!.IsSelected = event;
  }

  changeAmountDeposit(value: number) {
    this.saleModel.AmountDeposit = value;
    this.coDAmount();
  }

  changeDeliveryPrice(value: number) {
    this.saleModel.DeliveryPrice = value;
    this.coDAmount();
  }

  changeShipWeight(value: number) {
    this.saleModel.ShipWeight = value;
    this.calcFee();
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

  onRouterEvent(url:string) {
    this.modalRef.destroy(null);
    this.router.navigateByUrl(url)
  }

  onChecked(checked: boolean) {
    if(checked == true) {
      this.selectedIndex = 0;
    }
  }
}
