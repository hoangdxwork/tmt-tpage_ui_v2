import { DeliveryCarrierDTO } from './../../../../dto/carrier/delivery-carrier.dto';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TAuthService } from 'src/app/lib';
import { UserInitDTO } from 'src/app/lib/dto';
import { DataSuggestionDTO } from 'src/app/main-app/dto/address/address.dto';
import { SaleOnlineFacebookCommentFilterResultDTO } from 'src/app/main-app/dto/saleonlineorder/sale-online-order.dto';
import { DeliveryCarrierService } from 'src/app/main-app/services/delivery-carrier-order.service';
import { SaleOnline_FacebookCommentService } from 'src/app/main-app/services/sale-online-facebook-comment.service';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { TDSModalRef } from 'tmt-tang-ui';
import { ProductService } from 'src/app/main-app/services/product.server';
import { GetInventoryDTO, ValueGetInventoryDTO } from 'src/app/main-app/dto/product/product.dto';

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

  constructor(
    private modal: TDSModalRef,
    private fb: FormBuilder,
    private auth: TAuthService,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private saleOnline_FacebookCommentService: SaleOnline_FacebookCommentService,
    private deliveryCarrierService: DeliveryCarrierService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.loadUserInfo();
    this.loadDeliveryCarrier();

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

  log(str: string) {
    console.log(str);
  }

  onSearchProduct(event: any) {

  }

  onAddProduct() {

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
    formControls["AmountDeposit"].setValue(data.AmountDeposit);

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

    formControls["User"].setValue(data.User);
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
    this.modal.destroy(null);
  }

}
