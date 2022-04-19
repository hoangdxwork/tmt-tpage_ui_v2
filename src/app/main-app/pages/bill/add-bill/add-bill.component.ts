import { formatNumber } from '@angular/common';
import { TDSModalService, TDSHelperObject, TDSMessageService, TDSHelperArray, TDSSafeAny, TDSHelperString } from 'tmt-tang-ui';
import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { ModalSearchPartnerComponent } from '../components/modal-search-partner/modal-search-partner.component';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { SaleConfigsDTO, SaleSettingDTO } from 'src/app/main-app/dto/configs/sale-config.dto';
import { SharedService } from 'src/app/main-app/services/shared.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AccountRegisterPaymentService } from 'src/app/main-app/services/account-register-payment.service';
import { formatDate } from '@angular/common';
import { PartnerCategoryDTO } from 'src/app/main-app/dto/partner/partner-category.dto';
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
import { CalculatorFeeV2DTO } from 'src/app/main-app/dto/fastsaleorder/calculate-feeV2.dto';
import { CalculatorListFeeDTO } from 'src/app/main-app/dto/fastsaleorder/calculate-listFee.dto';
import { ModalEditPartnerComponent } from '../../partner/components/modal-edit-partner/modal-edit-partner.component';
import { SuggestCitiesDTO, SuggestDistrictsDTO, SuggestWardsDTO } from 'src/app/main-app/dto/suggest-address/suggest-address.dto';
import { ResultCheckAddressDTO } from 'src/app/main-app/dto/address/address.dto';
import { TaxDTO } from 'src/app/main-app/dto/tax/tax.dto';

@Component({
  selector: 'app-add-bill',
  templateUrl: './add-bill.component.html',
})

export class AddBillComponent implements OnInit, OnDestroy {

  _form!: FormGroup;
  id: any;
  isLoading: boolean = false;

  dataModel!: FastSaleOrder_DefaultDTOV2;
  roleConfigs!: SaleSettingDTO;
  lstCarriers!: Observable<DeliveryCarrierDTOV2[]>;
  lstPaymentJournals!: Observable<AccountJournalPaymentDTO[]>;
  lstPrices!: Observable<PartnerCategoryDTO[]>;
  lstCustomers!: Observable<CustomerDTO[]>;
  lstWareHouses!: Observable<StockWarehouseDTO[]>;
  lstTeams!: Observable<AllFacebookChildTO[]>;
  lstUser!: Observable<ApplicationUserDTO[]>;
  lstTax!: TaxDTO[];

  _cities!: SuggestCitiesDTO;
  _districts!: SuggestDistrictsDTO;
  _wards!: SuggestWardsDTO;
  _street!: string;

  keyFilter!: '';
  page: number = 1;
  limit: number = 20;

  totalAmountLines: number = 0;
  totalQtyLines: number = 0;
  priceListItems: any;

  enableInsuranceFee: boolean = false;
  visiblePopoverDiscount: boolean = false;
  visiblePopoverTax: boolean = false;
  visibleDiscountLines: boolean = false;
  indClickTag = -1;

  apiDeliveries: any = ['GHTK', 'ViettelPost', 'GHN', 'TinToc', 'SuperShip', 'FlashShip', 'OkieLa', 'MyVNPost', 'DHL', 'FulltimeShip', 'JNT', 'EMS', 'AhaMove', 'Snappy', 'NhatTin', 'HolaShip'];
  carrierTypeInsurance = ["MyVNPost", "GHN", "GHTK", "ViettelPost", "NinjaVan"];

  shipServices: any = [];
  shipExtraServices: any = [];
  lstCalcFee!: CalculatorListFeeDTO[];

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
        PartnerId: [null],
        PriceList: [null],
        PriceListId: [null],
        Warehouse: [null],
        WarehouseId: [null],
        PaymentJournal: [null],
        PaymentAmount: [0],
        Team: [null],
        TeamId: [null],
        Deliver: [null],
        PreviousBalance: [null],
        Reference: [null],
        Revenue: [null],
        Carrier: [null],
        CarrierId: [null],
        DeliveryPrice: [null],
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
        UserId: [null],
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
        AmountTax: [0],
        Type: [null],
        SaleOrder: [null],
        AmountTotal: [0],
        TotalQuantity: [0],
        Tax: [null],
        TaxId: [null],
        Ship_ServiceId: [null],
        Ship_ServiceName: [null],
        Ship_ExtrasText: [null],
        Ship_ServiceExtrasText: [null],
        Ship_Extras: [null],
        Ship_ServiceExtras: this.fb.array([]),
        OrderLines: this.fb.array([])
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
                 data.Carrier?.DeliveryType === "MyVNPost" || item.Id === "NinjaVan"))
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

      this.mappingAddress(this.dataModel);
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

    let totalQty = 0;
    let totalPrice = 0;
    if (TDSHelperArray.hasListValue(data.OrderLines)) {
        data.OrderLines.forEach((x: OrderLine) => {
            this.addOrderLines(x);
            totalQty = totalQty + x.ProductUOMQty;
            totalPrice = totalPrice + x.PriceTotal;
        });
    }

    this.totalQtyLines = totalQty;
    this.totalAmountLines = totalPrice;
    this._form.patchValue(data);
  }

  mappingAddress(data: any) {
      if(data && data.Ship_Receiver.City?.code) {
          this._cities = {
              code: data.Ship_Receiver.City.code,
              name: data.Ship_Receiver.City.name
          }
      }
      if(data && data.Ship_Receiver.District?.code) {
          this._cities = {
              code: data.Ship_Receiver.District.code,
              name: data.Ship_Receiver.District.name
          }
      }
      if(data && data.Ship_Receiver.Ward?.code) {
          this._cities = {
              code: data.Ship_Receiver.Ward.code,
              name: data.Ship_Receiver.Ward.name
          }
      }
      if(data && data.Ship_Receiver.Street) {
          this._street = data.Ship_Receiver.Street;
      }
  }

  onLoadSuggestion(item: ResultCheckAddressDTO) {
    this._form.controls['Ship_Receiver'].patchValue({
        Street: item.Address ? item.Address : null,
        City: item.CityCode ? { code: item.CityCode, name: item.CityName } : null,
        District: item.DistrictCode ? { code: item.DistrictCode, name: item.DistrictName } : null,
        Ward: item.WardCode ? { code: item.WardCode, name: item.WardName } : null
    });
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

  changePartner(partnerId: any) {
    this.partnerService.getById(partnerId).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      if(data) {
          delete data['@odata.context'];

          this._form.controls['Partner'].setValue(data);
          this._form.controls['PartnerId'].setValue(data.Id);
          this._form.controls["Ship_Receiver"].reset();

          let model = this.prepareModel();

          this.fastSaleOrderService.onChangePartnerPriceList({ model: model }).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
              delete res["@odata.context"];

              this._form.controls['PriceList'].setValue(res.PriceList);
              this._form.controls['PriceListId'].setValue(res.PriceList?.Id);
              this._form.controls['Revenue'].setValue(res.Revenue);
              this._form.controls['DeliveryNote'].setValue(res.DeliveryNote);

              //TODO: Cập nhật lại nợ cũ
              this._form.controls['PreviousBalance'].setValue(res.PreviousBalance);
              //TODO: Cập nhật lại dataSuggestion
              if (res && res.Ship_Receiver) {
                this._form.controls['Ship_Receiver'].patchValue({
                    Street: res.Ship_Receiver.Street,
                    City: res.Ship_Receiver.City ? {
                        code: res.Ship_Receiver.City.code,
                        name: res.Ship_Receiver.City.name
                    } : null,
                    District: res.Ship_Receiver.District ? {
                        code: res.Ship_Receiver.District.code,
                        name: res.Ship_Receiver.District.name
                    }: null,
                    Ward: res.Ship_Receiver.Ward ? {
                        code: res.Ship_Receiver.Ward.code,
                        name: res.Ship_Receiver.Ward.name
                    } :null
                })
              }
          }, error => {
              this.message.error('Thay đổi khách hàng đã xảy ra lỗi!')
          });
      }
    }, error => {
      this.message.error('Không tìm thấy khách hàng!');
    })
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

  onChangeWarehouse(event: any) {
    if(event && event.Id){
      this._form.controls['Warehouse'].setValue(event);
      this._form.controls['WarehouseId'].setValue(event.Id);
    }
  }

  onChangePayment(event: any) {
    if(event && event.Id){
      this._form.controls['PaymentJournal'].setValue(event);
      this._form.controls['PaymentJournalId'].setValue(event.Id);
    }
  }

  onChangeTeam(event: any) {
    if(event && event.Id){
      this._form.controls['Team'].setValue(event);
      this._form.controls['TeamId'].setValue(event.Id);
    }
  }

  onChangeUser(event: any) {
    if(event && event.Id) {
        this._form.controls['User'].setValue(event);
        this._form.controls['UserId'].setValue(event.Id);
    }
  }

  onChangeCarrier(event: DeliveryCarrierDTOV2) {
    if(TDSHelperObject.hasValue(event)) {
        this.shipServices = [];
        this.shipExtraServices = [];
        this._form.setControl('Ship_ServiceExtras', this.fb.array([]));

        this.enableInsuranceFee = true;
        this._form.controls['Carrier'].setValue(event);
        this._form.controls['CarrierId'].setValue(event.Id);

        //TODO: Cập nhật giá trị ship mặc định
        this._form.controls['DeliveryPrice'].setValue(event.Config_DefaultFee || 0);
        let cashOnDelivery = this._form.controls['AmountTotal'].value + this._form.controls['DeliveryPrice'].value;

        this._form.controls['CashOnDelivery'].setValue(cashOnDelivery || 0);
        this._form.controls['ShipWeight'].setValue(event.Config_DefaultWeight || 100);

        if(TDSHelperString.hasValueString(event.ExtrasText)) {
            this._form.controls['Ship_Extras'].setValue(JSON.parse(event.ExtrasText));
        }

        this.updateCoDAmount();
        //TODO: Check giá trị mặc định trước khi gửi
        this.calcServiceDefault();
        this.initOkieLa();
        this.initNinjaVan();
        this.initZTO();
        this.calculateFee(event).then(() => { });
    }
  }

  calcServiceDefault(){
      const formModel = this._form.value as FastSaleOrder_DefaultDTOV2;
      if(formModel.Carrier){
        switch(formModel.Carrier?.DeliveryType){
            case 'ViettelPost':
              formModel.Ship_ServiceId = formModel.Carrier?.ViettelPost_ServiceId;

              if (formModel.Ship_Extras && formModel.Ship_Extras.IsDropoff) {
                  this.shipExtraServices.push({
                    ServiceId: "GNG",
                    ServiceName: "Gửi tại bưu cục(Giảm 10% cước)",
                    Fee: 0,
                    IsSelected: true
                  });
              }
              if (formModel.Ship_Extras && formModel.Ship_Extras.ServiceCustoms) {
                formModel.Ship_Extras.ServiceCustoms.forEach(x => {
                  this.shipExtraServices.push( {
                      ServiceId: x.ServiceId,
                      ServiceName: x.Name,
                      Fee: 0,
                      IsSelected: x.IsDefault
                    });
                })
              }
              if (formModel.Ship_Extras && formModel.Ship_Extras.IsCollectMoneyGoods) {
                this.shipExtraServices.push({
                    ServiceId: "XMG",
                    ServiceName: "Thu tiền xem hàng",
                    Fee: 0,
                    IsSelected: true,
                  });
              }
            break;
            case 'GHN':
              formModel.Ship_ServiceId = formModel.Carrier?.GHN_ServiceId;
              if (formModel.Ship_Extras && formModel.Ship_Extras.IsDropoff) {
                this.shipExtraServices.push(
                  {
                    ServiceId: "53337",
                    ServiceName: "Gửi hàng tại điểm",
                    Fee: 0,
                    IsSelected: true
                  });
              }
            break;
            case 'MyVNPost':
              formModel.Ship_ServiceId = formModel.Carrier?.ViettelPost_ServiceId;
              if (formModel.Ship_Extras && formModel.Ship_Extras.IsPackageViewable) {
                this.shipExtraServices.push(
                  {
                    ServiceId: "IsPackageViewable",
                    ServiceName: "Cho xem hàng?",
                    Fee: 0,
                    IsSelected: true
                  });
              }
            break;
            case 'OkieLa':
              if (formModel.Ship_Extras && formModel.Ship_Extras.IsPackageViewable) {
                this.shipExtraServices.push(
                  {
                    ServiceId: "check_before_accept",
                    ServiceName: "Cho xem hàng?",
                    Fee: 0,
                    IsSelected: true
                  });
              }
              if (formModel.Ship_Extras && formModel.Ship_Extras.Is_Fragile) {
                this.shipExtraServices.push(
                  {
                    ServiceId: "is_fragile",
                    ServiceName: "Hàng dễ vỡ",
                    Fee: 0,
                    IsSelected: true
                  });
              }
            break;
            case 'DHL':
              if (formModel.Ship_Extras && formModel.Ship_Extras.IsPackageViewable) {
                this.shipExtraServices.push(
                  {
                    ServiceId: "OBOX",
                    ServiceName: "Cho khách xem hàng?",
                    Fee: 0,
                    IsSelected: true
                  });
              }
            break;
        }
      }

      //TODO: Bảo hiểm hàng hóa
      if (formModel.Ship_Extras && formModel.Ship_Extras.IsInsurance) {

        if (!formModel.Ship_InsuranceFee) {
          this._form.controls['Ship_InsuranceFee'].setValue(formModel.Ship_Extras.InsuranceFee || formModel.AmountTotal);
        }
        switch(formModel.Carrier?.DeliveryType) {
          case "MyVNPost":
            this.shipExtraServices.push(
              {
                ServiceId: "OrderAmountEvaluation",
                ServiceName: "Khai giá",
                Fee: 0,
                IsSelected: true
              });
            break;
          case "GHTK":
            this.shipExtraServices.push(
              {
                ServiceId: "16",
                ServiceName: "Bảo hiểm hàng hóa",
                Fee: 0,
                IsSelected: true
              });
            break;
          case "ViettelPost":
            this.shipExtraServices.push(
              {
                ServiceId: "GBH",
                ServiceName: "Bảo hiểm",
                Fee: 0,
                IsSelected: true
              });
            break;
        }
      }
  }

  initOkieLa(){
    !this.shipExtraServices && (this.shipExtraServices = []);
    if (this._form.controls['Carrier'].value && this._form.controls['Carrier'].value.Carrier?.DeliveryType === 'OkieLa' && this.shipExtraServices.length === 0) {
      this.shipExtraServices = [
        {
          ServiceId: 'is_fragile',
          ServiceName: 'Hàng dễ vỡ?',
          Fee: 0,
          IsSelected: true
        },
        {
          ServiceId: 'check_before_accept',
          ServiceName: 'Cho khách xem hàng?',
          Fee: 0,
          IsSelected: true
        }
      ];
    }
  }

  initNinjaVan() {
    const formModel = this._form.value;
    if (formModel.Carrier && formModel.Carrier?.DeliveryType === 'NinjaVan' && formModel.Ship_Extras) {
      this.shipExtraServices = [];
      this.shipExtraServices.push({
          ServiceId: "NinjaVan",
          ServiceName: "Khai giá hàng hóa",
          Fee: formModel.Ship_Extras.InsuranceFee ? formModel.Ship_Extras.InsuranceFee : 0,
          IsSelected: formModel.Ship_Extras.IsInsurance ? formModel.Ship_Extras.IsInsurance : false,
      });

      this.enableInsuranceFee = formModel.Ship_Extras.IsInsurance ? formModel.Ship_Extras.IsInsurance : false;
      this._form.controls['Ship_InsuranceFee'].setValue(formModel.Ship_Extras.InsuranceFee ? formModel.Ship_Extras.InsuranceFee : 0);
    }
  }

  initZTO() {
    const formModel = this._form.value;
    if (formModel.Carrier && formModel.Carrier?.DeliveryType === 'ZTO') {
      this.shipServices = [
        { ServiceId: "0", ServiceName: "Express" },
        { ServiceId: "1", ServiceName: "Ordinary Express" }
      ];
      this._form.controls['Ship_ServiceId'].setValue(formModel.CarrierConfig_TransportId);
    }
  }

  calcFeeList() {
    let model = this.prepareModel();
    this.isLoading = true;
    this.fastSaleOrderService.calculateListFee({ model: model }).subscribe((res: any) => {

      this.lstCalcFee = res.value;
      var exits = this.lstCalcFee.filter((x: CalculatorListFeeDTO) => x.CarrierId === model.Carrier?.Id)[0];
      if (exits) {
        this.setCarrier(exits);
      }

      this.isLoading = true;
    }, error => {
        this.message.error(`${error.message}` || 'Gợi ý tính phí đã xảy ra lỗi!');
        this.isLoading = true;
    });
  }

  calculateFee(event: DeliveryCarrierDTOV2): any {
    let promise = new Promise((resolve, reject): any => {
      if(this.apiDeliveries.includes(event.DeliveryType)) {

        let model = this.prepareModelFeeV2();
        this.isLoading = true;

        this.fastSaleOrderService.calculateFeeV2(model).subscribe((res: CalculatorFeeV2DTO) => {
          if(res) {
            //TODO: Cập nhật lại phí ship\
            this._form.controls['CustomerDeliveryPrice'].setValue(res.TotalFee);

            if (res.Services && res.Services.length > 0) {
                this.shipServices = res.Services;
                this.selectShipService(this.shipServices[0]);
            }

            this.isLoading = false;
            this.message.success(`Đối tác ${event.Name} có phí vận chuyển: ${formatNumber(Number(res.TotalFee), 'en-US', '1.0-0')} đ`);
            resolve(res);
          }
        }, error => {
            this.isLoading = false;
            this.message.error(`${error.error_description}` || 'Tính phí đã xảy ra lỗi!');
            reject(error);
        })
      }
    });

    return promise;
  }

  setCarrier(item: CalculatorListFeeDTO) {
    this.shipServices = [];
    this.shipExtraServices = [];
    this.enableInsuranceFee = false;
    const formModel = this._form.value as FastSaleOrder_DefaultDTOV2;

    this._form.controls['Ship_ServiceExtrasText'].setValue(JSON.stringify(formModel.Ship_ServiceExtras || null));
    if(this.enableInsuranceFee && !this._form.controls['Ship_InsuranceFee'].value) {
      if(formModel.Ship_Extras) {
          this._form.controls['Ship_InsuranceFee'].setValue(formModel.Ship_Extras.InsuranceFee || formModel.AmountTotal);
      } else {
        this._form.controls['Ship_InsuranceFee'].setValue(formModel.AmountTotal);
      }
    } else if(!this.enableInsuranceFee) {
      this._form.controls['Ship_InsuranceFee'].setValue(0);
    }

    if (formModel.Carrier && formModel.Carrier?.DeliveryType == 'NinjaVan') {
      this._form.controls['Ship_ServiceId'].setValue('Standard');
      this._form.controls['Ship_ServiceName'].setValue('Tiêu chuẩn');
    }

    if (!formModel.CashOnDelivery) {
      this._form.controls['CashOnDelivery'].setValue(0);
    }
    const model = this.prepareModel();

    this._form.controls['Carrier'].patchValue({
        Id: item.CarrierId,
        Name: item.CarrierName,
        DeliveryType: item.DeliveryType,
        Config_DefaultFee: item.Config_DefaultFee || 0,
        Config_DefaultWeight: item.Config_DefaultWeight,
        ExtrasText: item.ExtrasText,
        Extras: item.ExtrasText ? JSON.parse(item.ExtrasText) : null
    });

    this._form.controls['CustomerDeliveryPrice'].setValue(item.TotalFee);
    this._form.controls['DeliveryPrice'].setValue(model.Carrier.Config_DefaultFee || 0);

    if (TDSHelperArray.hasListValue(item.Services)) {
      this.shipServices = item.Services;
      if (model.Carrier.Extras) {
        this._form.controls['Ship_Extras'].setValue(model.Carrier.Extras);
      }

      this.selectShipService(this.shipServices[0]);
    }

    if (item.DeliveryType === 'GHTK') {
      this.shipExtraServices = [
        {
          ServiceId: '16',
          ServiceName: "Bảo hiểm hàng hóa",
          Fee: 0
        }
      ];
    }
    if ((item.DeliveryType === "ViettelPost" || item.DeliveryType === "GHN") && model.Ship_Extras && model.Ship_Extras.IsDropoff) {
      if (this.shipExtraServices) {
        this.shipExtraServices.map((x: any) => {
          if (x.ServiceId === '53337' && model.Carrier.DeliveryType === 'GHN') {
            x.IsSelected = true;
          }

          if (x.ServiceId === 'GNG' && model.Carrier.DeliveryType === 'ViettelPost') {
            x.IsSelected = true;
          }
        });
      }
    }
    // Bảo hiểm
    if (this.carrierTypeInsurance.includes(item.DeliveryType) && model.Ship_Extras && model.Ship_Extras.IsInsurance) {
      this.shipExtraServices.map((x: any) => {
        if (x.ServiceId === 'OrderAmountEvaluation' || x.ServiceId === "16" || x.ServiceId === "GBH") {
          x.IsSelected = true;
          this.enableInsuranceFee = true;

          if (!model.Ship_InsuranceFee) {
            this._form.controls['Ship_InsuranceFee'].setValue(model.Ship_Extras.InsuranceFee || model.AmountTotal);
          }
        }
      });
    }
    // Cho xem hàng
    if ((item.DeliveryType === "MyVNPost" || item.DeliveryType === "OkieLa") && model.Ship_Extras && model.Ship_Extras.IsPackageViewable) {
      this.shipExtraServices.map((x: any) => {
        if (x.ServiceId === 'IsPackageViewable' && model.Carrier.DeliveryType === 'MyVNPost') {
          x.IsSelected = true;
        }
        if (x.ServiceId === 'check_before_accept' && model.Carrier.DeliveryType === 'OkieLa') {
          x.IsSelected = true;
        }
      });
    }
    if (item.DeliveryType === "OkieLa" && model.Ship_Extras && model.Ship_Extras.Is_Fragile) {
      this.shipExtraServices.map((x: any) => {
        if (x.ServiceId === 'is_fragile' && model.Carrier.DeliveryType === 'OkieLa') {
          x.IsSelected = true;
        }
      });
    }
  }

  selectShipService(data :any) : void {
    this._form.controls['Ship_ServiceId'].setValue(data.ServiceId);
    this._form.controls['Ship_ServiceName'].setValue(data.ServiceName);
    this._form.controls['CustomerDeliveryPrice'].setValue(data.TotalFee);

    if (this._form.controls['Carrier'].value && this._form.controls['Carrier'].value?.DeliveryType === 'AhaMove') {
      this.shipExtraServices = [];
    }

    let temps = [];
    if (this.shipExtraServices) {
      temps = this.shipExtraServices.map((x: any) => x);
    }

    if (TDSHelperArray.hasListValue(data.Extras)) {
      this.shipExtraServices = data.Extras;
      let listServiceTemp: any = [];

      temps.map((x: TDSSafeAny) => {
        var exist = this.shipExtraServices.filter((s: any) => s.ServiceId === x.ServiceId)[0];
        if (exist) {
            exist.IsSelected = x.IsSelected;
            if (exist.ServiceId == 'XMG' && this._form.controls['Carrier'].value?.DeliveryType == 'ViettelPost' && exist.IsSelected == true) {
              exist.ExtraMoney = (this._form.controls['Ship_Extras'].value && this._form.controls['Ship_Extras'].value.IsCollectMoneyGoods && this._form.controls['Ship_Extras'].value.CollectMoneyGoods) ? this._form.controls['Ship_Extras'].value.CollectMoneyGoods : this._form.controls['CustomerDeliveryPrice'].value || null;
            }
        } else {
            listServiceTemp.push(x);
        }
      });

      if (listServiceTemp)
        listServiceTemp.forEach((item: any) => {
            this.shipExtraServices.push(item);
        });
    } else {
        this.shipExtraServices = [];
    }
  }

  public prepareModelFeeV2(){
    if(!this._form.controls['Partner'].value) {
      return  this.message.error('Vui lòng chọn khách hàng');
    }
    if(!this._form.controls['Carrier'].value) {
      return  this.message.error('Vui lòng chọn  đối tác giao hàng');
    }
    if(!this._form.controls['ShipWeight'].value) {
      return  this.message.error('Vui lòng chọn nhập khối lượng');
    }

    const formModel = this._form.value as FastSaleOrder_DefaultDTOV2;
    const model: any = {
        PartnerId: formModel.Partner?.Id,
        CompanyId: formModel.Company?.Id || this.roleConfigs.CompanyId,
        CarrierId: formModel.Carrier?.Id,
        ServiceId: formModel.Ship_ServiceId || null,
        InsuranceFee: formModel.Ship_InsuranceFee || 0,
        ShipWeight: formModel.ShipWeight,
        CashOnDelivery: formModel.CashOnDelivery,
        ServiceExtras: [],
        Ship_Receiver: {}
    }

    this.shipExtraServices || (this.shipExtraServices = []);
    this.shipExtraServices.map((x: any) => {
      if(x.IsSelected) {
        model.ServiceExtras.push({
            Id: x.ServiceId,
            Name: x.ServiceName,
            Fee: x.Fee,
            Type: x.Type,
            ExtraMoney: x.ExtraMoney
        });
      }
    })

    if (!formModel.Ship_Extras && formModel.Carrier && formModel.Carrier.Extras) {
      this._form.controls['Ship_Extras'].setValue(formModel.Carrier.Extras);
    }

    if (!this.enableInsuranceFee) {
      model.Ship_InsuranceFee = 0;
    } else {
      if (!model.Ship_InsuranceFee) {
        if (formModel.Ship_Extras) {
          model.Ship_InsuranceFee = formModel.Ship_Extras.InsuranceFee || formModel.AmountTotal;
        } else {
          model.Ship_InsuranceFee = formModel.AmountTotal;
        }
      }
    }

    if (formModel.Ship_Receiver) {
      model.Ship_Receiver = {
        Name: formModel.Ship_Receiver.Name,
        Street: formModel.Ship_Receiver.Street,
        Phone: formModel.Ship_Receiver.Phone,

        City: formModel.Ship_Receiver.City.code ? {
          code: formModel.Ship_Receiver.City.code,
          name: formModel.Ship_Receiver.City.name
        } : null,

        District: formModel.Ship_Receiver.District.code ? {
          code: formModel.Ship_Receiver.District.code,
          name: formModel.Ship_Receiver.District.name
        } : null,

        Ward: formModel.Ship_Receiver.Ward.code ? {
          code: formModel.Ship_Receiver.Ward.code,
          name: formModel.Ship_Receiver.Ward.name
        } : null
      };
    }

    return model;
  }

  changeDeliveryPrice(event: any) {
    if(event){
      this._form.controls['DeliveryPrice'].setValue(event);
      this.updateCoDAmount();
    }
  }

  changeAmountDeposit(event: any) {
    if(event){
      this._form.controls['AmountDeposit'].setValue(event);
      this.updateCoDAmount();
    }
  }

  changeShipWeight(event: any): any {
    if (!this._form.controls['Carrier'].value) {
      return this.message.error('Vui lòng chọn đối tác giao hàng!');
    }

    let model = this._form.controls['Carrier'].value;
    this.calculateFee(model).then((res: any) => {
      if (res.Costs) {
        res.Costs.map((x: any) => {
          var exist = this.shipExtraServices.filter((x: any) => x.ServiceId === x.ServiceId)[0];
          if (exist) {
            exist.Fee = x.TotalFee;
          }
        });
      }
    });
  }

  openTrackingOrderGHN() {
    let key = this.dataModel.TrackingRef;
    this.fastSaleOrderService.getTokenTrackingOrderGHN({ key: key }).subscribe((res: any) => {
      if (res.Success && res.data) {
          this.message.success('Thao tác thành công!');
          let urlTrackingOrder = res.data.UrlTrackingOrder;
          window.open(urlTrackingOrder, '_blank');
      } else {
        this.message.error(res.Message);
      }
    }, error => {
        this.message.error('Đã xảy ra lỗi!');
    });
  }

  public openTrackingOrderAhaMove() {
    let key = this.dataModel.TrackingRef;
    this.fastSaleOrderService.getTrackingOrderAhaMove({ key: key }).subscribe((res: any) => {
      if (res.Success && res.data) {
          this.message.success('Thao tác thành công!');
          let urlTrackingOrder = res.data.UrlTrackingOrder;
          window.open(urlTrackingOrder, '_blank');
      } else {
          this.message.error(res.Message);
      }
    }, error => {
        this.message.error('Đã xảy ra lỗi!');
    });
  }

  onChangeQuantity(event: any, item: any, index: number) {
    let datas = this._form.controls['OrderLines'].value;
    if(TDSHelperArray.hasListValue(datas)) {
      datas.map((x: any) => {
        if (x.ProductId == item.ProductId && x.ProductUOMId == item.ProductUOMId) {
            x.ProductUOMQty = event;
        }
      });

      this.computeAmountTotal();
    }
  }

  onChangePriceUnit(event: any, item: any, index: number) {
    let datas = this._form.controls['OrderLines'].value;
    if(TDSHelperArray.hasListValue(datas)) {
      datas.map((x: any) => {
          if (x.ProductId == item.ProductId && x.ProductUOMId == item.ProductUOMId) {
              x.PriceUnit = event;
          }
      });
      this.computeAmountTotal();
    }
  }

  openDiscountLines(id: number) {
    this.indClickTag = id;
  }

  closePopoverDiscountLines() {
    this.indClickTag = -1;
  }

  changeProductDiscountType(event: any, item: any, typeDiscount: string, i: number) {
    let datas = this._form.controls['OrderLines'].value;
    if(TDSHelperArray.hasListValue(datas)) {
        datas.map((x: any, index: number) => {
          if (x.ProductId == item.ProductId && x.ProductUOMId == item.ProductUOMId && i == index) {
              x[`${typeDiscount}`] = event;
          }
        });
    }
    this.computeAmountTotal();
  }

  selectProductType(item: any, type: string, i: number) {
    let datas = this._form.controls['OrderLines'].value;
    if(TDSHelperArray.hasListValue(datas)) {
        datas.map((x: any, index: number) => {
          if (x.ProductId == item.ProductId && x.ProductUOMId == item.ProductUOMId && i == index) {
              x.Type = type;
              x.Discount = 0;
              x.Discount_Fixed = 0;
          }
        });
    }
    this.computeAmountTotal();
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
    this.visiblePopoverTax = true;
    this.fastSaleOrderService.getTax().subscribe((res: any) => {
        if(TDSHelperArray.hasListValue(res.value)) {
            this.lstTax = res.value;
            this.lstTax = this.lstTax.sort((a, b) => a.Amount - b.Amount);
        }
    });
  }

  closePopoverTax() {
    this.visiblePopoverTax = false;
  }

  selectTax(tax: any) {
    this._form.controls['Tax'].setValue(tax);
    this._form.controls['TaxId'].setValue(tax?.Id);

    this.computeAmountTotal();
  }

  applyPopoverTax() {
    this.visiblePopoverTax = false
  }

  showModalSearchPartner() {
    const modal = this.modalService.create({
        title: 'Tìm kiếm khách hàng',
        content: ModalSearchPartnerComponent,
        size: "xl",
        viewContainerRef: this.viewContainerRef
    });
    modal.afterClose.subscribe(result => {
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

    this.computeAmountTotal();
  }

  removeOrderLines(item: OrderLine, index: number) {
    (<FormArray>this._form.controls['OrderLines']).removeAt(index);

    this.totalQtyLines = Number(this.totalQtyLines - item.ProductUOMQty);
    this.totalAmountLines = Number(this.totalAmountLines - item.PriceTotal);
    this.computeAmountTotal();
  }

  removeAllOrderLines(){
    let model = <FormArray>this._form.controls['OrderLines'];
    model.clear();
    model.setValue([])

    this.totalQtyLines = 0;
    this.totalAmountLines = 0;

    this._form.controls['TotalQuantity'].setValue(0);
    this._form.controls['DecreaseAmount'].setValue(0);
    this._form.controls['DiscountAmount'].setValue(0);
    this._form.controls['Discount'].setValue(0);
    this._form.controls['Tax'].setValue(null);
    this._form.controls['TaxId'].setValue(null);
    this._form.controls['AmountTax'].setValue(0);
    this._form.controls['AmountUntaxed'].setValue(0);
    this._form.controls['AmountTotal'].setValue(0);

    this.computeAmountTotal();
  }

  computeAmountTotal() {
    let datas = this._form.controls['OrderLines'].value as Array<OrderLine>;
    if(TDSHelperArray.hasListValue(datas)) {
        datas.forEach((x: OrderLine) => {
            x.Discount = x.Discount ? x.Discount : 0;
            x.PriceTotal = (x.PriceUnit * (1 - (x.Discount || 0) / 100) - (x.Discount_Fixed || 0)) * x.ProductUOMQty;
            x.WeightTotal = Math.round(x.ProductUOMQty * x.Weight * 1000) / 1000;
        });

        //TODO: Tính giá trị tổng bao gồm ShipWeight,WeightTotal,DiscountAmount,AmountUntaxed,PaymentAmount,TotalQuantity,AmoutTotal
        this.updateTotalSummary(datas);
        this.updateQuantitySummary(datas);
    }
    //TODO: update lại Giao hàng thu tiền
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

    //TODO: Gán lại khối lượng ship
    this._form.controls['WeightTotal'].setValue(weightTotal);
    if (weightTotal > 0) {
        this._form.controls['ShipWeight'].setValue(weightTotal * 1000);
    }

    //TODO: Gán lại tiền giảm DiscountAmount
    this.totalAmountLines = total;
    let discountAmount = Math.round(this.totalAmountLines * (this._form.controls['Discount'].value / 100));
    this._form.controls['DiscountAmount'].setValue(discountAmount);

    total = total - this._form.controls['DiscountAmount'].value - this._form.controls['DecreaseAmount'].value;
    this._form.controls['AmountUntaxed'].setValue(total);

    //TODO: Tính thuế để gán lại tổng tiền AmountTotal
    this.calcTax();

    //TODO: Gán lại số tiền trả PaymentAmount;
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
    if(!TDSHelperObject.hasValue(model.Partner)) {
        return this.message.error('Vui lòng chọn khách hàng!');
    }
    if(!TDSHelperArray.hasListValue(model.OrderLines)) {
        return this.message.error('Vui lòng chọn ít nhất 1 sản phẩm!');
    }

    if(this.id) {
      this.isLoading = true;
      this.fastSaleOrderService.update(this.id, model).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
          this.isLoading = false;
          this.message.success('Cập nhật phiếu bán hàng thành công!');
      }, error => {
          this.isLoading = false;
          this.message.error(`${error.error.message}` || 'Cập nhật phiếu bán hàng thất bại!');
      })
    } else {
      this.isLoading = true;
      this.fastSaleOrderService.insert(model).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
          this.isLoading = false;
          this.message.success('Tạo mới phiếu bán hàng  thành công!');
      }, error => {
          this.isLoading = false;
          this.message.error(`${error.error.message}`|| 'Tạo mới phiếu bán hàng thất bại!');
      });
    }
  }

  onBack() {
    history.back();
  }

  showStatus(status: string): any {
    switch (status) {
      case 'draft':
          return 'Nháp';
      case 'cancel':
          return 'Huỷ bỏ';
      case 'open':
          return 'Xác nhận';
      case 'paid':
          return 'Đã thanh toán';
    }
  }

  editPartner(data: any) {
    const modal = this.modalService.create({
        title: 'Sửa Khách hàng',
        content: ModalEditPartnerComponent,
        size: "xl",
        viewContainerRef: this.viewContainerRef,
        centered: true,
        componentParams: {
            partnerId: data.Id
        }
    });
    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe((event: any) => {
      if(event) {
          this.changePartner(event);
      }
    })
  }

  createPartner() {
    const modal = this.modalService.create({
        title: 'Sửa Khách hàng',
        content: ModalEditPartnerComponent,
        size: "xl",
        viewContainerRef: this.viewContainerRef,
        centered: true,
        componentParams: {}
    });
    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe((event: any) => {
      if(event) {
          this.changePartner(event);
      }
    })
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
