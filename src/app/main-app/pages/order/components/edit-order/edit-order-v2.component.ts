import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProductTemplateUOMLineService } from '../../../../services/product-template-uom-line.service';
import { ODataProductDTOV2, ProductDTOV2 } from '../../../../dto/product/odata-product.dto';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { PartnerStatusDTO } from 'src/app/main-app/dto/partner/partner.dto';
import { DeliveryCarrierDTOV2 } from '../../../../dto/delivery-carrier.dto';
import { CommonService } from 'src/app/main-app/services/common.service';
import { ChangeDetectorRef, Component, Input, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { TAuthService } from 'src/app/lib';
import { UserInitDTO } from 'src/app/lib/dto';
import { DataSuggestionDTO, ResultCheckAddressDTO } from 'src/app/main-app/dto/address/address.dto';
import { SaleOnline_FacebookCommentService } from 'src/app/main-app/services/sale-online-facebook-comment.service';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { ProductService } from 'src/app/main-app/services/product.service';
import { GetInventoryDTO } from 'src/app/main-app/dto/product/product.dto';
import { ApplicationUserService } from 'src/app/main-app/services/application-user.service';
import { ApplicationUserDTO } from 'src/app/main-app/dto/account/application-user.dto';
import { ModalProductTemplateComponent } from '@app/shared/tpage-add-product/modal-product-template.component';
import { Message } from 'src/app/lib/consts/message.const';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { takeUntil, mergeMap } from 'rxjs';
import { DeliveryCarrierService } from 'src/app/main-app/services/delivery-carrier.service';
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
import { SO_PrepareFastSaleOrderHandler } from '@app/handler-v2/order-handler/prepare-fastsaleorder.handler';
import { ModalAddAddressV2Component } from '@app/pages/conversations/components/modal-add-address-v2/modal-add-address-v2.component';
import { TDSDestroyService } from 'tds-ui/core/services';
import { SaleSettingConfigDto_V2 } from '@app/dto/setting/sale-setting-config.dto';
import { NgxVirtualScrollerDto } from '@app/dto/conversation-all/ngx-scroll/ngx-virtual-scroll.dto';

@Component({
  selector: 'edit-order-v2',
  templateUrl: './edit-order-v2.component.html',
  providers: [TDSDestroyService]
})

export class EditOrderV2Component implements OnInit {

  @ViewChild(VirtualScrollerComponent) virtualScroller!: VirtualScrollerComponent;
  @Input() dataItem!: QuickSaleOnlineOrderModel;

  _form!: FormGroup;
  dataSuggestion!: DataSuggestionDTO;
  userInit!: UserInitDTO;
  lstComment: CommentsOfOrderDTO[] = [];
  isEnableCreateOrder: boolean = false;
  isLoading: boolean = false;
  phoneRegex!:any;
  emailRegex!:any;

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
  isCalculateFeeAship: boolean = false;

  _cities!: SuggestCitiesDTO;
  _districts!: SuggestDistrictsDTO;
  _wards!: SuggestWardsDTO;
  _street!: string;
  innerText: string = '';

  selectedIndex: number = 0;

  indClick: number = -1;
  lstVariants:  ProductDTOV2[] = [];
  isLoadingSelect: boolean = false;
  countUOMLine: number = 0;
  pageSize = 20;
  pageIndex = 1;
  isLoadingNextdata: boolean = false;

  numberWithCommas =(value:TDSSafeAny) =>{
    if(value != null)
    {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return value;
  } ;

  parserComas = (value: TDSSafeAny) =>{
    if(value != null)
    {
      return TDSHelperString.replaceAll(value,'.','');
    }
    return value;
  };

  lstCarrier!: DeliveryCarrierDTOV2[];
  lstInventory!: GetInventoryDTO;
  lstUser!: Array<ApplicationUserDTO>;
  stateReports!: PartnerStatusDTO[];
  saleConfig!: SaleSettingConfigDto_V2;
  companyCurrents!: CompanyCurrentDTO;
  chatomniEventEmiter: any;

  isEqualAmountInsurance: boolean = false;
  delivery_calcfee = ["fixed", "base_on_rule", "VNPost"];
  isEnableCalcFee: boolean = false;

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
    private deliveryCarrierService: DeliveryCarrierService,
    private prepareModelFeeV2Handler: PrepareModelFeeV2Handler,
    private selectShipServiceV2Handler: SelectShipServiceV2Handler,
    private updateShipExtraHandler: UpdateShipExtraHandler,
    private updateShipServiceExtrasHandler: UpdateShipServiceExtrasHandler,
    private updateShipmentDetailAshipHandler: UpdateShipmentDetailAshipHandler,
    private computeCaclHandler: SO_ComputeCaclHandler,
    private calcFeeAshipHandler: CalculateFeeAshipHandler,
    private csOrder_SuggestionHandler: CsOrder_SuggestionHandler,
    private so_PrepareFastSaleOrderHandler: SO_PrepareFastSaleOrderHandler,
    private partnerService: PartnerService,
    private sharedService: SharedService,
    private destroy$: TDSDestroyService,
    private productTemplateUOMLineService: ProductTemplateUOMLineService,
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

            this.saleModel = this.so_PrepareFastSaleOrderHandler.so_prepareFastSaleOrder(this.saleModel, this.quickOrderModel);

            this.calcTotal();
            this.coDAmount();

            this.loadConfigProvider(this.saleModel);

            this.handleIsEqualAmountInsurance();
            this.prepareCalcFeeButton();
          }
          this.isLoading = false;
      },
      error: (error: any) => {
          this.isLoading = false;
          this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
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

  loadCurrentCompany() {
    this.sharedService.setCurrentCompany();
    this.sharedService.getCurrentCompany().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: CompanyCurrentDTO) => {
        this.companyCurrents = res;

        if(this.companyCurrents?.DefaultWarehouseId) {
          this.loadInventoryWarehouseId(this.companyCurrents?.DefaultWarehouseId);
        }

        if(this.companyCurrents.Configs){
          this.phoneRegex = JSON.parse(this.companyCurrents.Configs)?.PhoneRegex;
        }
      },
      error: (error: any) => {
        this.message.error(error?.error?.message || 'Load thông tin công ty mặc định đã xảy ra lỗi!');
      }
    });
  }

  onLoadSuggestion(item: ResultCheckAddressDTO) {
    let data = {...this.csOrder_SuggestionHandler.onLoadSuggestion(item, this.quickOrderModel)};
    this.quickOrderModel = data;
  }

  mappingAddress(data: QuickSaleOnlineOrderModel) {
    let x = {...this.csOrder_SuggestionHandler.mappingAddress(data)};

    this._cities = x._cities;
    this._districts = x._districts;
    this._wards = x._wards;
    this._street = x._street;

    this.innerText = this._street;
  }

  loadCarrier() {
    this.deliveryCarrierService.get().pipe(takeUntil(this.destroy$)).subscribe(res => {
        this.lstCarrier = [...res.value];
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

  onEnableCreateOrder(event: TDSCheckboxChange) {
    this.isEnableCreateOrder = event.checked;

    if(event.checked == true && !this.saleModel) {
        this.loadSaleModel();
    }
  }

  onSearchProduct(event: any) {
    if(!this.textSearchProduct) {
      return;
    }

    if(this.virtualScroller) {
      this.virtualScroller.refresh();
      this.virtualScroller.scrollToPosition(0);
    }

    this.pageIndex = 1;
    let text = this.textSearchProduct;
    this.loadProduct(text);
  }

  closeSearchProduct(){
    this.textSearchProduct = '';
  }

  onChangePartnerName(name: any){
    this.quickOrderModel.Name = name;
    this.quickOrderModel.PartnerName = name;

    if(this.quickOrderModel.Partner){
      this.quickOrderModel.Partner.Name = name;
    }
  }

  onChangePhone(data: any){
    this.quickOrderModel.Telephone = data;
    this.quickOrderModel.PartnerPhone = data;

    if(this.quickOrderModel.Partner){
      this.quickOrderModel.Partner.Phone = data;
    }
  }

  onChangeEmail(data: any){
    this.quickOrderModel.Email = data;

    if(this.quickOrderModel.Partner){
      this.quickOrderModel.Partner.Email = data;
    }
  }

  onChangeUser(user:any){
    this.quickOrderModel.User = user;
  }

  onChangeNote(note:any){
    this.quickOrderModel.Note = note;
  }

  selectProduct(data: ProductDTOV2){
    let index = this.quickOrderModel.Details?.findIndex(x => x.ProductId === data.Id && x.UOMId === data.UOMId) as number;
    if (Number(index) >= 0){
        this.quickOrderModel.Details[index].Quantity += 1;
    } else{

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
    }

    this.closeSearchProduct();
    this.calcTotal();
    this.coDAmount();
  }

  onAddProduct() {
    const modal = this.modal.create({
        title: 'Thêm sản phẩm',
        content: ModalProductTemplateComponent,
        size: 'xl',
        viewContainerRef: this.viewContainerRef,
    });

    modal.afterClose.subscribe(result => {
      if(TDSHelperObject.hasValue(result)) {
        let data = result[0];
        let item = {
            Quantity: 1,
            Price: data.ListPrice,
            ProductId: data.VariantFirstId,
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

        this.quickOrderModel.Details = [...this.quickOrderModel.Details, ...[item]];

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
  }

  calcFee() {
    let model = this.saleModel.Carrier as any;
    this.calculateFeeAship(model);
  }

  onSelectShipServiceId (serviceId: string) {
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

  onUpdateWeight() {
    this.calcFee();
  }

  onUpdateInsuranceFee() {
    this.calcFee();
  }

  commentsOfOrder(fb_PostId: string, teamId: any, fb_ASUserId: string) {
    this.saleOnline_FacebookCommentService.getCommentsOfOrder(fb_PostId, teamId, fb_ASUserId)
        .pipe(takeUntil(this.destroy$)).subscribe({
          next: data => {
              if(data) {
                  this.lstComment = data.filter((x: any) => x.message != '');
              }
          },
          error: (error: any) => {
              this.message.error(error?.error?.message || Message.ErrorOccurred);
          }
        });
  }

  addComment(comment:string){
    if(!this.quickOrderModel.Note?.includes(comment)){
      if(this.quickOrderModel.Note){
          this.quickOrderModel.Note = this.quickOrderModel.Note.concat('\n' + comment);
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
    if(value >= 1) {
      this.quickOrderModel.Details[index].Quantity = value;
      this.calcTotal();
      this.coDAmount();
    } else {
      this.message.error('Vui lòng nhập số lượng sản phẩm');
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
    let data = {...this.computeCaclHandler.so_calcTotal((this.saleModel || null), this.quickOrderModel, this.saleConfig)};

    this.quickOrderModel = data.quickOrderModel;
    if(this.saleModel) {
       this.saleModel = data.saleModel as FastSaleOrder_DefaultDTOV2;
    }
  }

  calcTax() {
    if(this.saleModel) {
        let tax = {...this.computeCaclHandler.so_calcTax(this.saleModel)};
        this.saleModel.AmountTax = tax.AmountTax;
        this.saleModel.AmountTotal = tax.AmountTotal;
    }
  }

  coDAmount() {
    if(this.saleModel) {
        let cashOnDelivery = this.computeCaclHandler.so_coDAmount(this.saleModel);
        this.saleModel.CashOnDelivery = Number(cashOnDelivery);
    }
  }

  onSave(formAction?: string, type?: string): any {
    let model = this.quickOrderModel;
    model.Details?.map(x => {
      if(x.Quantity == null) {
          x.Quantity = 1;
      }
    })

    let id = this.quickOrderModel.Id as string;

    if(TDSHelperString.hasValueString(formAction)) {
        model.FormAction = formAction;
        if(this.saleModel) {
            this.saleModel.FormAction = formAction;
        }
    }

    if(this.isEnableCreateOrder) {
      if (!TDSHelperArray.hasListValue(model.Details)) {
          this.notification.warning('Không thể tạo hóa đơn', 'Đơn hàng chưa có chi tiết');
          return;
      }

      if (!TDSHelperString.hasValueString(model.Telephone)) {
          this.notification.warning('Không thể tạo hóa đơn', 'Vui lòng thêm điện thoại');
          return;
      }

      if (!TDSHelperString.hasValueString(model.Address)) {
          this.notification.warning('Không thể tạo hóa đơn', 'Vui lòng thêm địa chỉ');
          return;
      }

      if (!TDSHelperString.hasValueString(model.CityCode) || !TDSHelperString.hasValueString(model.DistrictCode)) {
          this.notification.warning('Không thể tạo hóa đơn', 'Tỉnh/Thành phố là bắt buộc');
          return false;
      }

      //TODO: trường hợp đối tác đã có mà chưa call lại hàm tính phí aship
      if(!this.isCalculateFeeAship && this.saleModel.Carrier) {
          this.notification.info(`Đối tác ${this.saleModel.Carrier.Name}`, 'Đang tính lại ship đối tác, vui lòng xác nhận lại sau khi thành công');
          let carrier = this.saleModel.Carrier as any;
          this.calculateFeeAship(carrier);
          return;
      }
    }

    this.isLoading = true;
    this.saleOnline_OrderService.update(id, model).pipe(mergeMap((x) => {
          return this.saleOnline_OrderService.getById(id);
      }))
      .subscribe({
        next: (res: any): any => {

          delete res['@odata.context'];
          // this.quickOrderModel.Details.map(x => {
          //     let item = res.Details?.find((a: any) => a.ProductId === x.ProductId && a.UOMId === x.UOMId) as any;
          //     if(item && (item.Quantity < x.Quantity)) {

          //     }
          // })
          this.quickOrderModel = {...res};

          if(!this.isEnableCreateOrder && type) {
              this.orderPrintService.printId(id, this.quickOrderModel);
          }

          if(this.isEnableCreateOrder) {
              // call api tạo hóa đơn
              let fs_model = {} as FastSaleOrder_DefaultDTOV2;

              this.updateShipExtras();
              this.updateShipServiceExtras();
              this.updateShipmentDetailsAship();

              fs_model = {...this.so_PrepareFastSaleOrderHandler.so_prepareFastSaleOrder(this.saleModel, this.quickOrderModel)};
              fs_model.CompanyId = this.companyCurrents?.CompanyId;

              this.createFastSaleOrder(fs_model, type);
          } else {
              this.isLoading = false;
              this.message.success('Cập nhật đơn hàng thành công');
              this.modalRef.destroy('onLoadPage');
          }
      },
      error: (error: any) => {
        this.isLoading = false;

        if(TDSHelperString.isString(error)){
          this.message.error(error);
        }else{
          this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
        }
      }
    });

  }

  createFastSaleOrder(fs_model: FastSaleOrder_DefaultDTOV2, type?: string) {
    let model = {...this.so_PrepareFastSaleOrderHandler.so_prepareFastSaleOrder(fs_model, this.quickOrderModel)};

    // TODO check cấu hình ghi chú in
    let printNote = this.saleConfig && this.saleConfig.SaleSetting && this.saleConfig.SaleSetting.GroupSaleOnlineNote;
    if(!printNote) {
      model.Comment = '';
    }

    this.fastSaleOrderService.saveV2(model).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: CreateFastSaleOrderDTO) => {
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

            if(type && res) {
                this.printOrder(type, res);
            } else {
              this.isLoading = false;
              this.modalRef.destroy('onLoadPage');
            }

            this.isCalculateFeeAship = false;
        },
        error: (error: any) => {
            this.isLoading = false;
            this.notification.error('Tạo hóa đơn thất bại', error.error?.message);
        }
    });
  }

  printOrder(type?: string, res?: CreateFastSaleOrderDTO) {
    let obs: TDSSafeAny;
    if(type == 'print') {
        obs = this.printerService.printUrl(`/fastsaleorder/print?ids=${res?.Data.Id}`);
    }

    if(type == 'printShip') {
        obs = this.printerService.printUrl(`/fastsaleorder/printshipthuan?ids=${res?.Data.Id}`);
    }

    if (obs) {
      obs.pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
          this.printerService.printHtml(res);
          this.isLoading = false;
          this.modalRef.destroy('onLoadPage');

      }, (error: TDSSafeAny) => {
          if(error?.error?.message) {
              this.notification.error( 'Lỗi in phiếu', error?.error?.message);
          }
          this.isLoading = false;
          this.modalRef.destroy('onLoadPage');
      });
    }
  }

  onCancel() {
    this.modalRef.destroy(null);
  }

  loadUserInfo() {
    this.auth.getUserInit().pipe(takeUntil(this.destroy$)).subscribe({
      next: res => {
        if(res) {
            this.userInit = res || {};
        }
      },
      error: (error: any) => {
        this.message.error(error?.error?.message || 'Không thể tải thông tin user');
      }
    })
  }

  loadInventoryWarehouseId(warehouseId: number) {
    this.productService.setInventoryWarehouseId(warehouseId);
    this.productService.getInventoryWarehouseId().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.lstInventory = res;
      },
      error: (err: any) => {
          this.message.error(err?.error?.message || 'Không thể tải thông tin kho hàng');
      }
    });
  }

  loadProduct(textSearch: string) {
    this.isLoadingProduct = true;

    this.productTemplateUOMLineService.getProductUOMLine(this.pageIndex, this.pageSize, textSearch).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ODataProductDTOV2) => {
        this.countUOMLine = res['@odata.count'] as number;
        this.lstProductSearch = [...res.value];
        this.isLoadingProduct = false
      },
      error: (error: any) => {
        this.isLoadingProduct = false
        this.message.error(error?.error?.message || 'Không thể tải danh sách sản phẩm');
      }
    });
  }

  loadUser() {
    this.applicationUserService.getActive().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.lstUser = [...res.value];
      },
      error: (error: any) => {
        this.message.error(error?.error?.message || 'Không thể tải danh sách user');
      }
    });
  }

  loadPartnerStatus() {
    this.commonService.getPartnerStatus().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.lstPartnerStatus = res;
      },
      error: (error: any) => {
        this.message.error(error?.error?.message || 'Không thể tải danh sách trạng thái khách hàng');
      }
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

      this.partnerService.updateStatus(this.quickOrderModel.PartnerId, data).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res: any) => {
            this.message.success(Message.Partner.UpdateStatus);
            this.quickOrderModel.Partner.StatusText = status.text;
          },
          error: (error: any) => {
            this.message.error(error.error.message || 'Cập nhật trạng thái thất bại');
          }
      })
    } else {
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

  calculateFeeAship(event: DeliveryCarrierDTOV2): any {
    if(!this.saleModel.Carrier) {
        return this.message.error('Vui lòng chọn  đối tác giao hàng');
    }

    if (!this.saleModel.ShipWeight) {
        return this.message.error('Vui lòng chọn nhập khối lượng');
    }

    let model = this.prepareModelFeeV2();
    this.isLoading = true;

    this.calcFeeAshipHandler.calculateFeeAship(model, event, this.configsProviderDataSource).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            if(res && !res.error) {

                if(!TDSHelperString.isString(res)){
                  this.configsProviderDataSource = [...res.configs];

                  this.insuranceInfo = res.data?.InsuranceInfo || null;
                  this.shipServices = res.data?.Services || [];

                  if(TDSHelperArray.hasListValue(this.shipServices)) {
                      let x = this.shipServices.filter((x: any) => x.ServiceId === model.ServiceId)[0];
                      if(x) {
                          this.selectShipServiceV2(x);
                          this.message.success(`Đối tác ${event.Name} có phí vận chuyển: ${formatNumber(Number(x.TotalFee), 'en-US', '1.0-0')} đ`);
                      }else {
                        let item = this.shipServices[0] as CalculateFeeServiceResponseDto;
                        this.selectShipServiceV2(item);
                        this.message.success(`Đối tác ${event.Name} có phí vận chuyển: ${formatNumber(Number(item.TotalFee), 'en-US', '1.0-0')} đ`);
                      }
                  }
                }
            }

            if(res && res.error?.message) {
              this.message.error(res.error.message);
            }

            this.isLoading = false;
            this.isCalculateFeeAship = true;
            this.cdRef.markForCheck();
        },
        error: (error: any) => {
            this.isLoading = false;
            this.message.error(error.error.message || error.error.error_description);
            this.cdRef.markForCheck();
        }
    })
  }

  selectShipServiceV2(x: CalculateFeeServiceResponseDto) {
    let data = {...this.selectShipServiceV2Handler.so_selectShipServiceV2(x, this.shipExtraServices, this.saleModel)};

    this.saleModel = data.saleModel;

    this.shipExtraServices = [];
    this.shipExtraServices = data.shipExtraServices;
  }

  prepareModelFeeV2() {
    let companyId = this.companyCurrents.CompanyId;

    let model = {...this.prepareModelFeeV2Handler.so_prepareModelFeeV2(this.shipExtraServices, this.saleModel, this.quickOrderModel, companyId, this.insuranceInfo)};
    return {...model};
  }

  openPopoverShipExtraMoney(value: number) {
    this.extraMoney = Number(value) || 0;
    this.visibleShipExtraMoney = true;
  }

  closePopoverShipExtraMoney() {
    this.visibleShipExtraMoney = false;
  }

  changeIsSelectedEx(event: any, i: number) {
    this.shipExtraServices[i]!.IsSelected = event;
  }

  onChangeExtraMoney(event: number){
    this.extraMoney = event;
  }

  changeAmountDeposit(event: any) {
    if (Number(event) >= 0) {
      this.saleModel.AmountDeposit = Number(event);
      this.coDAmount();
    }
  }

  changeDeliveryPrice(event: any) {
    if (Number(event) >= 0) {
      this.saleModel.DeliveryPrice = Number(event);
      this.coDAmount();
    }
  }

  changeShipWeight() {
    if(this.saleModel.Carrier) {
      this.calcFee();
    }
  }

  changeCashOnDelivery(event: any) {
    if (Number(event) >= 0) {
      this.saleModel.CashOnDelivery = Number(event);
    }
  }

  changeShip_InsuranceFee(event: any) {
    if (Number(event) >= 0) {
      this.saleModel.Ship_InsuranceFee = Number(event);
    }
  }

  changeShipExtraMoney() {
    let idx = this.shipExtraServices.findIndex((f: any) => f.ServiceId === 'XMG') as number;
    this.shipExtraServices[idx].ExtraMoney = this.extraMoney;
    this.calcFee();

    this.visibleShipExtraMoney = false;
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

  onRouterEvent(url:string) {
    this.modalRef.destroy(null);
    this.router.navigateByUrl(url)
  }

  onChecked(checked: boolean) {
    if(checked == true) {
      this.selectedIndex = 0;
    }
  }

  showModalSuggestAddress(){
    let modal =  this.modal.create({
      title: 'Sửa địa chỉ',
      content: ModalAddAddressV2Component,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        _cities: this._cities,
        _districts: this._districts,
        _wards: this._wards,
        _street: this.innerText,
        isSelectAddress: true
      }
    });

    modal.afterClose.subscribe({
      next: (result: ResultCheckAddressDTO) => {
        if(result){
          this.onLoadSuggestion(result);
          this.innerText = result.Address;
          this.quickOrderModel.Address = result.Address;
        }
      }
    })
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
}
