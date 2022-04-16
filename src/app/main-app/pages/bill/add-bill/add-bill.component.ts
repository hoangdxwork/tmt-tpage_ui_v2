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
  priceListItems: any;

  enableInsuranceFee: boolean = false;
  visiblePopoverDiscount: boolean = false;
  visiblePopoverTax: boolean = false;

  apiDeliveries: any = ['GHTK', 'ViettelPost', 'GHN', 'TinToc', 'SuperShip', 'FlashShip', 'OkieLa', 'MyVNPost', 'DHL', 'FulltimeShip', 'JNT', 'EMS', 'AhaMove', 'Snappy', 'NhatTin', 'HolaShip'];
  carrierTypeInsurance = ["MyVNPost", "GHN", "GHTK", "ViettelPost", "NinjaVan"];
  shipServices: any = [];
  shipExtraServices: any = [];

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
    this.lstPrices = this.loadListPrice();
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
      Ship_InsuranceFee: [0],
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
      Ship_ServiceId: [null],
      Ship_ServiceName: [null],
      Ship_ExtrasText: [null],
      Ship_ServiceExtrasText: [null],
      Ship_Extras: [null],
      Ship_ServiceExtras: this.fb.array([]),
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

      if(data.Ship_ServiceId) {
        this.shipServices.push({
          ServiceId: data.Ship_ServiceId,
          ServiceName: data.Ship_ServiceName,
          TotalFee: data.CustomerDeliveryPrice
        });
      }
      if (data.Ship_ServiceExtras && data.Ship_ServiceExtras.length > 0) {
        for (var item of data.Ship_ServiceExtras) {
          var exits = ((item.Id == '16' || item.Id == "GBH" || item.Id == "GHN" || item.Id == "OrderAmountEvaluation" &&
                 data.Carrier.DeliveryType === "MyVNPost" || item.Id === "NinjaVan"))
          if (exits) {
            this.enableInsuranceFee = true;
          }

          this.shipExtraServices.push({
            ServiceId: item.Id,
            ServiceName: item.Name,
            Fee: item.Fee,
            Type: item.Type,
            ExtraMoney: item.ExtraMoney,
            IsSelected: true
          });
        }
      }

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
    //TODO: cập nhật price of product theo bảng giá
    if(data.PriceListId) {
      this.commonService.getPriceListItems(data.PriceListId).subscribe((res: any) => {
          this.priceListItems = res;
      }, error => {
        this.message.error('Load bảng giá đã xảy ra lỗi!')
      })
    }

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

  loadListPrice() {
    let date = formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'en-US');
    return this.commonService.getPriceListAvailable(date).pipe(map(res => res.value))
  }

  changePartner(event: any) {
    let model = this.prepareModel();
    this.partnerService.onChangePartnerPriceList({ model: model}).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {

    }, error => {
      this.message.error('Thay đổi khách hàng đã xảy ra lỗi!')
    });
  }

  onChangePriceList(event: any) {
    if(TDSHelperObject.hasValue(event)) {
      this.commonService.getPriceListItems(event.Id).subscribe((res: any) => {
          this.priceListItems = res;
      }, error => {
          this.message.error('Load bảng giá đã xảy ra lỗi!')
      })
    }
  }

  changePaymentAmount(event: any) {
    this._form.controls['PaymentAmount'].setValue(event);
  }

  onChangeWarehouse(event: any) {
    this._form.controls['Warehouse'].setValue(event);
    this._form.controls['WarehouseId'].setValue(event.Id);
  }

  onChangePayment(event: any) { }

  onChangeTeam(event: any) { }

  onChangeUser(event: any) { }

  onChangeCarrier(event: DeliveryCarrierDTOV2) {
    if(TDSHelperObject.hasValue(event)) {
        //TODO: Cập nhật giá trị ship mặc định
        this._form.controls['DeliveryPrice'].setValue(event.Config_DefaultFee || 0);
        let cashOnDelivery = this._form.controls['AmountTotal'].value + this._form.controls['DeliveryPrice'].value;

        this._form.controls['CashOnDelivery'].setValue(cashOnDelivery || 0);
        this._form.controls['ShipWeight'].setValue(event.Config_DefaultWeight || 100);
        this._form.controls['Ship_Extras'].setValue(JSON.parse(event.ExtrasText) || null);

        this.updateCoDAmount();
        //TODO: Check giá trị mặc định trước khi gửi
    }
  }

  calculateFee(event: DeliveryCarrierDTOV2): any {
    if(!this._form.controls['Partner'].value) {
      return  this.message.error('Vui lòng chọn khách hàng');
    }
    if(!this._form.controls['Carrier'].value) {
      return  this.message.error('Vui lòng chọn  đối tác giao hàng');
    }
    if(!this._form.controls['ShipWeight'].value) {
      return  this.message.error('Vui lòng chọn nhập khối lượng');
    }
  }

  public prepareModelFeeV2(){
    const formModel = this._form.value;
    const model: any = {
      PartnerId: formModel.Partner.Id,
      CompanyId: formModel.Company.Id,
      CarrierId: formModel.Carrier.Id,
      ServiceId: formModel.Ship_ServiceId || null,
      InsuranceFee: formModel.Ship_InsuranceFee || 0,
      ShipWeight: formModel.ShipWeight,
      CashOnDelivery: formModel.CashOnDelivery,
      ServiceExtras: [],
      Ship_Receiver: {}
    }
  }

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

    this.computeAmountTotal();
  }

  removeAllOrderLines(){
    let model = <FormArray>this._form.controls['OrderLines'];
    model.clear();

    this.computeAmountTotal();
  }

  computeAmountTotal() {
    let datas = this._form.controls['OrderLines'].value as Array<OrderLine>;

    if(TDSHelperArray.hasListValue(datas)){
        datas.forEach((x: OrderLine) => {
            x.Discount = x.Discount ? x.Discount : 0;
            x.PriceTotal = (x.PriceUnit * (1 - (x.Discount || 0) / 100) - (x.Discount_Fixed || 0)) * x.ProductUOMQty;
            x.WeightTotal = Math.round(x.ProductUOMQty * x.Weight * 1000) / 1000;
        });

        //Tính giá trị tổng bao gồm ShipWeight,WeightTotal,DiscountAmount,AmountUntaxed,PaymentAmount,TotalQuantity,AmoutTotal
        this.updateTotalSummary(datas);
        this.updateQuantitySummary(datas);
    }
    //update lại Giao hàng thu tiền
    this.updateCoDAmount();
  }

  updateTotalSummary(datas: OrderLine[]){
    let total = 0;
    let weightTotal = 0;

    if(TDSHelperArray.hasListValue(datas)){
      datas.forEach((x: OrderLine) => {
          total += x.PriceTotal;
          weightTotal += x.WeightTotal;
      });
    }

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
    if(TDSHelperArray.hasListValue(datas)){
      datas.forEach((x: OrderLine) => {
          if (!x.PromotionProgramId) {
              total += x.ProductUOMQty;
          }
      });
    }
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

  onSave(): any {
    let model = this.prepareModel();
    if(!TDSHelperArray.hasListValue(model.OrderLines)) {
      return this.message.error('Vui lòng chọn ít nhất 1 sản phẩm!');
    }

    if(this.id) {
      this.fastSaleOrderService.update(this.id, model).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
          this.message.success('Cập nhật hóa đơn thành công!');
      }, error => {
          this.message.error(`${error.error.message}` || 'Cập nhật hóa đơn thất bại!');
      })
    } else {
      this.fastSaleOrderService.insert(model).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
          this.message.success('Tạo mới hóa đơn thành công!');
      }, error => {
          this.message.error(`${error.error.message}`|| 'Tạo mớihóa đơn thất bại!');
      });
    }
  }

  onBack() {
    history.back();
  }

  prepareModel(): any {
    const formModel = this._form.value as FastSaleOrder_DefaultDTOV2;
    const model = this.dataModel as FastSaleOrder_DefaultDTOV2;

    model.Id = formModel.Id ? formModel.Id : model.Id;
    model.Partner = formModel.Partner ? formModel.Partner : model.Partner;
    model.PartnerId = formModel.Partner ? formModel.Partner.Id : model.PartnerId;
    model.PriceList = formModel.PriceList ? formModel.PriceList : model.PriceList;
    model.PriceListId = formModel.PriceList ? formModel.PriceList.Id : model.PriceListId;
    model.Warehouse = formModel.Warehouse ? formModel.Warehouse : model.Warehouse;
    model.WarehouseId = formModel.Warehouse ? formModel.Warehouse.Id : model.WarehouseId;
    model.PaymentJournal = formModel.PaymentJournal ? formModel.PaymentJournal : model.PaymentJournal;
    model.PaymentJournalId = formModel.PaymentJournal ? formModel.PaymentJournal.Id : model.PaymentJournalId;
    model.PaymentAmount = formModel.PaymentAmount ? formModel.PaymentAmount : model.PaymentAmount;
    model.Team = formModel.Team ? formModel.Team : model.Team;
    model.TeamId = formModel.Team ? formModel.Team.Id : model.TeamId;
    model.Deliver = formModel.Deliver ? formModel.Deliver : model.Deliver;
    model.PreviousBalance = formModel.PreviousBalance ? formModel.PreviousBalance : model.PreviousBalance;
    model.Reference = formModel.Reference ? formModel.Reference : model.Reference;
    model.Revenue = formModel.Revenue ? formModel.Revenue : model.Revenue;
    model.Carrier = formModel.Carrier ? formModel.Carrier : model.Carrier;
    model.CarrierId = formModel.Carrier ? formModel.Carrier.Id : model.CarrierId;
    model.DeliveryPrice = formModel.DeliveryPrice ? formModel.DeliveryPrice : model.DeliveryPrice;
    model.AmountDeposit = formModel.AmountDeposit ? formModel.AmountDeposit : model.AmountDeposit;
    model.CashOnDelivery = formModel.CashOnDelivery ? formModel.CashOnDelivery : model.CashOnDelivery;
    model.ShipWeight = formModel.ShipWeight ? formModel.ShipWeight : model.ShipWeight;
    model.DeliveryNote = formModel.DeliveryNote ? formModel.DeliveryNote : model.DeliveryNote;
    model.Ship_ServiceId = formModel.Ship_ServiceId ? formModel.Ship_ServiceId : model.Ship_ServiceId;
    model.Ship_ServiceName = formModel.Ship_ServiceName ? formModel.Ship_ServiceName : model.Ship_ServiceName;
    model.Ship_ServiceExtrasText = formModel.Ship_ServiceExtrasText ? formModel.Ship_ServiceExtrasText : model.Ship_ServiceExtrasText;
    model.Ship_ExtrasText = formModel.Ship_ExtrasText ? formModel.Ship_ExtrasText : model.Ship_ExtrasText;
    model.Ship_InsuranceFee = formModel.Ship_InsuranceFee ? formModel.Ship_InsuranceFee : model.Ship_InsuranceFee;
    model.CustomerDeliveryPrice = formModel.CustomerDeliveryPrice ? formModel.CustomerDeliveryPrice : model.CustomerDeliveryPrice;
    model.TrackingRef = formModel.TrackingRef ? formModel.TrackingRef : model.TrackingRef;
    model.Ship_Receiver = formModel.Ship_Receiver ? formModel.Ship_Receiver : model.Ship_Receiver;
    model.Address = formModel.Address ? formModel.Address : model.Address;
    model.ReceiverName = formModel.ReceiverName ? formModel.ReceiverName : model.ReceiverName;
    model.ReceiverPhone = formModel.ReceiverPhone ? formModel.ReceiverPhone : model.ReceiverPhone;
    model.ReceiverDate = formModel.ReceiverDate ? formModel.ReceiverDate : model.ReceiverDate;
    model.ReceiverAddress = formModel.ReceiverAddress ? formModel.ReceiverAddress : model.ReceiverAddress;
    model.ReceiverNote = formModel.ReceiverNote ? formModel.ReceiverNote : model.ReceiverNote;
    model.User = formModel.User ? formModel.User : model.User;
    model.UserId = formModel.User ? formModel.User.Id : model.UserId;
    model.DateOrderRed = formModel.DateOrderRed ? formModel.DateOrderRed : model.DateOrderRed;
    model.State = formModel.State ? formModel.State : model.State;
    model.DateInvoice = formModel.DateInvoice ? formModel.DateInvoice : model.DateInvoice;
    model.NumberOrder = formModel.NumberOrder ? formModel.NumberOrder : model.NumberOrder;
    model.Comment = formModel.Comment ? formModel.Comment : model.Comment;
    model.Seri = formModel.Seri ? formModel.Seri : model.Seri;
    model.WeightTotal = formModel.WeightTotal ? formModel.WeightTotal : model.WeightTotal;
    model.DiscountAmount = formModel.DiscountAmount ? formModel.DiscountAmount : model.DiscountAmount;
    model.Discount = formModel.Discount ? formModel.Discount : model.Discount;
    model.DecreaseAmount = formModel.DecreaseAmount ? formModel.DecreaseAmount : model.DecreaseAmount;
    model.AmountUntaxed = formModel.AmountUntaxed ? formModel.AmountUntaxed : model.AmountUntaxed;
    model.Type = formModel.Type ? formModel.Type : model.Type;
    model.SaleOrder = formModel.SaleOrder ? formModel.SaleOrder : model.SaleOrder;
    model.AmountTotal = formModel.AmountTotal ? formModel.AmountTotal : model.AmountTotal;
    model.TotalQuantity = formModel.TotalQuantity ? formModel.TotalQuantity : model.TotalQuantity;
    model.Tax = formModel.Tax ? formModel.Tax : model.Tax;
    model.TaxId = formModel.Tax ? formModel.Tax.Id : model.TaxId;
    model.OrderLines = formModel.OrderLines ? formModel.OrderLines : model.OrderLines;

    return model;
  }

}
