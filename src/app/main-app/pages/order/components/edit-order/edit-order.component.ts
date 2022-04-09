import { TDSHelperObject } from 'tmt-tang-ui';
import { FastSaleOrderHandler } from './../../../../services/handlers/fast-sale-order.handler';
import { CommonService } from 'src/app/main-app/services/common.service';
import { DeliveryCarrierDTO } from './../../../../dto/carrier/delivery-carrier.dto';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { TAuthService } from 'src/app/lib';
import { UserInitDTO } from 'src/app/lib/dto';
import { CheckAddressDTO, DataSuggestionDTO } from 'src/app/main-app/dto/address/address.dto';
import { SaleOnlineFacebookCommentFilterResultDTO, SaleOnline_OrderDTO } from 'src/app/main-app/dto/saleonlineorder/sale-online-order.dto';
import { SaleOnline_FacebookCommentService } from 'src/app/main-app/services/sale-online-facebook-comment.service';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { TDSModalRef, TDSModalService, TDSSafeAny, TDSMessageService, TACheckboxChange, TDSHelperString } from 'tmt-tang-ui';
import { ProductService } from 'src/app/main-app/services/product.service';
import { GetInventoryDTO, ValueGetInventoryDTO } from 'src/app/main-app/dto/product/product.dto';
import { ApplicationUserService } from 'src/app/main-app/services/application-user.server';
import { ApplicationUserDTO } from 'src/app/main-app/dto/account/application-user.dto';
import { TpageAddProductComponent } from 'src/app/main-app/shared/tpage-add-product/tpage-add-product.component';
import { PartnerStatusDTO } from 'src/app/main-app/dto/partner/partner.dto';
import { Message } from 'src/app/lib/consts/message.const';
import { FastSaleOrderDTO, FastSaleOrderLineDTO, FastSaleOrder_ServiceExtraDTO } from 'src/app/main-app/dto/fastsaleorder/fastsaleorder.dto';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { SaleOnline_OrderHandler } from 'src/app/main-app/services/handlers/sale-online-order.handler';
import { Observable } from 'rxjs';
import { CarrierHandler } from 'src/app/main-app/services/handlers/carier.handler';

@Component({
  selector: 'edit-order',
  templateUrl: './edit-order.component.html'
})
export class EditOrderComponent implements OnInit {

  @Input() idOrder: string = "";

  formEditOrder!: FormGroup;

  dataSuggestion!: DataSuggestionDTO;
  userInit!: UserInitDTO;
  lstComment: SaleOnlineFacebookCommentFilterResultDTO[] = [];
  isEnableCreateOrder: boolean = false;
  enableInsuranceFee: boolean = false;
  isLoadCarrier: boolean = false;

  model!: SaleOnline_OrderDTO;
  defaultBill!: FastSaleOrderDTO;

  // Giá trị này phải khởi tạo = []
  shipExtraServices: TDSSafeAny[] = [];
  shipServices: TDSSafeAny[] = [];

  saveType = {
    orderSave: 1,
    orderPrint: 2,
    billSave: 3,
    billPrint: 4,
    billPrintShip: 5
  }

  numberWithCommas = (value: number) => `${value} đ`;
  parserComas = (value: string) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  lstDeliveryCarrier!: Array<DeliveryCarrierDTO>;
  lstInventory!: GetInventoryDTO;
  lstUser!: Array<ApplicationUserDTO>;
  lstPartnerStatus!: Array<PartnerStatusDTO>;
  deliveryCarrierService: any;

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
    private saleOnline_OrderHandler: SaleOnline_OrderHandler,
    private fastSaleOrderHandler: FastSaleOrderHandler,
    private carrierHandler: CarrierHandler
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.loadUserInfo();
    this.loadDeliveryCarrier();
    this.loadUser();
    this.loadPartnerStatus();

    this.loadData();
  }

  onSave(type: TDSSafeAny) {
    debugger;
    let model = this.prepareOrderModel();

    this.saleOnline_OrderService.update(this.idOrder, model).subscribe((res: any) => {
      if(type == this.saveType.orderSave) {
        this.message.success(Message.Order.UpdateSuccess);
        this.onCancelSuccess(res);
      }
      else if(type == this.saveType.orderPrint) {
        // TODO: in
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

              this.onCancelSuccess(data);

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
      delete res["@odata.context"];
      this.model = res;

      this.updateSuggestion(res);
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
      this.updateBillByForm(this.formEditOrder);
    });
  }

  onEnableCreateOrder(event: TACheckboxChange) {
    if(event.checked && !this.defaultBill) {
      this.loadDefaultBill();
    }
  }

  onSearchProduct(event: any) {

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

    modal.afterClose.subscribe(result => {
      if(TDSHelperObject.hasValue(result)) {
        let details = this.formEditOrder.controls['Details'];

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
    let formValue = this.formEditOrder.value;

    this.model.Partner = formValue.Partner;
    this.model.Name = formValue.Name;
    this.model.Telephone = formValue.Telephone;
    this.model.Email = formValue.Email;
    this.model.Address = formValue.Address;
    this.model.Note = formValue.Note;

    this.model.CityCode = formValue.City?.Code ? formValue.City.Code : null;
    this.model.CityName = formValue.City?.Name ? formValue.City.Name : null;

    this.model.DistrictCode = formValue.District?.Code ? formValue.District.Code : null;
    this.model.DistrictName = formValue.District?.Name ? formValue.District.Name : null;

    this.model.WardCode = formValue.Ward?.Code ? formValue.Ward.Code : null;
    this.model.WardName = formValue.Ward?.Name ? formValue.Ward.Name : null;

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

    let formValue = this.formEditOrder.value;

    this.defaultBill.SaleOnlineIds = [this.model.Id];

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

    let formControl = this.formEditOrder.controls;
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

    let check = this.fastSaleOrderHandler.checkValue(this.defaultBill);

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
      onCancel:()=>{console.log('cancel')},
      okText:"Đồng ý",
      cancelText:"Hủy"
    });
  }

  onSelectCarrier(event: any) {
    this.shipExtraServices.length = 0;
    this.shipServices.length = 0;
    this.enableInsuranceFee = false;
    this.isLoadCarrier = true;

    debugger;

    this.saleOnline_OrderHandler.changeCarrier(this.defaultBill, this.formEditOrder, event, this.shipExtraServices).subscribe(res => {
      this.enableInsuranceFee = res.EnableInsuranceFee;
      this.shipServices = res.ShipServices;

      if(res.TypeShipExtra == "NinjaVan") {
        this.initNinjaVan();
      }

      console.log(this.shipServices);
      console.log(this.defaultBill);

      this.updateFormByBillDefault(this.defaultBill);

      this.isLoadCarrier = false;

    }, error => {
      console.log(error);
      if(error.error_description) {
        this.message.error(error.error_description);
      }
      else {
        this.message.error(JSON.stringify(error));
      }

      this.updateFormByBillDefault(this.defaultBill);

      this.isLoadCarrier = false;
    });
  }

  onSelectShipServices(event: any) {
    !this.shipExtraServices && (this.shipExtraServices = []);
    this.saleOnline_OrderHandler.selectShipService(event, this.defaultBill, this.shipExtraServices);

    if (this.defaultBill.Carrier.DeliveryType === 'GHN') {
      this.onUpdateInsuranceFee('16').subscribe(res => {});
    }
  }

  onUpdateInsuranceFee(serviceId: any): Observable<any> {
    return this.saleOnline_OrderHandler.onUpdateInsuranceFee(serviceId, this.defaultBill, this.formEditOrder, this.shipExtraServices);
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
    this.saleOnline_OrderHandler.calculateFeeHandler(item, this.defaultBill, this.formEditOrder, this.shipExtraServices).subscribe(res => {
        this.shipServices = res.Services;
    }, (error: TDSSafeAny) => {
      if(error && typeof error == 'string') {
        this.message.error(error);
      }
    });
  }

  updateSuggestion(data: any) {
    let model: DataSuggestionDTO = {
      Street: data.Address,
      CityCode: data.CityCode,
      CityName: data.CityName,
      DistrictCode: data.DistrictCode,
      DistrictName: data.DistrictName,
      WardCode: data.WardCode,
      WardName: data.WardName,
    }

    this.dataSuggestion = model;
  }

  updateForm(data: any) {
    let formControls = this.formEditOrder.controls;

    formControls["Facebook_UserName"].setValue(data.Facebook_UserName);
    formControls["Facebook_UserId"].setValue(data.Facebook_UserId);
    formControls["Name"].setValue(data.Name);
    formControls["Partner"].setValue(data.Partner);
    formControls["Telephone"].setValue(data.Telephone);
    formControls["Email"].setValue(data.Email);
    formControls["Address"].setValue(data.Address);
    formControls["AmountDeposit"].setValue(data.AmountDeposit || 0);

    formControls["Company"].setValue(this.userInit?.Company);
    formControls["CompanyId"].setValue(this.userInit?.Company?.Id);

    formControls["City"].setValue({
      Code: data.CityCode,
      Name: data.CityName,
    });

    formControls["District"].setValue({
      Code: data.DistrictCode,
      Name: data.DistrictName,
    });

    formControls["Ward"].setValue({
      Code: data.WardCode,
      Name: data.WardName,
    });

    formControls["User"].setValue(data.User);
    formControls["Note"].setValue(data.Note);
    formControls["TotalAmount"].setValue(data.TotalAmount);

    formControls["CashOnDelivery"].setValue(
      formControls["DeliveryPrice"].value +
      formControls["TotalAmount"].value
    );

    // if (formControls["Address"].value) {
    //   formControls["Ship_Receiver"].setValue({
    //     Name: formControls["Name"].value,
    //     Street: formControls["Address"].value,
    //     Phone: formControls["Telephone"].value,
    //     City: formControls["City"].value,
    //     District: formControls["District"].value,
    //     Ward: formControls["Ward"].value,
    //   });
    // }
    // else {
    //   formControls["Ship_Receiver"].setValue(null)
    // }

    this.formEditOrder.setControl("Details", this.fb.array(data.Details || []));
  }

  updateFormByBillDefault(billDefault: FastSaleOrderDTO) {
    billDefault.Ship_ServiceExtras = JSON.parse(billDefault.Ship_ServiceExtrasText) || [];

    let formControl = this.formEditOrder.controls;

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
          (element.Id === "OrderAmountEvaluation" && this.defaultBill.Carrier.DeliveryType === "MyVNPost") ) {
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

    debugger;

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
    let formControls = this.formEditOrder.controls;

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
    let formControls = this.formEditOrder.controls;

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

      console.log(this.lstComment);
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
    (this.formEditOrder.controls["Details"] as FormArray).removeAt(index);

    this.updateTotalAmount();
    this.updateTotalQuantity();
    this.updateCoDAmount();
  }

  updateTotalAmount() {
    let lstDetail = this.formEditOrder.controls["Details"].value;

    let total: number = 0;

    lstDetail.forEach((detail: TDSSafeAny) => {
      total += detail.Quantity * detail.Price;
    });

    this.formEditOrder.controls["TotalAmount"].setValue(total);
  }

  updateTotalQuantity() {
    let lstDetail = this.formEditOrder.controls["Details"].value;

    let quantity: number = 0;

    lstDetail.forEach((detail: TDSSafeAny) => {
      quantity += detail.Quantity;
    });

    this.formEditOrder.controls["TotalQuantity"].setValue(quantity);
  }

  updateCoDAmount() {
    if (this.defaultBill && this.isEnableCreateOrder) {
      let coDAmount = this.formEditOrder.controls["TotalAmount"].value + this.formEditOrder.controls["DeliveryPrice"].value;
      this.formEditOrder.controls["CashOnDelivery"].setValue(coDAmount);
    }
  }

  onChangeAddress(event: CheckAddressDTO) {
    let formControls = this.formEditOrder.controls;

    debugger;

    formControls["Address"].setValue(event.Street);

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

    console.log(this.formEditOrder.value);
  }

  createForm() {
    this.formEditOrder = this.fb.group({
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

  onCancel() {
    this.modalRef.destroy(null);
  }

  onCancelSuccess(data: TDSSafeAny) {
    this.modalRef.destroy(data);
  }

}
