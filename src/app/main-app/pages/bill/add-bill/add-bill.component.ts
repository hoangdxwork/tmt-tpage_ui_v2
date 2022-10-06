import { DeliveryCarrierV2Service } from './../../../services/delivery-carrier-v2.service';
import { Ward, District, City } from './../../../dto/fastsaleorder/register-payment';
import { SuggestAddressService } from './../../../services/suggest-address.service';
import { Validators } from '@angular/forms';
import { SaleOnlineOrderGetDetailsDto } from './../../../dto/order/so-orderlines.dto';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { TDSDestroyService } from 'tds-ui/core/services';
import { PrepareCopyItemHandler } from '@app/handler-v2/bill-handler/prepare-copy-item.handler';
import { PreparePartnerHandler } from './../../../handler-v2/bill-handler/prepare-partner.handler';
import { CalculateBillFeeHandler } from './../../../handler-v2/bill-handler/calculate-bill-fee.handler';
import { UpdateOrderLinesHandler } from './../../../handler-v2/bill-handler/update-order-lines.handler';
import { GetServiceHandler } from './../../../handler-v2/bill-handler/get-services.handler';
import { PrepareSuggestionsBillHandler } from './../../../handler-v2/bill-handler/prepare-suggestions-bill.handler';
import { formatNumber } from '@angular/common';
import { Component, OnInit, ViewContainerRef, ChangeDetectorRef, HostListener } from '@angular/core';
import { ModalSearchPartnerComponent } from '../components/modal-search-partner/modal-search-partner.component';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { SharedService } from 'src/app/main-app/services/shared.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AccountRegisterPaymentService } from 'src/app/main-app/services/account-register-payment.service';
import { formatDate } from '@angular/common';
import { PartnerCategoryDTO } from 'src/app/main-app/dto/partner/partner-category.dto';
import { CommonService } from 'src/app/main-app/services/common.service';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { FastSaleOrder_DefaultDTOV2, OrderLineV2, ShipServiceExtra } from 'src/app/main-app/dto/fastsaleorder/fastsaleorder-default.dto';
import { DeliveryCarrierDTOV2 } from 'src/app/main-app/dto/delivery-carrier.dto';
import { AccountJournalPaymentDTO } from 'src/app/main-app/dto/register-payment/register-payment.dto';
import { CustomerDTO } from 'src/app/main-app/dto/partner/customer.dto';
import { DeliveryCarrierService } from 'src/app/main-app/services/delivery-carrier.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, map, mergeMap, takeUntil } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { StockWarehouseDTO } from 'src/app/main-app/dto/product/warehouse.dto';
import { AllFacebookChildTO } from 'src/app/main-app/dto/team/all-facebook-child.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ApplicationUserService } from 'src/app/main-app/services/application-user.service';
import { ApplicationUserDTO } from 'src/app/main-app/dto/account/application-user.dto';
import { CalculatorListFeeDTO } from 'src/app/main-app/dto/fastsaleorder/calculate-listFee.dto';
import { ModalEditPartnerComponent } from '../../partner/components/modal-edit-partner/modal-edit-partner.component';
import { SuggestCitiesDTO, SuggestDistrictsDTO, SuggestWardsDTO } from 'src/app/main-app/dto/suggest-address/suggest-address.dto';
import { ResultCheckAddressDTO } from 'src/app/main-app/dto/address/address.dto';
import { TaxDTO } from 'src/app/main-app/dto/tax/tax.dto';
import { DataPouchDBDTO } from 'src/app/main-app/dto/product-pouchDB/product-pouchDB.dto';
import { FastSaleOrderLineService } from 'src/app/main-app/services/fast-sale-orderline.service';
import { FSOrderLines } from 'src/app/main-app/dto/fastsaleorder/fastsale-orderline.dto';
import { CompanyCurrentDTO } from 'src/app/main-app/dto/configs/company-current.dto';
import { SaleSettingsDTO } from 'src/app/main-app/dto/setting/setting-sale-online.dto';
import { AccountTaxService } from 'src/app/main-app/services/account-tax.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { PartnerStatusDTO } from 'src/app/main-app/dto/partner/partner.dto';
import { CalculateFeeInsuranceInfoResponseDto, CalculateFeeServiceResponseDto } from 'src/app/main-app/dto/carrierV2/delivery-carrier-response.dto';
import { AshipGetInfoConfigProviderDto } from 'src/app/main-app/dto/carrierV2/aship-info-config-provider-data.dto';
import { UpdateShipExtraHandler } from 'src/app/main-app/handler-v2/aship-v2/update-shipextra.handler';
import { UpdateShipServiceExtrasHandler } from 'src/app/main-app/handler-v2/aship-v2/update-shipservice-extras.handler';
import { PrepareModelFeeV2Handler } from 'src/app/main-app/handler-v2/aship-v2/prepare-model-feev2.handler';
import { SelectShipServiceV2Handler } from 'src/app/main-app/handler-v2/aship-v2/select-shipservice-v2.handler';
import { UpdateShipmentDetailAshipHandler } from 'src/app/main-app/handler-v2/aship-v2/shipment-detail-aship.handler';
import { AddBillHandler } from 'src/app/main-app/handler-v2/bill-handler/add-bill.handler';
import { CreateFormBillHandler } from 'src/app/main-app/handler-v2/bill-handler/create-form-bill.handler';
import { PrinterService } from '@app/services/printer.service';
import { CalculateFeeAshipHandler } from '@app/handler-v2/aship-v2/calcfee-aship.handler';
import { ModalAddAddressV2Component } from '@app/pages/conversations/components/modal-add-address-v2/modal-add-address-v2.component';
import { PrepareCopyBill } from '@app/handler-v2/bill-handler/prepare-copy-bill.handler';
import { PrepareDetailsOrderLineHandler } from '@app/handler-v2/order-handler/prepare-details-orderLine.handler';
import { TDSNotificationService } from 'tds-ui/notification';
import { SaleSettingConfigDto_V2 } from '@app/dto/setting/sale-setting-config.dto';

@Component({
  selector: 'app-add-bill',
  templateUrl: './add-bill.component.html',
  providers: [ TDSDestroyService ]
})

export class AddBillComponent implements OnInit {

  _form!: FormGroup;
  id: any;
  path: any;
  isOrder: any;
  isLoading: boolean = false;
  isLoadingProduct: boolean = false;
  dataModel!: FastSaleOrder_DefaultDTOV2;
  saleConfig!: SaleSettingConfigDto_V2;
  companyCurrents!: CompanyCurrentDTO;
  lstCarriers!: Observable<DeliveryCarrierDTOV2[]>;
  lstPaymentJournals!: Observable<AccountJournalPaymentDTO[]>;
  lstPrices!: Observable<PartnerCategoryDTO[]>;
  lstCustomers!: Observable<CustomerDTO[]>;
  lstWareHouses!: Observable<StockWarehouseDTO[]>;
  lstTeams!: Observable<any[]>;
  lstUser!: Observable<ApplicationUserDTO[]>;
  lstPartnerStatus!: Array<PartnerStatusDTO>;
  lstTax!: TaxDTO[];
  innerText: string = '';

  _cities!: SuggestCitiesDTO;
  _districts!: SuggestDistrictsDTO;
  _wards!: SuggestWardsDTO;
  _street!: string;
  lstCity!: Array<SuggestCitiesDTO>;
  lstDistrict!: Array<SuggestDistrictsDTO>;
  lstWard!: Array<SuggestWardsDTO>;

  private citySubject = new BehaviorSubject<SuggestCitiesDTO[]>([]);
  private districtSubject = new BehaviorSubject<SuggestDistrictsDTO[]>([]);
  private wardSubject = new BehaviorSubject<SuggestWardsDTO[]>([]);

  keyFilter!: '';
  page: number = 1;
  limit: number = 20;

  idPush: number = 0;
  totalAmountLines: number = 0;
  totalQtyLines: number = 0;
  priceListItems: any;

  insuranceInfo!: CalculateFeeInsuranceInfoResponseDto | null;
  visiblePopoverDiscount: boolean = false;
  visiblePopoverTax: boolean = false;
  visibleDiscountLines: boolean = false;
  visibleShipExtraMoney: boolean = false;
  extraMoney: number = 0;
  insuranceFee: number = 0;
  indClickTag = -1;

  shipServices: CalculateFeeServiceResponseDto[] = [];
  shipExtraServices: ShipServiceExtra[] = [];

  lstCalcFee!: CalculatorListFeeDTO[];
  loadByOrder: any;
  showShipService!: boolean;
  selectedIndex = 0;
  configsProviderDataSource: Array<AshipGetInfoConfigProviderDto> = [];
  phoneRegex!:string;
  tipLoading: string = 'Loading...';

  numberWithCommas =(value:TDSSafeAny) =>{
    if(value != null)
    {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return value;
  } ;

  parserComas = (value: TDSSafeAny) =>{
    if(value != null)
    {
      return TDSHelperString.replaceAll(value,'.','');
    }
    return value;
  };

  isCalculateFeeAship: boolean = false;

  constructor(private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private partnerService: PartnerService,
    private message: TDSMessageService,
    private deliveryCarrierService: DeliveryCarrierService,
    private sharedService: SharedService,
    private commonService: CommonService,
    private fsOrderLineService: FastSaleOrderLineService,
    private fastSaleOrderService: FastSaleOrderService,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private modalService: TDSModalService,
    private crmTeamService: CRMTeamService,
    private cdRef: ChangeDetectorRef,
    private modal: TDSModalService,
    private notification: TDSNotificationService,
    private notificationService: TDSNotificationService,
    private addBillHandler: AddBillHandler,
    private prepareDetailsOrdLineHandler: PrepareDetailsOrderLineHandler,
    private prepareSuggestionsBill: PrepareSuggestionsBillHandler,
    private updateOrderLinesHandler: UpdateOrderLinesHandler,
    private calculateBillFee: CalculateBillFeeHandler,
    private getServiceHandler: GetServiceHandler,
    private updateShipExtraHandler: UpdateShipExtraHandler,
    private preparePartnerHandler: PreparePartnerHandler,
    private prepareCopyBill:PrepareCopyBill,
    private prepareCopyItemHandler: PrepareCopyItemHandler,
    private prepareModelFeeV2Handler: PrepareModelFeeV2Handler,
    private selectShipServiceV2Handler: SelectShipServiceV2Handler,
    private updateShipServiceExtrasHandler: UpdateShipServiceExtrasHandler,
    private updateShipmentDetailAshipHandler: UpdateShipmentDetailAshipHandler,
    private createFormBillHandler: CreateFormBillHandler,
    private applicationUserService: ApplicationUserService,
    private registerPaymentService: AccountRegisterPaymentService,
    private deliveryCarrierV2Service: DeliveryCarrierV2Service,
    private printerService: PrinterService,
    private accountTaxService: AccountTaxService,
    private viewContainerRef: ViewContainerRef,
    private calcFeeAshipHandler: CalculateFeeAshipHandler,
    private suggestService: SuggestAddressService,
    private destroy$: TDSDestroyService) {
      this.createForm();
      this.loadCurrentCompany();
  }

  createForm() {
    this._form = this.createFormBillHandler.createForm(this._form, this.fb);
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    this.path = this.route.snapshot.url[0]?.path;
    this.isOrder = this.route.snapshot.queryParams['isorder'];

    switch (this.path) {
        case 'copy':
            const key = this.fastSaleOrderService._keyCacheCopyInvoice;
            let obs = localStorage.getItem(key) as string;
            if(TDSHelperString.hasValueString(obs)) {
                let data = JSON.parse(obs);
                this.loadCopyData(data);
            } else {
                this.router.navigateByUrl('bill/create');
            }
        break;

        case 'edit':
            this.loadBill(this.id);
            this.removelocalStorage();
        break;

        default:
            this.loadDefault();
        break;
    }

    this.loadCity();
    this.loadSaleConfig();
    this.lstCarriers = this.loadCarrier();
    this.lstPaymentJournals = this.loadPaymentJournals();
    this.lstPrices = this.loadListPrice();
    this.lstCustomers = this.loadCustomers();
    this.lstWareHouses = this.loadWareHouse();
    this.lstTeams = this.loadAllFacebookChilds();
    this.lstUser = this.loadUser();
    this.loadPartnerStatus();
  }

  loadPartnerStatus() {
    this.commonService.getPartnerStatus().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.lstPartnerStatus = [...res];
      }
    });
  }

  selectStatus(item: any): void {
    let partnerId = this._form.controls['Partner'].value.Id;
    if (partnerId) {
      let data = {
          status: `${item.value}_${item.text}`
      }

      this.partnerService.updateStatus(partnerId, data).pipe(takeUntil(this.destroy$)).subscribe({
        next: res => {
          this.message.success('Cập nhật trạng thái khách hàng thành công');
          this._form.controls['Partner'].value.StatusText = item.text;
        },
        error: (error: any) => {
          this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Cập nhật trạng thái khách hàng thất bại')
        }
      });
    }
  }

  onCurrentStatus(text: string, data: any): void {
    let exits = data?.filter((x: any) => x.text === text)[0];
    if (exits) {
        return exits.value;
    }
  }

  loadDelivery(carrierId: any) {
    if (carrierId) {
      this.isLoading = true;

      this.deliveryCarrierV2Service.getById(carrierId).pipe(finalize(() => this.isLoading = false)).subscribe(res => {
          if(res && TDSHelperObject.hasValue(res.Extras)){
            this._form.controls['Ship_InsuranceFee'].setValue(res.Extras?.InsuranceFee);
            this.cdRef.detectChanges();
          }
        });
    }
  }

  //Load thông tin ship aship
  loadConfigProvider(data: FastSaleOrder_DefaultDTOV2) {
    if ( data.Carrier && data.Carrier.ExtraProperties) {
      let _shipmentDetailsAship = (JSON.parse(data.Carrier.ExtraProperties) ?? [])?.filter((x: AshipGetInfoConfigProviderDto) => !x.IsHidden) as Array<AshipGetInfoConfigProviderDto>;
      this.insuranceInfo = data.ShipmentDetailsAship?.InsuranceInfo || null;

      this.configsProviderDataSource = _shipmentDetailsAship.map(x => {
          let detailConfig = data.ShipmentDetailsAship?.ConfigsProvider.find(y => y.ConfigName == x.ConfigName);
          x.ConfigValue = detailConfig ? detailConfig.ConfigValue : x.ConfigValue;

          return {...x} as AshipGetInfoConfigProviderDto;
      });
    }
  }

  loadBill(id: number) {
    this.isLoading = true;
    this.fastSaleOrderService.getById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          delete res['@odata.context'];
          let obs = res as FastSaleOrder_DefaultDTOV2;

          obs.DateInvoice = obs.DateInvoice ? new Date(obs.DateInvoice) : null;
          obs.DateOrderRed = obs.DateOrderRed ? new Date(obs.DateOrderRed) : null;
          obs.ReceiverDate = obs.ReceiverDate ? new Date(obs.ReceiverDate) : null;

          this.updateForm(obs);
          // TODO: change partner gán thêm các field
          let partnerId = obs.PartnerId || obs.Partner?.Id;
          if (partnerId) {
              this.changePartner(partnerId);
          }

          this.isLoading = false;
      },
      error:(error) => {
        this.message.error(error?.error?.message || 'Tải thông tin hóa đơn đã xảy ra lỗi!');
        this.isLoading = false;
      }
    })
  }

  loadDefault() {
    let model = { Type: 'invoice', SaleOrderIds:[] };
    this.isLoading = true;

    this.fastSaleOrderService.setDefaultV2({ model: model });
    this.fastSaleOrderService.getDefaultV2().pipe(takeUntil(this.destroy$)).subscribe({
      next:(data: any) => {
          delete data['@odata.context'];
          data.DateInvoice = new Date();

          // TODO: trường hợp tạo hóa đơn F10
          if(this.isOrder){
              const key = this.saleOnline_OrderService._keyCreateBillOrder;
              const item = localStorage.getItem(key) as string;

              if(TDSHelperString.hasValueString(item)) {
                  let order = JSON.parse(item) as SaleOnlineOrderGetDetailsDto;
                  data = {...this.prepareDetailsOrdLineHandler.prepareModel(data, order)} as FastSaleOrder_DefaultDTOV2;
              }

          } else {
              // TODO: xóa cache order F10
              this.removelocalStorage();
          }

          // TODO: trường hợp thêm mới load dữ liệu lần đầu số tiền trả = 0
          data.PaymentAmount = 0;
          this.updateForm(data);

          // TODO: change partner gán thêm các field
          let partnerId = data.PartnerId || data.Partner?.Id;
          if (partnerId) {
              this.changePartner(partnerId);
          }

          // TODO: chỉ gọi calcTotal() trường hợp tạo hóa đơn F10
          this.calcTotal();
          this.isLoading = false;

      },
      error:(err) => {
          this.isLoading = false;
          this.message.error(err?.error?.message || 'Tải thông tin mặc định đã xảy ra lỗi!');
      }
    });
  }

  loadCopyData(data?: FastSaleOrder_DefaultDTOV2){
    delete this.id;
    let model = { Type: 'invoice', SaleOrderIds: [] };

    let currentTeam = this.crmTeamService.getCurrentTeam();
    if(currentTeam && data){
        data.TeamId = currentTeam.Id;
        data.PageName = currentTeam.Name;
        data.Team = {
            Id: currentTeam.Id,
            Name: currentTeam.Name
        } as any
    }

    this.fastSaleOrderService.apiDefaultGetV2({ model: model }).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res: any) => {
            delete res['@odata.context'];
            let obs = this.prepareCopyBill.prepareModel(data, res);

            obs.DateInvoice = obs.DateInvoice ? new Date(obs.DateInvoice) : null;
            obs.DateOrderRed = obs.DateOrderRed ? new Date(obs.DateOrderRed) : null;
            obs.ReceiverDate = obs.ReceiverDate ? new Date(obs.ReceiverDate) : null;

            this.updateForm(obs);
            // TODO: change partner gán thêm các field
            let partnerId = obs.PartnerId || obs.Partner?.Id;
            if (partnerId) {
              this.changePartner(partnerId);
            }

            this.isLoading = false;
        },
        error:(err) => {
            this.isLoading = false;
            this.message.error(err?.error?.message || 'Tải thông tin mặc định đã xảy ra lỗi!');
        }
    })
  }

  updateForm(data: FastSaleOrder_DefaultDTOV2){
    //TODO: cập nhật danh sách dịch vụ
    let services = this.getServiceHandler.getShipService(data);
    if(services != null){
        this.shipServices.push(services);
    }

    this.shipExtraServices = this.getServiceHandler.getShipExtrasService(data) || [];

    //TODO: cập nhật price of product theo bảng giá
    if (data.PriceListId) {
      this.commonService.getPriceListItems(data.PriceListId).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            this.priceListItems = res;
        },
        error: (error: any) => {
            this.message.error(error?.error?.message || 'Tải thông tin bảng giá đã xảy ra lỗi!');
        }
      })
    }

    this.dataModel = {...data};

    //TODO: cập nhật danh sách sản phẩm
    this.updateOrderLines(data);

    //TODO: cập nhật địa chỉ
    this.mappingDataAddress(data);

    //Load thông tin ship aship
    this.loadConfigProvider(this.dataModel);

    if(!this.dataModel.AmountDeposit){
      this.dataModel.AmountDeposit = 0;
    }

    this._form.patchValue(this.dataModel);

    this.dataModel.OrderLines?.map((x: any) => {
        this.totalQtyLines = this.totalQtyLines + x.ProductUOMQty;
        this.totalAmountLines = this.totalAmountLines + x.PriceTotal;
    })

  }

  mappingDataAddress(data:TDSSafeAny){
    let result = this.prepareSuggestionsBill.mappingAddress(data);

    this._cities = result?._cities || { code:'', name:'' };
    if(this._cities && this._cities.code) {
      this.loadDistricts(this._cities.code);
    }

    this._districts = result?._districts || this._districts;
    if(this._districts && this._districts.code) {
      this.loadWards(this._districts.code);
    }

    this._wards = result?._wards || this._wards;

    this._street = result?._street || this._street;
    this.innerText = this._street;
  }

  loadSaleConfig() {
    this.sharedService.setSaleConfig();
    this.sharedService.getSaleConfig().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.saleConfig = {...res} as SaleSettingConfigDto_V2;
      }
    })
  }

  loadCurrentCompany() {
    this.sharedService.setCurrentCompany();
    this.sharedService.getCurrentCompany().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: CompanyCurrentDTO) => {
        this.companyCurrents = {...res};

        if(res.Configs){
          this.phoneRegex = JSON.parse(res.Configs)?.PhoneRegex;
          this._form.controls["ReceiverPhone"].addValidators(Validators.pattern(this.phoneRegex || /^((\+[(]?[0-9]{2}[)]?)|0)[0-9]{9}$/g));
        }
      },
      error: (error: any) => {
        this.message.error(error?.error?.message || 'Tải thông tin công ty mặc định đã xảy ra lỗi!');
      }
    });
  }

  selectChangePartner(event: any) {
    if (event && event.Id) {
        this.changePartner(event.Id);

    }
  }

  onSearchPartner(event: any) {
    if (TDSHelperString.hasValueString(event)) {
      this.keyFilter = event;
    } else {
      this.keyFilter = '';
    }

    this.lstCustomers = this.loadCustomers();
  }

  loadChangePartner(partnerId: any): Observable<any> {
    return this.partnerService.getById(partnerId).pipe(mergeMap((partner: TDSSafeAny) => {
      delete partner['@odata.context'];

      // this._form.controls["Ship_Receiver"].reset();
      // this._form.controls['Partner'].setValue(partner);
      this._form.controls['PartnerId'].setValue(partnerId);
      let model = this.prepareModel();

      return this.fastSaleOrderService.onChangePartnerPriceList({ model: model })
        .pipe(map((data: TDSSafeAny) => {
            delete data['@odata.context'];
            return [data, partner];
        }))
    }));
  }

  changePartner(partnerId: any) {
    this.isLoading = true;
    this.loadChangePartner(partnerId).subscribe({
        next: ([data, partner]) => {
            if (data && partner) {

                this.preparePartnerHandler.prepareModel(this._form, data, partner, this.id);

                if(Number(this.id) == 0) {
                  this.mappingDataAddress(data);
                }
            }
            this.isLoading = false
        },
        error: (error: any) => {
            this.isLoading = false
            this.message.error(`${error?.error?.message}` || 'Thay đổi khách hàng đã xảy ra lỗi!');
        }
    })
  }

  onChangePriceList(event: any) {
    if (TDSHelperObject.hasValue(event)) {
        this.commonService.getPriceListItems(event.Id).pipe(takeUntil(this.destroy$)).subscribe({
            next: (res: any) => {
                this.priceListItems = res;
            },
            error: (error: any) => {
                this.message.error(error?.error?.message || 'Tải thông tin bảng giá đã xảy ra lỗi!');
            }
        })
    }
  }

  onChangeWarehouse(event: any) {
    if (event && event.Id) {
      this._form.controls['WarehouseId'].setValue(event.Id);
    }
  }

  onChangePayment(event: any) {
    if (event && event.Id) {
      this._form.controls['PaymentJournalId'].setValue(event.Id);
    }
  }

  onChangeTeam(event: any) {
    if (event && event.Id) {
        this._form.controls['TeamId'].setValue(event.Id);
    } else {
        this._form.controls['TeamId'].setValue(null);
    }
  }

  onChangeUser(event: any) {
    if (event && event.Id) {
      this._form.controls['UserId'].setValue(event.Id);
    }
  }

  calcFee() {
    if (!this._form.controls['Carrier'].value ) {
        this.message.error('Vui lòng chọn đối tác giao hàng');
        return
    }

    if (!this._form.controls['ShipWeight'].value ) {
        this.message.error('Vui lòng nhập khối lượng');
        return
    }

    let model = this._form.controls['Carrier'].value;
    this.calculateFeeAship(model);
  }

  onSelectShipServiceId(event: CalculateFeeServiceResponseDto) {
    if(event && event?.ServiceId) {
      let exist = this.shipServices.filter((x: any) => x.ServiceId === event?.ServiceId)[0];
      if(exist) {
          this.selectShipServiceV2(exist);
      }
    }
  }

  onUpdateInsuranceFee() {
    this.calcFee();
  }

  selectShipServiceV2(x: CalculateFeeServiceResponseDto) {
    let value = this.selectShipServiceV2Handler.selectShipServiceV2(x, this.shipExtraServices, this._form);

    this.shipExtraServices = [];
    this.shipExtraServices = value;
  }

  changeDeliveryPrice(value: number) {
    // Sử dụng formcontrolname không cần setvalue lại
    this.coDAmount();
  }

  changeShip_InsuranceFee(value: number) {
    // this._form.controls['Ship_InsuranceFee'].setValue(value);
    this.coDAmount();
  }

  changeAmountDeposit(value: number) {
    // this._form.controls['AmountDeposit'].setValue(value);
    this.coDAmount();
  }

  changeShipWeight(): any {
    // this._form.controls['ShipWeight'].setValue(this.dataModel.ShipWeight);
    if(this._form.controls['Carrier'].value) {
        this.calcFee();
    }
  }

  openTrackingOrderGHN() {
    let key = this.dataModel.TrackingRef;
    this.fastSaleOrderService.getTokenTrackingOrderGHN({ key: key }).subscribe({
      next:(res: any) => {
        if (res.Success && res.data) {

              this.message.success('Thao tác thành công!');

              let urlTrackingOrder = res.data.UrlTrackingOrder;
              window.open(urlTrackingOrder, '_blank');

          } else {
              this.message.error(res.Message || 'Thao tác thất bại');
          }
      },
      error:(error) => {
          this.message.error(error?.error?.message || 'Đã xảy ra lỗi!');
      }
    });
  }

  public openTrackingOrderAhaMove() {
    let key = this.dataModel.TrackingRef;
    this.fastSaleOrderService.getTrackingOrderAhaMove({ key: key }).subscribe({
      next:(res: any) => {
        if (res.Success && res.data) {

          this.message.success('Thao tác thành công!');
          let urlTrackingOrder = res.data.UrlTrackingOrder;
          window.open(urlTrackingOrder, '_blank');

        } else {
          this.message.error(res.Message || 'Thao tác thất bại');
        }
      },
      error:(error) => {
        this.message.error(error?.error?.message || 'Đã xảy ra lỗi!');
      }
    });
  }

  onChangeQuantity(event: any, item: any) {
    let datas = this._form.controls['OrderLines'].value;
    if (TDSHelperArray.hasListValue(datas)) {

      datas.map((x: any, i: number) => {
        if (x.ProductId == item.ProductId && x.ProductUOMId == item.ProductUOMId && x.Id == item.Id) {
          x.ProductUOMQty = event;
        }
      });

      this.calcTotal();
    }
  }

  onChangePriceUnit(event: any, item: any) {
    let datas = this._form.controls['OrderLines'].value;

    if (TDSHelperArray.hasListValue(datas)) {
        datas.map((x: any) => {
          if (x.ProductId == item.ProductId && x.ProductUOMId == item.ProductUOMId && x.Id == item.Id) {
              x.PriceUnit = event;
          }
        });
        this.calcTotal();
    }
  }

  onAddUserOrderLines(event: any, item: OrderLineV2, index: number): void {
    let datas = this._form.controls['OrderLines'].value;

    if (TDSHelperArray.hasListValue(datas)) {
      datas.map((x: OrderLineV2, i: number) => {
        if (x.ProductId == item.ProductId && x.ProductUOMId == item.ProductUOMId && i == index) {
            x.User = event;
            x.UserId = event.Id;
        }
      });
    }

    this.calcTotal();
  }

  changeProductDiscountType(event: any, item: any, typeDiscount: string, i: number) {
    let datas = this._form.controls['OrderLines'].value;

    if (TDSHelperArray.hasListValue(datas)) {
        datas.map((x: any, index: number) => {
            if (x.ProductId == item.ProductId && x.ProductUOMId == item.ProductUOMId && i == index) {
                x[`${typeDiscount}`] = event;
            }
        });
    }

    this.calcTotal();
  }

  selectProductType(item: any, type: string, i: number) {
    let datas = this._form.controls['OrderLines'].value;
    if (TDSHelperArray.hasListValue(datas)) {

      datas.map((x: any, index: number) => {
        if (x.ProductId == item.ProductId && x.ProductUOMId == item.ProductUOMId && i == index) {
          x.Type = type;
          x.Discount = 0;
          x.Discount_Fixed = 0;
        }
      });
    }

    this.calcTotal();
  }

  changeDiscount(event: any) {
    if (event) {
      this.calcTotal();
    }
  }

  changeDecreaseAmount(event: any) {
    if (event) {
      this.calcTotal();
    }
  }

  openPopoverDiscount() {
    this.visiblePopoverDiscount = true;
  }

  closePopoverDiscount() {
    this.visiblePopoverDiscount = false
  }

  openPopoverTax() {
    this.visiblePopoverTax = true;
    this.accountTaxService.getTax().pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            if (TDSHelperArray.hasListValue(res.value)) {
              this.lstTax = [...res.value];
              this.lstTax = this.lstTax.sort((a, b) => a.Amount - b.Amount);
            }
        }
    });
  }

  closePopoverTax() {
    this.visiblePopoverTax = false;
  }

  selectTax(tax: any) {
    if(tax && tax.Id > 0) {
      this._form.controls['TaxId'].setValue(tax?.Id);
      this._form.controls['Tax'].setValue(tax);
    } else {
      this._form.controls['TaxId'].setValue(null);
      this._form.controls['Tax'].setValue(null);
    }

    this.calcTotal();
    this.coDAmount();
  }

  showModalSearchPartner() {
    const modal = this.modalService.create({
      title: 'Tìm kiếm khách hàng',
      content: ModalSearchPartnerComponent,
      size: "xl",
      viewContainerRef: this.viewContainerRef
    });
    modal.afterClose.subscribe(event => {
      if (event && event.Id) {
        this.changePartner(event.Id);
      }
    });
  }

  copyOrderLine(x: OrderLineV2, index: number) {
    let items = this._form.controls['OrderLines'].value;
    let item = this.prepareCopyItemHandler.prepareCopyModel(x, this.dataModel);

    item.Id = this.idPush - 1;
    this.idPush = item.Id;

    const insert = (arr: string | any[], index: number, ...newItems: any[]) => [
      // part of the array before the specified index
      ...arr.slice(0, index),
      // inserted items
      ...newItems,
      // part of the array after the specified index
      ...arr.slice(index)
    ];

    let datas = insert(items, index++, item) || [];

    if (datas) {
      this._form.setControl('OrderLines', this.fb.array(datas));
    }

    this.calcTotal();
  }

  removeOrderLines(item: OrderLineV2, index: number) {
    (<FormArray>this._form.controls['OrderLines']).removeAt(index);

    this.totalQtyLines = Number(this.totalQtyLines - item.ProductUOMQty);
    this.totalAmountLines = Number(this.totalAmountLines - item.PriceTotal);

    this.calcTotal();
  }

  removeAllOrderLines() {
    this._form.setControl('OrderLines', this.fb.array([]));
    this.calcTotal();
  }

  onLoadProductToOrderLines(event: any): any {

    // TODO: check dk trùng biến thể chiến dịch live
    if(event && event.length > 0) {
      return
    }

    if (!this._form.controls['Partner'].value) {
      return this.message.error('Vui lòng chọn khách hàng!');
    }

    let datas = this._form.controls['OrderLines'].value as Array<OrderLineV2>;
    let exist = datas.filter((x: any) => x.ProductId == event.Id && x.ProductUOMId == event.UOMId && (x.Id != null || x.Id != 0))[0];

    if (exist) {
        this.onChangeQuantity(Number(exist.ProductUOMQty + 1), exist);
    } else {
        this.pushProductToOrderlines(event);
    }

  }

  // TODO: trường hợp thêm mới
  pushProductToOrderlines(event: DataPouchDBDTO): any {
    let data = {
      model: {
          Discount: event.DiscountSale,
          Discount_Fixed: 0,
          Note: null,
          PriceUnit: event.Price,
          PriceRecent: event.OldPrice,
          Product: event,
          ProductId: event.Id,
          ProductName: event.Name,
          ProductNameGet: event.NameGet,
          ProductUOMId: event.UOMId,
          ProductUOMName: event.UOMName,
          ProductUOMQty: 1,
          Type: 'percent',
          User: this.dataModel.User,
          Weight: event.Weight
      },

      order: this.dataModel
    }

    this.isLoadingProduct = true;
    this.fsOrderLineService.onChangeProduct(data)
      .pipe(finalize(() => { this.isLoadingProduct = false })).subscribe({
        next:(res: FSOrderLines) => {
          delete res['@odata.context'];

          let item: OrderLineV2 = this.prepareCopyItemHandler.prepareOnChangeProductModel(res, this.dataModel, event);

          if (item.Id <= 0) {
            item.Id = this.idPush - 1;
            this.idPush = item.Id;
          }

          let formArray = <FormArray> this._form.controls['OrderLines'];
          formArray.push(this.updateOrderLinesHandler.initOrderLines(this.dataModel, item));

          this.calcTotal();
          this.cdRef.detectChanges();

        },
        error:(error) => {
            this.message.error(`${error?.error?.message}` || 'Thêm sản phẩm thất bại')
        }
      })
  }

  updateInsuranceFeeEqualAmountTotal() {
    if (this._form.controls['Ship_Extras'].value) {

        if(this._form.controls['Ship_Extras'].value?.IsInsuranceEqualTotalAmount) {
            this._form.controls['Ship_InsuranceFee'].setValue(this._form.controls['TotalAmount'].value)
        } else {
            this._form.controls['Ship_InsuranceFee'].setValue(this._form.controls['Ship_Extras'].value?.InsuranceFee || 0)
        }
    }
  }

  signAmountTotalToInsuranceFee(): any {
    let x = this._form.controls['AmountTotal'].value;
    this._form.controls['Ship_InsuranceFee'].setValue(x);

    this.onUpdateInsuranceFee();
  }

  changeExtramoney(value: number){
    this.extraMoney = Number(value);
  }

  changeShipExtraMoney(event: any) {
    if(event) {
      let idx = this.shipExtraServices.findIndex((f: any) => f.Id === 'XMG') as number;
      this.shipExtraServices[idx].ExtraMoney = this.extraMoney;
      this.calcFee();

      this.visibleShipExtraMoney = false;
    }
  }

  // TODO: cập nhật giá xem hàng
  updateShipExtras() {
    this.updateShipExtraHandler.updateShipExtraHandler(this.shipExtraServices, this._form);
  }

  // TODO: cập nhật danh sách dịch vụ
  updateShipServiceExtras() {
    if (this.shipExtraServices) {
      this.updateShipServiceExtrasHandler.updateShipServiceExtras(this.shipExtraServices, this._form, this.fb);
    }
  }

  // TODO: cập nhật danh sách cấu hình aship
  updateShipmentDetailsAship() {
    if (this.configsProviderDataSource) {
      this.updateShipmentDetailAshipHandler.updateShipmentDetailAship(this.configsProviderDataSource, this.insuranceInfo, this._form, this.fb);
    }
  }

  openPopoverShipExtraMoney(value: number) {
    this.extraMoney = value;
    this.visibleShipExtraMoney = true;
  }

  closePopoverShipExtraMoney() {
    this.visibleShipExtraMoney = false;
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
    let modal = this.modalService.create({
      title: 'Sửa khách hàng',
      content: ModalEditPartnerComponent,
      size: "xl",
      viewContainerRef: this.viewContainerRef,
      centered: true,
      componentParams: {
        partnerId: data?.Id
      }
    });
    modal.afterClose.subscribe({
      next:(event: any) => {
        if (event) {
          this.changePartner(event);
        }
      }
    })
  }

  createPartner() {
    const modal = this.modalService.create({
      title: 'Thêm khách hàng',
      content: ModalEditPartnerComponent,
      size: "xl",
      viewContainerRef: this.viewContainerRef,
      centered: true,
      componentParams: {
        partnerId: null
      }
    });
    modal.afterClose.subscribe({
      next:(event: any) => {
        if (event) {
          this.changePartner(event);
        }
      }
    })
  }

  prepareModelFeeV2() {
    let companyId = this.companyCurrents.CompanyId;
    let model = {...this.prepareModelFeeV2Handler.prepareModelFeeV2(this.shipExtraServices, this._form, companyId, this.insuranceInfo )};
    return model;
  }

  prepareModel(): any {
    let model = {...this.addBillHandler.prepareModel(this.dataModel, this._form, this.id)} as any;

    // TODO: gán lại công ty hiện tại
    if(!Number(model.CompanyId) || Number(model.CompanyId) == 0) {
      model.CompanyId = this.companyCurrents?.CompanyId;

      model.CompanyId = this.companyCurrents?.CompanyId;
      model.CompanyName = this.companyCurrents?.CompanyName;

      model.Company = {
          Id: this.companyCurrents?.CompanyId,
          Name: this.companyCurrents?.CompanyName
      } as any;
    }

    if(!TDSHelperString.hasValueString(model.FormAction)) {
      model.FormAction = 'draft';
    }

    switch(this.path) {
      case 'create':
        model.OrderLines?.map((x: any) => {
          delete x.Account;
          delete x.AccountId;
        })
      break;
      
      case 'copy':
        model.OrderLines?.map((x: any) => {
            delete x.Account;
            delete x.AccountId;
        })
      break;

      case 'edit':
        model.OrderLines?.map((x: any) => {
          x.AccountId = model.AccountId;
          if(model.Account) {
              x.Account = model.Account;
          }
        })
      break;
      default:
      break;
    }

    if(model.TeamId && model.Team) {
      model.TeamId = Number(model.TeamId);
      model.Team = {
        Id: model.TeamId,
        Name: model.Team.Name
      }
    }

    // TODO: gán lại sô tiền nợ
    model.NewCredit = Number(model.OldCredit) + Number(model.AmountTotal) as number;

    return {...model};
  }

  confirmShipService(carrier: TDSSafeAny) {
    this.modal.info({
      title: 'Cảnh báo',
      content: 'Đối tác chưa có dịch vụ bạn hãy bấm [Ok] để tìm dịch vụ.\nHoặc [Cancel] để tiếp tục.\nSau khi tìm dịch vụ bạn hãy xác nhận lại."',
      onOk: () => this.calcFee(),
      onCancel:() => {},
      okText: "OK",
      cancelText: "Cancel"
    });
  }

  onSave(formAction?: string, print?: string): any {

    //TODO: trường hợp đối tác đã có mà chưa call lại hàm tính phí aship
    let carrier = this._form.controls['Carrier'].value;
    if(!this.isCalculateFeeAship && carrier) {
        this.notification.info(`Đối tác ${carrier.Name}`, 'Đang tính lại ship đối tác, vui lòng thao tác lại sau khi thành công');
        this.calculateFeeAship(carrier);
        return;
    }

    this.updateShipExtras();
    this.updateShipServiceExtras();
    this.updateShipmentDetailsAship();

    let model = this.prepareModel();

    if(TDSHelperString.hasValueString(formAction)) {
        model.FormAction = formAction;
    }

    if (!TDSHelperObject.hasValue(this._form.controls['Partner'].value) && !this._form.controls['PartnerId'].value) {
        return this.message.error('Vui lòng chọn khách hàng!');
    }
    if (!TDSHelperArray.hasListValue(this._form.controls['OrderLines'].value)) {
        return this.message.error('Vui lòng chọn ít nhất 1 sản phẩm!');
    }

    //TODO ràng buộc COD
    let COD = model.AmountTotal + model.DeliveryPrice - model.AmountDeposit;
    let exist = this.saleConfig?.SaleSetting?.GroupFastSaleDeliveryCarrier && model.Type == "invoice" && model.CashOnDelivery != COD && !model.TrackingRef;

    if (exist) {
      this.modal.warning({
          title: 'Cảnh báo',
          content: `COD hiện tại ${formatNumber(model.CashOnDelivery, 'en-US', '1.0-3')} không bằng tổng COD phần mềm tính ${formatNumber(COD, 'en-US', '1.0-3')} bạn có muốn gán lại COD của phần mềm [${formatNumber(COD, 'en-US', '1.0-3')}]`,
          onOk: () => { model.CashOnDelivery = COD; this.saveRequest(model, print) },
          onCancel: () => { this.saveRequest(model, print) },
          okText: "Đồng ý",
          cancelText: "Hủy bỏ",
          confirmViewType: "compact",
      });

    } else {
        this.saveRequest(model, print);
    }
  }

  saveRequest(model: any, type_print?: string) {
    if (this.isLoading) {
      return
    }

    if (this.id) {
        this.isLoading = true;
        this.fastSaleOrderService.update(this.id, model).pipe(takeUntil(this.destroy$)).subscribe({
            next:(res: any) => {

                if(model.FormAction == 'SaveAndOpen' || model.FormAction == 'SaveAndPrint') {
                    this.actionInvoiceOpen(model, this.id, type_print);
                } else {
                    this.isLoading = false;
                    this.message.success('Cập nhật phiếu bán hàng thành công!');
                    this.router.navigateByUrl(`bill/detail/${this.id}`);
                }
            },
            error:(error) => {
                this.isLoading = false;
                this.message.error(`${error?.error?.message}` || 'Cập nhật phiếu bán hàng thất bại!');
            }
        })

    } else {
        this.isLoading = true;
        this.fastSaleOrderService.insert(model).pipe(takeUntil(this.destroy$)).subscribe({
            next:(res: any) => {
                delete res['@odata.context'];

                // TODO: gửi vận đơn
                let exist = res && !TDSHelperString.hasValueString(res.TrackingRef) && res.CarrierId
                   && (res.State !== 'cancel' || res.State !== 'draft') && (res.FormAction == 'SaveAndOpen' || res.FormAction == 'SaveAndPrint');
                if(exist) {
                    this.sendToShipper(res, type_print);
                } else {
                    this.loadDataInsert(res, type_print);
                }

                // TODO: xóa cache tạo hóa đơn nếu có lưu F10, sao chép
                this.removelocalStorage();
            },
            error:(error) => {
                this.isLoading = false;
                this.message.error(`${error?.error?.message}` || 'Tạo mới phiếu bán hàng thất bại!');
            }
        });
    }
  }

  loadDataInsert(model: FastSaleOrder_DefaultDTOV2, type_print?: string) {
    if(model.FormAction == 'SaveAndPrint') {
        this.loadPrintHtml(model, Number(model.Id), type_print);
    } else {
        this.isLoading = false;
        this.message.success('Tạo mới phiếu bán hàng thành công!');
        this.router.navigateByUrl(`bill/detail/${model.Id}`);
    }
  }

  sendToShipper(model: FastSaleOrder_DefaultDTOV2, type_print?: string) {
    let data = { id: model.Id };
    this.fastSaleOrderService.getSendToShipper(data).pipe(takeUntil(this.destroy$)).subscribe({
      next:() => {
          this.loadDataInsert(model, type_print);
      },
      error:(error) => {
          this.notificationService.error('Lỗi gửi vận đơn', error?.error?.message);
          this.loadDataInsert(model, type_print);
      }
    })
  }

  applyPromotion(type: string){
    switch(type){
      case 'coupon':
        this.onSave();
        this.showApplyCouponModal();
        break;
      case 'promotion':
        this.onSave();
        this.showApplyPromotionModal();
        break;
    }
  }

  showApplyCouponModal(){

  }

  showApplyPromotionModal(){

  }

  removelocalStorage() {
    const key1 = this.saleOnline_OrderService._keyCreateBillOrder;
    localStorage.removeItem(key1);

    const key2 = this.fastSaleOrderService._keyCacheCopyInvoice;
    localStorage.removeItem(key2);
  }

  actionInvoiceOpen(data: any, id: number, type?: string ) {
    let model = { ids: [Number(id)] };
    this.fastSaleOrderService.actionInvoiceOpen(model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        if(res) {
            this.loadPrintHtml(data, id, type);
            this.loadInventoryIds(data);
        }

        if(res && TDSHelperString.hasValueString(res.Error)) {
            this.message.warning(res.Error);
        }

        this.isLoading = false;
        this.isCalculateFeeAship = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        this.message.error(`${error.error.message || 'Xác nhận bán hàng thất bại'}`);
      }
    })
  }

  loadPrintHtml(data: any, id: number, type?: string) {
    this.message.success('Xác nhận bán hàng thành công!');
    let obs!: Observable<any>;

    switch (type) {
      case "print":
          obs = this.printerService.printUrl(`/fastsaleorder/print?ids=${[Number(id)]}`);
      break;

      case "printShip":
        let url = `/fastsaleorder/PrintShipThuan?ids=${[Number(id)]}`;
        if (Number(data.CarrierId) > 0) {
            url = `${url}&carrierid=${data.CarrierId}`;
        }
        obs = this.printerService.printUrl(url);
      break;

      default:
      break;
    }

    obs.pipe(takeUntil(this.destroy$)).subscribe({
        next:(res: TDSSafeAny) => {
            this.isLoading = false;
            this.printerService.printHtml(res);
            this.router.navigateByUrl(`bill/detail/${id}`);
        },
        error:(error: any) => {
          this.isLoading = false;
        }
    })
  }

  loadInventoryIds(data: any){
    let ids: any = [];
    let orderLines = data?.OrderLines;

    if(orderLines) {
      orderLines.forEach((x: any) => {
        if (!ids.includes(Number(x.ProductId))) {
            ids.push(Number(x.ProductId));
        }
      });
    }

    let warehouseId = this.dataModel.WarehouseId;
    this.commonService.getInventoryByIds(warehouseId, ids).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: any) => {
          this.notificationService.success('Tồn kho', 'Cập nhật tồn kho thành công!');
      },
      error:(error) => {
          this.notificationService.warning('Tồn kho', 'Cập nhật tồn kho thất bại!');
      }
    })
  }

  onChangeCarrierV2(event: DeliveryCarrierDTOV2) {
      if(!event) {
        this._form.controls['CarrierId'].setValue(null);
        return;
      }

      if (!this._form.controls['Partner'].value) {
        this.message.error('Vui lòng chọn khách hàng');
        return;
      }

      this.shipServices = []; // dịch vụ
      this.shipExtraServices = [];
      this.insuranceInfo = null;
      this.configsProviderDataSource = [];
      // TODO: tải thông tin giao hàng, cập nhật giá trị hàng hóa
      this.loadDelivery(event.Id);

      this._form.controls['Ship_ServiceId'].setValue(null);
      this._form.controls['Ship_ServiceName'].setValue(null);
      this._form.controls['Ship_Extras'].setValue(null);
      this._form.controls['CustomerDeliveryPrice'].setValue(0);
      this._form.controls['DeliveryPrice'].setValue(0);
      this._form.setControl('Ship_ServiceExtras', this.fb.array([]));

      // this._form.controls['Carrier'].setValue(event);
      // this._form.controls['CarrierId'].setValue(event?.Id);

      //TODO: Cập nhật giá trị ship mặc định

      let deliveryPrice = event?.Config_DefaultFee || this.companyCurrents?.ShipDefault || 0;
      if (this._form.controls['DeliveryPrice'].value != deliveryPrice) {
          this._form.controls['DeliveryPrice'].setValue(Number(deliveryPrice));
          this.coDAmount();
      }

      this._form.controls['ShipWeight'].setValue(event?.Config_DefaultWeight || this.companyCurrents?.WeightDefault || 100);

      if (TDSHelperString.hasValueString(event?.ExtrasText)) {
        this._form.controls['Ship_Extras'].setValue(JSON.parse(event.ExtrasText));
      }

      if(event) {
          this.calcFee();
      }
  }

  calculateFeeAship(event: DeliveryCarrierDTOV2): any {
    let model = this.prepareModelFeeV2();

    this.isLoading = true;
    this.calcFeeAshipHandler.calculateFeeAship(model, event, this.configsProviderDataSource).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            if(res && !res.error) {

                if(!TDSHelperString.isString(res)) {
                    this.configsProviderDataSource = [...res.configs];

                    this.insuranceInfo = res.data?.InsuranceInfo || null;
                    this.shipServices = res.data?.Services || [];

                    if(TDSHelperArray.hasListValue(this.shipServices)) {

                        let x = this.shipServices[0] as CalculateFeeServiceResponseDto;
                        this.selectShipServiceV2(x);

                        this.message.success(`Đối tác ${event.Name} có phí vận chuyển: ${formatNumber(Number(x.TotalFee), 'en-US', '1.0-0')} đ`);
                    }
                }
            }

            if(res && res.error?.message) {
              this.message.error(res.error.message);
            }

            this.isLoading = false;
            this.isCalculateFeeAship = true;
        },
        error: (error: any) => {
            this.isLoading = false;
            this.message.error(error.error.message || error.error.error_description);
        }
    })
  }

  directPage(path: string) {
    this.router.navigateByUrl(path);
  }

  onBack(){
    history.back();
  }

  coDAmount() {
    this.calculateBillFee.fs_coDAmount(this._form);
  }

  updateOrderLines(model: FastSaleOrder_DefaultDTOV2) {
    this.updateOrderLinesHandler.updateOrderLines(this._form, model);
  }

  calcTotal() {
    let cacl = this.calculateBillFee.fs_calcTotal(this._form, this.saleConfig?.SaleSetting);

    this.totalQtyLines = cacl.totalQtyLines;
    this.totalAmountLines = cacl.totalAmountLines;
  }

  loadCustomers() {
    return this.partnerService.getCustomers(this.page, this.limit, this.keyFilter)
      .pipe(map(res => res.value));
  }

  loadWareHouse() {
    return this.sharedService.getStockWarehouse().pipe(map(res => res.value));
  }

  loadAllFacebookChilds() {
    return this.crmTeamService.getAllFacebookChildsV2().pipe(map(res => res));
  }

  loadUser() {
    this.applicationUserService.setUserActive();
    return this.applicationUserService.getUserActive();
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

  showModalSuggestAddress(){
    let modal =  this.modalService.create({
      title: 'Thêm địa chỉ',
      content: ModalAddAddressV2Component,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        _cities: this._cities,
        _districts: this._districts,
        _wards: this._wards,
        _street: this.innerText,
        isSelectAddress: true
      }
    });

    modal.afterClose.subscribe({
      next: (result: ResultCheckAddressDTO) => {
        if(result) {
          this.setAddress(result);

          this.prepareSuggestionsBill.onLoadSuggestion(this._form, result);
          this.innerText = result.Address;
        }
      }
    })
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if(event.key === 'F9'){
      this.onSave('SaveAndPrint', 'print');
    }

    if(event.key === 'F8'){
      this.onSave('SaveAndOpen');
    }
  }

  setAddress(result: ResultCheckAddressDTO){
    this._cities = {
      code: result.CityCode,
      name: result.CityName
    }

    this._districts = {
      code: result.DistrictCode,
      name: result.DistrictName
    } as any;

    this._wards = {
      code: result.WardCode,
      name: result.WardName
    } as any;
  }

  loadCity(): void {
    this.suggestService.setCity();
    this.suggestService.getCity().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        this.lstCity = [...res];
        this.citySubject.next(res);
    });
  }

  loadDistricts(code: string) {
    this.suggestService.getDistrict(code).subscribe((res: any) => {
        this.lstDistrict = [...res];
        this.districtSubject.next(res);
    });
  }

  loadWards(code: string) {
    this.suggestService.getWard(code).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        this.lstWard = [...res];
        this.wardSubject.next(res);
    });
  }


  changeCity(city: SuggestCitiesDTO) {
    this._form.controls['Ship_Receiver'].patchValue({
      City: null,
      District: null,
      Ward: null
    });

    this.lstDistrict = [];
    this.lstWard = [];

    if (city && city.code ) {
      this._form.controls['Ship_Receiver'].patchValue({
        City: city
      });
        this.loadDistricts(city.code);
    }
    this.mappingStreet();

    let item: ResultCheckAddressDTO = {
        Address: this._form.controls['Ship_Receiver'].value?.Street,
        CityCode: city ? city.code : null,
        CityName: city ? city.name : null,
        DistrictCode: null,
        DistrictName: null,
        WardCode: null,
        WardName: null
    } as any;

    this.setAddress(item);
  }

  changeDistrict(district: SuggestDistrictsDTO) {
    this._form.controls['Ship_Receiver'].patchValue({
      District: null,
      Ward: null
    });

    this.lstWard = [];

    if (district && district.code) {
      this._form.controls['Ship_Receiver'].patchValue({
        District: district
      });
        this.loadWards(district.code);
    }
    this.mappingStreet();

    let item: ResultCheckAddressDTO = {
        Address: this._form.controls['Ship_Receiver'].value?.Street,
        CityCode: district ? district.cityCode : null,
        CityName:  district ? district.cityName : null,
        DistrictCode: district ? district.code : null,
        DistrictName: district ? district.name : null,
        WardCode: null,
        WardName: null
    } as any;

    this.setAddress(item);
  }

  changeWard(ward: SuggestWardsDTO) {
    this._form.controls['Ship_Receiver'].patchValue({
      Ward: null
    });

    if(ward && ward.code) {
      this._form.controls['Ship_Receiver'].patchValue({
        Ward: ward
      });
    }
    this.mappingStreet();

    let item: ResultCheckAddressDTO = {
        Address: this._form.controls['Ship_Receiver'].value?.Street,
        CityCode: ward ? ward.cityCode : null,
        CityName: ward ? ward.cityName : null,
        DistrictCode: ward ? ward.districtCode : null,
        DistrictName: ward ? ward.districtName : null,
        WardCode: ward ? ward.code : null,
        WardName: ward ? ward.name : null
    } as any;

    this.setAddress(item)
  }

  changeStreet(event: any){
    if(event) {
      this._form.controls['Street'].setValue(event.target.value);

      let item: ResultCheckAddressDTO = {
        Telephone: null,
        Address: this._form.controls['Ship_Receiver'].value?.Street,
        ShortAddress: '',
        CityCode: this._form.controls['Ship_Receiver'].value?.City?.code,
        CityName: this._form.controls['Ship_Receiver'].value?.City?.name,
        DistrictCode: this._form.controls['Ship_Receiver'].value?.District?.code,
        DistrictName: this._form.controls['Ship_Receiver'].value?.District?.name,
        WardCode: this._form.controls['Ship_Receiver'].value?.Ward?.code,
        WardName: this._form.controls['Ship_Receiver'].value?.Ward?.name,
        Score: 0
      }
      this.setAddress(item);
    }
  }

  handleCityFilter(value: string) {
    if(TDSHelperString.hasValueString(value)){
      let result = this.lstCity?.filter((x: SuggestCitiesDTO) => (x.name && TDSHelperString.stripSpecialChars(x.name.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(value.toLowerCase())) !== -1));
      this.citySubject.next(result);
    }
  }

  handleFilterDistrict(value: string) {
    if(TDSHelperString.hasValueString(value)){
      let result = this.lstDistrict?.filter((x: SuggestDistrictsDTO) => (x.name && TDSHelperString.stripSpecialChars(x.name.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(value.toLowerCase())) !== -1));
      this.districtSubject.next(result);
    }
  }

  handleFilterWard(value: string) {
    if(TDSHelperString.hasValueString(value)){
      let result = this.lstWard?.filter((x: SuggestWardsDTO) => (x.name && TDSHelperString.stripSpecialChars(x.name.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(value.toLowerCase())) !== -1));
      this.wardSubject.next(result);
    }
  }

  mappingStreet(){
    let street = (this._form.controls['Ship_Receiver'].value?.Ward?.name ? (this._form.controls['Ship_Receiver'].value?.Ward?.name + ', '): '')
      + (this._form.controls['Ship_Receiver'].value?.District?.name ? (this._form.controls['Ship_Receiver'].value?.District?.name + ', '): '')
      + (this._form.controls['Ship_Receiver'].value?.City?.name ? this._form.controls['Ship_Receiver'].value?.City?.name: '')

    this._form.controls['Ship_Receiver'].patchValue({Street: street});
    this.innerText = this._form.controls['Ship_Receiver'].value?.Street;
  }

}
