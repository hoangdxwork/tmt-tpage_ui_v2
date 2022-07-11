import { ChangeDetectorRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewContainerRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Message } from 'src/app/lib/consts/message.const';
import { CheckAddressDTO } from 'src/app/main-app/dto/address/address.dto';
import { CalculateFeeResponse_Data_ServiceDTO, CalculateFeeResponse_Data_Service_ExtraDTO, DeliveryCarrierDTO } from 'src/app/main-app/dto/carrier/delivery-carrier.dto';
import { ConversationMatchingItem } from 'src/app/main-app/dto/conversation-all/conversation-all.dto';
import { ConversationOrderForm, ConversationOrderProductDefaultDTO, SaleOnline_Facebook_CommentFilterResultDTO } from 'src/app/main-app/dto/coversation-order/conversation-order.dto';
import { DataPouchDBDTO } from 'src/app/main-app/dto/product-pouchDB/product-pouchDB.dto';
import { SaleOnline_OrderDTO } from 'src/app/main-app/dto/saleonlineorder/sale-online-order.dto';
import { FastSaleOrderRestDTO } from 'src/app/main-app/dto/saleonlineorder/saleonline-order-red.dto';
import { SaleSettingsDTO } from 'src/app/main-app/dto/setting/setting-sale-online.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { ApplicationUserDTO } from 'src/app/main-app/dto/user/application-user.dto';
import { ApplicationUserService } from 'src/app/main-app/services/application-user.service';
import { CommonService } from 'src/app/main-app/services/common.service';
import { DraftMessageService } from 'src/app/main-app/services/conversation/draft-message.service';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { DeliveryCarrierService } from 'src/app/main-app/services/delivery-carrier.service';
import { ConversationEventFacade } from 'src/app/main-app/services/facades/conversation-event.facade';
import { ConversationOrderFacade } from 'src/app/main-app/services/facades/conversation-order.facade';
import { GeneralConfigsFacade } from 'src/app/main-app/services/facades/general-config.facade';
import { FacebookCommentService } from 'src/app/main-app/services/facebook-comment.service';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { CarrierHandler } from 'src/app/main-app/services/handlers/carier.handler';
import { CheckFormHandler } from 'src/app/main-app/services/handlers/check-form.handler';
import { OrderFormHandler } from 'src/app/main-app/services/handlers/order-form.handler';
import { SaleHandler } from 'src/app/main-app/services/handlers/sale.handler';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { OrderPrintService } from 'src/app/main-app/services/print/order-print.service';
import { PrinterService } from 'src/app/main-app/services/printer.service';
import { SaleOnline_FacebookCommentService } from 'src/app/main-app/services/sale-online-facebook-comment.service';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { TpageAddProductComponent } from 'src/app/main-app/shared/tpage-add-product/tpage-add-product.component';
import { TpageConfigProductComponent } from 'src/app/main-app/shared/tpage-config-product/tpage-config-product.component';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { ModalListProductComponent } from '../modal-list-product/modal-list-product.component';
import { ModalTaxComponent } from '../modal-tax/modal-tax.component';

@Component({
  selector: 'post-order',
  templateUrl: './post-order.component.html'
})
export class PostOrderComponent implements OnInit, OnChanges, OnDestroy {

  @Input() data!: ConversationMatchingItem;
  @Input() team!: CRMTeamDTO;

  @Output() currentOrderCode = new EventEmitter<string | undefined>();

  orderForm!: FormGroup;
  private destroy$ = new Subject<void>();

  editNoteProduct: string | null = null;

  isLoading: boolean = false;
  isLoadingCarrier: boolean = false;

  isEnableCreateOrder: boolean = false;
  isEnableInsuranceFee: boolean = false;

  currentTeam!: CRMTeamDTO | null;
  lstUser!: Array<ApplicationUserDTO>;
  lstCarriers: DeliveryCarrierDTO[] = [];
  lstShipServices: CalculateFeeResponse_Data_ServiceDTO[] = []; //  Dịch vụ bổ xung
  lstComment: SaleOnline_Facebook_CommentFilterResultDTO[] = [];

  saleModel!: FastSaleOrderRestDTO;
  shipExtraServices: CalculateFeeResponse_Data_Service_ExtraDTO[] = [];
  saleSettings!: SaleSettingsDTO;

  visibleIndex: number = -1;
  detailEdit?: TDSSafeAny;

  constructor(
    private message: TDSMessageService,
    private draftMessageService: DraftMessageService,
    private conversationEventFacade: ConversationEventFacade,
    private conversationOrderFacade: ConversationOrderFacade,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private applicationUserService: ApplicationUserService,
    private crmService: CRMTeamService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private checkFormHandler: CheckFormHandler,
    private modalService: TDSModalService,
    private generalConfigsFacade: GeneralConfigsFacade,
    private commonService: CommonService,
    private deliveryCarrierService: DeliveryCarrierService,
    private crmTeamService: CRMTeamService,
    private partnerService: PartnerService,
    private fastSaleOrderService: FastSaleOrderService,
    private orderPrintService: OrderPrintService,
    private printerService: PrinterService,
    private orderFormHandler: OrderFormHandler,
    private carrierHandler: CarrierHandler,
    private viewContainerRef: ViewContainerRef,
    private saleHandler: SaleHandler,
    private facebookCommentService: FacebookCommentService,
    private saleOnline_FacebookCommentService: SaleOnline_FacebookCommentService,
    private router: Router) {
  }

  get detailsFormGroups() {
    return (this.orderForm?.get("Details") as FormArray);
  }

  ngOnInit(): void {
    this.createForm();
    this.createSaleModel();
    this.loadConfig();
    this.loadOrder();
    this.loadUsers();
    this.loadCarrier();
    this.loadCurrentTeam();
  }

  createForm(): void {
    this.orderForm = this.orderFormHandler.createOrderFormGroup();
  }

  resetForm(): void {
    this.orderForm.reset({
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
  }

  createSaleModel() {
    this.orderFormHandler.createBillDefault().subscribe(res => {
      this.saleModel = res;

      this.updateShipExtraServices(res.Carrier);
      this.updateOrderFormByBill(res);
    });
  }

  updateOrderFormByBill(bill: FastSaleOrderRestDTO) {
    this.orderForm.controls.Carrier?.setValue(bill.Carrier);
    this.orderForm.controls.Tax?.setValue(bill.Tax);
    this.saleModel.CashOnDelivery = this.orderForm.value.TotalAmountBill || 0;
  }

  loadUsers() {
    this.applicationUserService.getActive().subscribe(res => {
      this.lstUser = res.value;
    });
  }

  loadOrder() {
    this.conversationOrderFacade.onOrderCheckPost$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.updateFormOrder(res);
      this.updateBillByForm(this.orderForm);
      this.currentOrderCode.emit(res?.Code);
      this.loadCommentPartner(res.Facebook_ASUserId, res.Facebook_PostId);
      this.isLoading = false;
    });
  }

  loadConfig() {
    this.generalConfigsFacade.getSaleConfigs().subscribe(res => {
      this.saleSettings = res?.SaleSetting;
    });
  }

  loadCarrier() {
    this.deliveryCarrierService.dataCarrierActive$.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.lstCarriers = res;
    });
  }

  loadCurrentTeam() {
    this.crmTeamService.onChangeTeam().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.currentTeam = res;
    });
  }

  loadCommentPartner(psid: string, postId: string) {
    this.saleOnline_FacebookCommentService.getCommentsByUserAndPost(psid, postId).subscribe(res => {
      this.lstComment = res?.value;
    }, error => {
      this.lstComment = [];
    })
  }


  updateFormOrder(order: ConversationOrderForm) {
    this.resetForm();

    let details = new FormArray([]);

    if (order["Details"] && order["Details"].length > 0) {
      order["Details"].forEach(detail => {
        details.push(this.fb.group(detail));
      });
    }

    this.orderForm.patchValue(order);
    this.orderForm.setControl("Details", details);

    this.updateTotalAmount();
  }

  onChangeCarrier(carrier: DeliveryCarrierDTO) {
    this.isLoadingCarrier = true;
    this.shipExtraServices.length = 0;
    this.lstShipServices.length = 0;
    this.isEnableInsuranceFee = false;

    this.carrierHandler.changeCarrierV2(this.saleModel, this.orderForm, carrier, this.shipExtraServices)
      .pipe(finalize(() => this.isLoadingCarrier = false))
      .subscribe(res => {
        this.lstShipServices = res?.Services || [];
        this.updateShipExtraServices(carrier);

      }, error => {
          this.message.error(error?.error_description ? error.error_description : JSON.stringify(error));
      });
  }

  updateShipExtraServices(carrier: DeliveryCarrierDTO | undefined) {
    if(carrier) {
      let insuranceFee = this.orderForm.value.Ship_Extras?.InsuranceFee || 0;

      this.isEnableInsuranceFee = this.carrierHandler.getShipExtraServices(carrier, this.shipExtraServices);
      this.isEnableInsuranceFee && (this.orderForm.controls.Ship_InsuranceFee.setValue(insuranceFee));
    }
  }

  removeDetail(index: number) {
    const control = this.orderForm.controls["Details"] as FormArray;
    control.removeAt(index);

    this.updateTotalAmount();
  }

  updateTotalAmount() {
    this.saleHandler.updateTotalAmount(this.orderForm);
    this.updateTotalAmountByOrderForm();
  }

  updateTotalAmountByOrderForm() {
    let formValue = this.orderForm.value;

    if(this.saleModel) {
      this.saleModel.AmountTotal = formValue.TotalAmountBill;
      let coDAmount = this.saleModel.AmountTotal + this.saleModel.DeliveryPrice - this.saleModel.AmountDeposit;
      this.saleModel.CashOnDelivery = coDAmount;
    }
  }

  onSave(print?: string) {
    this.isLoading = true;
    let orderModel = this.prepareOrderModel();

    this.saleOnline_OrderService.insertFromMessage({model: orderModel})
      .subscribe(res => {
        this.orderForm.controls["Id"].setValue(res.Id);
        this.orderForm.controls["PartnerId"].setValue(res.PartnerId);

        if (!this.isEnableCreateOrder) {
          if(print == "print") {
            this.orderPrintService.printOrder(res, null);
          }

          if(orderModel.Id && orderModel.Code) {
            this.message.success(Message.Order.UpdateSuccess);
          }
          else {
            this.message.success(Message.Order.InsertSuccess);
          }

          this.isLoading = false;
          // this.updatePartner(this.currentTeam?.Facebook_PageId, orderModel.Facebook_ASUserId);
          this.partnerService.onLoadPartnerFromTabOrder$.emit(this.data);
        }
        else {
          let billModel = this.prepareBillModel(); // Bản chất đã change this.saleModel
          billModel.FormAction = print;

          this.isLoading = false;

          if(this.isCheckBillValue(billModel) === 1) {
            if(this.checkShipServiceId(billModel) === 1) {
              let isDraft = print == "draft" ?  true : false;

              this.isLoading = true;
              this.fastSaleOrderService.saveV2(billModel, isDraft)
                .pipe(finalize(() => this.isLoading = false))
                .subscribe(bill => {
                  this.message.success(Message.Bill.InsertSuccess);
                  // TODO: Cập nhật doanh thu, danh sách phiếu bán hàng gần nhất

                  if (print == "print") {
                    this.printerService.printUrl(`/fastsaleorder/print?ids=${bill.Data.Id}`);
                  }

                  if (print == "printShip") {
                    let params = "";
                    bill.Data.CarrierId && (params = `&carrierId=${bill.Data.CarrierId}`);
                    this.printerService.printUrl(`/fastsaleorder/PrintShipThuan?ids=${bill.Data.Id}${params}`);
                  }

                  this.partnerService.onLoadPartnerFromTabOrder$.emit(this.data);
                  // this.updatePartner(this.currentTeam?.Facebook_PageId, orderModel.Facebook_ASUserId);
                }, error => {
                  this.message.error(`${error?.error?.message}` || JSON.stringify(error));
                });
            }
          }
        }
      }, error => {
        this.isLoading = false;
        this.message.error(`${error?.error?.message}` || JSON.stringify(error));
      });
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
        okText: "Xác nhận",
        cancelText: "Hủy bỏ",
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
    this.carrierHandler.calculateFee(this.saleModel, this.orderForm, carrier, this.shipExtraServices)
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
          this.partnerService.onLoadOrderFromTabPartner$.next(res.Data);
        });
    }
    else {
      this.message.error(Message.Order.LoadUpdatePartnerFail);
    }
  }

  prepareOrderModel(): SaleOnline_OrderDTO {
    let model = this.checkFormHandler.prepareOrder(this.orderForm);

    if(!TDSHelperString.hasValueString(model.Facebook_ASUserId)) {
      model.Facebook_ASUserId = this.data?.psid;
    }

    return model;
  }

  prepareBillModel(): FastSaleOrderRestDTO {
    let model = this.checkFormHandler.prepareBill(this.orderForm, this.saleModel, this.shipExtraServices);
    return model;
  }

  updateBillByForm(form: FormGroup) {
    let formValue = form.value;

    if(this.saleModel) {
      this.saleModel.Address = formValue.Address || formValue.Street;

      if (this.saleModel?.Address) {
        this.saleModel.Ship_Receiver = {
          Name: formValue["Name"],
          FullAddress: formValue["Address"],
          Street: formValue["Address"],
          Phone: formValue["Telephone"],
          City: formValue["City"],
          District: formValue["District"],
          Ward: formValue["Ward"],
        };
      }
      else {
        this.saleModel.Ship_Receiver = null;
      }
    }
  }

  onSelectShipService(shipService: TDSSafeAny) {
    // this.isLoadingCarrier = true;

    // !this.shipExtraServices && (this.shipExtraServices = []);
    // this.carrierHandler.selectShipService(shipService, this.saleModel, this.shipExtraServices);

    // if (this.saleModel.Carrier?.DeliveryType === 'GHN') {
    //   this.onUpdateInsuranceFee('16')
    //     .pipe((finalize(() => this.isLoadingCarrier = false)))
    //     .subscribe(res => {});
    // }
    // else {
    //   this.isLoadingCarrier = false;
    // }
  }

  calcFee() {
    if (!this.saleModel.Carrier || !this.saleModel.Carrier.Id) {
      this.message.error(Message.Carrier.EmptyCarrier);
      return;
    }

    this.calculateFee(this.saleModel.Carrier);
  }

  onUpdateInsuranceFee(serviceId: any) {
    // return this.carrierHandler.onUpdateInsuranceFee(serviceId, this.saleModel, this.orderForm, this.shipExtraServices);
  }

  onChangeExtraService(extra: TDSSafeAny) {
    // this.isLoadingCarrier = true;
    // this.carrierHandler.onCheckExtraService(extra, this.lstShipServices, this.saleModel, this.orderForm, this.shipExtraServices)
    //   .pipe(finalize(() => this.isLoadingCarrier = false))
    //   .subscribe(res => {
    //     if(res != null)  this.isEnableInsuranceFee = res;
    //   });
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
        viewContainerRef: this.viewContainerRef,
        componentParams: {
          typeComponent: null,
        }
    });

    modal.componentInstance?.onLoadedProductSelect
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        let product = this.convertDetailSelect(res);
        this.selectProduct(product);
      });
  }

  showModalConfigProduct() {
    const modal = this.modalService.create({
        title: 'Cấu hình sản phẩm',
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
      size: 'xl'
    });

    modal.afterClose.subscribe((res: DataPouchDBDTO) =>{
      if(TDSHelperObject.hasValue(res)) {
        let product = this.convertDetail(res);
        this.selectProduct(product);
      }
    });
  }

  selectProduct(product: ConversationOrderProductDefaultDTO) {
    let formDetail = this.orderForm.value.Details;
    let quantity = 1;

    let findProduct = formDetail.find((x: any) =>
        x.ProductId == product.ProductId &&
        x.Price == product.Price &&
        x.UOMId == product.UOMId
    );

    if(TDSHelperObject.hasValue(findProduct)) {
      findProduct.Quantity++;
      quantity = findProduct.Quantity;
      (this.orderForm?.get("Details") as FormArray).patchValue(formDetail);
    }
    else {
      (this.orderForm?.get("Details") as FormArray).push(this.fb.group(product));
    }

    this.updateTotalAmount();
    this.message.success(`Đã thêm ${quantity} ${product.UOMName}. ${product.ProductNameGet}`)
  }

  convertDetail(product: DataPouchDBDTO): ConversationOrderProductDefaultDTO {
    let result = {} as ConversationOrderProductDefaultDTO;

    result.Note = "";
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
    let formControls = this.orderForm.controls;

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

  addTextAddress(comment: SaleOnline_Facebook_CommentFilterResultDTO) {
    comment.selected = !comment.selected;

    let findSelected = this.lstComment.filter(x => x.selected);

    if(TDSHelperArray.hasListValue(findSelected)) {
      let text = findSelected.map(x => x.message).join(" ");
      this.orderForm.controls.Street.setValue(text);
    }
    else {
      this.orderForm.controls.Street.setValue(this.data?.address);
    }
  }

  showModalTax() {
    const modal = this.modalService.create({
      title: 'Danh sách thuế',
      content: ModalTaxComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'xl',
      componentParams: {
        currentTax: this.orderForm.value.Tax
      }
    });

    modal.componentInstance?.onSuccess.subscribe(res => {
      this.orderForm.controls.Tax.setValue(res);
      this.updateTotalAmount();
    });
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
    let formDetail = this.orderForm.value.Details;

    let findProduct = formDetail.find((x: any, index: number) =>
      x.ProductId == this.detailEdit.ProductId &&
      index == this.visibleIndex &&
      x.UOMId == this.detailEdit.UOMId
    );

    if(findProduct) {
      findProduct.Price = this.detailEdit.Price;
    }

    (this.orderForm?.get("Details") as FormArray).patchValue(formDetail);
    this.updateTotalAmount();
    this.visibleIndex = -1;
  }

  changeQuantityDetail(detail: TDSSafeAny, isMinus: boolean) {
    let formDetail = this.orderForm.value.Details;

    let findProduct = formDetail.find((x: any) =>
        x.ProductId == detail.ProductId &&
        x.Price == detail.Price &&
        x.UOMId == detail.UOMId
    );

    if(findProduct) {
      if(isMinus) (findProduct?.Quantity > 1) && (findProduct.Quantity--)
      else (findProduct.Quantity++)
    }

    (this.orderForm?.get("Details") as FormArray).patchValue(formDetail);
    this.updateTotalAmount();
  }


  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes.data);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
