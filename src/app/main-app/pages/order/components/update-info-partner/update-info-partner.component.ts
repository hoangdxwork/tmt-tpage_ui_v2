import { TDSDestroyService } from 'tds-ui/core/services';
import { Partner } from './../../../../dto/order/order-bill-default.dto';
import { TDSMessageService } from 'tds-ui/message';
import { takeUntil, Subject } from 'rxjs';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { ResultCheckAddressDTO } from 'src/app/main-app/dto/address/address.dto';
import { SuggestCitiesDTO, SuggestDistrictsDTO, SuggestWardsDTO } from 'src/app/main-app/dto/suggest-address/suggest-address.dto';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { ModalAddAddressV2Component } from '@app/pages/conversations/components/modal-add-address-v2/modal-add-address-v2.component';

@Component({
  selector: 'app-update-info-partner',
  templateUrl: './update-info-partner.component.html',
  providers: [TDSDestroyService]
})
export class UpdateInfoPartnerComponent implements OnInit {

  @Input() partner!: Partner;
  @Input() phoneRegex!:string;

  _form!: FormGroup;

  _cities!: SuggestCitiesDTO;
  _districts!: SuggestDistrictsDTO;
  _wards!: SuggestWardsDTO;
  _street!: string;
  chatomniEventEmiter: any;

  constructor(private fb: FormBuilder,
    private modalRef: TDSModalRef,
    private modal: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private partnerService : PartnerService,
    private message: TDSMessageService,
    private destroy$: TDSDestroyService) {
      this.createForm();
  }

  ngOnInit(): void {
    this.updateForm();
  }

  createForm() {
    this._form = this.fb.group({
      Name: [null, Validators.required],
      Phone: [null, Validators.required],
      Street: [null, Validators.required],
      City: [null],
      District: [null],
      Ward: [null],
    });
  }

  updateForm() {
    if(this.partner) {
      this._form.controls["Name"].setValue(this.partner.Name);
      this._form.controls["Phone"].setValue(this.partner.Phone);
      this._form.controls['Street'].setValue(this.partner.Street);
      
      if(this.phoneRegex){
        this._form.controls["Phone"].addValidators(Validators.pattern(this.phoneRegex));
      }
      this.mappingAddress(this.partner);
    }
  }

  mappingAddress(data: any) {
    if (data && data.City?.code) {
      this._cities = {
        code: data.City.code,
        name: data.City.name
      }
    }
    
    if (data && data.District?.code) {
      this._districts = {
        cityCode: data.City?.code,
        cityName: data.City?.name,
        code: data.District.code,
        name: data.District.name
      }
    }

    if (data && data.Ward?.code) {
      this._wards = {
        cityCode: data.City?.code,
        cityName: data.City?.name,
        districtCode: data.District?.code,
        districtName: data.District?.name,
        code: data.Ward.code,
        name: data.Ward.name
      }
    }

    if (data && data?.Street || data?.Address) {
      this._street = data?.Street || data?.Address;
    }
  }

  onLoadSuggestion(item: ResultCheckAddressDTO) {
    this._form.controls['Street'].setValue( item.Address ? item.Address : null);

    if(item && item.CityCode) {
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

  checkValid(){
    if(!this._form.controls['Name'].valid){
      this.message.error('Vui lòng nhập tên');
      return 0;
    }

    if(!this._form.controls['Phone'].valid){
      this.message.error('Vui lòng nhập số điện thoại');
      return 0;
    }

    if(!this._form.controls['Street'].valid){
      this.message.error('Vui lòng nhập địa chỉ');
      return 0;
    }

    return 1;
  }

  save() {
    if (this.checkValid() == 1) {
      let result = {
        model: this.prepareModel()
      }
      
      this.partnerService.updatePartnerSimple(result).pipe(takeUntil(this.destroy$))
        .subscribe({
          next:(res) => {
            this.modalRef.destroy(res);
          },
          error:(err) => {
            this.message.error(err.error? err.error.message: 'Sửa thất bại');
          }
        })
    }
  }

  prepareModel() {
    let formValue = this._form.value;

    this.partner.Name = formValue["Name"];
    this.partner.Phone = formValue["Phone"];
    this.partner.Street = formValue["Street"] ? formValue["Street"]: this.partner.Street;

    this.partner.City = formValue["City"]?.code? {
      code: formValue["City"].code,
      name: formValue["City"].name
    }: this.partner.City;
    this.partner.CityCode = formValue["City"]?.code;
    this.partner.CityName = formValue["City"]?.name;

    this.partner.District = formValue["District"]?.code? {
      code: formValue["District"].code,
      name: formValue["District"].name
    }: this.partner.District;
    this.partner.DistrictCode = formValue["District"]?.code;
    this.partner.DistrictName = formValue["District"]?.name;

    this.partner.Ward = formValue["Ward"]?.code? {
      code: formValue["Ward"].code,
      name: formValue["Ward"].name
    }: this.partner.Ward;
    this.partner.WardCode = formValue["Ward"]?.code;
    this.partner.WardName = formValue["Ward"]?.name;
    
    return this.partner;
  }

  onCancel() {
    this.modalRef.destroy(null);
  }

  showModalSuggestAddress(){
    let modal = this.modal.create({
      title: 'Sửa địa chỉ',
      content: ModalAddAddressV2Component,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        _street: this._form.controls['Street']?.value || '',
        _cities: this._cities,
        _districts: this._districts,
        _wards: this._wards,
        isSelectAddress: true
      }
    });

    modal.afterClose.subscribe({
      next: (result: ResultCheckAddressDTO) => {
        if(result){
          this.onLoadSuggestion(result);
          this.mappingAddress(this._form.value);
        }
      }
    })
  }
}
