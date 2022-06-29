import { FilterObjDTO, OdataProductService } from './../../../../services/mock-odata/odata-product.service';
import { CommonService } from 'src/app/main-app/services/common.service';
import { CalculateFeeResponse_Data_ServiceDTO, DeliveryCarrierDTO } from './../../../../dto/carrier/delivery-carrier.dto';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { TAuthService } from 'src/app/lib';
import { UserInitDTO } from 'src/app/lib/dto';
import { CheckAddressDTO, DataSuggestionDTO, ResultCheckAddressDTO } from 'src/app/main-app/dto/address/address.dto';
import { SaleOnlineFacebookCommentFilterResultDTO, SaleOnline_OrderDTO } from 'src/app/main-app/dto/saleonlineorder/sale-online-order.dto';
import { SaleOnline_FacebookCommentService } from 'src/app/main-app/services/sale-online-facebook-comment.service';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { ProductService } from 'src/app/main-app/services/product.service';
import { GetInventoryDTO, ValueGetInventoryDTO } from 'src/app/main-app/dto/product/product.dto';
import { ApplicationUserService } from 'src/app/main-app/services/application-user.service';
import { ApplicationUserDTO } from 'src/app/main-app/dto/account/application-user.dto';
import { TpageAddProductComponent } from 'src/app/main-app/shared/tpage-add-product/tpage-add-product.component';
import { PartnerStatusDTO } from 'src/app/main-app/dto/partner/partner.dto';
import { Message } from 'src/app/lib/consts/message.const';
import { FastSaleOrderLineDTO, FastSaleOrderRestDTO, FastSaleOrder_ServiceExtraDTO } from 'src/app/main-app/dto/fastsaleorder/fastsaleorder.dto';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { Observable } from 'rxjs';
import { CarrierHandler } from 'src/app/main-app/services/handlers/carier.handler';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { DeliveryCarrierService } from 'src/app/main-app/services/delivery-carrier.service';
import { finalize } from 'rxjs/operators';
import { CheckFormHandler } from 'src/app/main-app/services/handlers/check-form.handler';
import { SuggestCitiesDTO, SuggestDistrictsDTO, SuggestWardsDTO } from 'src/app/main-app/dto/suggest-address/suggest-address.dto';
import { TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TACheckboxChange } from 'tds-ui/tds-checkbox';

@Component({
  selector: 'edit-order',
  templateUrl: './edit-order.component.html'
})

export class EditOrderComponent implements OnInit {

  @Input() idOrder: string = "";

  _form!: FormGroup;

  dataSuggestion!: DataSuggestionDTO;
  userInit!: UserInitDTO;
  lstComment: SaleOnlineFacebookCommentFilterResultDTO[] = [];
  isEnableCreateOrder: boolean = false;
  enableInsuranceFee: boolean = false;
  isLoadCarrier: boolean = false;

  model!: SaleOnline_OrderDTO;
  defaultBill!: FastSaleOrderRestDTO;

  // Giá trị này phải khởi tạo = []
  shipExtraServices: TDSSafeAny[] = [];
  shipServices: CalculateFeeResponse_Data_ServiceDTO[] = [];

  saveType = {
    orderSave: 1,
    orderPrint: 2,
    billSave: 3,
    billPrint: 4,
    billPrintShip: 5
  }

  _cities!: SuggestCitiesDTO;
  _districts!: SuggestDistrictsDTO;
  _wards!: SuggestWardsDTO;
  _street!: string;

  numberWithCommas = (value: number) => `${value} đ`;
  parserComas = (value: string) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  lstDeliveryCarrier!: Array<DeliveryCarrierDTO>;
  lstInventory!: GetInventoryDTO;
  lstUser!: Array<ApplicationUserDTO>;
  lstPartnerStatus!: Array<PartnerStatusDTO>;

  constructor(private modal: TDSModalService,
    private modalRef: TDSModalRef,
    private fb: FormBuilder,
    private auth: TAuthService,
    private message: TDSMessageService,
    private viewContainerRef: ViewContainerRef,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private saleOnline_FacebookCommentService: SaleOnline_FacebookCommentService,
    private productService: ProductService,
    private applicationUserService: ApplicationUserService,
    private commonService: CommonService,
    private fastSaleOrderService: FastSaleOrderService,
    private carrierHandler: CarrierHandler,
    private partnerService: PartnerService,
    private odataProductService: OdataProductService,
    private deliveryCarrierService: DeliveryCarrierService,
    private checkFormHandler: CheckFormHandler) {
      this.createForm();
   }

  ngOnInit(): void {
    this.loadUserInfo();
    this.loadDeliveryCarrier();
    this.loadUser();
    this.loadPartnerStatus();

    this.loadData();
  }

  loadProduct(textSearch: string) {
    let filterObj: FilterObjDTO = {
      searchText: textSearch,
    }

    let pageSize = 20;
    let pageIndex = 1;

    let filters = this.odataProductService.buildFilter(filterObj);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters);

    this.odataProductService.getView(params).subscribe((res: TDSSafeAny) => {
        // console.log("view product:", res);
    });
  }

  onSave(type: TDSSafeAny) {debugger
    let model = this.prepareOrderModel();

    this.saleOnline_OrderService.update(this.idOrder, model).subscribe((res: any) => {
      if(type == this.saveType.orderSave) {
        this.message.success(Message.Order.UpdateSuccess);
        this.onCancel(true);
      }
      else if(type == this.saveType.orderPrint) {
        // TODO: in
        this.onCancel(true);
      }
      else if(this.isEnableCreateOrder) {
        let modelSale = this.prepareSaleModel();

        if(modelSale) {
          this.fastSaleOrderService.create(this.defaultBill).subscribe((data: any) => {
            if (data.Success) {
              if (data.Message) {
                this.message.warning(data.Message);
              } else {
                this.message.success(Message.Bill.InsertSuccess);
              }

              // TODO: thực hiện in
              if(type == this.saveType.billPrint) {

              }
              else if(type == this.saveType.billPrintShip) {

              }

              this.onCancel(data);

            } else {
              this.message.error(data.Message);
            }
          });
        }
      }
    }, error => {this.message.error(JSON.stringify(error))});
  }

  loadData() {
    this.saleOnline_OrderService.getById(this.idOrder).subscribe(res => {
      this.model = res;

      this.updateForm(res);
      this.getCommentsByUserAndPost(res.Facebook_ASUserId, res.Facebook_PostId);
    });
  }

  loadUserInfo() {
    this.auth.getUserInit().subscribe(res => {
      this.userInit = res || {};

      if(this.userInit?.Company?.Id) {
        this.loadInventoryWarehouseId(this.userInit?.Company?.Id);
      }
    })
  }

  loadDeliveryCarrier() {
    this.deliveryCarrierService.get().subscribe((res: any) => {
      this.lstDeliveryCarrier = res.value;
    });
  }

  loadInventoryWarehouseId(warehouseId: number) {
    this.productService.getInventoryWarehouseId(warehouseId).subscribe(res => {
      this.lstInventory = res;
    });
  }

  loadUser() {
    this.applicationUserService.getActive().subscribe(res => {
      this.lstUser = res.value;
    });
  }

  loadPartnerStatus() {
    this.commonService.getPartnerStatus().subscribe(res => {
      this.lstPartnerStatus = res;
    });
  }

  loadDefaultBill() {
    // TODO: dữ liệu bill default nên lưu lại
    this.fastSaleOrderService.defaultGet().subscribe(res => {
      delete res["@odata.context"];
      this.defaultBill = res;
      this.updateBillByForm(this._form);
    });
  }

  onEnableCreateOrder(event: TACheckboxChange) {
    if(event.checked && !this.defaultBill) {
      this.loadDefaultBill();
    }
  }

  onSearchProduct(event: any) {
    let text = event.target.value;
    this.loadProduct(text);
  }

  onAddProduct() {
    const modal = this.modal.create({
      title: 'Thêm sản phẩm',
      content: TpageAddProductComponent,
      size: 'xl',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
      }
    });

    modal.componentInstance?.onLoadedProductSelect.subscribe(result => {
      if(TDSHelperObject.hasValue(result)) {
        let details = this._form.controls['Details'];

        let productAdd = {
            Factor: 1,
            Id: this.idOrder,
            ImageUrl: result.ImageUrl,
            Note: '',
            OrderId: '',
            Price: result.ListPrice,
            Priority: 0,
            ProductCode: result.Barcode,
            ProductId: result.Id,
            ProductName: result.Name,
            ProductNameGet: result.NameGet,
            Quantity: 1,
            UOMId: result.UOMId,
            UOMName: result.UOMName
        };

        (details as FormArray).push(new FormControl(productAdd));

        this.updateTotalAmount();
        this.updateTotalQuantity();
        this.updateCoDAmount();
      }
    });
  }

  prepareOrderModel() {
    let formValue = this._form.value;

    this.model.Partner = formValue.Partner;
    this.model.Name = formValue.Name;
    this.model.Telephone = formValue.Telephone;
    this.model.Email = formValue.Email;
    this.model.Note = formValue.Note;

    this.model.Address = formValue.Address;

    this.model.CityCode = formValue.City?.code ? formValue.City.code : null;
    this.model.CityName = formValue.City?.name ? formValue.City.name : null;

    this.model.DistrictCode = formValue.District?.code ? formValue.District.code : null;
    this.model.DistrictName = formValue.District?.name ? formValue.District.name : null;

    this.model.WardCode = formValue.Ward?.code ? formValue.Ward.code : null;
    this.model.WardName = formValue.Ward?.name ? formValue.Ward.name : null;

    if (formValue.User) {
      this.model.User = formValue.User;
      this.model.UserId = formValue.User.Id
    } else {
      this.model.User = undefined;
    }

    this.model.Details = formValue.Details || [];
    this.model.TotalAmount = formValue.TotalAmount || 0;
    this.model.TotalQuantity = formValue.TotalQuantity || 0;

    return this.model;
  }

  prepareSaleModel(): boolean {
    if(!this.model.Details || this.model.Details.length < 1) {
      this.message.error(Message.Order.EmptyProduct);
      return false;
    }

    let formValue = this._form.value;

    this.defaultBill.SaleOnlineIds = this.model.Id ? [this.model.Id] : [];

    this.defaultBill.PartnerId = formValue.Partner ? formValue.Partner.Id : null;
    this.defaultBill.Partner = formValue.Partner ? formValue.Partner : null;
    this.defaultBill.OrderLines = [];
    this.defaultBill.Carrier = formValue.Carrier;
    this.defaultBill.CarrierId = formValue.Carrier ? formValue.Carrier.Id : null;
    this.defaultBill.ShipWeight = formValue.ShipWeight;
    this.defaultBill.DeliveryPrice = formValue.DeliveryPrice;
    this.defaultBill.CashOnDelivery = formValue.CashOnDelivery;
    this.defaultBill.DeliveryNote = formValue.DeliveryNote;
    this.defaultBill.Ship_ServiceId = formValue.Ship_ServiceId;
    this.defaultBill.Ship_ServiceName = formValue.Ship_ServiceName;
    this.defaultBill.CustomerDeliveryPrice = formValue.CustomerDeliveryPrice;
    this.defaultBill.Ship_InsuranceFee = formValue.Ship_InsuranceFee;
    this.defaultBill.Ship_Extras = formValue.Ship_Extras;
    this.defaultBill.CompanyId = formValue.Company.Id;
    this.defaultBill.AmountTotal = formValue.AmountTotal;

    if(formValue.Ship_Receiver) {
      this.defaultBill.Ship_Receiver = formValue.Ship_Receiver;
    }
    else {
      if (formValue["Address"]) {
        this.defaultBill.Ship_Receiver = {
          Name: formValue["Name"],
          FullAddress: formValue["Address"] || formValue["Street"],
          Street: formValue["Address"],
          Phone: formValue["Telephone"],
          City: formValue["City"],
          District: formValue["District"],
          Ward: formValue["Ward"],
        };
      }
      else {
        formValue["Ship_Receiver"].setValue(null)
      }
    }

    this.defaultBill.OrderLines = formValue.Details.map((detail: TDSSafeAny) => {
      let item: TDSSafeAny = {
        ProductId: detail.ProductId,
        ProductUOMId: detail.UOMId,
        ProductUOMQty: detail.Quantity,
        PriceUnit: detail.Price,
        Discount: 0,
        Discount_Fixed: 0,
        Type: "fixed",
        PriceSubTotal: detail.Price * detail.Quantity,
        Note: detail.Note
      }

      return item;
    });

    if (this.shipExtraServices) {
      this.shipExtraServices.map((x) => {
        this.defaultBill.Ship_ServiceExtras = [];
        if (x.IsSelected) {
          this.defaultBill.Ship_ServiceExtras.push({
            Id: x.ServiceId,
            Name: x.ServiceName,
            Fee: x.Fee,
            Type: x.Type,
            ExtraMoney: x.ExtraMoney
          });
        }
      });
    }

    this.defaultBill.Ship_ServiceExtrasText = JSON.stringify(this.defaultBill.Ship_ServiceExtras);

    let formControl = this._form.controls;
    let carrierValue = formControl.Carrier.value;

    if (carrierValue && carrierValue.DeliveryType == 'NinjaVan') {
      formControl.Ship_ServiceId.setValue('Standard');
      formControl.Ship_ServiceName.setValue('Tiêu chuẩn');
    }

    if(carrierValue) {
      if (carrierValue.DeliveryType === "ViettelPost" || carrierValue.DeliveryType === "GHN" ||
          carrierValue.DeliveryType === "TinToc" || carrierValue.DeliveryType === "FlashShip") {
        if (carrierValue.DeliveryType === "GHN") {
          formControl.Ship_ServiceId.setValue(formControl.Ship_ServiceId.value || carrierValue.GHN_ServiceId);
        }
        else if (carrierValue.DeliveryType === "ViettelPost" || carrierValue.DeliveryType === "TinToc" || carrierValue.DeliveryType === "FlashShip" ) {
          formControl.Ship_ServiceId.setValue(formControl.Ship_ServiceId.value || carrierValue.ViettelPost_ServiceId);
        }
        if (!formControl.Ship_ServiceId.value) {
          this.confirmShipService(carrierValue);
          return false;
        }
      }
    }

    let check = this.checkFormHandler.checkValueBill(this.defaultBill);

    if(TDSHelperString.hasValueString(check)) {
      this.message.error(JSON.stringify(check));
      return false;
    }

    return true;
  }

  confirmShipService(carrier: TDSSafeAny) {
    this.modal.info({
      title: 'Cảnh báo',
      content: 'Đối tác chưa có dịch vụ bạn hãy bấm [Ok] để tìm dịch vụ.\nHoặc [Cancel] để tiếp tục.\nSau khi tìm dịch vụ bạn hãy xác nhận lại."',
      onOk: () => this.calculateFee(carrier),
      onCancel:()=>{},
      okText:"Đồng ý",
      cancelText:"Hủy"
    });
  }

  onSelectCarrier(event: any) {
    this.shipExtraServices.length = 0;
    this.shipServices.length = 0;
    this.enableInsuranceFee = false;
    this.isLoadCarrier = true;

    this.carrierHandler.changeCarrierV2(this.defaultBill, this._form, event, this.shipExtraServices)
      .pipe(finalize(() => this.isLoadCarrier = false))
      .subscribe(res => {
          this.shipServices = res?.Services || [];
          this.updateShipExtraServices(event);
          this.updateFormByBillDefault(this.defaultBill);
      }, error => {
          this.updateFormByBillDefault(this.defaultBill);
          this.message.error(error.error_description ? error.error_description : JSON.stringify(error));
      });
  }

  updateShipExtraServices(carrier: any) {
    if(carrier) {
      let insuranceFee = this._form.value.Ship_Extras?.InsuranceFee || 0;

      this.enableInsuranceFee = this.carrierHandler.getShipExtraServices(carrier, this.shipExtraServices);
      this.enableInsuranceFee && (this._form.controls.Ship_InsuranceFee.setValue(insuranceFee));
    }
  }

  onSelectShipServices(event: any) {
    !this.shipExtraServices && (this.shipExtraServices = []);
    this.carrierHandler.selectShipService(event, this.defaultBill, this.shipExtraServices);

    if (this.defaultBill.Carrier?.DeliveryType === 'GHN') {
      this.onUpdateInsuranceFee('16').subscribe(res => {});
    }
  }

  onUpdateInsuranceFee(serviceId: any): Observable<any> {
    return this.carrierHandler.onUpdateInsuranceFee(serviceId, this.defaultBill, this._form, this.shipExtraServices);
  }

  existDeliveryTypes(deliveryType: string) {
    return this.carrierHandler.existDeliveryTypes(deliveryType);
  }

  calcFee() {
    if (!this.defaultBill.Carrier || !this.defaultBill.Carrier.Id) {
      this.message.error(Message.Carrier.EmptyCarrier);
      return;
    }

    this.calculateFee(this.defaultBill.Carrier);
  }

  calculateFee(item: any) {
    this.carrierHandler.calculateFee(item, this.defaultBill, this._form, this.shipExtraServices).subscribe(res => {
        this.shipServices = res?.Services || [];
    }, (error: TDSSafeAny) => {
      if(error && typeof error == 'string') {
        this.message.error(error);
      }
    });
  }

  updateForm(data: any) {
    let formControls = this._form.controls;

    formControls["Facebook_UserName"].setValue(data.Facebook_UserName);
    formControls["Facebook_UserId"].setValue(data.Facebook_UserId);
    formControls["Name"].setValue(data.Name);
    formControls["Partner"].setValue(data.Partner);
    formControls["Telephone"].setValue(data.Telephone);
    formControls["Email"].setValue(data.Email);
    formControls["AmountDeposit"].setValue(data.AmountDeposit || 0);

    formControls["Company"].setValue(this.userInit?.Company);
    formControls["CompanyId"].setValue(this.userInit?.Company?.Id);

    formControls["User"].setValue(data.User);
    formControls["Note"].setValue(data.Note);
    formControls["TotalAmount"].setValue(data.TotalAmount);

    formControls["CashOnDelivery"].setValue(
      formControls["DeliveryPrice"].value +
      formControls["TotalAmount"].value
    );

    this.mappingAddress(data);
    this._form.setControl("Details", this.fb.array(data.Details || []));
  }

  mappingAddress(data: any) {
    if (data && data.CityCode) {
      this._cities = {
        code: data.CityCode,
        name: data.CityName
      }
    }
    if (data && data.DistrictCode) {
      this._districts = {
        cityCode: data.CityCode,
        cityName: data.CityName,
        code: data.DistrictCode,
        name: data.DistrictName
      }
    }
    if (data && data.WardCode) {
      this._wards = {
        cityCode: data.CityCode,
        cityName: data.CityName,
        districtCode: data.DistrictCode,
        districtName: data.DistrictName,
        code: data.WardCode,
        name: data.WardName
      }
    }
    if (data && (data.Address)) {
      this._street = data.Address;
    }
  }

  onLoadSuggestion(item: ResultCheckAddressDTO) {
    this._form.controls['Address'].setValue( item.Address ? item.Address : null);

  if(item && item.CityCode) {debugger
    this._form.controls['City'].patchValue({
        code: item.CityCode,
        name: item.CityName
    });
  } else{
    this._form.controls['City'].setValue(null)
  }

  if(item && item.DistrictCode) {
    this._form.controls['District'].patchValue({
        code: item.DistrictCode,
        name: item.DistrictName
    });
  } else {
    this._form.controls['District'].setValue(null)
  }

  if(item && item.WardCode) {
    this._form.controls['Ward'].patchValue({
        code: item.WardCode,
        name: item.WardName
    });
  } else {
    this._form.controls['Ward'].setValue(null)
  }
}

  updateFormByBillDefault(billDefault: FastSaleOrderRestDTO) {
    billDefault.Ship_ServiceExtras = JSON.parse(billDefault.Ship_ServiceExtrasText) || [];

    let formControl = this._form.controls;

    formControl["Carrier"].setValue(billDefault.Carrier);
    formControl["Ship_Extras"].setValue(billDefault.Ship_Extras);
    formControl["ShipWeight"].setValue(billDefault.ShipWeight);

    formControl["DeliveryPrice"].setValue(
      billDefault.DeliveryPrice || 0
    );

    formControl["CashOnDelivery"].setValue(
      (billDefault.DeliveryPrice || 0) + (billDefault.AmountTotal || 0)
    );

    formControl["DeliveryNote"].setValue(
      billDefault.DeliveryNote || 0
    );

    formControl["Ship_ServiceId"].setValue(
      billDefault.Ship_ServiceId
    );

    formControl["Ship_ServiceName"].setValue(
      billDefault.Ship_ServiceName
    );

    formControl["CustomerDeliveryPrice"].setValue(
      billDefault.CustomerDeliveryPrice || 0
    );

    formControl["Company"].setValue(billDefault.Company);

    if (formControl["Address"].value) {
      formControl["Ship_Receiver"].setValue({
        Name: formControl["Name"].value,
        Street: formControl["Address"].value,
        Phone: formControl["Telephone"].value,
        City: formControl["City"].value,
        District: formControl["District"].value,
        Ward: formControl["Ward"].value,
      });
    }
    else {
      formControl["Ship_Receiver"].setValue(null)
    }
  }

  updateBillByForm(form: FormGroup) {
    let formValue = form.value;

    if (this.defaultBill.Ship_ServiceExtras && this.defaultBill.Ship_ServiceExtras.length > 0) {
      this.defaultBill.Ship_ServiceExtras.forEach((element: FastSaleOrder_ServiceExtraDTO) => {

        if (element.Id === "NinjaVan" || element.Id === "16" || element.Id === "GBH" ||
          (element.Id === "OrderAmountEvaluation" && this.defaultBill.Carrier?.DeliveryType === "MyVNPost") ) {
          this.enableInsuranceFee = true;
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

    this.defaultBill.Address = formValue.Address || formValue.Street;

    if (formValue["Address"]) {
      this.defaultBill.Ship_Receiver = {
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
      this.defaultBill.Ship_Receiver = null;
    }
  }

  initOkieLa() {
    let formControls = this._form.controls;

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

  initNinjaVan() {
    let formControls = this._form.controls;

    if (formControls.Carrier.value && formControls.Carrier.value.DeliveryType == 'NinjaVan' && formControls.Ship_Extras.value) {
      this.shipExtraServices.length = 0;

      this.shipExtraServices.push({
        ServiceId: "NinjaVan",
        ServiceName: "Khai giá hàng hóa",
        Fee: formControls.Ship_Extras.value.InsuranceFee ? formControls.Ship_Extras.value.InsuranceFee : 0,
        IsSelected: formControls.Ship_Extras.value.IsInsurance ? formControls.Ship_Extras.value.IsInsurance : false,
      });

      this.enableInsuranceFee = formControls.Ship_Extras.value.IsInsurance ? formControls.Ship_Extras.value.IsInsurance : false;
      formControls["Ship_InsuranceFee"].setValue(formControls.Ship_Extras.value.InsuranceFee ? formControls.Ship_Extras.value.InsuranceFee : 0);
    }
  }

  getCommentsByUserAndPost(asId: string, postId: string) {
    this.saleOnline_FacebookCommentService.getCommentsByUserAndPost(asId, postId).subscribe(res => {
      this.lstComment = res.value.map((x: any) => {
        x.selected = false;
        return x;
      });

    });
  }

  onChangeProductPrice() {
    this.updateTotalAmount();
    this.updateTotalQuantity();
    this.updateCoDAmount();
  }

  onChangeProductQuantity() {
    this.updateTotalAmount();
    this.updateTotalQuantity();
    this.updateCoDAmount();
  }

  onRemoveProduct(product: TDSSafeAny, index: number) {
    (this._form.controls["Details"] as FormArray).removeAt(index);

    this.updateTotalAmount();
    this.updateTotalQuantity();
    this.updateCoDAmount();
  }

  updateTotalAmount() {
    let lstDetail = this._form.controls["Details"].value;

    let total: number = 0;

    lstDetail.forEach((detail: TDSSafeAny) => {
      total += detail.Quantity * detail.Price;
    });

    this._form.controls["TotalAmount"].setValue(total);
  }

  updateTotalQuantity() {
    let lstDetail = this._form.controls["Details"].value;

    let quantity: number = 0;

    lstDetail.forEach((detail: TDSSafeAny) => {
      quantity += detail.Quantity;
    });

    this._form.controls["TotalQuantity"].setValue(quantity);
  }

  updateCoDAmount() {
    if (this.defaultBill && this.isEnableCreateOrder) {
      let coDAmount = this._form.controls["TotalAmount"].value + this._form.controls["DeliveryPrice"].value;
      this._form.controls["CashOnDelivery"].setValue(coDAmount);
    }
  }

  createForm() {
    this._form = this.fb.group({
      isEnableCreateOrder: [false],
      Facebook_UserName: [null],
      Facebook_UserId: [null],
      Partner: [null],
      Company: [null],
      Name: [null],
      Telephone: [null],
      Email: [null],
      Address: [null],
      AddressCheck: [null],
      City: [null],
      District: [null],
      Ward: [null],
      User: [null],
      Note: [null],
      Details: this.fb.array([]),
      TotalAmount: [0],
      TotalQuantity: [0],

      Carrier: [null],
      ShipWeight: [0],
      DeliveryPrice: [0],
      CashOnDelivery: [0],
      DeliveryNote: [null],
      Ship_ServiceExtras: [[]],
      Ship_ServiceExtrasText: [""],
      Ship_ServiceId: [""],
      Ship_ServiceName: [""],
      CustomerDeliveryPrice: [0],
      Ship_InsuranceFee: [0],
      Ship_Extras: [null],
      PartnerId: [null],
      CompanyId: [null],
      AmountTotal: [0],
      Ship_Receiver: [null],
      AmountDeposit: [0]
    });
  }

  getStatusColor(): string {
    let partner = this._form.controls["Partner"].value;

    if(partner) {
      let value = this.lstPartnerStatus.find(x => x.text == partner.StatusText);
      if(value) return value.value;
      else return '#e5e7eb';
    }

    else return '#e5e7eb';
  }

  selectStatus(status: PartnerStatusDTO) {
    let partner = this._form.controls["Partner"].value;

    if(partner) {
      let data = {
        status: `${status.value}_${status.text}`
      }

      this.partnerService.updateStatus(partner.Id, data).subscribe(res => {
        this.message.success(Message.Partner.UpdateStatus);
        partner.StatusText = status.text;
        this._form.controls["Partner"].setValue(partner);
      });
    }
  }

  onCancel(result: TDSSafeAny) {
    this.modalRef.destroy(result);
  }

  onChangeAddress(event: CheckAddressDTO) {
    let formControls = this._form.controls;

    formControls["Street"].setValue(event.Street);

    formControls["City"].setValue( event.City?.Code ? {
      Code: event.City?.Code,
      Name: event.City?.Name
    } : null);

    formControls["District"].setValue( event.District?.Code ? {
      Code: event.District?.Code,
      Name: event.District?.Name,
    } : null);

    formControls["Ward"].setValue( event.Ward?.Code ? {
      Code: event.Ward?.Code,
      Name: event.Ward?.Name,
    } : null);

  }

}
