import { DeliveryCarrierDTOV2 } from './../../../../dto/delivery-carrier.dto';
import { FilterObjDTO, OdataProductService } from './../../../../services/mock-odata/odata-product.service';
import { CommonService } from 'src/app/main-app/services/common.service';
import { CalculateFeeResponse_Data_ServiceDTO, DeliveryCarrierDTO } from './../../../../dto/carrier/delivery-carrier.dto';
import { AfterContentInit, AfterViewChecked, ChangeDetectorRef, Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { TAuthService } from 'src/app/lib';
import { UserInitDTO } from 'src/app/lib/dto';
import { CheckAddressDTO, DataSuggestionDTO, ResultCheckAddressDTO } from 'src/app/main-app/dto/address/address.dto';
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
import { CarrierHandler } from 'src/app/main-app/services/handlers/carier.handler';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { DeliveryCarrierService } from 'src/app/main-app/services/delivery-carrier.service';
import { finalize } from 'rxjs/operators';
import { SuggestCitiesDTO, SuggestDistrictsDTO, SuggestWardsDTO } from 'src/app/main-app/dto/suggest-address/suggest-address.dto';
import { TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
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
import { PrepareSaleModelHandler } from 'src/app/main-app/commands/prepare-salemodel.handler';
import { ValidateInsuranceFeeHandler } from 'src/app/main-app/commands/validate-insurance-fee.dto';
import { SelectShipServiceHandler } from 'src/app/main-app/commands/select-ship-service.handler';
import { GeneralConfigsFacade } from 'src/app/main-app/services/facades/general-config.facade';
import { CalcServiceDefaultHandler } from 'src/app/main-app/commands/calc-service-default.handler';
import { InitSaleDTO } from 'src/app/main-app/dto/setting/setting-sale-online.dto';

@Component({
  selector: 'edit-order',
  templateUrl: './edit-order.component.html'
})

export class EditOrderComponent implements OnInit, AfterViewChecked {

  @Input() dataItem!: SaleOnline_Order_V2DTO;
  _form!: FormGroup;

  dataSuggestion!: DataSuggestionDTO;
  userInit!: UserInitDTO;
  lstComment: CommentsOfOrderDTO[] = [];
  isEnableCreateOrder: boolean = false;
  enableInsuranceFee: boolean = false;
  isLoadCarrier: boolean = false;
  isLoading: boolean = false;

  quickOrderModel!: QuickSaleOnlineOrderModel;
  saleModel!: FastSaleOrder_DefaultDTOV2;

  lstPartnerStatus: any[] = []
  // Giá trị này phải khởi tạo = []
  shipExtraServices: TDSSafeAny[] = [];
  shipServices: any[] = [];

  _cities!: SuggestCitiesDTO;
  _districts!: SuggestDistrictsDTO;
  _wards!: SuggestWardsDTO;
  _street!: string;

  numberWithCommas = (value: number) => `${value} đ`;
  parserComas = (value: string) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  delivery_types = ["fixed", "base_on_rule", "VNPost"];
  carrierTypeInsurance = ["MyVNPost", "GHN", "GHTK", "ViettelPost", "NinjaVan", "HolaShip"];
  apiDeliveries = ['GHTK', 'ViettelPost', 'GHN', 'TinToc', 'SuperShip', 'FlashShip', 'OkieLa', 'MyVNPost', 'DHL', 'FulltimeShip', 'JNT', 'BEST', 'EMS', 'AhaMove', 'Snappy', 'NhatTin', 'HolaShip', 'ZTO', 'FastShip', 'Shopee', 'GHSV'];

  lstDeliveryCarrier!: Array<DeliveryCarrierDTO>;
  lstInventory!: GetInventoryDTO;
  lstUser!: Array<ApplicationUserDTO>;
  stateReports!: PartnerStatusDTO[];
  destroy$ = new Subject<void>();
  saleConfig!: InitSaleDTO;

  constructor(private modal: TDSModalService,
    private modalRef: TDSModalRef,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private auth: TAuthService,
    private message: TDSMessageService,
    private viewContainerRef: ViewContainerRef,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private saleOnline_FacebookCommentService: SaleOnline_FacebookCommentService,
    private productService: ProductService,
    private applicationUserService: ApplicationUserService,
    private commonService: CommonService,
    private fastSaleOrderService: FastSaleOrderService,
    private carrierHandler: CarrierHandler,
    private partnerService: PartnerService,
    private generalConfigsFacade: GeneralConfigsFacade,
    private odataProductService: OdataProductService,
    private deliveryCarrierService: DeliveryCarrierService) {
      this.createForm();
  }

  createForm() {
    this._form = this.fb.group({
      isEnableCreateOrder: [false],
      Facebook_UserName: [null],
      Facebook_UserId: [null],
      Partner: [null],
      Company: [null],
      Name: [null],
      Telephone: [null],
      Email: [null],
      Address: [null],
      AddressCheck: [null],
      City: [null],
      District: [null],
      Ward: [null],
      User: [null],
      Note: [null],
      Details: this.fb.array([]),
      TotalAmount: [0],
      TotalQuantity: [0],
      Carrier: [null],
      ShipWeight: [0],
      DeliveryPrice: [0],
      CashOnDelivery: [0],
      DeliveryNote: [null],
      Ship_ServiceExtras: [[]],
      Ship_ServiceExtrasText: [""],
      Ship_ServiceId: [""],
      Ship_ServiceName: [""],
      CustomerDeliveryPrice: [0],
      Ship_InsuranceFee: [0],
      Ship_Extras: [null],
      PartnerId: [null],
      CompanyId: [null],
      AmountTotal: [0],
      Ship_Receiver: [null],
      AmountDeposit: [0]
    });
  }

  ngOnInit(): void {
    if(this.dataItem) {
      // Thông tin đơn hàng
      this.loadData();

      this.loadUserInfo();
      this.loadDeliveryCarrier();
      this.loadUser();
      this.loadPartnerStatus();
      this.loadSaleConfig();
    }
  }

  loadData() {
    this.isLoading = true;
    this.saleOnline_OrderService.getById(this.dataItem.Id).pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false)).subscribe(res => {
      delete res['@odata.context'];
      this.quickOrderModel = {...res};

      this.commentsOfOrder(res.Facebook_PostId, res.CRMTeamId, res.Facebook_ASUserId);
      this.updateForm(res);

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
        this.saleModel = Object.assign( {
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
          this.getStatusPartner();
        }

        if (this.saleModel.Ship_ServiceExtrasText) {
          let shipExtra = JSON.parse(this.saleModel.Ship_ServiceExtrasText) as any[];

          this.shipExtraServices = [];
          shipExtra.map(item => {
          this.shipExtraServices.push({
                ServiceId: item.Id,
                ServiceName: item.Name,
                Fee: 0,
                IsSelected: true,
                Type: item.Type,
                ExtraMoney: item.ExtraMoney,
                Pickup_Time: item.Pickup_Time,
                Pickup_Time_Range_Id: item.Pickup_Time_Range_Id,
            });
            if (item.Id === 'OrderAmountEvaluation' || item.Id === "16" || item.Id === "GBH" || item.Id === "NinjaVan" || item.Id === "BEST_Insurance" || item.Id === "Snappy_Insurance" || item.Id === "HolaShip_Insurance" || item.Id === "JNT_Insurance" || item.Id === "FastShip_Insurance" || item.Id === "Shopee_Insurance" || item.Id === "GHSV_Insurance" || item.Id === "SHIP60_Insurance") {
              this.enableInsuranceFee = true;
            }
          });
        }

        InitOkieLaHandler.initOkieLa(this.saleModel, this.shipExtraServices);
        InitServiceHandler.initService(this.saleModel, this.shipExtraServices, this.shipServices);
        InitInfoOrderDeliveryHandler.initInfoOrderDelivery(this.saleModel, this.quickOrderModel, this.shipExtraServices, this.enableInsuranceFee);

        // update lại các giá form
        this._form.controls['DeliveryNote'].setValue(this.saleModel.DeliveryNote);
        this._form.controls['Carrier'].setValue(this.saleModel.Carrier || this.saleConfig.SaleSetting?.DeliveryCarrier);
        this._form.controls['DeliveryPrice'].setValue(this.saleModel.DeliveryPrice);
        this._form.controls['ShipWeight'].setValue(this.saleModel.ShipWeight);
        this.coDAmount();

    }, error => {
      this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
    });
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

  getStatusPartner() {
    let partnerId = this.quickOrderModel.Partner.Id;
    let carrierId = this.saleModel.Carrier?.Id as number;

    this.saleOnline_OrderService.getStatusPartner(partnerId, carrierId).subscribe((res: any) => {
        this.stateReports = res;
    }, error => {
      this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
    })
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
      componentParams: {
      }
    });

    modal.componentInstance?.onLoadedProductSelect.subscribe(result => {
      if(TDSHelperObject.hasValue(result)) {
        let details = this._form.controls['Details'];

        let item = {
            Factor: 1,
            Id: this.dataItem.Id,
            ImageUrl: result.ImageUrl,
            Note: '',
            OrderId: '',
            Price: result.ListPrice,
            Priority: 0,
            ProductCode: result.Barcode,
            ProductId: result.Id,
            ProductName: result.Name,
            ProductNameGet: result.NameGet,
            Quantity: 1,
            UOMId: result.UOMId,
            UOMName: result.UOMName
        };

        (details as FormArray).push(new FormControl(item));

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
    this.shipServices = [];

    if (!event || (this.saleModel.Carrier && event.Id !== this.saleModel.Carrier.Id)) {
        this.shipExtraServices = [];
    }

    this.enableInsuranceFee = false;
    this.saleModel.Ship_InsuranceFee = null;
    this.saleModel.Ship_ServiceId = '';
    this.saleModel.Ship_ServiceName = '';
    delete this.saleModel.CustomerDeliveryPrice;

    this.saleModel.Carrier = event;
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

    // update lại các giá trị form
    this._form.controls['Carrier'].setValue(this.saleModel.Carrier);
    this._form.controls['ShipWeight'].setValue(this.saleModel.ShipWeight);
    this._form.controls['DeliveryPrice'].setValue(this.saleModel.DeliveryPrice);

    this.calculateFee(event).then(() => {});

  }

  updateShipExtraServices(carrier: any) {
    if(carrier) {
      let insuranceFee = this._form.value.Ship_Extras?.InsuranceFee || 0;

      this.enableInsuranceFee = this.carrierHandler.getShipExtraServices(carrier, this.shipExtraServices);
      this.enableInsuranceFee && (this._form.controls['Ship_InsuranceFee'].setValue(insuranceFee));
    }
  }

  existDeliveryTypes(deliveryType: string) {
    return this.carrierHandler.existDeliveryTypes(deliveryType);
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
    this.selectShipService(event.dataItem);
    if (this.saleModel.Carrier?.DeliveryType === 'GHN') {
        this.onUpdateInsuranceFee();
    }
  }

  onUpdateWeight() {
    this.calculateFeeRequest();
  }

  onUpdateInsuranceFee() {
    this.calculateFeeRequest();
  }

  updateForm(data: QuickSaleOnlineOrderModel) {
    this._form.controls["Company"].setValue(this.userInit?.Company);
    this._form.controls["CompanyId"].setValue(this.userInit?.Company?.Id);

    this.mappingAddress(data);
    this._form.setControl("Details", this.fb.array(data.Details || []));
    this._form.patchValue(data);
  }

  mappingAddress(data: any) {
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
        districtName: data.DistrictName,
        code: data.WardCode,
        name: data.WardName
      }
    }
    if (data && (data.Address)) {
      this._street = data.Address;
    }
  }

  onLoadSuggestion(item: ResultCheckAddressDTO) {
    this._form.controls['Address'].setValue( item.Address ? item.Address : null);

    if(item && item.CityCode) {
      this._form.controls['City'].patchValue({
          code: item.CityCode,
          name: item.CityName
      });
    } else{
      this._form.controls['City'].setValue(null)
    }

    if(item && item.DistrictCode) {
      this._form.controls['District'].patchValue({
          code: item.DistrictCode,
          name: item.DistrictName
      });
    } else {
      this._form.controls['District'].setValue(null)
    }

    if(item && item.WardCode) {
      this._form.controls['Ward'].patchValue({
          code: item.WardCode,
          name: item.WardName
      });
    } else {
      this._form.controls['Ward'].setValue(null)
    }
  }

  updateFormByBillDefault(billDefault: FastSaleOrder_DefaultDTOV2) {
    billDefault.Ship_ServiceExtras = JSON.parse(billDefault.Ship_ServiceExtrasText) || [];

    let formControl = this._form.controls;

    formControl["Carrier"].setValue(billDefault.Carrier);
    formControl["Ship_Extras"].setValue(billDefault.Ship_Extras);
    formControl["ShipWeight"].setValue(billDefault.ShipWeight);

    formControl["DeliveryPrice"].setValue(
      billDefault.DeliveryPrice || 0
    );

    formControl["CashOnDelivery"].setValue(
      (billDefault.DeliveryPrice || 0) + (billDefault.AmountTotal || 0)
    );

    formControl["DeliveryNote"].setValue(
      billDefault.DeliveryNote || 0
    );

    formControl["Ship_ServiceId"].setValue(
      billDefault.Ship_ServiceId
    );

    formControl["Ship_ServiceName"].setValue(
      billDefault.Ship_ServiceName
    );

    formControl["CustomerDeliveryPrice"].setValue(
      billDefault.CustomerDeliveryPrice || 0
    );

    formControl["Company"].setValue(billDefault.Company);

    if (formControl["Address"].value) {
      formControl["Ship_Receiver"].setValue({
        Name: formControl["Name"].value,
        Street: formControl["Address"].value,
        Phone: formControl["Telephone"].value,
        City: formControl["City"].value,
        District: formControl["District"].value,
        Ward: formControl["Ward"].value,
      });
    }
    else {
      formControl["Ship_Receiver"].setValue(null)
    }
  }

  commentsOfOrder(fb_PostId: string, teamId: any, fb_ASUserId: string) {
    this.saleOnline_FacebookCommentService.getCommentsOfOrder(fb_PostId, teamId, fb_ASUserId)
      .pipe(takeUntil(this.destroy$)).subscribe(data => {
          if(data) {
              this.lstComment = data.filter((x: any) => x.message != '');
          }
    });
  }

  onChangeProductPrice() {
    this.calcTotal();
    this.coDAmount();
  }

  onChangeProductQuantity() {
    this.calcTotal();
    this.coDAmount();
  }

  onRemoveProduct(product: TDSSafeAny, index: number) {
    (this._form.controls["Details"] as FormArray).removeAt(index);

    this.calcTotal();
    this.coDAmount();
  }

  calcTotal() {
    let totalAmount = 0 as number;
    let totalQuantity = 0 as number;
    let details = this._form.controls['Details'].value as Detail_QuickSaleOnlineOrder[];

    details.map((x: any) => {
        totalAmount += x.Price * x.Quantity;
        totalQuantity += x.Quantity;
    })

    this._form.controls['TotalAmount'].setValue(totalAmount);
    this._form.controls['TotalQuantity'].setValue(totalQuantity);
  }

  coDAmount() {
    if (this.saleModel) {
      let coDAmount = this._form.controls["TotalAmount"].value + this._form.controls["DeliveryPrice"].value - this._form.controls["AmountDeposit"].value;
      this._form.controls['CashOnDelivery'].setValue(coDAmount);
    }
  }

  getStatusColor(): string {
    let partner = this._form.controls["Partner"].value;

    if(partner) {
      let value = this.lstPartnerStatus.find(x => x.text == partner.StatusText);
      if(value) return value.value;
      else return '#e5e7eb';
    }
    else return '#e5e7eb';
  }

  selectStatus(status: any) {
    let partner = this._form.controls["Partner"].value;

    if(partner) {
      let data = {
        status: `${status.value}_${status.text}`
      }

      this.partnerService.updateStatus(partner.Id, data).subscribe(res => {
        this.message.success(Message.Partner.UpdateStatus);
        partner.StatusText = status.text;
        this._form.controls["Partner"].setValue(partner);
      });
    }
  }

  onSave(type: string) {
    if(!this._form.valid) {
      let model = this.prepareModel();

      let id = this.dataItem.Id;
      this.isLoading = true;

      this.saleOnline_OrderService.update(id, model)
        .pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false)).subscribe((res: any) => {
            if(this.isEnableCreateOrder) {

                let x = PrepareSaleModelHandler.prepareSaleModel(this.saleModel, this.quickOrderModel, this.shipExtraServices, this.userInit, this.isEnableCreateOrder, this.enableInsuranceFee);
                if(x) {
                  if(!this.enableInsuranceFee) {
                    this.saleModel.Ship_InsuranceFee = 0;
                  }
                  this.createFastSaleOrder(this.saleModel);
                }
            }

            if(type == 'print') {

            }

            if(type == 'print_ship') {

            }

      }, error => {
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
      });
    }
  }

  createFastSaleOrder(data: FastSaleOrder_DefaultDTOV2) {
    this.fastSaleOrderService.createFastSaleOrder(data).pipe(takeUntil(this.destroy$))
      .subscribe((res: CreateFastSaleOrderDTO) => {
          if(res && res.Success == true) {

              this.shipServices = [];
              this.shipExtraServices = [];
              delete this.saleModel.Ship_ServiceId;
              delete this.saleModel.Ship_ServiceName;

              if(res.Message) {
                  this.message.warning(res.Message);
              } else {
                  this.message.success('Tạo hóa đơn thành công');
              }
          } else {
              this.message.error(res.Message);
          }
      }, error => {
          this.message.error(error.data.Message ? error.data.Message : 'Đã xảy ra lỗi');
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

  loadDeliveryCarrier() {
    this.deliveryCarrierService.get().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.lstDeliveryCarrier = [...res.value];
    });
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
        // console.log("view product:", res);
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

  onChangeAddress(event: CheckAddressDTO) {
    let formControls = this._form.controls;
    formControls["Street"].setValue(event.Street);

    formControls["City"].setValue( event.City?.Code ? {
      Code: event.City?.Code,
      Name: event.City?.Name
    } : null);

    formControls["District"].setValue( event.District?.Code ? {
      Code: event.District?.Code,
      Name: event.District?.Name,
    } : null);

    formControls["Ward"].setValue( event.Ward?.Code ? {
      Code: event.Ward?.Code,
      Name: event.Ward?.Name,
    } : null);
  }

  prepareModel() {
    let formModel = this._form.value;

    this.quickOrderModel.Partner = formModel.Partner;
    this.quickOrderModel.Name = formModel.Name;
    this.quickOrderModel.Telephone = formModel.Telephone;
    this.quickOrderModel.Email = formModel.Email;
    this.quickOrderModel.Note = formModel.Note;

    this.quickOrderModel.Address = formModel.Address;

    this.quickOrderModel.CityCode = formModel.City?.code ? formModel.City.code : null;
    this.quickOrderModel.CityName = formModel.City?.name ? formModel.City.name : null;

    this.quickOrderModel.DistrictCode = formModel.District?.code ? formModel.District.code : null;
    this.quickOrderModel.DistrictName = formModel.District?.name ? formModel.District.name : null;

    this.quickOrderModel.WardCode = formModel.Ward?.code ? formModel.Ward.code : null;
    this.quickOrderModel.WardName = formModel.Ward?.name ? formModel.Ward.name : null;

    if (formModel.User) {
      this.quickOrderModel.User = formModel.User;
      this.quickOrderModel.UserId = formModel.User.Id
    } else {
      this.quickOrderModel.User = null;
    }

    this.quickOrderModel.Details = formModel.Details || [];
    this.quickOrderModel.TotalAmount = formModel.TotalAmount || 0;
    this.quickOrderModel.TotalQuantity = formModel.TotalQuantity || 0;

    return this.quickOrderModel;
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
                        totalFee += x.Fee;
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
    let promise = new Promise((resolve, reject) => {
      if (this.apiDeliveries.includes(item.DeliveryType)) {
          if (ValidateInsuranceFeeHandler.validateInsuranceFee(this.saleModel, this.shipExtraServices)) {
              this.enableInsuranceFee = true;
              //gán giá trị bảo hiểm"
              if (!this.saleModel.Ship_InsuranceFee) {
                this.saleModel.Ship_InsuranceFee = this.saleModel.Ship_Extras.InsuranceFee || this.quickOrderModel.TotalAmount;
              }
          }

          let model = PrepareSaleModelHandler.prepareSaleModel(this.saleModel, this.quickOrderModel, this.shipExtraServices, this.userInit, this.isEnableCreateOrder, this.enableInsuranceFee);
          this.fastSaleOrderService.calculateFeeV2(model).pipe(takeUntil(this.destroy$)).subscribe((response: any) => {

            this.message.success(`Đối tác ${item.Name} có phí vận chuyển: ${formatNumber(Number(response.TotalFee), 'en-US', '1.0-0')} đ`);
            // Cập nhật lại phí ship (đối tác)
            this.saleModel.CustomerDeliveryPrice = response.TotalFee;

            if (response.Services && response.Services.length > 0) {
                this.shipServices = response.Services;
                this.selectShipService(this.shipServices[0]);
            }

            resolve(response);
          }, error => {
              reject(error.data || error);
          });
      }
    })
    return promise;
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
