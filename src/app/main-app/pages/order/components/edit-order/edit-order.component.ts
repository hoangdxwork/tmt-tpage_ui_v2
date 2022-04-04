import { DeliveryCarrierDTO } from './../../../../dto/carrier/delivery-carrier.dto';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TAuthService } from 'src/app/lib';
import { UserInitDTO } from 'src/app/lib/dto';
import { CheckAddressDTO, DataSuggestionDTO } from 'src/app/main-app/dto/address/address.dto';
import { SaleOnlineFacebookCommentFilterResultDTO } from 'src/app/main-app/dto/saleonlineorder/sale-online-order.dto';
import { DeliveryCarrierService } from 'src/app/main-app/services/delivery-carrier-order.service';
import { SaleOnline_FacebookCommentService } from 'src/app/main-app/services/sale-online-facebook-comment.service';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { TDSModalRef, TDSModalService, TDSSafeAny } from 'tmt-tang-ui';
import { ProductService } from 'src/app/main-app/services/product.server';
import { GetInventoryDTO, ValueGetInventoryDTO } from 'src/app/main-app/dto/product/product.dto';
import { ApplicationUserService } from 'src/app/main-app/services/application-user.server';
import { ApplicationUserDTO } from 'src/app/main-app/dto/account/application-user.dto';
import { TpageAddProductComponent } from 'src/app/main-app/shared/tpage-add-product/tpage-add-product.component';

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

  numberWithCommas = (value: number) => `${value} đ`;
  parserComas = (value: string) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  lstDeliveryCarrier!: Array<DeliveryCarrierDTO>;
  lstInventory!: GetInventoryDTO;
  lstUser!: Array<ApplicationUserDTO>;

  constructor(
    private modal: TDSModalService,
    private modalRef: TDSModalRef,
    private fb: FormBuilder,
    private auth: TAuthService,
    private viewContainerRef: ViewContainerRef,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private saleOnline_FacebookCommentService: SaleOnline_FacebookCommentService,
    private deliveryCarrierService: DeliveryCarrierService,
    private productService: ProductService,
    private applicationUserService: ApplicationUserService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.loadUserInfo();
    this.loadDeliveryCarrier();
    this.loadUser();

    this.loadData();
  }

  onSave() {

  }

  loadData() {
    this.saleOnline_OrderService.getById(this.idOrder).subscribe(res => {
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
    this.deliveryCarrierService.get().subscribe(res => {
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

  log(str: string) {
    console.log(str);
  }

  onSearchProduct(event: any) {

  }

  onAddProduct() {
    this.modal.create({
      title: 'Thêm sản phẩm',
      content: TpageAddProductComponent,
      size: 'xl',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
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
      code: data.CityCode,
      name: data.CityName,
    });

    formControls["District"].setValue({
      code: data.DistrictCode,
      name: data.DistrictName,
    });

    formControls["Ward"].setValue({
      code: data.WardCode,
      name: data.WardName,
    });

    formControls["User"].setValue([data.User]);
    formControls["Note"].setValue(data.Note);
    formControls["TotalAmount"].setValue(data.TotalAmount);

    formControls["CashOnDelivery"].setValue(
      formControls["DeliveryPrice"].value +
      formControls["TotalAmount"].value
    );

    this.formEditOrder.setControl("Details", this.fb.array(data.Details || []));
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

  onChangeAddress(event: CheckAddressDTO) {
    let formControls = this.formEditOrder.controls;

    formControls["Address"].setValue(event.street);

    formControls["City"].setValue( event.city ? {
      code: event.city?.code,
      name: event.city?.name
    } : null);

    formControls["District"].setValue( event.district ? {
      code: event.district?.code,
      name: event.district?.name,
    } : null);

    formControls["Ward"].setValue( event.ward ? {
      code: event.ward?.code,
      name: event.ward?.name,
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

}
