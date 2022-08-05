import { THelperCacheService } from 'src/app/lib';
import { TDSDestroyService } from 'tds-ui/core/services';
import { OrderEvent } from './../../../handler-v2/order-handler/order.event';
import { PrepareCopyItemHandler } from '@app/handler-v2/bill-handler/prepare-copy-item.handler';
import { PreparePartnerHandler } from './../../../handler-v2/bill-handler/prepare-partner.handler';
import { UpdateFromCacheHandler } from './../../../handler-v2/bill-handler/update-from-cache.handler';
import { CalculateBillFeeHandler } from './../../../handler-v2/bill-handler/calculate-bill-fee.handler';
import { UpdateOrderLinesHandler } from './../../../handler-v2/bill-handler/update-order-lines.handler';
import { GetServiceHandler } from './../../../handler-v2/bill-handler/get-services.handler';
import { PrepareSuggestionsBillHandler } from './../../../handler-v2/bill-handler/prepare-suggestions-bill.handler';
import { formatNumber } from '@angular/common';
import { Component, OnInit, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
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
import { finalize, map, mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
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
import { InitSaleDTO, SaleSettingsDTO } from 'src/app/main-app/dto/setting/setting-sale-online.dto';
import { AccountTaxService } from 'src/app/main-app/services/account-tax.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { PartnerStatusDTO } from 'src/app/main-app/dto/partner/partner.dto';
import { CaculateFeeResponseDto, CalculateFeeInsuranceInfoResponseDto, CalculateFeeServiceResponseDto, DeliveryResponseDto } from 'src/app/main-app/dto/carrierV2/delivery-carrier-response.dto';
import { AshipGetInfoConfigProviderDto } from 'src/app/main-app/dto/carrierV2/aship-info-config-provider-data.dto';
import { UpdateShipExtraHandler } from 'src/app/main-app/handler-v2/aship-v2/update-shipextra.handler';
import { UpdateShipServiceExtrasHandler } from 'src/app/main-app/handler-v2/aship-v2/update-shipservice-extras.handler';
import { PrepareModelFeeV2Handler } from 'src/app/main-app/handler-v2/aship-v2/prepare-model-feev2.handler';
import { SelectShipServiceV2Handler } from 'src/app/main-app/handler-v2/aship-v2/select-shipservice-v2.handler';
import { UpdateShipmentDetailAshipHandler } from 'src/app/main-app/handler-v2/aship-v2/shipment-detail-aship.handler';
import { AddBillHandler } from 'src/app/main-app/handler-v2/bill-handler/add-bill.handler';
import { CreateFormBillHandler } from 'src/app/main-app/handler-v2/bill-handler/create-form-bill.handler';

@Component({
  selector: 'app-add-bill',
  templateUrl: './add-bill.component.html',
  providers: [ TDSDestroyService ]
})

export class AddBillComponent implements OnInit {

  _form!: FormGroup;
  id: any;
  path: any;
  isLoading: boolean = false;
  isLoadingProduct: boolean = false;
  isCalcFee: boolean = false;

  dataModel!: FastSaleOrder_DefaultDTOV2;
  roleConfigs!: SaleSettingsDTO;
  companyCurrents!: CompanyCurrentDTO;
  lstCarriers!: Observable<DeliveryCarrierDTOV2[]>;
  lstPaymentJournals!: Observable<AccountJournalPaymentDTO[]>;
  lstPrices!: Observable<PartnerCategoryDTO[]>;
  lstCustomers!: Observable<CustomerDTO[]>;
  lstWareHouses!: Observable<StockWarehouseDTO[]>;
  lstTeams!: Observable<AllFacebookChildTO[]>;
  lstUser!: Observable<ApplicationUserDTO[]>;
  lstPartnerStatus!: Array<PartnerStatusDTO>;
  lstTax!: TaxDTO[];

  _cities!: SuggestCitiesDTO;
  _districts!: SuggestDistrictsDTO;
  _wards!: SuggestWardsDTO;
  _street!: string;

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
    private modalService: TDSModalService,
    private crmTeamService: CRMTeamService,
    private cdRef: ChangeDetectorRef,
    private modal: TDSModalService,
    private addBillHandler: AddBillHandler,
    private prepareSuggestionsBill: PrepareSuggestionsBillHandler,
    private updateOrderLinesHandler: UpdateOrderLinesHandler,
    private calculateBillFee: CalculateBillFeeHandler,
    private getServiceHandler: GetServiceHandler,
    private updateFromCache: UpdateFromCacheHandler,
    private updateShipExtraHandler: UpdateShipExtraHandler,
    private preparePartnerHandler: PreparePartnerHandler,
    private prepareCopyItemHandler: PrepareCopyItemHandler,
    private prepareModelFeeV2Handler: PrepareModelFeeV2Handler,
    private selectShipServiceV2Handler: SelectShipServiceV2Handler,
    private updateShipServiceExtrasHandler: UpdateShipServiceExtrasHandler,
    private updateShipmentDetailAshipHandler: UpdateShipmentDetailAshipHandler,
    private createFormBillHandler: CreateFormBillHandler,
    private applicationUserService: ApplicationUserService,
    private registerPaymentService: AccountRegisterPaymentService,
    private accountTaxService: AccountTaxService,
    private viewContainerRef: ViewContainerRef) {
    this.createForm();
  }

  createForm() {
    this._form = this.createFormBillHandler.createForm(this._form, this.fb);
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    this.path = this.route.snapshot?.routeConfig?.path || '';

    if (this.id) {
      this.loadBill(this.id);
    } else {
      this.loadDefault();
    }

    this.loadConfig();
    this.loadCurrentCompany();
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
    this.commonService.getPartnerStatus().subscribe(res => {
      this.lstPartnerStatus = [...res];
    });
  }

  numberWithCommas = (value: TDSSafeAny) => {
    if (value != null) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return value
  };
  parserComas = (value: TDSSafeAny) => {
    if (value != null) {
      return TDSHelperString.replaceAll(value, ',', '');
    }
    return value
  };

  selectStatus(item: any): void {
    let partnerId = this._form.controls['Partner'].value.Id;
    if (partnerId) {
      let data = {
        status: `${item.value}_${item.text}`
      }

      this.partnerService.updateStatus(partnerId, data).subscribe(res => {
        this.message.success('Cập nhật trạng thái khách hàng thành công');
        this._form.controls['Partner'].value.StatusText = item.text;
        this.cdRef.markForCheck();
      }, error => {
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Cập nhật trạng thái khách hàng thất bại')
      });
    }
  }

  onCurrentStatus(text: string, data: any): void {
    let exits = data.filter((x: any) => x.text === text)[0];
    if (exits) {
      return exits.value;
    }
  }

  //Load thông tin ship aship
  loadConfigProvider(data: FastSaleOrder_DefaultDTOV2) {
    if (data.CarrierId && data.Carrier) {
      let _shipmentDetailsAship = (JSON.parse(data.Carrier.ExtraProperties) ?? [])?.filter((x: AshipGetInfoConfigProviderDto) => !x.IsHidden) as Array<AshipGetInfoConfigProviderDto>;

      this.insuranceInfo = data.ShipmentDetailsAship?.InsuranceInfo || null;

      this.configsProviderDataSource = _shipmentDetailsAship.map(x => {
          let detailConfig = data.ShipmentDetailsAship?.ConfigsProvider.find(y => y.ConfigName == x.ConfigName);
          x.ConfigValue = detailConfig ? detailConfig.ConfigValue : x.ConfigValue;

          return x;
      });
    }
  }

  loadBill(id: number) {debugger
    this.isLoading = true;

    this.fastSaleOrderService.getById(id).pipe(finalize(() => { this.isLoading = false })).subscribe((res: any) => {debugger
      delete res['@odata.context'];
      let data = res as FastSaleOrder_DefaultDTOV2;

      if(this.path.includes('copy')){
        delete this.id;
        data.Id = 0;

        data.DateInvoice = new Date();
        data.ReceiverDate = new Date();
        data.DateOrderRed = new Date();

      } else {
        data.DateInvoice = data.DateInvoice ? new Date(data.DateInvoice) : null;
        data.DateOrderRed = data.DateOrderRed ? new Date(data.DateOrderRed) : null;
        data.ReceiverDate = data.ReceiverDate ? new Date(data.ReceiverDate) : null;
      }

      this.dataModel = data;

      //TODO: tạm thời đóng tính năng
      // this.loadConfigProvider(this.dataModel);

      //TODO: cập nhật danh sách dịch vụ
      let services = this.getServiceHandler.getShipService(this.dataModel);
      if(services != null){
        this.shipServices.push(services);
      }

      this.shipExtraServices = this.getServiceHandler.getShipExtrasService(this.dataModel);

      //TODO: nếu Team thiếu thông tin thì map dữ liệu
      if (data.TeamId) {
        this.loadTeamById(data.TeamId);
      }

      //TODO: cập nhật price of product theo bảng giá
      if (data.PriceListId) {
        this.commonService.getPriceListItems(data.PriceListId).subscribe((res: any) => {
            this.priceListItems = res;
        }, error => {
            this.message.error(error?.error?.message || 'Load bảng giá đã xảy ra lỗi!');
        })
      }

      //TODO: cập nhật địa chỉ
      this.mappingDataAddress(this.dataModel);

      //TODO: cập nhật danh sách sản phẩm
      this.updateOrderLinesHandler.updateOrderLines(this._form, this.dataModel);

      //TODO: cập nhật form giá
      let cacl = this.calculateBillFee.computeAmountTotal(this._form, this.roleConfigs);
      this.totalQtyLines = cacl.totalAmountLines;
      this.totalAmountLines = cacl.totalAmountLines;

      this._form.patchValue(this.dataModel);
    }, error => {
      this.message.error(error?.error?.message || 'Load hóa đơn đã xảy ra lỗi!');
    })
  }

  loadDefault() {
    this.isLoading = true;
    let model = { Type: 'invoice', SaleOrderIds:[] };

    this.fastSaleOrderService.defaultGetV2({ model: model }).pipe(finalize(() => this.isLoading = false)).subscribe((data: any) => {
      delete data['@odata.context'];

      data.DateInvoice = new Date();
      this.dataModel = data;

      // Trường hợp Tạo hóa đơn F10 bên Đơn hàng thì update thông tin từ cache
      this.updateFromCache.loadCacheOrder(this.dataModel).subscribe(res => {

          //TODO: cập nhật thông tin khách hàng
          if (res.PartnerId && res.Partner?.Id) {
              this.changePartner(res.PartnerId);
          }
          //TODO: cập nhật danh sách order lines
          this.updateOrderLinesHandler.updateOrderLines(this._form, data);

          //TODO: cập nhật form giá
          let cacl = this.calculateBillFee.computeAmountTotal(this._form,this.roleConfigs);
          this.totalQtyLines = cacl.totalAmountLines;
          this.totalAmountLines = cacl.totalAmountLines;

          this._form.patchValue(data);
      },  err => {
          this.message.error(err?.error?.message || 'Không thể tải dữ liệu từ cache');
      });

    }, error => {
      this.message.error(error?.error?.message || 'Load thông tin mặc định đã xảy ra lỗi!');
    });
  }

  loadTeamById(id: any) {
    this.crmTeamService.getTeamById(id).subscribe((team: any) => {
      this.dataModel.Team.Name = team?.Name;
      this.dataModel.Team.Facebook_PageName = team?.Facebook_PageName;
    },  err=>{
      this.message.error(err?.error?.message)
    })
  }

  mappingDataAddress(data:TDSSafeAny){
    let result = this.prepareSuggestionsBill.mappingAddress(data);

    if(TDSHelperObject.hasValue(result)){
      this._cities = result._cities || this._cities;
      this._districts = result._districts || this._districts;
      this._wards = result._wards || this._wards;
      this._street = result._street || this._street;
    }
  }

  onLoadSuggestion(item: ResultCheckAddressDTO) {
    this.prepareSuggestionsBill.onLoadSuggestion(this._form,item);
  }

  loadCustomers() {
    return this.partnerService.getCustomers(this.page, this.limit, this.keyFilter)
      .pipe(map(res => res.value));
  }

  loadWareHouse() {
    return this.sharedService.getStockWarehouse().pipe(map(res => res.value));
  }

  loadAllFacebookChilds() {
    return this.crmTeamService.getAllFacebookChilds().pipe(map(res => res.value));
  }

  loadUser() {
    return this.applicationUserService.dataActive$;
  }

  loadConfig() {
    this.sharedService.getConfigs().subscribe((res: InitSaleDTO) => {
      this.roleConfigs = res.SaleSetting;
    }, error => {
      this.message.error(error?.error?.message || 'Load thông tin cấu hình mặc định đã xảy ra lỗi!');
    });
  }

  loadCurrentCompany() {
    this.sharedService.getCurrentCompany().subscribe((res: CompanyCurrentDTO) => {
      this.companyCurrents = res;
    }, error => {
      this.message.error(error?.error?.message || 'Load thông tin công ty mặc định đã xảy ra lỗi!');
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

      this._form.controls["Ship_Receiver"].reset();
      this._form.controls['Partner'].setValue(partner);
      this._form.controls['PartnerId'].setValue(partner.Id);

      let model = this.prepareModel();

      return this.fastSaleOrderService.onChangePartnerPriceList({ model: model })
        .pipe(map((data: TDSSafeAny) => {
          delete data['@odata.context'];
          return [data, partner];
        })
        )
    }));
  }

  changePartner(partnerId: any) {
    this.isLoading = true;

    this.loadChangePartner(partnerId).pipe(finalize(() => this.isLoading = false))
      .subscribe(([data, partner]) => {
        if (data && partner) {
          this.preparePartnerHandler.prepareModel(this._form, data, partner);
          this.mappingDataAddress(data);
        }
      }, error => {
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Thay đổi khách hàng đã xảy ra lỗi!');
      })
  }

  onChangePriceList(event: any) {
    if (TDSHelperObject.hasValue(event)) {
      this.commonService.getPriceListItems(event.Id).subscribe((res: any) => {
        this.priceListItems = res;
      }, error => {
        this.message.error(error?.error?.message || 'Load bảng giá đã xảy ra lỗi!');
      })
    }
  }

  onChangeWarehouse(event: any) {
    if (event && event.Id) {
      this._form.controls['Warehouse'].setValue(event);
      this._form.controls['WarehouseId'].setValue(event.Id);
    }
  }

  onChangePayment(event: any) {
    if (event && event.Id) {
      this._form.controls['PaymentJournal'].setValue(event);
      this._form.controls['PaymentJournalId'].setValue(event.Id);
    }
  }

  onChangeTeam(event: any) {
    if (event && event.Id) {
      this._form.controls['Team'].setValue(event);
      this._form.controls['TeamId'].setValue(event.Id);
    }
  }

  onChangeUser(event: any) {
    if (event && event.Id) {
      this._form.controls['User'].setValue(event);
      this._form.controls['UserId'].setValue(event.Id);
    }
  }

  // getInsuranceFee() {
  //   // if (!model.Ship_InsuranceFee) {
  //   //   this._form.controls['Ship_InsuranceFee'].setValue(model.Ship_Extras?.InsuranceFee || model.AmountTotal);
  //   // }
  //   const formModel = this.prepareModel() as FastSaleOrder_DefaultDTOV2;
  //   let insuranceFee = 0;
  //   if (formModel.Ship_Extras?.IsInsurance) {
  //     if (formModel.Ship_Extras?.IsInsuranceEqualTotalAmount) {
  //       insuranceFee = formModel.AmountTotal;
  //     } else if (formModel.Ship_Extras.InsuranceFee) {
  //       insuranceFee = formModel.Ship_Extras?.InsuranceFee;
  //     } else {
  //       insuranceFee = formModel.AmountTotal;
  //     }
  //   }
  //   return insuranceFee || 0;
  // }

  calcFee() {
    let model = this._form.controls['Carrier'].value;
    if(!model) {
      this.message.error('Vui lòng chọn đối tác giao hàng')
    }

    this.calculateFeeAship(model).catch((e: any) => {
      this.isCalcFee = false;
      let error = e.error.message || e.error.error_description;
      if (error)
          this.message.error(error);
    });
  }

  calcFeeList(type: boolean) {
    if(type) {
      let model = this.prepareModel();
      this.isCalcFee = true;

      this.fastSaleOrderService.calculateListFee({ model: model }).subscribe((res: any) => {

        this.lstCalcFee = [...res.value];
        let exits = this.lstCalcFee.filter((x: CalculatorListFeeDTO) => x.CarrierId === model.Carrier?.Id)[0];
        if (exits) {
          this.setCarrier(exits);
        }
        this.isCalcFee = false;

      }, error => {
        this.isCalcFee = false;
        this.message.error(`${error.error_description}` ? `${error.error_description}` : 'Gợi ý tính phí đã xảy ra lỗi!');
      });
    } else {
      this.message.info('Tính nắng chưa khả dụng')
    }
  }

  setCarrier(item: CalculatorListFeeDTO) {
    this.shipServices = [];
    this.shipExtraServices = [];
    this.insuranceInfo = null;

    const formModel = this.prepareModel();
    formModel.Carrier = {
      Id: item.CarrierId,
      Name: item.CarrierName,
      DeliveryType: item.DeliveryType,
      Config_DefaultFee: item.Config_DefaultFee || 0,
      Config_DefaultWeight: item.Config_DefaultWeight,
      ExtrasText: item.ExtrasText,
      Extras: item.ExtrasText ? JSON.parse(item.ExtrasText) : null
    }

    this._form.controls['CustomerDeliveryPrice'].setValue(item.TotalFee);
    this._form.controls['DeliveryPrice'].setValue(formModel.Carrier.Config_DefaultFee || 0);

    if (item.Services && item.Services.length > 0) {

      if (formModel.Carrier.Extras) {
        this._form.controls['Ship_Extras'].setValue(formModel.Carrier.Extras)
      }

      this.selectShipServiceV2(this.shipServices[0]);
    }

    //Phí xem hàng
    if ((item.DeliveryType === "ViettelPost") && formModel.Ship_Extras && formModel.Ship_Extras?.IsCollectMoneyGoods) {
      this.shipExtraServices.map((x: any) => {
        if (x.ServiceId === 'XMG' && formModel.Carrier?.DeliveryType === 'ViettelPost') {
          x.IsSelected = true;
        }
      });
    }
  }

  onSelectShipServiceId(event: CalculateFeeServiceResponseDto) {
    // let item = this.shipServices.find((x: any) => x.ServiceId === event.ServiceId);

    // if (item && item.ServiceId) {
    //   this.selectShipServiceV2(item);
    // }

    let isDirty = this._form.controls['Ship_ServiceId'].dirty;
    if(event && isDirty) {
        let exits = this.shipExtraServices.find(x => x.IsSelected);
        // Tính lại phí bảo hiểm
        if(this.insuranceInfo?.IsInsurance || exits) {
          this.onUpdateInsuranceFee();
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
    if (value && value > 0) {
      this._form.controls['DeliveryPrice'].setValue(value);
    } else {
      this._form.controls['DeliveryPrice'].setValue(0);
    }
    this.calculateBillFee.updateCoDAmount(this._form);
  }

  changeShip_InsuranceFee(value: number) {
    if (value && value > 0) {
      this._form.controls['Ship_InsuranceFee'].setValue(value);
    } else {
      this._form.controls['Ship_InsuranceFee'].setValue(0);
    }
    this.calculateBillFee.updateCoDAmount(this._form);
  }

  changeAmountDeposit(value: number) {
    if (value && value > 0) {
      this._form.controls['AmountDeposit'].setValue(value);
    }else{
      this._form.controls['AmountDeposit'].setValue(0);
    }

    this.calculateBillFee.updateCoDAmount(this._form);
  }

  changeShipWeight(event: any): any {
    this._form.controls['ShipWeight'].setValue(event);
    this.calcFee();
  }

  openTrackingOrderGHN() {
    let key = this.dataModel.TrackingRef;
    this.fastSaleOrderService.getTokenTrackingOrderGHN({ key: key }).subscribe((res: any) => {
      if (res.Success && res.data) {
        this.message.success('Thao tác thành công!');
        let urlTrackingOrder = res.data.UrlTrackingOrder;
        window.open(urlTrackingOrder, '_blank');
      } else {
        this.message.error(res.Message || 'Thao tác thất bại');
      }
    }, error => {
      this.message.error(error?.error?.message || 'Đã xảy ra lỗi!');
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
        this.message.error(res.Message || 'Thao tác thất bại');
      }
    }, error => {
      this.message.error(error?.error?.message || 'Đã xảy ra lỗi!');
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

      //TODO: cập nhật form giá
      let cacl = this.calculateBillFee.computeAmountTotal(this._form,this.roleConfigs);
      this.totalQtyLines = cacl.totalAmountLines;
      this.totalAmountLines = cacl.totalAmountLines;
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

      //TODO: cập nhật form giá
      let cacl = this.calculateBillFee.computeAmountTotal(this._form,this.roleConfigs);
      this.totalQtyLines = cacl.totalAmountLines;
      this.totalAmountLines = cacl.totalAmountLines;
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

    //TODO: cập nhật form giá
    let cacl = this.calculateBillFee.computeAmountTotal(this._form,this.roleConfigs);
    this.totalQtyLines = cacl.totalAmountLines;
    this.totalAmountLines = cacl.totalAmountLines;
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

    //TODO: cập nhật form giá
    let cacl = this.calculateBillFee.computeAmountTotal(this._form,this.roleConfigs);
    this.totalQtyLines = cacl.totalAmountLines;
    this.totalAmountLines = cacl.totalAmountLines;
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

    //TODO: cập nhật form giá
    let cacl = this.calculateBillFee.computeAmountTotal(this._form,this.roleConfigs);
    this.totalQtyLines = cacl.totalAmountLines;
    this.totalAmountLines = cacl.totalAmountLines;
  }

  changeDiscount(event: any) {
    if (event) {
      //TODO: cập nhật form giá
      let cacl = this.calculateBillFee.computeAmountTotal(this._form,this.roleConfigs);
      this.totalQtyLines = cacl.totalAmountLines;
      this.totalAmountLines = cacl.totalAmountLines;
    }
  }

  changeDecreaseAmount(event: any) {
    if (event) {
      //TODO: cập nhật form giá
      let cacl = this.calculateBillFee.computeAmountTotal(this._form,this.roleConfigs);
      this.totalQtyLines = cacl.totalAmountLines;
      this.totalAmountLines = cacl.totalAmountLines;
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
    this.accountTaxService.getTax().subscribe((res: any) => {
      if (TDSHelperArray.hasListValue(res.value)) {
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

    //TODO: cập nhật form giá
    let calData = this.calculateBillFee.computeAmountTotal(this._form,this.roleConfigs);
    this.totalQtyLines = calData.totalAmountLines;
    this.totalAmountLines = calData.totalAmountLines;
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
    let item = this.prepareCopyItemHandler.prepareCopyModel(x, this.dataModel);

    if (item.Id <= 0) {
      item.Id = this.idPush + 1;
      this.idPush = item.Id;
    }

    const insert = (arr: string | any[], index: number, ...newItems: any[]) => [
      // part of the array before the specified index
      ...arr.slice(0, index),
      // inserted items
      ...newItems,
      // part of the array after the specified index
      ...arr.slice(index)
    ];

    let items = this._form.controls['OrderLines'].value;
    let datas = insert(items, index++, item) || [];

    if (datas) {
      this._form.setControl('OrderLines', this.fb.array(datas));
    }

    //TODO: cập nhật form giá
    let calData = this.calculateBillFee.computeAmountTotal(this._form, this.roleConfigs);

    this.totalQtyLines = calData.totalAmountLines;
    this.totalAmountLines = calData.totalAmountLines;
  }

  removeOrderLines(item: OrderLineV2, index: number) {
    (<FormArray>this._form.controls['OrderLines']).removeAt(index);

    this.totalQtyLines = Number(this.totalQtyLines - item.ProductUOMQty);
    this.totalAmountLines = Number(this.totalAmountLines - item.PriceTotal);

    //TODO: cập nhật form giá
    let calData = this.calculateBillFee.computeAmountTotal(this._form,this.roleConfigs);
    this.totalQtyLines = calData.totalAmountLines;
    this.totalAmountLines = calData.totalAmountLines;
  }

  removeAllOrderLines() {
    this._form.setControl('OrderLines', this.fb.array([]));
    //TODO: cập nhật form giá
    let calData = this.calculateBillFee.computeAmountTotal(this._form,this.roleConfigs);
    this.totalQtyLines = calData.totalAmountLines;
    this.totalAmountLines = calData.totalAmountLines;
  }

  onLoadProductToOrderLines(event: DataPouchDBDTO): any {

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
      .pipe(finalize(() => { this.isLoadingProduct = false })).subscribe((res: FSOrderLines) => {
        delete res['@odata.context'];

        let item: OrderLineV2 = this.prepareCopyItemHandler.prepareOnChangeProductModel(res, this.dataModel, event);

        if (item.Id <= 0) {
          item.Id = this.idPush - 1;
          this.idPush = item.Id;
        }

        let formArray = <FormArray> this._form.controls['OrderLines'];
        formArray.push(this.updateOrderLinesHandler.initOrderLines(this.dataModel, item));

        //TODO: cập nhật form giá
        let cacl = this.calculateBillFee.computeAmountTotal(this._form, this.roleConfigs);
        this.totalQtyLines = cacl.totalAmountLines;
        this.totalAmountLines = cacl.totalAmountLines;

        this.cdRef.detectChanges();
      }, error => {
        this.message.error(`${error?.error?.message}` || 'Thêm sản phẩm thất bại')
      })
  }

  signAmountTotalToInsuranceFee(): any {
    this._form.controls['Ship_InsuranceFee'].setValue(this._form.controls['AmountTotal'].value);
    if (this._form.controls['Carrier'].value && this._form.controls['Carrier'].value.DeliveryType == 'NinjaVan') {
      return false;
    }
    this.onUpdateInsuranceFee();
  }

  changeShipExtraMoney(event: any) {
    if(event) {
      let idx = this.shipExtraServices.findIndex((f: any) => f.ServiceId === 'XMG');

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
    modal.afterClose.subscribe((event: any) => {
      if (event) {
        this.changePartner(event);
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
    modal.afterClose.subscribe((event: any) => {
      if (event) {
        this.changePartner(event);
      }
    })
  }

  prepareModelFeeV2() {
    let companyId = this.roleConfigs.CompanyId;

    let model = this.prepareModelFeeV2Handler.prepareModelFeeV2(this.shipExtraServices, this._form, companyId, this.insuranceInfo );
    return model;
  }

  prepareModel(): any {
    let model = this.dataModel as FastSaleOrder_DefaultDTOV2;
    let x = this.addBillHandler.prepareModel(model, this._form);

    if(!TDSHelperString.hasValueString(x.FormAction)) {
      x.FormAction = 'draft';
    }

    delete x.ShipmentDetailsAship;// lỗi do tg vịnh
    return x;
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

  onSave(): any {
    this.updateShipExtras();
    this.updateShipServiceExtras();
    this.updateShipmentDetailsAship();

    let model = this.prepareModel();

    if (!TDSHelperObject.hasValue(this._form.controls['Partner'].value) && !this._form.controls['PartnerId'].value) {
      return this.message.error('Vui lòng chọn khách hàng!');
    }
    if (!TDSHelperArray.hasListValue(this._form.controls['OrderLines'].value)) {
      return this.message.error('Vui lòng chọn ít nhất 1 sản phẩm!');
    }

    //TODO ràng buộc COD
    let COD = model.AmountTotal + model.DeliveryPrice - model.AmountDeposit;

    let exist = this.roleConfigs?.GroupFastSaleDeliveryCarrier && model.Type == "invoice" && model.CashOnDelivery != COD && !model.TrackingRef;
    if (exist) {
      this.modal.warning({
          title: 'Cảnh báo',
          content: `COD hiện tại ${formatNumber(model.CashOnDelivery, 'en-US', '1.0-3')} không bằng tổng COD phần mềm tính ${formatNumber(COD, 'en-US', '1.0-3')} bạn có muốn gán lại COD của phần mềm [${formatNumber(COD, 'en-US', '1.0-3')}]`,
          onOk: () => { model.CashOnDelivery = COD; this.saveRequest(model) },
          onCancel: () => { this.saveRequest(model) },
          okText: "Đồng ý",
          cancelText: "Hủy bỏ",
          confirmViewType: "compact",
      });
    } else {
      this.saveRequest(model);
    }
  }

  saveRequest(model: any) {
    if (this.id) {

      this.isLoading = true;
      this.fastSaleOrderService.update(this.id, model).pipe(finalize(() => { this.isLoading = false })).subscribe((res: any) => {
        this.message.success('Cập nhật phiếu bán hàng thành công!');
        this.onBack();
      }, error => {
        this.message.error(`${error.error.message}` || 'Cập nhật phiếu bán hàng thất bại!');
      })

    } else {
      this.isLoading = true;

      this.fastSaleOrderService.insert(model).pipe(finalize(() => { this.isLoading = false })).subscribe((res: any) => {
        this.message.success('Tạo mới phiếu bán hàng thành công!');
        this.onBack();
      }, error => {
        this.message.error(`${error.error.message}` || 'Tạo mới phiếu bán hàng thất bại!');
      });
    }
  }

  onChangeCarrierV2(event: DeliveryCarrierDTOV2) {
      this.shipServices = []; // dịch vụ
      this.shipExtraServices = [];
      this.insuranceInfo = null;
      this.configsProviderDataSource = [];

      this._form.controls['Ship_InsuranceFee'].setValue(null);
      this._form.controls['Ship_ServiceId'].setValue(null);
      this._form.controls['Ship_ServiceName'].setValue(null);
      this._form.controls['Ship_Extras'].setValue(null);
      this._form.controls['CustomerDeliveryPrice'].setValue(0);
      this._form.controls['DeliveryPrice'].setValue(0);
      this._form.setControl('Ship_ServiceExtras', this.fb.array([]));

      this._form.controls['Carrier'].setValue(event);
      this._form.controls['CarrierId'].setValue(event?.Id);

      //TODO: Cập nhật giá trị ship mặc định
      let deliveryPrice = event?.Config_DefaultFee || this.companyCurrents?.ShipDefault || 0;
      if (this._form.controls['DeliveryPrice'].value != deliveryPrice) {
          this._form.controls['DeliveryPrice'].setValue(deliveryPrice);
          this.calculateBillFee.updateCoDAmount(this._form);
      }

      this._form.controls['ShipWeight'].setValue(event?.Config_DefaultWeight || this.companyCurrents?.WeightDefault || 100);
      this.dataModel.ShipWeight = this._form.controls['ShipWeight'].value;

      if (TDSHelperString.hasValueString(event?.ExtrasText)) {
        this._form.controls['Ship_Extras'].setValue(JSON.parse(event.ExtrasText));
      }

      if(event) {
          this.calcFee();
      }
  }

  calculateFeeAship(event: DeliveryCarrierDTOV2): any {
    if (!this._form.controls['Carrier'].value ) {
      return this.message.error('Vui lòng chọn  đối tác giao hàng');
    }
    if (!this._form.controls['ShipWeight'].value ) {
      return this.message.error('Vui lòng chọn nhập khối lượng');
    }

    let model = this.prepareModelFeeV2();

    let promise = new Promise((resolve, reject): any => {

      this.isCalcFee = true;
      this.fastSaleOrderService.calculateFeeAship(model).subscribe((res: DeliveryResponseDto<CaculateFeeResponseDto>) => {

        if (res && res.Data?.Services) {

          let extras = event.ExtraProperties ? (JSON.parse(event.ExtraProperties) ?? []).filter((x: any) => !x.IsHidden) : [] as AshipGetInfoConfigProviderDto[];

          if(TDSHelperArray.hasListValue(extras) && TDSHelperArray.hasListValue(this.configsProviderDataSource)) {
            extras.map((x: AshipGetInfoConfigProviderDto) => {
                let exits = this.configsProviderDataSource.filter(e => e.ConfigName === x.ConfigName && (x.ConfigsValue.find(t => t.Id == e.ConfigValue)))[0];
                if(exits) {
                    x.ConfigValue = exits.ConfigValue;
                }
            })
          }

          this.configsProviderDataSource = [];
          this.configsProviderDataSource = [...extras];

          this.insuranceInfo = res.Data?.InsuranceInfo ?? null;
          this.shipServices = res.Data?.Services ?? [];

          if(TDSHelperArray.hasListValue(this.shipServices)) {
              let serviceDetail = this.shipServices[0] as CalculateFeeServiceResponseDto;
              this.selectShipServiceV2(serviceDetail);

              this.message.success(`Đối tác ${event.Name} có phí vận chuyển: ${formatNumber(Number(serviceDetail.TotalFee), 'en-US', '1.0-0')} đ`);
          }
        }

        else {
          if (res && res.Error) {
            this.message.error(res.Error.Message);
          }
        }

        this.isCalcFee = false;
        resolve(res);
        this.cdRef.detectChanges();

      }, error => {
          reject(error)
      })
    })

    return promise;
  }

  directPage(path: string) {
    this.router.navigateByUrl(path);
  }

  onBack(){
    history.back();
  }
}
