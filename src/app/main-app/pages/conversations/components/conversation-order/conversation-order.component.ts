import { CommonService } from 'src/app/main-app/services/common.service';
import { User } from 'src/app/main-app/dto/fastsaleorder/fastsaleorder-default.dto';
import { ChangeDetectorRef, Component, Host, Input, OnChanges, OnInit, Optional, SimpleChanges, SkipSelf } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, pipe, Observable } from 'rxjs';
import { ActiveMatchingItem } from 'src/app/main-app/dto/conversation-all/conversation-all.dto';
import { CheckConversationData } from 'src/app/main-app/dto/partner/check-conversation.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { DraftMessageService } from 'src/app/main-app/services/conversation/draft-message.service';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ConversationEventFacade } from 'src/app/main-app/services/facades/conversation-event.facade';
import { ConversationOrderFacade } from 'src/app/main-app/services/facades/conversation-order.facade';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { TDSMessageService, TDSSafeAny, TDSHelperString, TDSHelperObject, TDSModalService } from 'tmt-tang-ui';
import { takeUntil, finalize } from 'rxjs/operators';
import { ConversationOrderForm } from 'src/app/main-app/dto/coversation-order/conversation-order.dto';
import { ApplicationUserService } from 'src/app/main-app/services/application-user.service';
import { ApplicationUserDTO } from 'src/app/main-app/dto/account/application-user.dto';
import { CheckFormHandler } from 'src/app/main-app/services/handlers/check-form.handler';
import { FastSaleOrderDefaultDTO, FastSaleOrder_ServiceExtraDTO } from 'src/app/main-app/dto/fastsaleorder/fastsaleorder.dto';
import { GeneralConfigsFacade } from 'src/app/main-app/services/facades/general-config.facade';
import { DeliveryCarrierService } from 'src/app/main-app/services/delivery-carrier.service';
import { DeliveryCarrierDTO } from 'src/app/main-app/dto/carrier/delivery-carrier.dto';
import { Message } from 'src/app/lib/consts/message.const';
import { SaleOnline_OrderDTO } from 'src/app/main-app/dto/saleonlineorder/sale-online-order.dto';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { OrderPrintService } from 'src/app/main-app/services/print/order-print.service';
import { PrinterService } from 'src/app/main-app/services/printer.service';
import { OrderFormHandler } from 'src/app/main-app/services/handlers/order-form.handler';
import { CarrierHandler } from 'src/app/main-app/services/handlers/carier.handler';
import { SaleHandler } from 'src/app/main-app/services/handlers/sale.handler';

@Component({
    selector: 'conversation-order',
    templateUrl: './conversation-order.component.html',
})

export class ConversationOrderComponent  implements OnInit, OnChanges {

  @Input() data!: ActiveMatchingItem;
  @Input() team!: CRMTeamDTO;

  orderForm!: FormGroup;

  private destroy$ = new Subject();

  editNoteProduct: string | null = null;

  isLoading: boolean = false;
  isLoadingCarrier: boolean = false;

  isEnableCreateOrder: boolean = false;
  isEnableInsuranceFee: boolean = false;

  currentTeam!: CRMTeamDTO | null;
  lstUser!: Array<ApplicationUserDTO>;
  lstCarriers: DeliveryCarrierDTO[] = [];
  lstShipServices: TDSSafeAny = []; //  Dịch vụ bổ xung

  saleModel: TDSSafeAny = null;
  shipExtraServices: TDSSafeAny = [];
  saleConfigRoles: TDSSafeAny = [];

  constructor(private message: TDSMessageService,
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
    private saleHandler: SaleHandler,
    public router: Router) {
  }

  get detailsFormGroups() {
    return (this.orderForm?.get("Details") as FormArray).controls;
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

  updateOrderFormByBill(bill: FastSaleOrderDefaultDTO) {
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
    this.conversationOrderFacade.onLastOrderCheckCvs$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.updateFormOrder(res);
      this.updateBillByForm(this.orderForm);
    });
  }

  loadConfig() {
    this.generalConfigsFacade.getSaleConfigs().subscribe(res => {
      this.saleConfigRoles = res?.roles;
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

  updateFormOrder(order: ConversationOrderForm) {
    this.resetForm();

    order.Facebook_UserName = this.data?.name;

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

  onChangeCarrier(carrier: any) {
    this.isLoadingCarrier = true;
    this.shipExtraServices.length = 0;
    this.lstShipServices.length = 0;
    this.isEnableInsuranceFee = false;

    this.carrierHandler.changeCarrierV2(this.saleModel, this.orderForm, carrier, this.shipExtraServices)
      .pipe(finalize(() => this.isLoadingCarrier = false))
      .subscribe(res => {
        this.lstShipServices = res?.Services;
        this.updateShipExtraServices(carrier);

      }, error => {
          this.message.error(error?.error_description ? error.error_description : JSON.stringify(error));
      });
  }

  updateShipExtraServices(carrier: any) {
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

        // TODO: Cập nhật mapping, thông tin khách hàng

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
          this.updatePartner(this.currentTeam?.Facebook_PageId, orderModel.Facebook_ASUserId);
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

  isCheckBillValue(model: TDSSafeAny): number { // TODO: Tách hàm này ra function riêng
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
        this.lstShipServices = res.Services;
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

  prepareOrderModel(): any {
    let model = this.checkFormHandler.prepareOrder(this.orderForm);

    if(!TDSHelperString.hasValueString(model.Facebook_ASUserId)) {
      model.Facebook_ASUserId = this.data?.psid;
    }

    return model;
  }

  prepareBillModel() {
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
    this.isLoadingCarrier = true;

    !this.shipExtraServices && (this.shipExtraServices = []);
    this.carrierHandler.selectShipService(shipService, this.saleModel, this.shipExtraServices);

    if (this.saleModel.Carrier.DeliveryType === 'GHN') {
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
    return this.carrierHandler.onUpdateInsuranceFee(serviceId, this.saleModel, this.orderForm, this.shipExtraServices);
  }

  onChangeExtraService(extra: TDSSafeAny) {
    this.isLoadingCarrier = true;
    this.carrierHandler.onCheckExtraService(extra, this.lstShipServices, this.saleModel, this.orderForm, this.shipExtraServices)
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

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes.data);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
