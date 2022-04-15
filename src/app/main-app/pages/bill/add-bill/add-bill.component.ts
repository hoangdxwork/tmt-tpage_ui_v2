import { da } from 'date-fns/locale';

import { TDSModalService, TDSHelperObject, TDSMessageService, TDSHelperArray, TDSSafeAny } from 'tmt-tang-ui';
import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { ModalSearchPartnerComponent } from '../components/modal-search-partner/modal-search-partner.component';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { SaleConfigsDTO, SaleSettingDTO } from 'src/app/main-app/dto/configs/sale-config.dto';
import { SharedService } from 'src/app/main-app/services/shared.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AccountRegisterPaymentService } from 'src/app/main-app/services/account-register-payment.service';
import { formatDate } from '@angular/common';
import { ODataPartnerCategoryDTO, PartnerCategoryDTO } from 'src/app/main-app/dto/partner/partner-category.dto';
import { CommonService } from 'src/app/main-app/services/common.service';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { FastSaleOrder_DefaultDTOV2, OrderLine, User } from 'src/app/main-app/dto/fastsaleorder/fastsaleorder-default.dto';
import { DeliveryCarrierDTOV2, ODataDeliveryCarrierDTOV2 } from 'src/app/main-app/dto/delivery-carrier.dto';
import { AccountJournalPaymentDTO, ODataAccountJournalPaymentDTO } from 'src/app/main-app/dto/register-payment/register-payment.dto';
import { CustomerDTO, ODataCustomerDTO } from 'src/app/main-app/dto/partner/customer.dto';
import { DeliveryCarrierService } from 'src/app/main-app/services/delivery-carrier.service';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { StockWarehouseDTO } from 'src/app/main-app/dto/product/warehouse.dto';
import { AllFacebookChildTO } from 'src/app/main-app/dto/team/all-facebook-child.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ApplicationUserService } from 'src/app/main-app/services/application-user.service';
import { ApplicationUserDTO } from 'src/app/main-app/dto/account/application-user.dto';

@Component({
  selector: 'app-add-bill',
  templateUrl: './add-bill.component.html',
})

export class AddBillComponent implements OnInit, OnDestroy {

  _form!: FormGroup;
  id: any;

  dataModel!: FastSaleOrder_DefaultDTOV2;
  roleConfigs!: SaleSettingDTO;
  lstCarriers!: Observable<DeliveryCarrierDTOV2[]>;
  lstPaymentJournals!: Observable<AccountJournalPaymentDTO[]>;
  lstPrices!: Observable<PartnerCategoryDTO[]>;
  lstCustomers!: Observable<CustomerDTO[]>;
  lstWareHouses!: Observable<StockWarehouseDTO[]>;
  lstTeams!: Observable<AllFacebookChildTO[]>;
  lstUser!: Observable<ApplicationUserDTO[]>

  keyFilter!: '';
  page: number = 1;
  limit: number = 20;

  totalAmountLines: number = 0;
  productUOMQtyTotal: number = 0;
  productPriceTotal: number = 0;

  visiblePopoverDiscount: boolean = false;
  visiblePopoverTax: boolean = false;
  private destroy$ = new Subject();

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private partnerService: PartnerService,
    private message: TDSMessageService,
    private deliveryCarrierService: DeliveryCarrierService,
    private sharedService: SharedService,
    private commonService: CommonService,
    private fastSaleOrderService: FastSaleOrderService,
    private modalService: TDSModalService,
    private cRMTeamService: CRMTeamService,
    private applicationUserService: ApplicationUserService,
    private registerPaymentService: AccountRegisterPaymentService,
    private viewContainerRef: ViewContainerRef) {

      this.createForm();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    if (this.id) {
      this.loadBill(this.id);
    } else {
      this.loadDefault();
    }

    this.loadConfig();
    this.lstCarriers = this.loadCarrier();
    this.lstPaymentJournals = this.loadPaymentJournals();
    this.lstPrices = this.loadlstPrice();
    this.lstCustomers = this.loadCustomers();
    this.lstWareHouses = this.loadWareHouse();
    this.lstTeams = this.loadAllFacebookChilds();
    this.lstUser = this.loadUser();
  }

  createForm() {
    this._form = this.fb.group({
      Id: [null],
      Partner: [null],
      PriceList: [null],
      Warehouse: [null],
      PaymentJournal: [null],
      PaymentAmount: [0],
      Team: [null],
      Deliver: [null],
      PreviousBalance: [null],
      Reference: [null],
      Revenue: [null],
      Carrier: [null],
      DeliveryPrice: [0],
      AmountDeposit: [0],
      CashOnDelivery: [0],
      ShipWeight: [0],
      DeliveryNote: [null],
      Ship_InsuranceFee: [null],
      CustomerDeliveryPrice: [null],
      TrackingRef: [null],
      Ship_Receiver: [null],
      Address: [null],
      ReceiverName: [null],
      ReceiverPhone: [null],
      ReceiverDate: [null],
      ReceiverAddress: [null],
      ReceiverNote: [null],
      User: [null],
      DateOrderRed: [null],
      State: [null],
      DateInvoice: [null],
      NumberOrder: [null],
      Comment: [null],
      Seri: [null],
      WeightTotal: [0],
      DiscountAmount: [0],
      Discount: [0],
      DecreaseAmount: [0],
      AmountUntaxed: [0],
      Type: [null],
      SaleOrder: [null],
      AmountTotal: [0],
      TotalQuantity: [0],
      Tax: [null],
      OrderLines: this.fb.array([]),
    });
  }

  loadBill(id: number) {
    this.fastSaleOrderService.getById(id).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      delete data['@odata.context'];
      if (data.DateInvoice) {
        data.DateInvoice = new Date(data.DateInvoice);
      }
      if (data.DateOrderRed) {
        data.DateOrderRed = new Date(data.DateOrderRed);
      }
      if (data.ReceiverDate) {
        data.ReceiverDate = new Date(data.ReceiverDate);
      }
      this.dataModel = data;
      this.updateForm(this.dataModel);
    }, error => {
      this.message.error('Load hóa đơn đã xảy ra lỗi!');
    })
  }

  loadDefault() {
    let model = { Type: 'invoice' };
    this.fastSaleOrderService.defaultGetV2({ model: model }).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      delete data['@odata.context'];
      if (data.DateInvoice) {
        data.DateInvoice = new Date(data.DateInvoice);
      }
      if (data.DateOrderRed) {
        data.DateOrderRed = new Date(data.DateOrderRed);
      }
      if (data.ReceiverDate) {
        data.ReceiverDate = new Date(data.ReceiverDate);
      }

      this.dataModel = data;
      this.updateForm(this.dataModel);

    }, error => {
        this.message.error('Load thông tin mặc định đã xảy ra lỗi!');
    });
  }

  updateForm(data: FastSaleOrder_DefaultDTOV2) {
    if (TDSHelperArray.hasListValue(data.OrderLines)) {
        data.OrderLines.forEach((x: OrderLine) => {
            this.addOrderLines(x);

            this.productUOMQtyTotal = this.productUOMQtyTotal + x.ProductUOMQty;
            this.productPriceTotal = this.productPriceTotal + x.PriceTotal;
        });
    }
    this._form.patchValue(data);
  }

  loadCustomers() {
    return this.partnerService.getCustomers(this.page, this.limit, this.keyFilter)
        .pipe(map(res => res.value));
  }

  loadWareHouse() {
    return this.sharedService.getStockWarehouse().pipe(map(res => res.value));
  }

  loadAllFacebookChilds() {
    return this.cRMTeamService.getAllFacebookChilds().pipe(map(res => res.value));
  }

  loadUser() {
    return this.applicationUserService.dataActive$;
  }

  loadConfig() {
    this.sharedService.getConfigs().pipe(takeUntil(this.destroy$)).subscribe((res: SaleConfigsDTO) => {
      this.roleConfigs = res.SaleSetting;
    }, error => {
      this.message.error('Load thông tin cấu hình mặc định đã xảy ra lỗi!');
    });
  }

  loadCarrier() {
    return this.deliveryCarrierService.get().pipe(map(res => res.value));
  }

  loadPaymentJournals() {
    return this.registerPaymentService.getWithCompanyPayment().pipe(map(res => res.value));
  }

  loadlstPrice() {
    let date = formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'en-US');
    return this.commonService.getPriceListAvailable(date).pipe(map(res => res.value))
  }

  changePartner(event: any) {

  }

  onChangePrice(event: any) {
  }

  onChangeWarehouse(event: any) { }

  onChangePayment(event: any) { }

  onChangeTeam(event: any) { }

  onChangeUser(event: any) { }

  onChangeCarrier(event: any) { }
  changeDeliveryPrice(event: any) { }
  changeAmountDeposit(event: any) { }
  changeShipWeight(event: any) { }

  onChangeQuantity(ev: any) {
  }

  onChangePriceUnit(ev: any) {
  }

  openPopoverDiscount() {
    this.visiblePopoverDiscount = true
  }
  closePopoverDiscount() {
    this.visiblePopoverDiscount = false
  }
  applyPopoverDiscount() {
    this.visiblePopoverDiscount = false
  }

  openPopoverTax() {
    this.visiblePopoverTax = true
  }
  closePopoverTax() {
    this.visiblePopoverTax = false
  }
  applyPopoverTax() {
    this.visiblePopoverTax = false
  }

  showModalSearchPartner() {
    const modal = this.modalService.create({
      title: 'Tìm kiếm khách hàng',
      content: ModalSearchPartnerComponent,
      size: "xl",
      viewContainerRef: this.viewContainerRef,
    });
    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    modal.afterClose.subscribe(result => {
      console.log('[afterClose] The result is:', result);
      if (TDSHelperObject.hasValue(result)) {

      }
    });
  }

  initOrderLines(data: OrderLine | null) {
    if (data != null) {
      return this.fb.group({
        Id: [data.Id],
        ProductId: [data.ProductId],
        ProductUOMId: [data.ProductUOMId],
        PriceUnit: [data.PriceUnit],
        ProductUOMQty: [data.ProductUOMQty],
        UserId: [data.UserId],
        Discount: [data.Discount],
        Discount_Fixed: [data.Discount_Fixed],
        PriceTotal: [data.PriceTotal],
        PriceSubTotal: [data.PriceSubTotal],
        Weight: [data.Weight],
        WeightTotal: [data.WeightTotal],
        AccountId: [data.AccountId],
        PriceRecent: [data.PriceRecent],
        Name: [data.Name],
        IsName: [data.IsName],
        ProductName: [data.ProductName],
        ProductUOMName: [data.ProductUOMName],
        SaleLineIds: [data.SaleLineIds],
        ProductNameGet: [data.Id],
        SaleLineId: [data.Id],
        Type: [data.Type],
        PromotionProgramId: [data.PromotionProgramId],
        Note: [data.Note],
        ProductBarcode: [data.ProductBarcode],
        CompanyId: [data.CompanyId],
        PartnerId: [data.PartnerId],
        PriceSubTotalSigned: [data.PriceSubTotalSigned],
        PromotionProgramComboId: [data.PromotionProgramComboId],
        Product: [data.Product],
        ProductUOM: [data.ProductUOM],
        Account: [data.Account],
        SaleLine: [data.SaleLine],
        User: [data.User]
      });
    } else {
      return this.fb.group({
        Id: [null],
        ProductId: [null],
        ProductUOMId: [null],
        PriceUnit: [null],
        ProductUOMQty: [null],
        UserId: [null],
        Discount: [null],
        Discount_Fixed: [null],
        PriceTotal: [null],
        PriceSubTotal: [null],
        Weight: [null],
        WeightTotal: [null],
        AccountId: [null],
        PriceRecent: [null],
        Name: [null],
        IsName: [false],
        ProductName: [null],
        ProductUOMName: [null],
        SaleLineIds: [],
        ProductNameGet: [null],
        SaleLineId: [null],
        Type: [null],
        PromotionProgramId: [null],
        Note: [null],
        ProductBarcode: [null],
        CompanyId: [null],
        PartnerId: [null],
        PriceSubTotalSigned: [null],
        PromotionProgramComboId: [null],
        Product: [null],
        ProductUOM: [null],
        Account: [null],
        SaleLine: [null],
        User: [null]
      });
    }
  }

  addOrderLines(data: OrderLine) {
    let control = <FormArray>this._form.controls['OrderLines'];
    control.push(this.initOrderLines(data));
  }

  removeOrderLines(i: number) {
    let control = <FormArray>this._form.controls['OrderLines'];
    control.removeAt(i);
  }

  removeAllOrderLines(){
    let model = <FormArray>this._form.controls['OrderLines'];
    model.clear();

    this.computeAmountTotal();
  }

  computeAmountTotal() {
    let datas = this._form.controls['OrderLines'].value as Array<OrderLine>;
    datas.forEach((x: OrderLine) => {
        x.Discount = x.Discount ? x.Discount : 0;
        x.PriceTotal = (x.PriceUnit * (1 - (x.Discount || 0) / 100) - (x.Discount_Fixed || 0)) * x.ProductUOMQty;
        x.WeightTotal = Math.round(x.ProductUOMQty * x.Weight * 1000) / 1000;
    });

    //Tính giá trị tổng bao gồm ShipWeight,WeightTotal,DiscountAmount,AmountUntaxed,PaymentAmount,TotalQuantity,AmoutTotal
    this.updateTotalSummary(datas);
    this.updateQuantitySummary(datas);

    //update lại Giao hàng thu tiền
    this.updateCoDAmount();
  }

  updateTotalSummary(datas: OrderLine[]){
    let total = 0;
    let weightTotal = 0;

    datas.forEach((x: OrderLine) => {
        total += x.PriceTotal;
        weightTotal += x.WeightTotal;
    });

    //Gán lại khối lượng ship
    this._form.controls['WeightTotal'].setValue(weightTotal);
    if (weightTotal > 0) {
      this._form.controls['ShipWeight'].setValue(weightTotal * 1000);
    }

    //Gán lại tiền giảm DiscountAmount
    this.totalAmountLines = total;
    let discountAmount = Math.round(this.totalAmountLines * (this._form.controls['Discount'].value / 100));
    this._form.controls['DiscountAmount'].setValue(discountAmount);

    total = total - this._form.controls['DiscountAmount'].value - this._form.controls['DecreaseAmount'].value;
    this._form.controls['AmountUntaxed'].setValue(total);

    //Tính thuế để gán lại tổng tiền AmountTotal
    this.calcTax();

    //Gán lại số tiền trả PaymentAmount;
    let amountDepositSale = this._form.controls['SaleOrder'].value ? this._form.controls['SaleOrder'].value.AmountDeposit : 0;
    let paymentAmount = amountDepositSale ? (this._form.controls['AmountTotal'].value - amountDepositSale) : this._form.controls['AmountTotal'].value;

    if(!this.roleConfigs || !this.roleConfigs.GroupAmountPaid) {
      this._form.controls['PaymentAmount'].setValue(paymentAmount);
    }
  }

  calcTax() {
    this._form.controls['AmountTax'].setValue(0);

    if (this._form.controls['Tax'].value) {
      let amountTax = Math.round(this._form.controls['AmountUntaxed'].value * ((this._form.controls['Tax'].value.Amount) / 100));
      this._form.controls['AmountTax'].setValue(amountTax);
    }

    let amountTotal = Math.round(this._form.controls['AmountUntaxed'].value + this._form.controls['AmountTax'].value);
    this._form.controls['AmountTotal'].setValue(amountTotal);
  }

  updateQuantitySummary(datas: OrderLine[]) {
    let total = 0;
    datas.forEach((x: OrderLine) => {
        if (!x.PromotionProgramId) {
          total += x.ProductUOMQty;
        }
    });
    this._form.controls['TotalQuantity'].setValue(total);
  }

  updateCoDAmount() {
    let formModel = this._form.value;
    let coDAmount = (formModel.AmountTotal + formModel.DeliveryPrice) - formModel.AmountDeposit;
    if (coDAmount) {
      this._form.controls['CashOnDelivery'].setValue(coDAmount);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
