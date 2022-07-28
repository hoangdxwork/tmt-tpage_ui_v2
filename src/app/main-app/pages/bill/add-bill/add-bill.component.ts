import { id } from 'date-fns/locale';
import { formatNumber } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { ModalSearchPartnerComponent } from '../components/modal-search-partner/modal-search-partner.component';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { SharedService } from 'src/app/main-app/services/shared.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AccountRegisterPaymentService } from 'src/app/main-app/services/account-register-payment.service';
import { formatDate } from '@angular/common';
import { PartnerCategoryDTO } from 'src/app/main-app/dto/partner/partner-category.dto';
import { CommonService } from 'src/app/main-app/services/common.service';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { FastSaleOrder_DefaultDTOV2, OrderLineV2, ServiceCustoms, ShipExtras, ShipServiceExtra } from 'src/app/main-app/dto/fastsaleorder/fastsaleorder-default.dto';
import { DeliveryCarrierDTOV2 } from 'src/app/main-app/dto/delivery-carrier.dto';
import { AccountJournalPaymentDTO } from 'src/app/main-app/dto/register-payment/register-payment.dto';
import { CustomerDTO } from 'src/app/main-app/dto/partner/customer.dto';
import { DeliveryCarrierService } from 'src/app/main-app/services/delivery-carrier.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, map, takeUntil, mergeMap } from 'rxjs/operators';
import { Observable, Subject, startWith, pairwise } from 'rxjs';
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
import { CalculateFeeResponse_DataDTO } from 'src/app/main-app/dto/carrier/delivery-carrier.dto';
import { InitSaleDTO, SaleSettingsDTO } from 'src/app/main-app/dto/setting/setting-sale-online.dto';
import { AccountTaxService } from 'src/app/main-app/services/account-tax.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { PartnerStatusDTO } from 'src/app/main-app/dto/partner/partner.dto';
import { THelperCacheService } from 'src/app/lib';
import { PartnerDetailDTO } from 'src/app/main-app/dto/partner/partner-detail.dto';
import { ChangePartnerPriceListDTO } from 'src/app/main-app/dto/partner/change-partner-pricelist.dto';
import { AddBillHandler } from './add-bill.handler';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { CaculateFeeResponseDto, CalculateFeeInsuranceInfoResponseDto, CalculateFeeServiceExtrasResponseDto, CalculateFeeServiceResponseDto, DeliveryResponseDto } from 'src/app/main-app/dto/carrierV2/delivery-carrier-response.dto';
import { AshipGetInfoConfigProviderDto } from 'src/app/main-app/dto/carrierV2/aship-info-config-provider-data.dto';
import { UpdateShipExtraHandler } from 'src/app/main-app/services/handlers/aship-v2/update-shipextra.handler';
import { UpdateShipServiceExtrasHandler } from 'src/app/main-app/services/handlers/aship-v2/update-shipservice-extras.handler';
import { PrepareModelFeeV2Handler } from 'src/app/main-app/services/handlers/aship-v2/prepare-model-feev2.handler';
import { SelectShipServiceV2Handler } from 'src/app/main-app/services/handlers/aship-v2/select-shipservice-v2.handler';
import { UpdateShipmentDetailAshipHandler } from 'src/app/main-app/services/handlers/aship-v2/shipment-detail-aship.handler';
import { CreateFormBillHandler } from 'src/app/main-app/services/handlers/bill-handler/create-form-bill.handler';
import { TDSI18nService } from 'tds-ui/i18n';

@Component({
  selector: 'app-add-bill',
  templateUrl: './add-bill.component.html',
})

export class AddBillComponent implements OnInit, OnDestroy {

  _form!: FormGroup;
  id: any;
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
  pageChange: string = 'bill';
  configsProviderDataSource: Array<AshipGetInfoConfigProviderDto> = [];

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder,
    private i18n: TDSI18nService,
    private cacheApi: THelperCacheService,
    private router: Router,
    private route: ActivatedRoute,
    private partnerService: PartnerService,
    private message: TDSMessageService,
    private deliveryCarrierService: DeliveryCarrierService,
    private sharedService: SharedService,
    private commonService: CommonService,
    private fsOrderLineService: FastSaleOrderLineService,
    private fastSaleOrderService: FastSaleOrderService,
    private saleOnlineOrderService: SaleOnline_OrderService,
    private modalService: TDSModalService,
    private cRMTeamService: CRMTeamService,
    private cdRef: ChangeDetectorRef,
    private modal: TDSModalService,
    private addBillHandler: AddBillHandler,
    private updateShipExtraHandler: UpdateShipExtraHandler,
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
    if (this.id) {
      this.loadBill(this.id);
    } else {
      // TODO: xử lý tạo mới + copy + tạo hóa đơn nhanh từ order nếu có
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

  directPage(route: string) {
    this.router.navigateByUrl(route);
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

  loadBill(id: number) {

    this.isLoading = true;
    this.fastSaleOrderService.getById(id).pipe(takeUntil(this.destroy$)).pipe(finalize(() => { this.isLoading = false })).subscribe((res: any) => {
      delete res['@odata.context'];
      let data = res as FastSaleOrder_DefaultDTOV2;

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
      this.loadConfigProvider(data);

      if (data.Ship_ServiceId) {
        this.shipServices.push({
            ServiceId: data.Ship_ServiceId,
            ServiceName: data.Ship_ServiceName,
            TotalFee: data.CustomerDeliveryPrice,
            InsuranceFee: 0,
            Extras: []
        });
      }

      if (data.Ship_ServiceExtras && data.Ship_ServiceExtras.length > 0) {

        for (let item of data.Ship_ServiceExtras) {
          this.shipExtraServices.push({
              Id: item.Id,
              Name: item.Name,
              Fee: item.Fee || 0,
              Type: item.Type,
              ExtraMoney: item.ExtraMoney,
              IsSelected: true as boolean,
          });
        }
      }

      this.mappingAddress(this.dataModel);
      //TODO: nếu Team thiếu thông tin thì map dữ liệu
      if (data.TeamId) {
        this.loadTeamById(data.TeamId);
      }
      this.updateForm(this.dataModel);
    }, error => {
      this.message.error(error?.error?.message || 'Load hóa đơn đã xảy ra lỗi!');
    })
  }

  loadDefault() {
    this.isLoading = true;
    let model = { Type: 'invoice' };
    this.fastSaleOrderService.defaultGetV2({ model: model }).pipe(takeUntil(this.destroy$)).pipe(finalize(() => this.isLoading = false)).subscribe((data: any) => {
      delete data['@odata.context'];

      data.DateInvoice = new Date();

      this.dataModel = data;
      //Trường hợp copy
      this.loadCacheCopy(this.dataModel);
      //Trường hợp Tạo hóa đơn F10 bên Đơn hàng
      this.updateByOrder(this.dataModel);
    }, error => {
      this.message.error(error?.error?.message || 'Load thông tin mặc định đã xảy ra lỗi!');
    });
  }

  loadCacheCopy(data: FastSaleOrder_DefaultDTOV2) {
    let keyCache = this.fastSaleOrderService._keyCacheCopyInvoice as string;
    this.cacheApi.getItem(keyCache).subscribe((obs) => {

      if (TDSHelperString.hasValueString(obs)) {
        let cache = JSON.parse(obs['value']) as TDSSafeAny;
        let cacheDB = JSON.parse(cache['value']) as TDSSafeAny;
        data = { ...data, ...cacheDB };
        // Copy xong xóa dữ liệu cache
        this.cacheApi.removeItem(keyCache);
        this.pageChange = 'bill';
      }

      this.mappingAddress(data);
      this.updateForm(data);

      // TODO: nếu trường hợp load thêm mới, gán dữ liệu địa chỉ khách hàng cho form khởi tạo
      if (data.PartnerId || data.Partner?.Id) {
        let partnerId = data.PartnerId || data.Partner?.Id;
        this.changePartner(partnerId);
      }
    })
  }

  updateByOrder(data: FastSaleOrder_DefaultDTOV2) {
    const key = this.saleOnlineOrderService._keyCreateBillOrder;

    this.cacheApi.getItem(key).subscribe((res) => {
      if (TDSHelperObject.hasValue(res)) {
        let model = JSON.parse(res?.value)?.value;

        if (TDSHelperObject.hasValue(model)) {
          data.SaleOnlineIds = model.ids;
          // data.Partner = model.partner;
          data.Reference = model.Reference;
          data.Comment = model.comment || '';
          data.FacebookId = model.facebookId;
          data.FacebookName = model.facebookName;
          data.IsProductDefault = model.isProductDefault;
          //Check kho hàng
          if (model.warehouse) {
            data.Warehouse = model.warehouse;
          }
          data.ReceiverName = model.partner.DisplayName;

          var orderLines: any = [];
          for (var item of model.orderLines) {
            orderLines.push({
              AccountId: item.AccountId,
              Discount: item.Discount || 0,
              Discount_Fixed: item.Discount_Fixed || 0,
              Note: item.Note,
              PriceRecent: item.PriceRecent || 0,
              PriceSubTotal: item.PriceSubTotal || 0,
              PriceTotal: item.PriceTotal || 0,
              PriceUnit: item.PriceUnit || 0,
              Product: item.Product,
              ProductId: item.ProductId,
              ProductName: item.ProductName,
              ProductNameGet: item.Product.NameGet,
              ProductUOM: item.ProductUOM,
              ProductUOMId: item.ProductUOMId,
              ProductUOMName: item.ProductUOMName,
              ProductUOMQty: item.ProductUOMQty,
              Type: item.Product.Type,
              Weight: item.Weight || 0,
              WeightTotal: 0
            });
          }

          if (model.partner) {
            this.changePartner(model.partner.Id)
          }

          data.OrderLines = orderLines;
        }
        this.pageChange = 'order';
      }
      this.mappingAddress(data);
      this.updateForm(data);
    })
  }

  loadTeamById(id: any) {
    this.cRMTeamService.getTeamById(id).pipe(takeUntil(this.destroy$)).subscribe((team: any) => {
      this.dataModel.Team.Name = team?.Name;
      this.dataModel.Team.Facebook_PageName = team?.Facebook_PageName;
    })
  }

  updateForm(data: FastSaleOrder_DefaultDTOV2) {
    //TODO: cập nhật price of product theo bảng giá
    if (data.PriceListId) {
      this.commonService.getPriceListItems(data.PriceListId).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        this.priceListItems = res;
      }, error => {
        this.message.error(error?.error?.message || 'Load bảng giá đã xảy ra lỗi!')
      })
    }

    if (TDSHelperArray.hasListValue(data.OrderLines)) {
      data.OrderLines.forEach((x: OrderLineV2) => {
        this.addOrderLines(x);
      });
    }

    if (!data.CashOnDelivery) {
      let cod = data.AmountTotal + data.DeliveryPrice - data.AmountDeposit;
      data.CashOnDelivery = cod;
    }

    this._form.patchValue(data);
  }

  mappingAddress(data: any) {
    if (data && data.Ship_Receiver?.City?.code) {
      this._cities = {
        code: data.Ship_Receiver.City.code,
        name: data.Ship_Receiver.City.name
      }
    }
    if (data && data.Ship_Receiver?.District?.code) {
      this._districts = {
        cityCode: data.Ship_Receiver.City?.code,
        cityName: data.Ship_Receiver.City?.name,
        code: data.Ship_Receiver.District.code,
        name: data.Ship_Receiver.District.name
      }
    }
    if (data && data.Ship_Receiver?.Ward?.code) {
      this._wards = {
        cityCode: data.Ship_Receiver.City?.code,
        cityName: data.Ship_Receiver.City?.name,
        districtCode: data.Ship_Receiver.District?.code,
        districtName: data.Ship_Receiver.District?.name,
        code: data.Ship_Receiver.Ward.code,
        name: data.Ship_Receiver.Ward.name
      }
    }
    if (data && data.Ship_Receiver?.Street) {
      this._street = data.Ship_Receiver.Street;
    }
  }

  onLoadSuggestion(item: ResultCheckAddressDTO) {
    this._form.controls['ReceiverAddress'].setValue(item.Address);
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
    this.sharedService.getConfigs().pipe(takeUntil(this.destroy$)).subscribe((res: InitSaleDTO) => {
      this.roleConfigs = res.SaleSetting;
    }, error => {
      this.message.error(error?.error?.message || 'Load thông tin cấu hình mặc định đã xảy ra lỗi!');
    });
  }

  loadCurrentCompany() {
    this.sharedService.getCurrentCompany().pipe(takeUntil(this.destroy$)).subscribe((res: CompanyCurrentDTO) => {
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

  // TODO: bug gọi api nhiều lần, fix khi tdsInputDebounce sửa xong
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
    this.loadChangePartner(partnerId).pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false))
      .subscribe(([data, partner]) => {
        if (data && partner) {

          const obs = data as ChangePartnerPriceListDTO;
          const partnerModel = partner as PartnerDetailDTO;

          obs.ReceiverName = partnerModel.Name;
          obs.ReceiverPhone = partnerModel.Phone;
          obs.ReceiverAddress = partnerModel.Street;

          obs.Ship_Receiver.Name = partnerModel.Name;
          obs.Ship_Receiver.Phone = partnerModel.Phone;
          obs.Ship_Receiver.Street = partnerModel.Street;

          obs.Ship_Receiver.City = {
            code: partnerModel.CityCode, name: partnerModel.CityName
          }
          obs.Ship_Receiver.District = {
            code: partnerModel.DistrictCode, name: partnerModel.DistrictName
          }
          obs.Ship_Receiver.Ward = {
            code: partnerModel.WardCode, name: partnerModel.WardName
          }
          if (obs.Account) {
            this._form.controls['Account'].setValue(obs.Account);
            this._form.controls['AccountId'].setValue(obs.AccountId);
          }

          this._form.controls['PriceList'].setValue(obs.PriceList);
          this._form.controls['PriceListId'].setValue(obs.PriceList?.Id);
          this._form.controls['Revenue'].setValue(obs.Revenue);
          this._form.controls['DeliveryNote'].setValue(obs.DeliveryNote);
          this._form.controls['ReceiverName'].setValue(obs.ReceiverName);
          this._form.controls['ReceiverPhone'].setValue(obs.ReceiverPhone);
          this._form.controls['ReceiverNote'].setValue(obs.ReceiverNote);
          this._form.controls['ReceiverAddress'].setValue(obs.ReceiverAddress);

          //TODO: Cập nhật lại nợ cũ
          this._form.controls['PreviousBalance'].setValue(obs.PreviousBalance);

          //TODO: Cập nhật lại dataSuggestion
          if (obs && obs.Ship_Receiver) {
            this._form.controls['Ship_Receiver'].patchValue({
              Name: obs.Ship_Receiver?.Name,
              Phone: obs.Ship_Receiver?.Phone,
              Street: obs.Ship_Receiver?.Street,
              City: {
                code: obs.Ship_Receiver?.City?.code,
                name: obs.Ship_Receiver?.City?.name
              },
              District: {
                code: obs.Ship_Receiver.District.code,
                name: obs.Ship_Receiver.District.name
              },
              Ward: {
                code: obs.Ship_Receiver.Ward.code,
                name: obs.Ship_Receiver.Ward.name
              }
            })
          }

          this.mappingAddress(obs);
        }
      }, error => {
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Thay đổi khách hàng đã xảy ra lỗi!');
      })
  }

  onChangePriceList(event: any) {
    if (TDSHelperObject.hasValue(event)) {
      this.commonService.getPriceListItems(event.Id).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
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
      let error = e.error.message || e.error.error_description;
      if (error)
          this.message.error(error);
    });
  }

  calcFeeList(type: boolean) {
    if(type) {
      let model = this.prepareModel();
      this.isCalcFee = true;

      this.fastSaleOrderService.calculateListFee({ model: model }).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {

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
    this.shipExtraServices = [...value];
  }

  changeDeliveryPrice(value: number) {
    if (value && value > 0) {
      this._form.controls['DeliveryPrice'].setValue(value);
    } else {
      this._form.controls['DeliveryPrice'].setValue(0);
    }
    this.updateCoDAmount();
  }

  changeShip_InsuranceFee(value: number) {
    if (value && value > 0) {
      this._form.controls['Ship_InsuranceFee'].setValue(value);
    } else {
      this._form.controls['Ship_InsuranceFee'].setValue(0);
    }
    this.updateCoDAmount();
  }

  changeAmountDeposit(value: number) {
    if (value && value > 0) {
      this._form.controls['AmountDeposit'].setValue(value);
    }else{
      this._form.controls['AmountDeposit'].setValue(0);
    }

    this.updateCoDAmount();
  }

  changeShipWeight(event: any): any {
    this._form.controls['ShipWeight'].setValue(event);
    this.calcFee();
  }

  openTrackingOrderGHN() {
    let key = this.dataModel.TrackingRef;
    this.fastSaleOrderService.getTokenTrackingOrderGHN({ key: key }).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
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
    this.fastSaleOrderService.getTrackingOrderAhaMove({ key: key }).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
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
      this.computeAmountTotal();
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
      this.computeAmountTotal();
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
    this.computeAmountTotal();
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
    this.computeAmountTotal();
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
    this.computeAmountTotal();
  }

  changeDiscount(event: any) {
    if (event) {
      this.computeAmountTotal();
    }
  }

  changeDecreaseAmount(event: any) {
    if (event) {
      this.computeAmountTotal();
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

    this.computeAmountTotal();
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

  initOrderLines(data: OrderLineV2 | null) {
    if (data != null) {
      return this.fb.group({
        Id: [data.Id],
        ProductId: [data.ProductId],
        ProductUOMId: [data.ProductUOMId],
        PriceUnit: [data.PriceUnit],
        ProductUOMQty: [data.ProductUOMQty],
        UserId: [this.dataModel.UserId],
        Discount: [data.Discount],
        Discount_Fixed: [Number(data.Discount_Fixed)],
        PriceTotal: [Number(data.PriceTotal)],
        PriceSubTotal: [Number(data.PriceSubTotal)],
        Weight: [data.Weight],
        WeightTotal: [data.WeightTotal],
        AccountId: [data.AccountId || this.dataModel.AccountId],
        PriceRecent: [data.PriceRecent],
        Name: [data.Name],
        IsName: [data.IsName],
        LiveCampaign_DetailId: [data.LiveCampaign_DetailId],
        LiveCampaignQtyChange: [0],
        OrderId: [data.OrderId],
        ProductName: [data.ProductName],
        ProductUOMName: [data.ProductUOMName],
        SaleLineIds: [data.SaleLineIds],
        ProductNameGet: [data.ProductNameGet],
        SaleLineId: [data.SaleLineId],
        Type: [data.Type],
        PromotionProgramId: [data.PromotionProgramId],
        Note: [data.Note],
        ProductBarcode: [data.ProductBarcode],
        CompanyId: [this.dataModel?.Company?.Id],
        PartnerId: [this.dataModel?.Partner?.Id],
        PriceSubTotalSigned: [data.PriceSubTotalSigned],
        PromotionProgramComboId: [data.PromotionProgramComboId],
        Product: [data.Product],
        ProductUOM: [data.ProductUOM],
        Account: [data.Account || this.dataModel.Account],
        SaleLine: [data.SaleLine],
        User: [data.User]
      });
    } else {
      return this.fb.group({
        Id: [null],
        ProductId: [null],
        ProductUOMId: [null],
        PriceUnit: [0],
        ProductUOMQty: [0],
        UserId: [null],
        Discount: [0],
        Discount_Fixed: [0],
        PriceTotal: [0],
        PriceSubTotal: [0],
        Weight: [0],
        WeightTotal: [0],
        AccountId: [null],
        PriceRecent: [0],
        Name: [null],
        IsName: [false],
        LiveCampaign_DetailId: [null],
        LiveCampaignQtyChange: [0],
        OrderId: [null],
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

  addOrderLines(data: OrderLineV2) {
    let control = <FormArray>this._form.controls['OrderLines'];
    control.push(this.initOrderLines(data));

    this.computeAmountTotal();
  }

  copyOrderLine(item: OrderLineV2, index: number) {
    var item = {
      Id: 0,
      ProductId: item.ProductId,
      ProductUOMId: item.ProductUOMId,
      PriceUnit: item.PriceUnit,
      ProductUOMQty: item.ProductUOMQty,
      UserId: item.UserId,
      Discount: item.Discount,
      Discount_Fixed: item.Discount_Fixed,
      PriceTotal: item.PriceTotal,
      PriceSubTotal: item.PriceSubTotal,
      Weight: item.Weight,
      WeightTotal: item.WeightTotal,
      AccountId: item.AccountId,
      PriceRecent: item.PriceRecent,
      Name: item.Name,
      IsName: false,
      OrderId: this.dataModel.Id,
      LiveCampaign_DetailId: null,
      LiveCampaignQtyChange: 0,
      ProductName: item.ProductName,
      ProductUOMName: item.ProductUOMName,
      SaleLineIds: item.SaleLineIds,
      ProductNameGet: item.ProductNameGet,
      SaleLineId: item.SaleLineId,
      Type: item.Type,
      PromotionProgramId: item.PromotionProgramId,
      Note: item.Note,
      ProductBarcode: item.ProductBarcode,
      CompanyId: item.CompanyId,
      PartnerId: this.dataModel.PartnerId,
      PriceSubTotalSigned: item.PriceSubTotalSigned,
      PromotionProgramComboId: item.PromotionProgramComboId,
      Product: null,
      ProductUOM: item.ProductUOM,
      Account: item.Account,
      SaleLine: null,
      User: this.dataModel.User
    } as OrderLineV2


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
    this.computeAmountTotal();
  }

  removeOrderLines(item: OrderLineV2, index: number) {
    (<FormArray>this._form.controls['OrderLines']).removeAt(index);

    this.totalQtyLines = Number(this.totalQtyLines - item.ProductUOMQty);
    this.totalAmountLines = Number(this.totalAmountLines - item.PriceTotal);
    this.computeAmountTotal();
  }

  removeAllOrderLines() {
    this._form.setControl('OrderLines', this.fb.array([]));
    this.computeAmountTotal();
  }

  onLoadProductToOrderLines(event: DataPouchDBDTO) {
    let datas = this._form.controls['OrderLines'].value as Array<OrderLineV2>;
    let exist = datas.filter((x: any) => x.ProductId == event.Id && x.ProductUOMId == event.UOMId && (x.Id != null || x.Id != 0))[0];

    if (exist) {
      this.onChangeQuantity(Number(exist.ProductUOMQty + 1), exist);
    } else {
      this.pushProductToOrderlines(event);
    }
  }

  pushProductToOrderlines(event: DataPouchDBDTO): any {
    let data = {
      model: {
        Discount: event.DiscountSale,
        Discount_Fixed: 0,
        Note: null,
        PriceUnit: event.Price,
        PriceRecent: event.OldPrice,
        Product: {
          Id: event.Id
        },
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

    if (!this._form.controls['Partner'].value) {
      return this.message.error('Vui lòng chọn khách hàng!');
    }

    this.isLoadingProduct = true;
    this.fsOrderLineService.onChangeProduct(data)
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => { this.isLoadingProduct = false }))
      .subscribe((res: FSOrderLines) => {
        delete res['@odata.context'];

        var item: OrderLineV2 = {
          Id: 0,
          ProductId: res.ProductId,
          ProductUOMId: res.ProductUOMId,
          PriceUnit: res.PriceUnit,
          ProductUOMQty: res.ProductUOMQty,
          UserId: this.dataModel.UserId,
          Discount: res.Discount,
          Discount_Fixed: res.Discount_Fixed,
          PriceTotal: res.PriceTotal,
          PriceSubTotal: res.PriceSubTotal,
          Weight: res.Weight,
          WeightTotal: res.WeightTotal,
          AccountId: res.AccountId || res.Account?.Id,
          PriceRecent: res.PriceRecent,
          Name: res.Name,
          IsName: false,
          OrderId: this.dataModel.Id,
          LiveCampaign_DetailId: null,
          LiveCampaignQtyChange: 0,
          ProductName: res.ProductName,
          ProductUOMName: res.ProductUOMName,
          SaleLineIds: res.SaleLineIds,
          ProductNameGet: res.ProductNameGet,
          SaleLineId: res.SaleLineId,
          Type: res.Type,
          PromotionProgramId: res.PromotionProgramId,
          Note: res.Note,
          ProductBarcode: res.ProductBarcode,
          CompanyId: res.CompanyId || this.dataModel.Company?.Id,
          PartnerId: this.dataModel.PartnerId,
          PriceSubTotalSigned: res.PriceSubTotalSigned,
          PromotionProgramComboId: res.PromotionProgramComboId,
          Product: null,
          ProductUOM: res.ProductUOM,
          Account: res.Account,
          SaleLine: null,
          User: this.dataModel.User || null,
        } as any

        if (item.Id <= 0) {
          item.Id = this.idPush - 1;
          this.idPush = item.Id;
        }

        this.addOrderLines(item);
        this.computeAmountTotal();
        this.cdRef.detectChanges();
      }, error => {
        this.message.error(`${error?.error?.message}` || 'Thêm sản phẩm thất bại')
      })
  }

  computeAmountTotal() {
    let totalQty = 0;
    let totalPrice = 0;

    let datas = this._form.controls['OrderLines'].value as Array<OrderLineV2>;
    datas.forEach((x: OrderLineV2) => {
      x.Discount = x.Discount ? x.Discount : 0;
      x.PriceTotal = (x.PriceUnit * (1 - (x.Discount || 0) / 100) - (x.Discount_Fixed || 0)) * x.ProductUOMQty;
      x.WeightTotal = Math.round(x.ProductUOMQty * x.Weight * 1000) / 1000;

      //TODO: tổng số lượng và tổng tiền tạm tính
      totalQty = totalQty + x.ProductUOMQty;
      totalPrice = totalPrice + x.PriceTotal;
    });

    //TODO: tổng số lượng và tổng tiền tạm tính
    this.totalQtyLines = totalQty;
    this.totalAmountLines = totalPrice;

    //TODO: Tính giá trị tổng bao gồm ShipWeight,WeightTotal,DiscountAmount,AmountUntaxed,PaymentAmount,TotalQuantity,AmoutTotal
    this.updateTotalSummary(datas);
    this.updateQuantitySummary(datas);
    //TODO: update lại Giao hàng thu tiền
    this.updateCoDAmount();
  }

  updateTotalSummary(datas: OrderLineV2[]) {

    let total = 0;
    let weightTotal = 0;

    if (TDSHelperArray.hasListValue(datas)) {
      datas.forEach((x: OrderLineV2) => {
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

    if (!this.roleConfigs || !this.roleConfigs.GroupAmountPaid) {
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

  updateQuantitySummary(datas: OrderLineV2[]) {
    let total = 0;
    datas.forEach((x: OrderLineV2) => {
      if (!x.PromotionProgramId) {
        total += x.ProductUOMQty;
      }
    });
    this._form.controls['TotalQuantity'].setValue(total);
  }

  updateCoDAmount() {
    let formModel = this._form.value;
    let coDAmount = (formModel.AmountTotal + formModel.DeliveryPrice) - formModel.AmountDeposit;
    if (coDAmount > 0) {
      this._form.controls['CashOnDelivery'].setValue(coDAmount);
    }else{
      this._form.controls['CashOnDelivery'].setValue(0);
    }
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
    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe((event: any) => {
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
    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe((event: any) => {
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

    return x;
  }

  onSave(): any {
    this.updateShipExtras();
    this.updateShipServiceExtras();
    this.updateShipmentDetailsAship();

    let model = this.prepareModel();

    // console.log(model)
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
      this.fastSaleOrderService.update(this.id, model).pipe(takeUntil(this.destroy$), finalize(() => { this.isLoading = false })).subscribe((res: any) => {
        this.message.success('Cập nhật phiếu bán hàng thành công!');
      }, error => {
        this.message.error(`${error.error.message}` || 'Cập nhật phiếu bán hàng thất bại!');
      })

    } else {

      this.isLoading = true;
      this.fastSaleOrderService.insert(model).pipe(takeUntil(this.destroy$), finalize(() => { this.isLoading = false })).subscribe((res: any) => {
        this.message.success('Tạo mới phiếu bán hàng thành công!');
        if (this.pageChange === 'order') {
          this.onBack();
        } else {
          this.router.navigateByUrl(`bill/detail/${res.Id}`);
        }
      }, error => {
        this.message.error(`${error.error.message}` || 'Tạo mới phiếu bán hàng thất bại!');
      });
    }
  }

  onBack() {
    this.router.navigateByUrl(this.pageChange);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
          this.updateCoDAmount();
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
    let model = this.prepareModelFeeV2();

    if (!this._form.controls['Carrier'].value ) {
      return this.message.error('Vui lòng chọn  đối tác giao hàng');
    }
    if (!this._form.controls['ShipWeight'].value ) {
      return this.message.error('Vui lòng chọn nhập khối lượng');
    }

    let promise = new Promise((resolve, reject): any => {

      this.isCalcFee = true;
      this.fastSaleOrderService.calculateFeeAship(model).pipe(takeUntil(this.destroy$)).subscribe((res: DeliveryResponseDto<CaculateFeeResponseDto>) => {

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

          this.isCalcFee = false;
          this.message.error(`${error.error_description}` || 'Tính phí đã xảy ra lỗi!');
          this.cdRef.detectChanges();
      })
    })

    return promise;
  }

}
