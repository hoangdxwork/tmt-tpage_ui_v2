import { TDSMessageService } from 'tds-ui/message';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FastSaleOrder_DefaultDTOV2 } from './../../../../dto/fastsaleorder/fastsaleorder-default.dto';
import { Component, Input, OnInit } from '@angular/core';
import { TDSModalRef } from 'tds-ui/modal';
import { AddressService } from 'src/app/main-app/services/address.service';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-modal-confirm-shipping-address',
  templateUrl: './modal-confirm-shipping-address.component.html'
})
export class ModalConfirmShippingAddressComponent implements OnInit {
  @Input() data!: FastSaleOrder_DefaultDTOV2;
  detailShipReceiver : any = {};
  listCities: any;
  listDistricts: any;
  listWards: any;
  cityName: any;
  districtName: any;
  wardName: any;

  _form!: FormGroup;
  constructor(
    private modal: TDSModalRef,
    private fb: FormBuilder,
    private fastSaleOrderService: FastSaleOrderService,
    private message: TDSMessageService,
    private addressService: AddressService,
  ) {
    this.createForm();
   }

  private createForm() {
    this._form = this.fb.group({
      Name: [null, [Validators.required]],
      Phone: [null, Validators.required],
      Street: [null, Validators.required],
      City: [null, Validators.required],
      District: [null, Validators.required],
      Ward: [null, Validators.required],
      Note: [null],
    });
  }

  ngOnInit(): void {
    this.detailShipReceiver = this.data.Ship_Receiver;
    this.getData();
  }

  getData() {
    let cityId = this.detailShipReceiver.City.code;
    let districtId = this.detailShipReceiver.District.code;

    this.getCities();
    this.getDistrict(cityId);
    this.getWard(districtId);

    this.updateForm();
  }

  getCities() {
    this.addressService.getCities().subscribe((res: any) => {
      this.listCities = res;
    })
  }

  getDistrict(id: any) {
    this.addressService.getDistricts(id).subscribe((res: any) => {
      this.listDistricts = res;
    })
  }

  getWard(id: any) {
    this.addressService.getWards(id).subscribe((res: any) => {
      this.listWards = res;
    })
  }

  updateForm() {
    this._form.controls.Name.setValue(this.detailShipReceiver.Name);
    this._form.controls.Phone.setValue(this.detailShipReceiver.Phone);
    this._form.controls.Street.setValue(this.detailShipReceiver.Street);
    this._form.controls.City.setValue(this.detailShipReceiver.City.code);
    this._form.controls.District.setValue(this.detailShipReceiver.District.code);
    this._form.controls.Ward.setValue(this.detailShipReceiver.Ward.code);
    this._form.controls.Note.setValue(this.data.DeliveryNote);
  }

  cancel(){
    this.modal.destroy(null)
  }

  onSave() {
    var model = this.prepareModel();
    delete model.PaymentMethod;

    this.fastSaleOrderService.update(this.data.Id, model).subscribe((res: any) => {
      this.message.success("Cập nhật địa chỉ giao hàng thành công.");
      this.modal.destroy(model);
    });
  }

  prepareModel(): any {
    const formModel = this._form.value;
    var model = this.data;

    model.Partner.Phone = String(model.Partner.Phone).replace("+","");

    model.Ship_Receiver.Name = formModel.Name ? formModel.Name : '';
    model.Ship_Receiver.Phone = formModel.Phone ? formModel.Phone : formModel.Phone;
    model.Ship_Receiver.Street = formModel.Street ? formModel.Street: '';
    model.Ship_Receiver.City.code = formModel.City ? formModel.City: '';
    model.Ship_Receiver.City.name = this.listCities.filter((x: TDSSafeAny) => x.Code === formModel.City)[0].Name;
    model.Ship_Receiver.District.code = formModel.District ? formModel.District : '';
    model.Ship_Receiver.District.name = this.listDistricts.filter((x: TDSSafeAny) => x.Code === formModel.District)[0].Name;
    model.Ship_Receiver.Ward.code = formModel.Ward ? formModel.Ward : '';
    model.Ship_Receiver.Ward.name = this.listWards.filter((x: TDSSafeAny) => x.Code === formModel.Ward)[0].Name;
    model.DeliveryNote = formModel.Note;

    return model;
  }
}
