import { ModalApplyPromotionComponent } from './../modal-apply-promotion/modal-apply-promotion.component';
import { OnDestroy } from '@angular/core';
import { SaleSettingsDTO } from './../../../../dto/setting/setting-sale-online.dto';
import { Component, Input, OnInit, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subject, Observable, takeUntil, finalize } from 'rxjs';
import { ConversationMatchingItem } from 'src/app/main-app/dto/conversation-all/conversation-all.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ConversationOrderFacade } from 'src/app/main-app/services/facades/conversation-order.facade';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { ConversationOrderForm, ConversationOrderProductDefaultDTO } from 'src/app/main-app/dto/coversation-order/conversation-order.dto';
import { ApplicationUserService } from 'src/app/main-app/services/application-user.service';
import { ApplicationUserDTO } from 'src/app/main-app/dto/account/application-user.dto';
import { CheckFormHandler } from 'src/app/main-app/services/handlers/check-form.handler';
import { GeneralConfigsFacade } from 'src/app/main-app/services/facades/general-config.facade';
import { DeliveryCarrierService } from 'src/app/main-app/services/delivery-carrier.service';
import { CalculateFeeResponse_Data_ServiceDTO, CalculateFeeResponse_Data_Service_ExtraDTO, DeliveryCarrierDTO } from 'src/app/main-app/dto/carrier/delivery-carrier.dto';
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
import { FastSaleOrder_DefaultDTOV2 } from 'src/app/main-app/dto/fastsaleorder/fastsaleorder-default.dto';

@Component({
    selector: 'conversation-order',
    templateUrl: './conversation-order.component.html'
})

export class ConversationOrderComponent  implements OnInit, OnDestroy {

  @Input() data!: ConversationMatchingItem;
  @Input() team!: CRMTeamDTO;

  @Output() currentOrderCode = new EventEmitter<string | undefined>();

  _form!: FormGroup;
  editNoteProduct: string | null = null;

  isLoading: boolean = false;
  isLoadingCarrier: boolean = false;
  isEditPartner: boolean = false;
  isEnableOrder: boolean = false;
  isEnableInsuranceFee: boolean = false;

  currentTeam!: CRMTeamDTO | null;
  lstUser!: Array<ApplicationUserDTO>;
  lstCarriers: DeliveryCarrierDTO[] = [];
  lstShipServices: CalculateFeeResponse_Data_ServiceDTO[] = []; //  Dịch vụ bổ xung

  saleModel!: FastSaleOrder_DefaultDTOV2;
  shipExtraServices: CalculateFeeResponse_Data_Service_ExtraDTO[] = [];
  saleSettings!: SaleSettingsDTO;

  visibleIndex: number = -1;
  detailEdit?: ConversationOrderProductDefaultDTO;
  detailDiscount:number = 0;

  carriers:DeliveryCarrierDTO[] = [];
  keyFilterUser: string = '';
  isOpenCarrier = false;

  numberWithCommas =(value:TDSSafeAny) =>{
    if(value != null)
    {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return value
  };
  parserComas = (value: TDSSafeAny) =>{
    if(value != null)
    {
      return TDSHelperString.replaceAll(value,',','');
    }
    return value
  };

  private destroy$ = new Subject<void>();

  constructor(
    private message: TDSMessageService,
    private conversationOrderFacade: ConversationOrderFacade,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private applicationUserService: ApplicationUserService,
    private fb: FormBuilder,
    private checkFormHandler: CheckFormHandler,
    private modalService: TDSModalService,
    private generalConfigsFacade: GeneralConfigsFacade,
    private deliveryCarrierService: DeliveryCarrierService,
    private crmTeamService: CRMTeamService,
    private partnerService: PartnerService,
    private fastSaleOrderService: FastSaleOrderService,
    private orderPrintService: OrderPrintService,
    private printerService: PrinterService,
    private _formHandler: OrderFormHandler,
    private carrierHandler: CarrierHandler,
    private viewContainerRef: ViewContainerRef,
    private saleHandler: SaleHandler) {
      this.createForm();
  }

  get detailsFormGroups() {
    return (this._form?.get("Details") as FormArray);
  }

  ngOnInit(): void {
    this.createSaleModel();
    this.loadConfig();
    this.loadOrder();
    this.loadUsers();
    this.loadCarrier();
    this.loadCurrentTeam();
    this.eventAddProduct();
  }

  eventAddProduct() {
    this.conversationOrderFacade.onAddProductOrder.pipe(takeUntil(this.destroy$)).subscribe(res => {
      let product = this.convertDetail(res);
      this.selectProduct(product);
    });
  }

  createForm(): void {
    this._form = this._formHandler.createOrderFormGroup();
  }

  createSaleModel() {
    this._formHandler.createBillDefault().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.saleModel = res;

      if(res.Carrier) {
        this.updateShipExtraServices(res.Carrier);
      }
      this.update_formByBill(res);
    });
  }

  update_formByBill(bill: FastSaleOrder_DefaultDTOV2) {
    this._form.controls.Carrier?.setValue(bill.Carrier);
    this._form.controls.Tax?.setValue(bill.Tax);
    this.saleModel.CashOnDelivery = this._form.value.TotalAmountBill || 0;
  }

  loadUsers() {
    this.applicationUserService.getActive().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.lstUser = res.value;
    });
  }

  loadOrder() {
    this.conversationOrderFacade.onLastOrderCheckCvs$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.updateFormOrder(res);
      this.updateBillByForm(this._form);
      this.currentOrderCode.emit(res?.Code);
    });
  }

  loadConfig() {
    this.generalConfigsFacade.getSaleConfigs().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.saleSettings = res?.SaleSetting;
    });
  }

  loadCarrier() {
    this.deliveryCarrierService.dataCarrierActive$.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.lstCarriers = res;
      this.carriers = res;
    });
  }

  loadCurrentTeam() {
    this.crmTeamService.onChangeTeam().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.currentTeam = res;
    });
  }

  updateFormOrder(order: ConversationOrderForm) {
    this._form.reset({
      Id: [null],
      Code: [null],
      LiveCampaignId: [null],
      Facebook_UserId: [null],
      Facebook_ASUserId: [null],
      Facebook_UserName: [null],
      Facebook_CommentId: [null],
      Facebook_PostId: [null],
      PartnerId: [null],
      PartnerName: [null],
      Name: [null],
      Email: [null],
      TotalAmount: [0],
      TotalQuantity: [0],
      Street: [null],
      City: [null],
      District: [null],
      Ward: [null],
      User: [null],
      Telephone: [null],
      Note: [null],
      CRMTeamId: [null],
      PrintCount: [null],
      Session: [null],
      SessionIndex: [null],
      StatusText: [null],
      Details: this.fb.array([]),
    });
    order.Facebook_UserName = this.data?.name;
    this.visibleIndex = -1;

    let details = new FormArray([]);

    //TODO: thêm danh sách sản phẩm vào form
    if (order["Details"] && order["Details"].length > 0) {
      order["Details"].forEach(detail => {
        details.push(this.fb.group(detail));
      });
    }
    this._form.patchValue(order);
    this._form.setControl("Details", details);
    this.updateTotalAmount();
  }

  searchCarrier() {
    let data = this.carriers;
    let key = this.keyFilterUser;

    if (TDSHelperString.hasValueString(key)) {
      key = TDSHelperString.stripSpecialChars(key.trim());
    }
    data = data.filter((x) =>
      (x.Name && TDSHelperString.stripSpecialChars(x.Name.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(key.toLowerCase())) !== -1))
    this.lstCarriers = data
  }

  onVisibleChange(){
    this.isOpenCarrier = true;
  }

  onChangeCarrier(carrier: DeliveryCarrierDTO) {
    this.isLoadingCarrier = true;
    this.shipExtraServices.length = 0;
    this.lstShipServices.length = 0;
    this.isEnableInsuranceFee = false;

    this.carrierHandler.changeCarrierV2(this.saleModel, this._form, carrier, this.shipExtraServices)
      .pipe(finalize(() => {this.isLoadingCarrier = false; this.isOpenCarrier = false;}))
      .subscribe(res => {
        this.lstShipServices = res?.Services || [];
        this.updateShipExtraServices(carrier);
      }, error => {
          this.message.error(error?.error_description ? error.error_description : JSON.stringify(error));
      });
  }

  updateShipExtraServices(carrier: any) {
    if(carrier) {
      let insuranceFee = this._form.value.Ship_Extras?.InsuranceFee || 0;

      this.isEnableInsuranceFee = this.carrierHandler.getShipExtraServices(carrier, this.shipExtraServices);
      this.isEnableInsuranceFee && (this._form.controls.Ship_InsuranceFee.setValue(insuranceFee));
    }
  }

  onEditPartner() {
    this.isEditPartner = !this.isEditPartner;
  }

  changeUser(user:ApplicationUserDTO){
    this._form.controls['User'].setValue(user);
  }

  removeDetail(index: number) {
    const control = this._form.controls["Details"] as FormArray;
    control.removeAt(index);
    this.updateTotalAmount();
  }

  updateTotalAmount() {
    let that = this;

    this.saleHandler.updateTotalAmount(that._form);
    this.updateTotalAmountBy_form();
  }

  updateTotalAmountBy_form() {
    let formValue = this._form.value;

    if(this.saleModel) {
      this.saleModel.AmountTotal = formValue.TotalAmountBill;
      let coDAmount = this.saleModel.AmountTotal + this.saleModel.DeliveryPrice - this.saleModel.AmountDeposit;
      this.saleModel.CashOnDelivery = coDAmount;
    }
  }

  onSaveOrder(print: string) {
    this.isLoading = true;
    let orderModel = this.prepareOrderModel();

    this.saleOnline_OrderService.insertFromMessage({model: orderModel})
      .pipe(finalize(()=>this.isLoading = false),takeUntil(this.destroy$))
      .subscribe((res) => {
        this._form.controls["Id"].setValue(res.Id);
        this._form.controls["PartnerId"].setValue(res.PartnerId);
        this.message.success((orderModel.Id && orderModel.Code) ? Message.Order.UpdateSuccess : Message.Order.InsertSuccess);
        // this.updatePartner(this.currentTeam?.Facebook_PageId, orderModel.Facebook_ASUserId);
        this.partnerService.onLoadPartnerFromTabOrder.emit(this.data);
        if(print === "print") {
          this.orderPrintService.printOrder(res, null);
        }
      }, error => {
        this.message.error(`${error?.error?.message}` || JSON.stringify(error));
      });
  }

  onSaveInvoice(print:string){
    let billModel = this.prepareBillModel(); // Bản chất đã change this.saleModel
    // billModel.FormAction = print;
    this.isLoading = false;

    if(this.isCheckBillValue(billModel) === 1) {
      if(this.checkShipServiceId(billModel) === 1) {
        this.isLoading = true;
        let that = this;

        this.fastSaleOrderService.saveV2(billModel, print === "draft").pipe(takeUntil(this.destroy$)).subscribe(
          (bill) => {
            bill.Success ? this.message.success(bill.Message || 'Lưu thành công') : this.message.error(bill.Message || 'Lưu thất bại');
            // TODO: Cập nhật doanh thu, danh sách phiếu bán hàng gần nhất
            this.partnerService.onLoadPartnerFromTabOrder.emit(this.data);
            // this.updatePartner(this.currentTeam?.Facebook_PageId, orderModel.Facebook_ASUserId);
            let obs: TDSSafeAny;

            switch(print){
              case 'draft':
              case 'open':
                this.isLoading = false;
                break;
              case 'printOrder':
                obs = this.printerService.printUrl(`/fastsaleorder/print?ids=${bill.Data.Id}`);
                break;
              case 'printShip':
                let params = `&carrierId=${bill.Data.CarrierId ?? ''}`;
                obs = this.printerService.printUrl(`/fastsaleorder/PrintShipThuan?ids=${bill.Data.Id}${params}`);
            }
            //TODO: in hóa đơn & in phiếu ship
            if (TDSHelperObject.hasValue(obs)) {
              obs.pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false)).subscribe((res: TDSSafeAny) => {
                that.printerService.printHtml(res);
              })
            }
          },
          error => {
            this.message.error(`${error?.Message}` || JSON.stringify(error));
            this.isLoading = false;
          });
      }
    }
  }

  isCheckBillValue(model: TDSSafeAny): number {
    let errorMessage = this.checkFormHandler.checkValueBill(model);

    if(TDSHelperString.hasValueString(errorMessage) && errorMessage) {
      this.message.error(errorMessage);
      return 0;
    }

    return 1;
  }

  checkShipServiceId(model: TDSSafeAny) {
    let result = this.checkFormHandler.checkShipServiceId(model);

    if(result === 0) {
      const modal = this.modalService.error({
        title: 'Xác nhận đối tác',
        content: 'Đối tác chưa có dịch vụ bạn hãy bấm [Ok] để tìm dịch vụ.\nHoặc [Cancel] để tiếp tục.\nSau khi tìm dịch vụ bạn hãy xác nhận lại.',
        iconType: 'tdsi-trash-fill',
        okText: "Ok",
        cancelText: "Cancel",
        onOk: () => {
          this.calculateFee(model.Carrier);
        },
        onCancel: () => {
          modal.close();
        },
      });
    }

    return result;
  }

  calculateFee(carrier: TDSSafeAny) {
    this.isLoadingCarrier = true;

    this.carrierHandler.calculateFee(this.saleModel, this._form, carrier, this.shipExtraServices)
      .pipe(finalize(() => this.isLoadingCarrier = false))
      .subscribe(res => {
        this.lstShipServices = res?.Services || [];
      }, error => {
        this.message.error(error?.error_description ? error.error_description : JSON.stringify(error));
      });
  }

  updatePartner(pageId: string | undefined, psid: string) {
    if(pageId && TDSHelperString.hasValueString(psid)) {
      this.isLoading = true;

      this.partnerService.checkConversation(pageId, psid)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe(res => {
          this.partnerService.onLoadOrderFromTabPartner.next(res.Data);
        });
    }
    else {
      this.message.error(Message.Order.LoadUpdatePartnerFail);
    }
  }

  prepareOrderModel(): SaleOnline_OrderDTO {
    let model = this.checkFormHandler.prepareOrder(this._form);

    if(!TDSHelperString.hasValueString(model.Facebook_ASUserId)) {
      model.Facebook_ASUserId = this.data?.psid;
    }
    return model;
  }

  prepareBillModel(): FastSaleOrder_DefaultDTOV2 {
    let billModel:any = this.saleModel;
    delete billModel["@odata.context"];
    let model = this.checkFormHandler.prepareBill(this._form, billModel, this.shipExtraServices);
    return model;
  }

  updateBillByForm(form: FormGroup) {
    let formValue = form.value;

    if(this.saleModel) {
      this.saleModel.Address = formValue.Address || formValue.Street;
      if (this.saleModel?.Address) {
        this.saleModel.Ship_Receiver = {
          Name: formValue["Name"],
          Street: formValue["Address"],
          Phone: formValue["Telephone"],
          City: formValue["City"],
          District: formValue["District"],
          Ward: formValue["Ward"],
        };
      }
    }
  }

  onSelectShipService(shipService: TDSSafeAny) {
    this.isLoadingCarrier = true;

    !this.shipExtraServices && (this.shipExtraServices = []);
    this.carrierHandler.selectShipService(shipService, this.saleModel, this.shipExtraServices);

    if (this.saleModel.Carrier?.DeliveryType === 'GHN') {
      this.onUpdateInsuranceFee('16')
        .pipe((finalize(() => this.isLoadingCarrier = false)))
        .subscribe(res => {});
    }
    else {
      this.isLoadingCarrier = false;
    }
  }

  calcFee() {
    if (!this.saleModel.Carrier || !this.saleModel.Carrier.Id) {
      this.message.error(Message.Carrier.EmptyCarrier);
      return;
    }

    this.calculateFee(this.saleModel.Carrier);
  }

  onUpdateInsuranceFee(serviceId: any): Observable<any> {
    return this.carrierHandler.onUpdateInsuranceFee(serviceId, this.saleModel, this._form, this.shipExtraServices);
  }

  onChangeExtraService(extra: TDSSafeAny) {
    this.isLoadingCarrier = true;
    this.carrierHandler.onCheckExtraService(extra, this.lstShipServices, this.saleModel, this._form, this.shipExtraServices)
      .pipe(finalize(() => this.isLoadingCarrier = false))
      .subscribe(res => {
        if(res != null)  this.isEnableInsuranceFee = res;
      });
  }

  startEdit(id: string): void {
    this.editNoteProduct = id;
  }

  stopEdit(): void {
    this.editNoteProduct = null;
  }

  showModalAddProduct() {
    const modal = this.modalService.create({
        title: 'Thêm sản phẩm',
        content: TpageAddProductComponent,
        size: "xl",
        viewContainerRef: this.viewContainerRef
    });

    modal.componentInstance?.onLoadedProductSelect
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        let product = this.convertDetailSelect(res);
        this.selectProduct(product);
      });
  }

  showModalAddPromotion(){
    this.modalService.create({
      title: 'Chọn khuyến mãi',
      content: ModalApplyPromotionComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef
    });
  }

  showModalConfigProduct() {
    this.modalService.create({
        title: 'Chọn bảng giá',
        content: TpageConfigProductComponent,
        size: "lg",
        viewContainerRef: this.viewContainerRef
    });
  }

  showModalListProduct(){
    const modal = this.modalService.create({
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
        let product = this.convertDetail(res);
        this.selectProduct(product);
      }
    });
  }

  showModalTax() {
    const modal = this.modalService.create({
      title: 'Danh sách thuế',
      content: ModalTaxComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'lg',
      componentParams: {
        currentTax: this._form.value.Tax
      }
    });

    modal.componentInstance?.onSuccess.pipe(takeUntil(this.destroy$)).subscribe(res => {
      this._form.controls.Tax.setValue(res);
      this.updateTotalAmount();
    });
  }

  selectProduct(product: ConversationOrderProductDefaultDTO) {
    let formDetail = this._form.value.Details;
    let quantity = 1;

    let findProduct = formDetail.find((x: any) =>
        x.ProductId == product.ProductId &&
        x.Price == product.Price &&
        x.UOMId == product.UOMId
    );

    if(TDSHelperObject.hasValue(findProduct)) {
      findProduct.Quantity++;
      quantity = findProduct.Quantity;
      (this._form?.get("Details") as FormArray).patchValue(formDetail);
    }
    else {
      (this._form?.get("Details") as FormArray).push(this.fb.group(product));
    }

    this.updateTotalAmount();
    this.message.success(`Đã thêm ${quantity} ${product.UOMName}. ${product.ProductNameGet}`)
  }

  convertDetail(product: DataPouchDBDTO): ConversationOrderProductDefaultDTO {
    let result = {} as ConversationOrderProductDefaultDTO;

    result.Note = "";
    result.Discount = product.DiscountSale;
    result.Price = product.Price;
    result.ProductCode = product.Barcode;
    result.ProductId = product.Id;
    result.ProductName = product.Name;
    result.ProductNameGet = product.NameGet;
    result.Quantity = 1;
    result.UOMId = product.UOMId;
    result.UOMName = product.UOMName;

    return result;
  }

  convertDetailSelect(product: TDSSafeAny): ConversationOrderProductDefaultDTO {
    let result = {} as ConversationOrderProductDefaultDTO;

    result.Note = "";
    result.Discount = product.Discount;
    result.Price = product.ListPrice;
    result.ProductCode = product.Barcode;
    result.ProductId = product.Id;
    result.ProductName = product.Name;
    result.ProductNameGet = product.NameGet;
    result.Quantity = 1;
    result.UOMId = product.UOMId;
    result.UOMName = product.UOMName;

    return result;
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

  visibleChange($event: TDSSafeAny) {
    console.log($event)
  }

  closePriceDetail() {
    this.visibleIndex = -1;
  }

  openPriceDetail(index: number, detail: TDSSafeAny) {
    this.visibleIndex = index;
    this.detailEdit = Object.assign({}, detail);
  }

  editPriceDetail() {
    const formModel = this._form.controls['Details'].value as ConversationOrderProductDefaultDTO[];

    let indexProduct = formModel.findIndex((x: any, index: number) =>
      x.ProductId == this.detailEdit?.ProductId &&
      index == this.visibleIndex &&
      x.UOMId == this.detailEdit?.UOMId
    );

    if(indexProduct > -1) {
      formModel[indexProduct].Price = this.detailEdit?.Price || 0;
      formModel[indexProduct].Discount = this.detailEdit?.Discount || 0;
    }
    this.updateTotalAmount();
    this.closePriceDetail();
  }

  changeQuantityDetail(detail: TDSSafeAny, isMinus: boolean) {
    const formModel = this._form.controls['Details'].value as ConversationOrderProductDefaultDTO[];

    let indexProduct = formModel.findIndex((x: any) =>
      x.ProductId == detail?.ProductId &&
      x.UOMId == detail?.UOMId
    );

    if(indexProduct > -1) {
      if(isMinus && formModel[indexProduct]?.Quantity > 1){
        formModel[indexProduct].Quantity--;
        this.updateTotalAmount();
      }
      if(!isMinus){
        formModel[indexProduct].Quantity++;
        this.updateTotalAmount();
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
