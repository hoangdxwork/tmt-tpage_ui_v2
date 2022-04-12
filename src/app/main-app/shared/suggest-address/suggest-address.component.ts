import { TDSHelperArray, TDSHelperString, TDSMessageService } from 'tmt-tang-ui';
import { Component, Input, OnInit, EventEmitter, Output, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { SuggestCitiesDTO, SuggestDistrictsDTO, SuggestWardsDTO } from '../../dto/suggest-address/suggest-address.dto';
import { SuggestAddressService } from '../../services/suggest-address.service';

@Component({
  selector: 'suggest-address',
  templateUrl: './suggest-address.component.html',
})

export class SuggestAddressComponent implements  OnChanges {

  _form!: FormGroup;

  @Input() _street!: string;
  @Input() _cities!: SuggestCitiesDTO;
  @Input() _districts!: SuggestDistrictsDTO;
  @Input() _wards!: SuggestWardsDTO;

  lstCities!: Array<SuggestCitiesDTO>;
  lstDistricts!: Array<SuggestDistrictsDTO>;
  lstWards!: Array<SuggestWardsDTO>;
  innerText: string = '';

  isExpanded: boolean = false;
  tempAddresses: any = [];

  private citySubject = new BehaviorSubject<SuggestCitiesDTO[]>([]);
  private districtSubject = new BehaviorSubject<SuggestDistrictsDTO[]>([]);
  private wardSubject = new BehaviorSubject<SuggestWardsDTO[]>([]);

  @Output() onLoadSuggestion: EventEmitter<any> = new EventEmitter<any>();

  constructor(private fb: FormBuilder,
      private message: TDSMessageService,
      private suggestService: SuggestAddressService) {
        this.createForm();
        this.loadCity();
  }

  createForm() {
    this._form = this.fb.group({
        Street: [null],
        City: [null],
        District: [null],
        Ward: [null],
    });
  }

  ngOnChanges(changes: SimpleChanges) {

    if (this._cities && this._cities.code) {
      this._form.controls['City'].patchValue(this._cities || null);

      const code = this._cities.code;
      this.loadDistricts(code);
    }

    if (this._districts && this._districts.code) {
      this._form.controls['District'].patchValue(this._districts || null);

      const code = this._districts.code;
      this.loadWards(code);
    }

    if(this._wards && this._wards.code) {
      this._form.controls['Ward'].patchValue(this._wards || null);
    }

    if(this._street) {
        this._form.controls['Street'].setValue(this._street || null);
    }
  }

  loadCity(): void {
    this.suggestService.getCities().subscribe((res: any) => {
        this.lstCities = res;
        this.citySubject.next(res);
    });
  }

  loadDistricts(code: string) {
    this.suggestService.getDistricts(code).subscribe((res: any) => {
        this.lstDistricts = res;
        this.districtSubject.next(res);
      });
  }

  loadWards(code: string) {
    this.suggestService.getWards(code).subscribe((res: any) => {
        this.lstWards = res;
        this.wardSubject.next(res);
      });
  }

  handleCityFilter(value: string) {
      var result = this.lstCities.filter((x: SuggestCitiesDTO) => (x.name && TDSHelperString.stripSpecialChars(x.name.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(value.toLowerCase())) !== -1));
      this.citySubject.next(result);
  }

  handleFilterDistrict(value: string) {
      var result = this.lstDistricts.filter((x: SuggestDistrictsDTO) => (x.name && TDSHelperString.stripSpecialChars(x.name.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(value.toLowerCase())) !== -1));
      this.districtSubject.next(result);
  }

  handleFilterWard(value: string) {
      var result = this.lstWards.filter((x: SuggestWardsDTO) => (x.name && TDSHelperString.stripSpecialChars(x.name.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(value.toLowerCase())) !== -1));
      this.wardSubject.next(result);
  }

  changeCity(event: any) {
    if (this._form.value.City) {
      const code = this._form.value.City.code;
      this.loadDistricts(code);

      this._form.controls['District'].setValue(null);
      this._form.controls['Ward'].setValue(null);
      this.innerText = '';
    }
  }

  changeDistrict(event: any) {
    if (this._form.value.District) {
      const code = this._form.value.District.code;
      this.loadWards(code);

      this._form.controls['Ward'].setValue(null);
      this.innerText = '';
    }
  }

  expanded() {
     this.isExpanded = !this.isExpanded;
  }

  checkAddress(event: string) {
    if(!TDSHelperString.hasValueString(event)) {
        this.message.error('Vui lòng nhập dữ liệu trước khi kiểm tra!');
    }

    event = encodeURIComponent(event);
    this.suggestService.checkAddress(event).subscribe((res: any) => {
      if (res.success && TDSHelperArray.isArray(res.data)) {
          this.tempAddresses = res.data;
          this.selectAddress(res.data[0], 0);
      }
      else {
        this.message.error('Không tìm thấy kết quả phù hợp!');
      }
    })
  }

  selectAddress(item: any, index: number) {

  }

  changeWard(event: any) {

  }


}
