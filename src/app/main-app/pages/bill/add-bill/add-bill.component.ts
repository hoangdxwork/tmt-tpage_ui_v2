import { TDSModalService, TDSHelperObject, TDSMessageService } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ModalSearchPartnerComponent } from '../components/modal-search-partner/modal-search-partner.component';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { FastSaleOrder_DefaultDTOV2 } from 'src/app/main-app/dto/fastsaleorder/fastsaleorder-default.dto';
import { SaleConfigsDTO, SaleSettingDTO } from 'src/app/main-app/dto/configs/sale-config.dto';
import { SharedService } from 'src/app/main-app/services/shared.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DeliveryCarrierService } from 'src/app/main-app/services/delivery-carrier.service';
import { DeliveryCarrierDTOV2, ODataDeliveryCarrierDTOV2 } from 'src/app/main-app/dto/delivery-carrier.dto';
import { AccountRegisterPaymentService } from 'src/app/main-app/services/account-register-payment.service';
import { AccountJournalPaymentDTO, ODataAccountJournalPaymentDTO } from 'src/app/main-app/dto/register-payment/register-payment.dto';
import { formatDate } from '@angular/common';
import { ODataPartnerCategoryDTO, PartnerCategoryDTO } from 'src/app/main-app/dto/partner/partner-category.dto';
import { CommonService } from 'src/app/main-app/services/common.service';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { CustomerDTO, ODataCustomerDTO } from 'src/app/main-app/dto/partner/customer.dto';

@Component({
  selector: 'app-add-bill',
  templateUrl: './add-bill.component.html',
})
export class AddBillComponent implements OnInit {

  _form!: FormGroup;

  dataModel!: FastSaleOrder_DefaultDTOV2;
  roleConfigs!: SaleSettingDTO;
  lstCarriers!: DeliveryCarrierDTOV2[];
  lstPaymentJournals!: AccountJournalPaymentDTO[];
  lstPrice!: PartnerCategoryDTO[];
  lstCustomers!: CustomerDTO[];

  keyFilter!: '';
  page: number = 1;
  limit: number = 20;

  visiblePopoverDiscount: boolean = false;
  visiblePopoverTax: boolean = false;
  tabsAddBill = [
    {
      name: 'Thông tin',
    },
    {
      name: 'Thông tin giao hàng',
    },
    {
      name: 'Thông tin người nhận',
    },
    {
      name: 'Thông tin Khác',
    }
  ];
  // select tên khách hàng
  public optionsInfoNamePartner = [
    { id: 1, name: 'Elton John' },
    { id: 2, name: 'Elvis Presley' },
    { id: 3, name: 'Paul McCartney' },
    { id: 4, name: 'Elton John' },
    { id: 5, name: 'Elvis Presley' },
    { id: 6, name: 'Paul McCartney' },
  ]
  // select tên bảng giá
  public optionsPriceList= [
    { id: 1, name: 'Bảng giá mặc định' },
    { id: 2, name: 'Bảng giá mới' }
  ]
  // select phương thức tiền
  public optionsPricemethod= [
    { id: 1, name: 'Tiền mặt' },
    { id: 2, name: 'Ngân hàng' }
  ]
  // select đối tác giao hàng
  public optionsDelivery= [
    { id: 1, name: 'GHTK' },
    { id: 2, name: 'GHN' }
  ]
  //select người bán
  public optionsSeller= [
    { id: 1, name: 'Tpos.vn' },
    { id: 2, name: 'hihi' }
  ]

  createBill = [
    {id:1 , product:'[SP1128A] Sách Harry Potter', quantity: 1, priceUnit: 100000, priceOld: 200000, discount: 0.05, weight: 100, price: 100000},
    {id:1 , product:'[SP1128A] Sách Harry Potter', quantity: 1, priceUnit: 100000, priceOld: 200000, discount: 200000, weight: 100, price: 100000}
  ]

  constructor(private fb: FormBuilder,
      private partnerService: PartnerService,
      private message: TDSMessageService,
      private deliveryCarrierService: DeliveryCarrierService,
      private sharedService: SharedService,
      private commonService: CommonService,
      private fastSaleOrderService: FastSaleOrderService,
      private modalService: TDSModalService,
      private registerPaymentService: AccountRegisterPaymentService,
      private viewContainerRef: ViewContainerRef) {
        this.createForm();
  }

  ngOnInit(): void {
    this.loadBilDefault();
    this.loadConfig();
    this.loadCarrier();
    this.openPaymentJournals();
    this.openlstPrice();
    this.loadCustomers();
  }

  createForm() {
    this._form = this.fb.group({
        Partner: [null],
    });
  }

  loadBilDefault() {
    let model = { Type: 'invoice' };
    this.fastSaleOrderService.defaultGetV2({model: model}).subscribe((data: any) => {
        delete data['@odata.context'];

        if (this.dataModel.DateCreated) {
          this.dataModel.DateCreated = new Date(this.dataModel.DateCreated);
        }
        if (this.dataModel.DateInvoice) {
          this.dataModel.DateInvoice = new Date(this.dataModel.DateInvoice);
        }
        if (this.dataModel.DateOrderRed) {
          this.dataModel.DateOrderRed = new Date(this.dataModel.DateOrderRed);
        }
        if (this.dataModel.ReceiverDate) {
          this.dataModel.ReceiverDate = new Date(this.dataModel.ReceiverDate);
        }

        this.dataModel = data;
        this.updateForm(this.dataModel);

    }, error => {
        this.message.error('Load thông tin hóa đơn mặc định đã xảy ra lỗi!');
    })
  }

  updateForm(data: FastSaleOrder_DefaultDTOV2) {
      this._form.patchValue(data);
  }

  loadCustomers() {
    this.partnerService.getCustomers(this.page, this.limit, this.keyFilter).subscribe((res: ODataCustomerDTO) => {
        this.lstCustomers = res.value;
    }, error => {
      this.message.error('Load thông tin khách hàng đã xảy ra lỗi!');
    })
  }

  loadConfig() {
    this.sharedService.getConfigs().subscribe((res: SaleConfigsDTO) => {
        this.roleConfigs = res.SaleSetting;
    }, error => {
        this.message.error('Load thông tin cấu hình mặc định đã xảy ra lỗi!');
    });
  }

  loadCarrier() {
    this.deliveryCarrierService.get().subscribe((res: ODataDeliveryCarrierDTOV2) => {
        this.lstCarriers = res.value;
    }, error => {
      this.message.error('Load thông tin đối tác vận chuyển đã xảy ra lỗi!')
    })
  }

  openPaymentJournals() {
    this.registerPaymentService.getWithCompanyPayment().subscribe((res: ODataAccountJournalPaymentDTO) => {
        this.lstPaymentJournals = res.value;
    })
  }

  openlstPrice() {
    let date = formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'en-US');
    this.commonService.getPriceListAvailable(date).subscribe((res: ODataPartnerCategoryDTO) => {
        this.lstPrice = res.value;
    })
  }

  onChangeQuantity(ev: any){

  }

  onChangePriceUnit(ev : any){
  }

  openPopoverDiscount(){
    this.visiblePopoverDiscount = true
  }
  closePopoverDiscount(){
    this.visiblePopoverDiscount = false
  }
  applyPopoverDiscount(){
    this.visiblePopoverDiscount = false
  }

  openPopoverTax(){
    this.visiblePopoverTax = true
  }
  closePopoverTax(){
    this.visiblePopoverTax = false
  }
  applyPopoverTax(){
    this.visiblePopoverTax = false
  }

  showModalSearchPartner(){
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
}
