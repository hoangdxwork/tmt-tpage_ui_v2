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
import { finalize, map, mergeMap, takeUntil } from 'rxjs/operators';
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
  saleConfig!: SaleSettingsDTO;
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
  innerText: string = '';

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
  tipLoading: string = 'Loading...';

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
  chatomniEventEmiter: any;

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
    private printerService: PrinterService,
    private accountTaxService: AccountTaxService,
    private viewContainerRef: ViewContainerRef,
    private calcFeeAshipHandler: CalculateFeeAshipHandler,
    private destroy$: TDSDestroyService) {
      this.createForm();
      this.loadCurrentCompany();
  }

  createForm() {
    this._form = this.createFormBillHandler.createForm(this._form, this.fb);
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    this.path = this.route.snapshot.url[0].path;
    this.isOrder = this.route.snapshot.queryParams['isorder'];

    if (this.id) {
      // Trường hợp chỉnh sửa & sao chép
      this.loadBill(this.id);
    } else {
      // Trường hợp thêm mới + tạo hóa đơn F9
      this.loadDefault();
    }

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

    this.fastSaleOrderService.getById(id).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        delete res['@odata.context'];

        if(this.path == 'copy'){
          // Trường hợp sao chép
          this.loadCopyData(res);
        } else {
          let obs = res as FastSaleOrder_DefaultDTOV2;

          obs.DateInvoice = obs.DateInvoice ? new Date(obs.DateInvoice) : null;
          obs.DateOrderRed = obs.DateOrderRed ? new Date(obs.DateOrderRed) : null;
          obs.ReceiverDate = obs.ReceiverDate ? new Date(obs.ReceiverDate) : null;

          // TODO: cập nhật company id
          obs.CompanyId = this.companyCurrents.CompanyId;

          this.updateForm(obs);
          this.isLoading = false;
        }
    }, error => {
        this.message.error(error?.error?.message || 'Load hóa đơn đã xảy ra lỗi!');
        this.isLoading = false;
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

          // TODO: trường hợp tạo hóa đơn F9
          if(this.isOrder){
              const key = this.saleOnline_OrderService._keyCreateBillOrder;
              const item = localStorage.getItem(key) as string;

              if(TDSHelperString.hasValueString(item)) {
                  let order = JSON.parse(item) as SaleOnlineOrderGetDetailsDto;
                  data = {...this.prepareDetailsOrdLineHandler.prepareModel(data, order)} as FastSaleOrder_DefaultDTOV2;
              }
          }else{
            // TODO: xóa cache order
            const key = this.saleOnline_OrderService._keyCreateBillOrder;
            localStorage.removeItem(key);
          }

          this.updateForm(data);
          this.isLoading = false;
      },
      error:(err) => {
          this.isLoading = false;
          this.message.error(err?.error?.message || 'Load thông tin mặc định đã xảy ra lỗi!');
      }
    });
  }

  loadCopyData(data?: FastSaleOrder_DefaultDTOV2){
    delete this.id;
    let model = { Type: 'invoice', SaleOrderIds:[] };

    this.fastSaleOrderService.setDefaultV2({ model: model });
    this.fastSaleOrderService.getDefaultV2().pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: any) => {
        delete res['@odata.context'];
        let obs = {...this.prepareCopyBill.prepareModel(data, res)};

        obs.DateInvoice = obs.DateInvoice ? new Date(obs.DateInvoice) : null;
        obs.DateOrderRed = obs.DateOrderRed ? new Date(obs.DateOrderRed) : null;
        obs.ReceiverDate = obs.ReceiverDate ? new Date(obs.ReceiverDate) : null;

        this.updateForm(obs);
        this.isLoading = false;
      },
      error:(err) => {
        this.isLoading = false;
        this.message.error(err?.error?.message || 'Load thông tin mặc định đã xảy ra lỗi!');
      }
    })
  }

  updateForm(data: FastSaleOrder_DefaultDTOV2){
    // Cập nhật thông tin khách hàng
    let partnerId = data.PartnerId || data.Partner?.Id;
    if (partnerId) {
        this.changePartner(partnerId);
    }

    //TODO: cập nhật danh sách dịch vụ
    let services = this.getServiceHandler.getShipService(data);
    if(services != null){
        this.shipServices.push(services);
    }

    this.shipExtraServices = this.getServiceHandler.getShipExtrasService(data) || [];

    //TODO: nếu Team thiếu thông tin thì map dữ liệu
    if (data.TeamId) {
        this.loadTeamById(data.TeamId);
    }

    //TODO: cập nhật price of product theo bảng giá
    if (data.PriceListId) {
      this.commonService.getPriceListItems(data.PriceListId).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            this.priceListItems = res;
        },
        error: (error: any) => {
            this.message.error(error?.error?.message || 'Load bảng giá đã xảy ra lỗi!');
        }
      })
    }

    //TODO: cập nhật địa chỉ
    this.mappingDataAddress(data);

    //TODO: cập nhật danh sách sản phẩm
    this.updateOrderLines(data);
    this.dataModel = {...data};

    //Load thông tin ship aship
    this.loadConfigProvider(this.dataModel);
    this._form.patchValue(this.dataModel);
    this.calcTotal();
  }

  loadTeamById(id: any) {
    this.crmTeamService.getTeamById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (team: any) => {
        this.dataModel.Team!.Name = team?.Name;
        this.dataModel.Team!.Facebook_PageName = team?.Facebook_PageName;
      },
      error: (error: any) => {
        this.message.error(error?.error?.message)
      }
    })
  }

  mappingDataAddress(data:TDSSafeAny){
    let result = this.prepareSuggestionsBill.mappingAddress(data);

    this._cities = result?._cities || { code:'', name:'' };
    this._districts = result?._districts || this._districts;
    this._wards = result?._wards || this._wards;
    this._street = result?._street || this._street;
    this.innerText = this._street;
  }

  loadSaleConfig() {
    this.sharedService.setSaleConfig();
    this.sharedService.getSaleConfig().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.saleConfig = {...res};
      }
    })
  }

  loadCurrentCompany() {
    this.sharedService.setCurrentCompany();
    this.sharedService.getCurrentCompany().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: CompanyCurrentDTO) => {
        this.companyCurrents = res;
      },
      error: (error: any) => {
        this.message.error(error?.error?.message || 'Load thông tin công ty mặc định đã xảy ra lỗi!');
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

    this.loadChangePartner(partnerId).pipe(finalize(() => this.isLoading = false)).subscribe(([data, partner]) => {
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

  calcFee() {
    let model = this._form.controls['Carrier'].value;
    this.calculateFeeAship(model);
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

  onSelectShipServiceId(serviceId: CalculateFeeServiceResponseDto) {
    let exist = this.shipServices.filter((x: any) => x.ServiceId === serviceId)[0];
    this.selectShipServiceV2(exist);
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
    this._form.controls['DeliveryPrice'].setValue(value);
    this.coDAmount();
  }

  changeShip_InsuranceFee(value: number) {
    this._form.controls['Ship_InsuranceFee'].setValue(value);
    this.coDAmount();
  }

  changeAmountDeposit(value: number) {
    this._form.controls['AmountDeposit'].setValue(value);
    this.coDAmount();
  }

  changeShipWeight(): any {
    this._form.controls['ShipWeight'].setValue(this.dataModel.ShipWeight);
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
          this.message.error(error?.error?.message || 'ĝã xảy ra lỗi!');
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
        this.message.error(error?.error?.message || 'ĝã xảy ra lỗi!');
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

    this.calcTotal();
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

  onLoadProductToOrderLines(event: DataPouchDBDTO): any {

    if (!this._form.controls['Partner'].value) {
      return this.message.error('Vui lòng chờn khách hàng!');
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
    let x = this._form.controls['AmountTotal'].value
    this._form.controls['Ship_InsuranceFee'].setValue(x);

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
        return 'Huỷ bờ';
      case 'open':
        return 'Xác nhận';
      case 'paid':
        return 'ĝã thanh toán';
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
    let model = {...this.addBillHandler.prepareModel(this.dataModel, this._form)} as any;
    model.CompanyId = this.companyCurrents?.CompanyId;

    if(!TDSHelperString.hasValueString(model.FormAction)) {
      model.FormAction = 'draft';
    }

    if(this.path == 'copy') {
      model.OrderLines?.map((item: any) => {
          delete item.Account;
          delete item.AccountId;
      })
    }

    // TODO: trường hợp edit
    if(this.path == 'edit') {
      model.OrderLines?.map((item: any) => {
          item.AccountId = model.AccountId;
          if(model.Account) {
              item.Account = model.Account;
          }
      })
    }

    return {...model};
  }

  confirmShipService(carrier: TDSSafeAny) {
    this.modal.info({
      title: 'Cảnh báo',
      content: 'ĝối tác chưa có dịch vụ bạn hãy bấm [Ok] để tìm dịch vụ.\nHoặc [Cancel] để tiếp tục.\nSau khi tìm dịch vụ bạn hãy xác nhận lại."',
      onOk: () => this.calcFee(),
      onCancel:() => {},
      okText: "OK",
      cancelText: "Cancel"
    });
  }

  onSave(formAction?: string, print?: string): any {

    this.updateShipExtras();
    this.updateShipServiceExtras();
    this.updateShipmentDetailsAship();

    let model = this.prepareModel();

    if(TDSHelperString.hasValueString(formAction)) {
        model.FormAction = formAction;
    }

    if (!TDSHelperObject.hasValue(this._form.controls['Partner'].value) && !this._form.controls['PartnerId'].value) {
        return this.message.error('Vui lòng chờn khách hàng!');
    }
    if (!TDSHelperArray.hasListValue(this._form.controls['OrderLines'].value)) {
        return this.message.error('Vui lòng chờn ít nhất 1 sản phẩm!');
    }

    //TODO ràng buộc COD
    let COD = model.AmountTotal + model.DeliveryPrice - model.AmountDeposit;
    let exist = this.saleConfig?.GroupFastSaleDeliveryCarrier && model.Type == "invoice" && model.CashOnDelivery != COD && !model.TrackingRef;

    if (exist) {
      this.modal.warning({
          title: 'Cảnh báo',
          content: `COD hiện tại ${formatNumber(model.CashOnDelivery, 'en-US', '1.0-3')} không bằng tổng COD phần mờm tính ${formatNumber(COD, 'en-US', '1.0-3')} bạn có muốn gán lại COD của phần mờm [${formatNumber(COD, 'en-US', '1.0-3')}]`,
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

  saveRequest(model: any, print?: string) {
    if (this.id) {
      this.isLoading = true;

      this.fastSaleOrderService.update(this.id, model).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res: any) => {
          this.message.success('Cập nhật phiếu bán hàng thành công!');

          if(print) {
              this.printInvoices(print, this.id);
          } else {
              this.isLoading = false;
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
            this.message.success('Tạo mới phiếu bán hàng thành công!');
  
            if(print) {
              this.printInvoices(print, res.Id);
            } else {
              this.isLoading = false;
              this.router.navigateByUrl(`bill/detail/${res.Id}`);
            }
  
            // TODO: xóa cache tạo hóa đơn nếu có lưu F9
            if(this.isOrder){
              const key = this.saleOnline_OrderService._keyCreateBillOrder;
              localStorage.removeItem(key);
            }
  
          }, 
          error:(error) => {
              this.isLoading = false;
              this.message.error(`${error?.error?.message}` || 'Tạo mới phiếu bán hàng thất bại!');
          }
        });
    }
  }

  printInvoices(type: string, id: number) {

    let obs!: Observable<any>;
    switch (type) {
        case "print":
            obs = this.printerService.printUrl(`/fastsaleorder/print?ids=${[id]}`);
            break;

        case "printShip":
            obs = this.printerService.printUrl(`/fastsaleorder/printshipthuan?ids=${id}`);
          break;
        default: break;
    }

    if(!obs) {
      this.isLoading = false;
    }else{
      obs.pipe(takeUntil(this.destroy$)).subscribe({
        next:(res: TDSSafeAny) => {
          this.printerService.printHtml(res);
          this.isLoading = false;
  
          this.router.navigateByUrl(`bill/detail/${id}`);
        }, 
        error:(error: TDSSafeAny) => {
          this.isLoading = false;
          if(error?.error?.message) {
            this.message.error(error?.error?.message);
          }
  
          this.router.navigateByUrl(`bill/detail/${id}`);
        }
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
          this.coDAmount();
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
      return this.message.error('Vui lòng chờn  đối tác giao hàng');
    }
    if (!this._form.controls['ShipWeight'].value ) {
      return this.message.error('Vui lòng chờn nhập khối lượng');
    }

    let model = this.prepareModelFeeV2();
    this.isLoading = true;

    this.calcFeeAshipHandler.calculateFeeAship(model, event, this.configsProviderDataSource).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            if(res && !res.error) {

                if(!TDSHelperString.isString(res)){
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
    let cacl = this.calculateBillFee.fs_calcTotal(this._form, this.saleConfig);

    this.totalQtyLines = cacl.totalAmountLines;
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
    return this.crmTeamService.getAllFacebookChilds().pipe(map(res => res.value));
  }

  loadUser() {
    return this.applicationUserService.dataActive$;
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
        _street: this.innerText,
      }
    });

    modal.afterClose.subscribe({
      next: (result: ResultCheckAddressDTO) => {
        if(result){
          this.prepareSuggestionsBill.onLoadSuggestion(this._form, result);
          this.innerText = result.Address;
        }
      }
    })
  }
}
