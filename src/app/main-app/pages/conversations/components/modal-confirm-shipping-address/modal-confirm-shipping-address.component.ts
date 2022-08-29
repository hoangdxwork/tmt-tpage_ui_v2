import { SuggestAddressService } from './../../../../services/suggest-address.service';
import { takeUntil, Subject } from 'rxjs';
import { TDSMessageService } from 'tds-ui/message';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FastSaleOrder_DefaultDTOV2 } from './../../../../dto/fastsaleorder/fastsaleorder-default.dto';
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-modal-confirm-shipping-address',
  templateUrl: './modal-confirm-shipping-address.component.html'
})
export class ModalConfirmShippingAddressComponent implements OnInit {
  @Input() data!: FastSaleOrder_DefaultDTOV2;
  detailShipReceiver : any = {};
  lstCities: any;
  lstDistricts: any;
  lstWards: any;
  cityName: any;
  districtName: any;
  wardName: any;

  _form!: FormGroup;
  private destroy$ = new Subject<void>();
  constructor(
    private modal: TDSModalRef,
    private fb: FormBuilder,
    private fastSaleOrderService: FastSaleOrderService,
    private message: TDSMessageService,
    private suggestAddressService: SuggestAddressService,
    private cdref: ChangeDetectorRef
  ) {
    this.createForm();
   }

  createForm() {
    this._form = this.fb.group({
      Name: new FormControl('',[Validators.required]),
      Phone:  new FormControl('',[Validators.required]),
      Street:  new FormControl('',[Validators.required]),
      City:  new FormControl(null),
      District: new FormControl(null),
      Ward: new FormControl(null),
      Note: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.detailShipReceiver = this.data.Ship_Receiver;
    this.getData();
    this.updateForm();
  }

  getData() {
    let cityId = this.detailShipReceiver.City.code;
    let districtId = this.detailShipReceiver.District.code;

    this.getCities();
    this.getDistrict(cityId);
    this.getWard(districtId);

  }

  getCities() {
    this.suggestAddressService.getCity().subscribe((res: any) => {
      this.lstCities = [...res];
    })
  }

  getDistrict(id: any) {
    this.suggestAddressService.setDistrict(id);
    this.suggestAddressService.getDistrict().subscribe((res: any) => {
      this.lstDistricts = [...res];
    })
  }

  getWard(id: any) {
    this.suggestAddressService.setWard(id);
    this.suggestAddressService.getWard().subscribe((res: any) => {
      this.lstWards = [...res];
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

    this.cdref.detectChanges();
  }

  changeCity(value: number) {
    if (value) {
      this.getDistrict(value);

      this._form.controls['City'].setValue(value);
      this._form.controls['District'].setValue(null);
      this._form.controls['Ward'].setValue(null);
    } else {
      this.lstDistricts = [];
      this.lstWards = []
      this._form.controls['City'].setValue(null);
      this._form.controls['District'].setValue(null);
      this._form.controls['Ward'].setValue(null);
    }
  }

  changeDistrict(value: number) {
    if (value) {
      this.getWard(value);
      this._form.controls['District'].setValue(value);
      this._form.controls['Ward'].setValue(null);
    }else{
      this.lstWards = []
      this._form.controls['District'].setValue(null);
      this._form.controls['Ward'].setValue(null);
    }
  }

  changeWard(value: number) {
    if(value) {
      this._form.controls['Ward'].setValue(value);
    }
  }

  cancel(){
    this.modal.destroy(null)
  }

  onSave() {
    if(this._form.controls.Name.invalid){
      this.message.warning('Vui lòng nhập tên người nhận');
      return
    }
    if(this._form.controls.Phone.invalid){
      this.message.warning('Vui lòng nhập số điện thoại');
      return
    }
    if(this._form.controls.Street.invalid){
      this.message.warning('Vui lòng nhập số nhà, đường');
      return
    }

    var model = this.prepareModel();
    delete model.PaymentMethod;

    this.fastSaleOrderService.update(this.data.Id, model).pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
      this.message.success("Cập nhật địa chỉ giao hàng thành công.");
      this.modal.destroy(model);
    },err=>{
      this.message.error(err?.error ? err.error.message : 'Cập nhật địa chỉ giao hàng thất bại')
    });
  }

  prepareModel(): any {
    const formModel = this._form.value;
    var model = this.data;

    model.Partner!.Phone = String(model.Partner?.Phone).replace("+","");

    model.Ship_Receiver.Name = formModel.Name ? formModel.Name : '';
    model.Ship_Receiver.Phone = formModel.Phone ? formModel.Phone : formModel.Phone;
    model.Ship_Receiver.Street = formModel.Street ? formModel.Street: '';
    model.Ship_Receiver.City.code = formModel.City ? formModel.City: '';
    model.Ship_Receiver.City.name = this.lstCities.filter((x: TDSSafeAny) => x.Code === formModel.City)[0].Name;
    model.Ship_Receiver.District.code = formModel.District ? formModel.District : '';
    model.Ship_Receiver.District.name = this.lstDistricts.filter((x: TDSSafeAny) => x.Code === formModel.District)[0].Name;
    model.Ship_Receiver.Ward.code = formModel.Ward ? formModel.Ward : '';
    model.Ship_Receiver.Ward.name = this.lstWards.filter((x: TDSSafeAny) => x.Code === formModel.Ward)[0].Name;
    model.DeliveryNote = formModel.Note;

    return model;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
