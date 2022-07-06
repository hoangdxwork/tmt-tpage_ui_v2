import { ModalApplyPromotionComponent } from './../modal-apply-promotion/modal-apply-promotion.component';
import { ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { InitSaleDTO } from './../../../../dto/setting/setting-sale-online.dto';
import { Component, Input, OnInit, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subject, Observable, takeUntil, finalize, map } from 'rxjs';
import { ConversationMatchingItem } from 'src/app/main-app/dto/conversation-all/conversation-all.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ConversationOrderFacade } from 'src/app/main-app/services/facades/conversation-order.facade';
import { ConversationOrderForm, ConversationOrderProductDefaultDTO } from 'src/app/main-app/dto/coversation-order/conversation-order.dto';
import { ApplicationUserService } from 'src/app/main-app/services/application-user.service';
import { ApplicationUserDTO } from 'src/app/main-app/dto/account/application-user.dto';
import { CheckFormHandler } from 'src/app/main-app/services/handlers/check-form.handler';
import { GeneralConfigsFacade } from 'src/app/main-app/services/facades/general-config.facade';
import { DeliveryCarrierService } from 'src/app/main-app/services/delivery-carrier.service';
import { Message } from 'src/app/lib/consts/message.const';
import { SaleOnline_OrderDTO } from 'src/app/main-app/dto/saleonlineorder/sale-online-order.dto';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { OrderPrintService } from 'src/app/main-app/services/print/order-print.service';
import { PrinterService } from 'src/app/main-app/services/printer.service';
import { OrderFormHandler } from 'src/app/main-app/services/handlers/order-form.handler';
import { CarrierHandler } from 'src/app/main-app/services/handlers/carier.handler';
import { SaleHandler } from 'src/app/main-app/services/handlers/sale.handler';
import { ModalListProductComponent } from '../modal-list-product/modal-list-product.component';
import { DataPouchDBDTO } from 'src/app/main-app/dto/product-pouchDB/product-pouchDB.dto';
import { TpageAddProductComponent } from 'src/app/main-app/shared/tpage-add-product/tpage-add-product.component';
import { TpageConfigProductComponent } from 'src/app/main-app/shared/tpage-config-product/tpage-config-product.component';
import { CheckAddressDTO } from 'src/app/main-app/dto/address/address.dto';
import { ModalTaxComponent } from '../modal-tax/modal-tax.component';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { FastSaleOrderRestDTO } from 'src/app/main-app/dto/saleonlineorder/saleonline-order-red.dto';
import { QuickSaleOnlineOrderModel } from 'src/app/main-app/dto/saleonlineorder/quick-saleonline-order.dto';
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

@Component({
    selector: 'conversation-order',
    templateUrl: './conversation-order.component.html',
})

export class ConversationOrderComponent  implements OnInit, OnDestroy {

  @Input() data!: ConversationMatchingItem;
  @Input() team!: CRMTeamDTO;

  dataModle!: ConversationMatchingItem;

  isLoading: boolean = false;
  isEditPartner: boolean = false;
  isEnableCreateOrder: boolean = false;
  isEnableInsuranceFee: boolean = false;

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

  private destroy$ = new Subject<void>();

  constructor(private message: TDSMessageService,
    private conversationOrderFacade: ConversationOrderFacade,
    private applicationUserService: ApplicationUserService,
    private modal: TDSModalService,
    private generalConfigsFacade: GeneralConfigsFacade,
    private deliveryCarrierService: DeliveryCarrierService,
    private auth: TAuthService,
    private partnerService: PartnerService,
    private fastSaleOrderService: FastSaleOrderService,
    private orderPrintService: OrderPrintService,
    private printerService: PrinterService,
    private viewContainerRef: ViewContainerRef,
    private saleHandler: SaleHandler) {
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
    })
  }

  onSelectOrderFromMessage() {
    this.conversationOrderFacade.onSelectOrderFromMessage$.pipe(takeUntil(this.destroy$)).subscribe(res => {

        // if(res && TDSHelperString.hasValueString(res.phone) && this.partner) {
        //     this.partner.Phone = res.phone;
        // }
        // if(res && TDSHelperString.hasValueString(res.address) && this.partner) {
        //     this.partner.Street = res.address;
        // }
        // if(res && TDSHelperString.hasValueString(res.note) && this.partner) {
        //     let text = (this.partner.Comment || "") + ((this.partner.Comment || "").length > 0 ? '\n' + res.note : res.note);
        //     this.partner.Comment = text;
        // }
    })
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

  validateData(){
    (this.quickOrderModel as any) = null;
    (this.saleModel as any) = null;
  }

  onEnableCreateOrder(event: TACheckboxChange) {
    if(event.checked == true && !this.saleModel) {
        this.loadSaleModel();
    }
  }

  coDAmount() {
    if (this.saleModel) {
      let coDAmount = this.quickOrderModel.TotalAmount + this.saleModel.DeliveryPrice - this.saleModel.AmountDeposit;
      this.saleModel.CashOnDelivery = coDAmount;
    }
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

  eventAddProduct() {
    // this.conversationOrderFacade.onAddProductOrder.pipe(takeUntil(this.destroy$)).subscribe(res => {
    //   let product = this.convertDetail(res);
    //   this.selectProduct(product);
    // });
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

  updateFormOrder(order: ConversationOrderForm) {
    // this._form.reset({
    //   Id: [null],
    //   Code: [null],
    //   LiveCampaignId: [null],
    //   Facebook_UserId: [null],
    //   Facebook_ASUserId: [null],
    //   Facebook_UserName: [null],
    //   Facebook_CommentId: [null],
    //   Facebook_PostId: [null],
    //   PartnerId: [null],
    //   PartnerName: [null],
    //   Name: [null],
    //   Email: [null],
    //   TotalAmount: [0],
    //   TotalQuantity: [0],
    //   Street: [null],
    //   City: [null],
    //   District: [null],
    //   Ward: [null],
    //   User: [null],
    //   Telephone: [null],
    //   Note: [null],
    //   CRMTeamId: [null],
    //   PrintCount: [null],
    //   Session: [null],
    //   SessionIndex: [null],
    //   StatusText: [null],
    //   Details: this.fb.array([]),
    // });
    // order.Facebook_UserName = this.data?.name;
    // this.visibleIndex = -1;

    // let details = new FormArray([]);

    // //TODO: thêm danh sách sản phẩm vào form
    // if (order["Details"] && order["Details"].length > 0) {
    //   order["Details"].forEach(detail => {
    //     details.push(this.fb.group(detail));
    //   });
    // }
    // this._form.patchValue(order);
    // this._form.setControl("Details", details);
    // this.updateTotalAmount();
  }

  searchCarrier() {
    // let data = this.carriers;
    // let key = this.keyFilterUser;

    // if (TDSHelperString.hasValueString(key)) {
    //   key = TDSHelperString.stripSpecialChars(key.trim());
    // }
    // data = data.filter((x) =>
    //   (x.Name && TDSHelperString.stripSpecialChars(x.Name.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(key.toLowerCase())) !== -1))
    // this.lstCarriers = data
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
              this.message.error(error.error_description || error.message);
              reject(error);
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

    this.calculateFee(this.saleModel.Carrier);
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

  onEditPartner() {
    this.isEditPartner = !this.isEditPartner;
  }

  changeUser(user:ApplicationUserDTO){
    // this._form.controls['User'].setValue(user);
  }

  onSaveOrder(print: string) {
    // this.isLoading = true;
    // let orderModel = this.prepareOrderModel();

    // this.saleOnline_OrderService.insertFromMessage({model: orderModel})
    //   .pipe(finalize(()=>this.isLoading = false),takeUntil(this.destroy$))
    //   .subscribe((res) => {
    //     this._form.controls["Id"].setValue(res.Id);
    //     this._form.controls["PartnerId"].setValue(res.PartnerId);
    //     this.message.success((orderModel.Id && orderModel.Code) ? Message.Order.UpdateSuccess : Message.Order.InsertSuccess);
    //     // this.updatePartner(this.currentTeam?.Facebook_PageId, orderModel.Facebook_ASUserId);
    //     this.partnerService.onLoadPartnerFromTabOrder$.emit(this.data);
    //     if(print === "print") {
    //       this.orderPrintService.printOrder(res, null);
    //     }
    //   }, error => {
    //     this.message.error(`${error?.error?.message}` || JSON.stringify(error));
    //   });
  }

  onSaveInvoice(print:string){


    // let billModel = this.prepareBillModel(); // Bản chất đã change this.saleModel
    // billModel.FormAction = print;
    // this.isLoading = false;

    // if(this.isCheckBillValue(billModel) === 1) {
    //   if(this.checkShipServiceId(billModel) === 1) {
    //     this.isLoading = true;
    //     let that = this;

    //     this.fastSaleOrderService.saveV2(billModel, print === "draft").pipe(takeUntil(this.destroy$)).subscribe(
    //       (bill) => {
    //         bill.Success ? this.message.success(bill.Message || 'Lưu thành công') : this.message.error(bill.Message || 'Lưu thất bại');
    //         // TODO: Cập nhật doanh thu, danh sách phiếu bán hàng gần nhất
    //         this.partnerService.onLoadPartnerFromTabOrder$.emit(this.data);
    //         // this.updatePartner(this.currentTeam?.Facebook_PageId, orderModel.Facebook_ASUserId);
    //         let obs: TDSSafeAny;

    //         switch(print){
    //           case 'draft':
    //           case 'open':
    //             this.isLoading = false;
    //             break;
    //           case 'printOrder':
    //             obs = this.printerService.printUrl(`/fastsaleorder/print?ids=${bill.Data.Id}`);
    //             break;
    //           case 'printShip':
    //             let params = `&carrierId=${bill.Data.CarrierId ?? ''}`;
    //             obs = this.printerService.printUrl(`/fastsaleorder/PrintShipThuan?ids=${bill.Data.Id}${params}`);
    //         }

    //         //TODO: in hóa đơn & in phiếu ship
    //         if (TDSHelperObject.hasValue(obs)) {
    //           obs.pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false)).subscribe((res: TDSSafeAny) => {
    //             that.printerService.printHtml(res);
    //           })
    //         }

    //       },
    //       error => {
    //         this.message.error(`${error?.Message}` || JSON.stringify(error));
    //         this.isLoading = false;
    //       });
    //   }
    // }
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

  showModalAddProduct() {
    const modal = this.modal.create({
        title: 'Thêm sản phẩm',
        content: TpageAddProductComponent,
        size: "xl",
        viewContainerRef: this.viewContainerRef
    });

    modal.componentInstance?.onLoadedProductSelect
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        // let product = this.convertDetailSelect(res);
        // this.selectProduct(product);
      });
  }

  showModalAddPromotion(){
    this.modal.create({
      title: 'Chọn khuyến mãi',
      content: ModalApplyPromotionComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef
    });
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
      size: 'xl',
      componentParams: {
        useListPrice: true,
        isSelectProduct: true
      }
    });

    modal.componentInstance?.selectProduct.pipe(takeUntil(this.destroy$)).subscribe((res: DataPouchDBDTO) =>{
      if(TDSHelperObject.hasValue(res)) {
        // let product = this.convertDetail(res);
        // this.selectProduct(product);
      }
    });
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

    modal.componentInstance?.onSuccess.pipe(takeUntil(this.destroy$)).subscribe(res => {
      // this._form.controls.Tax.setValue(res);
      // this.updateTotalAmount();
    });
  }

  visibleChange($event: TDSSafeAny) {
    console.log($event)
  }

  closePriceDetail() {
    this.visibleIndex = -1;
  }

  onChangePrice(event: number, item: TDSSafeAny, index: number) {
    this.visibleIndex = index;
    let exit = this.quickOrderModel.Details[index]?.Id == item.Id;

    if(exit) {
        this.quickOrderModel.Details[index].Price = event;
        this.calcTotal();
        this.coDAmount();
    }
  }

  onChangeQuantity(event: any, item: TDSSafeAny, index: number) {
    this.visibleIndex = index;
    let exit = this.quickOrderModel.Details[index]?.Id == item.Id;

    if(exit) {
        this.quickOrderModel.Details[index].Quantity = event;
        this.calcTotal();
        this.coDAmount();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
