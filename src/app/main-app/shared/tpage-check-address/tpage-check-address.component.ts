import { TDSHelperString } from 'tmt-tang-ui';
import { Component, Input, OnInit, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CheckAddressDTO, CityDTO, DataSuggestionDTO, DistrictDTO, ResultCheckAddressDTO, WardDTO } from '../../dto/address/address.dto';
import { PartnerCityDTO, PartnerDistrictDTO, PartnerWardDTO } from '../../dto/partner/partner.dto';
import { AddressService } from '../../services/address.service';

@Component({
  selector: 'tpage-check-address',
  templateUrl: './tpage-check-address.component.html',
  styleUrls: ['./tpage-check-address.component.scss']
})
export class TpageCheckAddressComponent implements OnInit, OnChanges {

  @Input() streetText: string = "";
  @Input() city!: CityDTO;
  @Input() district!: DistrictDTO;
  @Input() ward!: WardDTO;

  @Output() onChangeAddress: EventEmitter<CheckAddressDTO> = new EventEmitter<CheckAddressDTO>();

  formAddress!: FormGroup;

  lstCity: CityDTO[] = [];
  lstDistrict: DistrictDTO[] = [];
  lstWard: WardDTO[] = [];

  lstResultCheck: ResultCheckAddressDTO[] = [];

  constructor(private fb: FormBuilder,
    private addressService: AddressService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.createForm();
    this.initForm();

    this.district && this.loadDistrict(this.city?.code);
    this.ward && this.loadWard(this.district?.code);
  }

  ngOnInit(): void {
    // this.createForm();
    this.loadCity();
  }

  createForm() {
    this.formAddress  = this.fb.group({
      street: [null],
      city: [null],
      district: [null],
      ward: [null]
    });
  }

  initForm() {
    debugger;
    if(TDSHelperString.hasValueString(this.streetText)) {
      this.formAddress.controls["street"].setValue(this.streetText);
    }
    if(this.city?.code) {
      this.formAddress.controls["city"].setValue(this.city);
    }
    if(this.district?.code) {
      this.formAddress.controls["district"].setValue(this.district);
    }
    if(this.ward?.code) {
      this.formAddress.controls["ward"].setValue(this.ward);
    }
  }

  loadCity() {
    this.addressService.getCities().subscribe(res => {
      this.lstCity = res;
    });
  }

  loadDistrict(cityCode: number | undefined) {
    if(!cityCode) return;
    this.addressService.getDistricts(cityCode).subscribe(res => {
      this.lstDistrict = res;
    });
  }

  loadWard(districtCode: number | undefined) {
    if(!districtCode) return;
    this.addressService.getWards(districtCode).subscribe(res => {
      this.lstWard = res;
    });
  }

  onSelectCity(event: CityDTO) {
    this.formAddress.controls["district"].setValue(null);
    this.formAddress.controls["ward"].setValue(null);
    this.loadDistrict(event.code);
    this.prepareAddress();
  }

  onSelectDistrict(event: DistrictDTO) {
    this.formAddress.controls["ward"].setValue(null);
    this.loadWard(event.code);
    this.prepareAddress();
  }

  onSelectWard(event: WardDTO) {
    console.log(event);
    this.prepareAddress();
  }

  onSelectStreet() {
    let value = this.formAddress.controls["street"].value;

    this.addressService.checkAddress(value).subscribe(res => {
      res.success && (this.lstResultCheck = res.data);
      res.success && this.setValueSelect(res.data[0]);
    });
  }

  setValueSelect(value: ResultCheckAddressDTO) {
    let formControls = this.formAddress.controls;

    formControls["street"].setValue(value.Address);

    formControls["city"].setValue(value.CityCode ? {
      Code: value.CityCode,
      Name: value.CityName
    } : null);

    formControls["district"].setValue(value.DistrictCode ? {
      Code: value.DistrictCode,
      Name: value.DistrictName
    }: null);

    formControls["ward"].setValue(value.WardCode ? {
      Code: value.WardCode,
      Name: value.WardName
    } : null);

    this.prepareAddress();
  }

  prepareAddress() {
    let value = this.formAddress.value;

    let model: CheckAddressDTO = {
      Street: value["street"],
      City: value["city"],
      District: value["district"],
      Ward: value["ward"],
    };

    this.onChangeAddress.emit(model);
  }

}
