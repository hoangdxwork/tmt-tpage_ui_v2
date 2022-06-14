import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { CheckAddressDTO, ResultCheckAddressDTO } from 'src/app/main-app/dto/address/address.dto';
import { SuggestCitiesDTO, SuggestDistrictsDTO, SuggestWardsDTO } from 'src/app/main-app/dto/suggest-address/suggest-address.dto';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-update-info-partner',
  templateUrl: './update-info-partner.component.html',
})
export class UpdateInfoPartnerComponent implements OnInit {

  _form!: FormGroup;

  @Input() partner: TDSSafeAny;
  _cities!: SuggestCitiesDTO;
  _districts!: SuggestDistrictsDTO;
  _wards!: SuggestWardsDTO;
  _street!: string;

  constructor(private fb: FormBuilder,
    private modalRef: TDSModalRef) {
      this.createForm();
  }

  ngOnInit(): void {
    this.updateForm();
  }

  createForm() {
    this._form = this.fb.group({
      Name: [null, [Validators.required]],
      Phone: [null],
      Street: [null],
      City: [null],
      District: [null],
      Ward: [null],
    });
  }

  updateForm() {
    if(this.partner) {
      this._form.controls["Name"].setValue(this.partner.Name);
      this._form.controls["Phone"].setValue(this.partner.Phone);
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

  save() {
    if (this._form.valid) {
      let result = this.prepareModel();
      this.modalRef.destroy(result);
    }
  }

  prepareModel() {
    let formValue = this._form.value;

    let model: TDSSafeAny = {
      Name: formValue["Name"],
      Phone: formValue["Phone"],
      Street: formValue["Street"],
      City: formValue["City"]?.Code ? {code: formValue["City"].Code, name: formValue["City"].Name } : null,
      District: formValue["District"]?.Code ? {code: formValue["District"].Code, name: formValue["District"].Name } : null,
      Ward: formValue["Ward"]?.Code ? {code: formValue["Ward"].Code, name: formValue["Ward"].Name } : null,
    };

    return model;
  }

  onCancel() {
    this.modalRef.destroy(null);
  }


}
