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
import { SaleOnline_OrderHandler } from 'src/app/main-app/services/handlers/sale-online-order.handler';
import { FastSaleOrderDefaultDTO, FastSaleOrder_ServiceExtraDTO } from 'src/app/main-app/dto/fastsaleorder/fastsaleorder.dto';
import { GeneralConfigsFacade } from 'src/app/main-app/services/facades/general-config.facade';
import { DeliveryCarrierService } from 'src/app/main-app/services/delivery-carrier.service';
import { DeliveryCarrierDTO } from 'src/app/main-app/dto/carrier/delivery-carrier.dto';
import { Message } from 'src/app/lib/consts/message.const';
import { SaleOnline_OrderDTO } from 'src/app/main-app/dto/saleonlineorder/sale-online-order.dto';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';

@Component({
    selector: 'conversation-order',
    templateUrl: './conversation-order.component.html',
})

export class ConversationOrderComponent  implements OnInit, OnChanges {

  @Input() data!: ActiveMatchingItem;
  @Input() team!: CRMTeamDTO;

  orderForm!: FormGroup;

  cvsData!: CheckConversationData;
  private destroy$ = new Subject();

  // Đơn hàng
  name = new FormControl('', [Validators.required]);
  phoneNumber = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{10}$/i)]);
  email = new FormControl('', [Validators.required, Validators.email]);
  nameSelect = new FormControl('', [Validators.required]);
  note = new FormControl('', [Validators.required]);
  noteProduct = new FormControl('', [Validators.required]);
  soLuongProduct = new FormControl('', [Validators.required]);
  giaBanProduct = new FormControl('', [Validators.required]);
  giamGia = new FormControl('', [Validators.required]);
  thue = new FormControl('', [Validators.required]);
  tienCoc = new FormControl('', [Validators.required]);
  khuyenMai = new FormControl('', [Validators.required]);
  thanhToan = new FormControl('', [Validators.required]);
  DTGH = new FormControl('', [Validators.required]);
  dichVu = new FormControl('', [Validators.required]);
  khoiLuong = new FormControl('', [Validators.required]);
  phiGH = new FormControl('', [Validators.required]);
  tienThuHo = new FormControl('', [Validators.required]);
  notGH = new FormControl('', [Validators.required]);
  // select đối tác giao hàng
  public listDTGiaoHang = [
    { id: 1, name: 'DHL' },
    { id: 2, name: 'Elvis Presley' },
    { id: 3, name: 'Paul McCartney' },
    {id: 4, name: 'Elton John' },
    { id: 5, name: 'Elvis Presley' },
    { id: 6, name: 'Paul McCartney' },
]
  // select dich vu
  public listDichVu = [
    { id: 1, name: 'Giao hàng tiêu chuẩn' },
    { id: 2, name: 'Elvis Presley' },
    { id: 3, name: 'Paul McCartney' },
    {id: 4, name: 'Elton John' },
    { id: 5, name: 'Elvis Presley' },
    { id: 6, name: 'Paul McCartney' },
]

  // select thông tin khách hàng
  public contactCustomer = [
    { id: 1, name: 'Nguyen Binh' },
    { id: 2, name: 'Elvis Presley' },
    { id: 3, name: 'Paul McCartney' },
    { id: 4, name: 'Elton John' },
    { id: 5, name: 'Elvis Presley' },
    { id: 6, name: 'Paul McCartney' },
]
  // select Page QAXK Nhiên Trung
  public contact:number = 1;
  public contactOptions = [
      { id: 1, name: 'Page QAXK Nhiên Trung' },
      { id: 2, name: 'Elvis Presley' },
      { id: 3, name: 'Paul McCartney' },
      { id: 4, name: 'Elton John' },
      { id: 5, name: 'Elvis Presley' },
      { id: 6, name: 'Paul McCartney' }
  ]
  // search
  inputValue?: string;
    // Đơn hàng
  // table đơn hàng
  listOfData = [
    {
      id: '1',
      name: '[SP0748] Gạo (Bao)',
      color: 'text-info-500',
      text: 'Ghi chú',
      icon: '',
      style:'not-italic',
    },
    {
      id: '2',
      name: '[SP0748] Gạo (Bao)',
      color: 'text-neutral-1-400',
      text: 'Ghi chú sản phẩm',
      icon: 'tdsi-edit-line',
      style:'italic',
    },
    {
      id: '3',
      name: '[SP0748] Gạo (Bao)',
      color: 'text-info-500',
      text: 'Ghi chú',
      icon: '',
      style:'not-italic',
    },
    {
      id: '4',
      name: '[SP0748] Gạo (Bao)',
      color: 'text-info-500',
      text: 'Ghi chú',
      icon: '',
      style:'not-italic',
    },
    {
      id: '5',
      name: '[SP0748] Gạo (Bao)',
      color: 'text-neutral-1-400',
      text: 'Ghi chú sản phẩm',
      icon: 'tdsi-edit-line',
      style:'italic',
    },
    {
      id: '6',
      name: '[SP0748] Gạo (Bao)',
      color: 'text-info-500',
      text: 'Ghi chú',
      icon: '',
      style:'not-italic',
    },
  ];

  editNoteProduct: string | null = null;
  startEdit(id: string): void {
    this.editNoteProduct = id;
  }

  stopEdit(): void {
    this.editNoteProduct = null;
  }

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
    private saleOnline_OrderHandler: SaleOnline_OrderHandler,
    private generalConfigsFacade: GeneralConfigsFacade,
    private commonService: CommonService,
    private deliveryCarrierService: DeliveryCarrierService,
    private crmTeamService: CRMTeamService,
    private partnerService: PartnerService,
    private fastSaleOrderService: FastSaleOrderService,
    public router: Router) {
  }

  get detailsFormGroups() {
    return (this.orderForm?.get("Details") as FormArray).controls;
  }

  ngOnInit(): void {
    this.createForm();
    this.createSaleModel();
    this.loadConfig();

    if(this.data ) {
      //TODO: data load lần đầu
      this.loadData(this.data);
    }
    //TODO: load user gán _form User

    this.loadOrder();
    this.loadUsers();
    this.loadCarrier();
    this.loadCurrentTeam();
  }

  createForm(): void {
    this.orderForm = this.fb.group({
        Id: null,

        Facebook_ASUserId: "",
        Facebook_UserId: "",
        Facebook_UserName: "",
        Facebook_CommentId: "",
        Facebook_PostId: "",

        LiveCampaignId: "",

        Name: "",
        Code: "",

        // StatusText: "",
        SessionIndex: 0,
        Session: 0,
        PrintCount: 0,

        PartnerId: null,
        PartnerName: "",
        Telephone: "",
        Email: "",

        CRMTeamId: null,
        AmountUntaxed: 0,
        AmountTax: 0,
        TotalAmount: 0,
        TotalAmountBill: 0,
        TotalQuantity: 0,
        DecreaseAmount: 0,
        PaymentAmount: 0,
        DiscountAmount: 0,
        Discount: 0,
        Tax: {},
        Note: "",
        Details: this.fb.array([]),

        Street: "",
        City: {},
        District: {},
        Ward: {},
        Carrier: {},

        User: null,

        tempPartner: this.fb.group({ Address: '' })
    });
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
    this.checkFormHandler.getBill().subscribe(res => {
      this.saleModel = res;

      if(res.Carrier) {
        let type = this.saleOnline_OrderHandler.initShipExtraServices(res.Carrier, this.shipExtraServices);
        if(type === "NinjaVan") this.isEnableInsuranceFee = true;
      }

      this.saleModel.CashOnDelivery = this.orderForm.value.TotalAmountBill || 0;
      this.updateOrderFormByBill(res);
    });
  }

  updateOrderFormByBill(bill: FastSaleOrderDefaultDTO) {
    this.orderForm.controls.Carrier?.setValue(bill.Carrier);
    this.orderForm.controls.Tax?.setValue(bill.Tax);
  }

  loadDataV1() {

  }

  loadData(data: any) {
    let id = "";
    this.saleOnline_OrderService.getById(id).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      delete res['@odata.context'];
      debugger
    });
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
    this.deliveryCarrierService.get().subscribe((res: any) => {
      this.lstCarriers = res.value;
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

    this.saleOnline_OrderHandler.changeCarrier(this.saleModel, this.orderForm, carrier, this.shipExtraServices)
      .pipe(finalize(() => this.isLoadingCarrier = false))
      .subscribe(res => {
        this.isEnableInsuranceFee = res.EnableInsuranceFee;
        this.lstShipServices = res.ShipServices;

        if(res.TypeShipExtra == "NinjaVan") {
          this.initNinjaVan();
        }
      }, error => {
        if(error.error_description) {
          this.message.error(error.error_description);
        }
        else {
          this.message.error(JSON.stringify(error));
        }
      });
  }

  initNinjaVan() {
    let formControls = this.orderForm.controls;

    if (formControls.Carrier.value && formControls.Carrier.value.DeliveryType == 'NinjaVan' && formControls.Ship_Extras.value) {
      this.shipExtraServices.length = 0;

      this.shipExtraServices.push({
        ServiceId: "NinjaVan",
        ServiceName: "Khai giá hàng hóa",
        Fee: formControls.Ship_Extras.value.InsuranceFee ? formControls.Ship_Extras.value.InsuranceFee : 0,
        IsSelected: formControls.Ship_Extras.value.IsInsurance ? formControls.Ship_Extras.value.IsInsurance : false,
      });

      this.isEnableInsuranceFee = formControls.Ship_Extras.value.IsInsurance ? formControls.Ship_Extras.value.IsInsurance : false;
      formControls["Ship_InsuranceFee"].setValue(formControls.Ship_Extras.value.InsuranceFee ? formControls.Ship_Extras.value.InsuranceFee : 0);
    }
  }

  initOkieLa() {
    let formControls = this.orderForm.controls;

    if (formControls.Carrier.value && formControls.Carrier.value.DeliveryType === "OkieLa" && this.shipExtraServices.length === 0) {
      this.shipExtraServices = [
        {
          ServiceId: "is_fragile",
          ServiceName: "Hàng dễ vỡ?",
        },
        {
          ServiceId: "check_before_accept",
          ServiceName: "Cho khách xem hàng?",
        },
      ];
    }
  }

  removeDetail(index: number) {
    const control = this.orderForm.controls["Details"] as FormArray;
    control.removeAt(index);

    this.updateTotalAmount();
  }

  updateTotalAmount() {
    let formValue = this.orderForm.value;

    let formDetail = formValue.Details;
    let discount = formValue.Discount;

    let total = 0;
    let totalQty = 0;
    let amountTax = 0;
    let decreaseAmount = formValue.DecreaseAmount;

    formDetail.forEach((product: TDSSafeAny) => {
      total += product.Quantity * product.Price;
      totalQty += product.Quantity;
    });

    let discountAmount = Math.round(total * (discount / 100));
    let totalAmount = total;
    let amountUntaxed = total - discountAmount - decreaseAmount;

    this.orderForm.controls.DiscountAmount.setValue(discountAmount);
    this.orderForm.controls.TotalAmount.setValue(totalAmount);
    this.orderForm.controls.AmountUntaxed.setValue(amountUntaxed);

    if(formValue.Tax && formValue.Tax.Id) {
      amountTax = Math.round(
        amountUntaxed * (formValue.Tax.Amount / 100)
      );
    }

    this.orderForm.controls.AmountTax.setValue(amountTax);
    let totalAmountBill = amountUntaxed + amountTax;
    this.orderForm.controls.TotalAmountBill.setValue(amountUntaxed + amountTax);
    this.orderForm.controls.TotalQuantity.setValue(totalQty);

    if (this.saleConfigRoles?.GroupAmountPaid !== true) {
      this.orderForm.controls.PaymentAmount.setValue(totalAmountBill);
    }
    else {
      this.orderForm.controls.PaymentAmount.setValue(0);
    }

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
    let orderModel = this.prepareOrderModel();
    this.isLoading = true;

    this.saleOnline_OrderService.insertFromMessage({model: orderModel})
      .subscribe(res => {
        this.orderForm.controls["Id"].setValue(res.Id);
        this.orderForm.controls["PartnerId"].setValue(res.PartnerId);

        // TODO: Cập nhật mapping, thông tin khách hàng

        if (!this.isEnableCreateOrder) {
          if(print == "print") {
            // TODO: Thực hiện in
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
          debugger;
          let billModel = this.prepareBillModel(); // Bản chất đã change this.saleModel
          billModel.FormAction = print;

          if(this.isCheckBillValue(billModel) === 1) {
            if(this.checkShipServiceId(billModel) === 1) {
              let isDraft = print == "draft" ?  true : false;

              this.fastSaleOrderService.saveV2(billModel, isDraft)
                .pipe(finalize(() => this.isLoading = false))
                .subscribe(res => {
                  this.message.success(Message.Bill.InsertSuccess);
                  // TODO: Cập nhật doanh thu, danh sách phiếu bán hàng gần nhất

                  // TODO: Thực hiện in
                  if (print == "print") {
                    // this.printerService.printUrl(`/fastsaleorder/print?ids=${res.Data.Id}`);
                  }

                  if (print == "printShip") {
                    let params = "";
                    res.Data.CarrierId && (params = `&carrierId=${res.Data.CarrierId}`);
                    // this.printerService.printUrl(`/fastsaleorder/PrintShipThuan?ids=${res.Data.Id}${params}`);
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

  isCheckBillValue(model: TDSSafeAny) { // TODO: Tách hàm này ra function riêng
    let errorMessage = null;

    let detail = model.OrderLines;

    if (!detail || detail.length === 0) {
      errorMessage = "Hãy nhập sản phẩm.";
    }

    if (!TDSHelperObject.hasValue(detail?.Carrier)) {

    }

    if (!TDSHelperString.hasValueString(model.Telephone)) {
      errorMessage = "Hãy nhập số điện thoại.";
    }

    if (!TDSHelperString.hasValueString(model.Address)) {
      errorMessage = "Hãy nhập địa chỉ.";
    }

    if (!TDSHelperString.hasValueString(model?.Ship_Receiver?.City?.Code)) {
      errorMessage = "Hãy nhập tỉnh/thành phố.";
    }

    if (!TDSHelperString.hasValueString(model?.Ship_Receiver?.District?.Code)) {
      errorMessage = "Hãy nhập quận/huyện.";
    }

    if(model.DeliveryPrice == null) {
      errorMessage = "Hãy nhập phí giao hàng.";
    }

    if(model.DeliveryPrice != 0 && model.DeliveryPrice < 0) {
      errorMessage = "Phí giao hàng phải lớn hơn 0.";
    }

    if(!TDSHelperString.hasValueString(model.PartnerName)) {
      errorMessage = "Hãy nhập tên khách hàng.";
    }

    if(errorMessage) {
      this.message.error(errorMessage);
      return 0;
    }

    return 1;
  }

  checkShipServiceId(model: TDSSafeAny) {
    if (model.Carrier && model.Carrier.Id &&
      (model.Carrier.DeliveryType === "ViettelPost" ||
      model.Carrier.DeliveryType === "GHN" ||
      model.Carrier.DeliveryType === "TinToc" ||
      model.Carrier.DeliveryType == 'NinjaVan'))
    {

      if (model.Carrier.DeliveryType === "GHN") {
        model.Ship_ServiceId = model.Ship_ServiceId || model.Carrier.GHN_ServiceId;
      }
      else if (model.Carrier.DeliveryType === "ViettelPost" || model.Carrier.DeliveryType === "TinToc") {
        model.Ship_ServiceId = model.Ship_ServiceId || model.Carrier.ViettelPost_ServiceId;
      }
      else if(model.Carrier.DeliveryType == 'NinjaVan') {
        model.Ship_ServiceId = 'Standard';
        model.Ship_ServiceName = 'Tiêu chuẩn';
      }

      if (!model.Ship_ServiceId) {
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

        return 0;
      }
    }

    return 1;

  }

  calculateFee(carrier: TDSSafeAny) {
    this.saleOnline_OrderHandler.calculateFeeHandler(carrier, this.saleModel, this.orderForm, this.shipExtraServices).subscribe(res => {
        this.lstShipServices = res.Services;
    }, (error: TDSSafeAny) => {
      if(error && typeof error == 'string') {
        this.message.error(error);
      }
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
    let formValue = this.orderForm.value;

    let model = {
      Id: formValue.Id ? formValue.Id : null,
      Code: formValue.Code ? formValue.Code : null,
      Details: formValue.Details,
      Facebook_UserId: formValue.Facebook_UserId,
      Facebook_ASUserId: formValue.Facebook_ASUserId,
      Facebook_UserName: formValue.Facebook_UserName || formValue.PartnerName,
      PartnerName: formValue.PartnerName,
      Name: formValue.PartnerName || formValue.Name,
      Email: formValue.Email,
      TotalAmount: formValue.TotalAmount || 0,
      TotalQuantity: formValue.TotalQuantity || 0,
      Address: formValue.Street,
      CityCode: formValue.City ? formValue.City.Code : null,
      CityName: formValue.City ? formValue.City.Name : null,
      DistrictCode: formValue.District ? formValue.District.Code : null,
      DistrictName: formValue.District ? formValue.District.Name : null,
      WardName: formValue.Ward ? formValue.Ward.Name : null,
      WardCode: formValue.Ward ? formValue.Ward.Code : null,
      PartnerId: formValue.PartnerId,
      UserId: formValue.User ? formValue.User.Id : null,
      User: formValue.User ? {Id: formValue.User.Id, Name: formValue.User.Name} : null,
      Telephone: formValue.Telephone,
      Note: formValue.Note,
      CRMTeamId: this.currentTeam ? this.currentTeam.Id : null
    };

    if (!model.Id) {
      delete model.Id;
      delete model.Code;
    }

    if(!TDSHelperString.hasValueString(model.Facebook_ASUserId)) {
      model.Facebook_ASUserId = this.data?.psid;
    }

    return model;
  }

  prepareBillModel() {
    let model = this.saleModel;

    let formValue = this.orderForm.value;

    model.SaleOnlineIds = [formValue.Id];
    model.PartnerId = formValue.PartnerId;
    model.Partner = formValue.Partner && formValue.Partner.Id ? formValue.Partner.Id : null;
    model.PartnerName = formValue.PartnerName || formValue.Facebook_UserName;
    model.Address = formValue.Address || formValue.Street;
    model.FacebookId = formValue.Facebook_UserId;
    model.FacebookName = formValue.Facebook_UserName || formValue.Name || formValue.PartnerName;
    model.Facebook_ASUserId = formValue.Facebook_ASUserId;
    model.Telephone = formValue.Telephone;

    model.Tax = formValue.Tax;
    model.Discount = formValue.Discount;
    model.AmountTax = formValue.AmountTax;
    model.AmountUntaxed = formValue.AmountUntaxed;
    model.DecreaseAmount = formValue.DecreaseAmount;
    model.DiscountAmount = formValue.DiscountAmount;
    model.PaymentAmount = formValue.PaymentAmount || 0;

    model.TaxId = formValue.Tax ? formValue.Tax.Id : null;
    model.User = formValue.User;
    model.UserId = formValue.User ? formValue.User.Id : null

    model.CompanyId = model.Company ? model.Company.Id : 0;
    model.AccountId = model.Account ? model.Account.Id : 0;
    model.JournalId = model.Journal ? model.Journal.Id : 0;
    model.PriceListId = model.PriceList ? model.PriceList.Id : 0;
    model.WarehouseId = model.Warehouse ? model.Warehouse.Id : 0;

    model.Carrier = model.Carrier != null && model.Carrier.Id ? model.Carrier : null;
    model.CarrierId = model.Carrier != null && model.Carrier.Id ? model.Carrier.Id : null;

    model.PaymentJournalId = model.PaymentJournal != null ? model.PaymentJournal.Id : null;

    // Xóa detail gán lại
    model.OrderLines = [];

    formValue.Details.forEach((detail: TDSSafeAny) => {
      if (!model.OrderLines)
        model.OrderLines = [];

      model.OrderLines.push({
        ProductId: detail.ProductId,
        ProductUOMId: detail.UOMId,
        ProductUOMQty: detail.Quantity,
        PriceUnit: detail.Price,
        Discount: 0,
        Discount_Fixed: 0,
        Type: "fixed",
        PriceSubTotal: detail.Price * detail.Quantity,
        Note: detail.Note
      });
    });

    model.Ship_Receiver = {
      Name: formValue.PartnerName || formValue.Name,
      Phone: formValue.Telephone,
      Street: formValue.Street,
      City: formValue.City,
      District: formValue.District,
      Ward: formValue.Ward
    };

    if (this.shipExtraServices) {
      model.Ship_ServiceExtras = [];

      this.shipExtraServices.map((x: any) => {
        if (x.IsSelected) {
          model.Ship_ServiceExtras.push({
            Id: x.ServiceId,
            Name: x.ServiceName,
            Fee: x.Fee,
            ExtraMoney: x.ExtraMoney,
            Type: x.Type,
          });
        }
      });
    }

    model["PageId"] = this.currentTeam ? this.currentTeam.Facebook_PageId : null
    model["PageName"] = this.currentTeam ? this.currentTeam.Facebook_PageName : null;

    return model;
  }

  updateBillByForm(form: FormGroup) {
    let formValue = form.value;

    if (this.saleModel?.Ship_ServiceExtras && this.saleModel?.Ship_ServiceExtras.length > 0) {
      this.saleModel.Ship_ServiceExtras.forEach((element: FastSaleOrder_ServiceExtraDTO) => {

        if (element.Id === "NinjaVan" || element.Id === "16" || element.Id === "GBH" ||
          (element.Id === "OrderAmountEvaluation" && this.saleModel.Carrier?.DeliveryType === "MyVNPost") ) {
          this.isEnableInsuranceFee = true;
        }

        this.shipExtraServices.push({
          ServiceId: element.Id,
          ServiceName: element.Name,
          Fee: element.Fee,
          IsSelected: true,
          Type: element.Type,
          ExtraMoney: element.ExtraMoney
        });

      });
    }

    this.initOkieLa();
    this.initNinjaVan();

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

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes.data);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
