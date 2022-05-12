import { map, takeUntil } from 'rxjs/operators';
import { TDSHelperString, TDSSafeAny, TDSMessageService, TDSHelperArray, TDSHelperObject } from 'tmt-tang-ui';
import { Component, Input, OnInit, EventEmitter, Output, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CheckAddressDTO, CityDTO, DataSuggestionDTO, DistrictDTO, ResultCheckAddressDTO, WardDTO } from '../../dto/address/address.dto';
import { PartnerCityDTO, PartnerDistrictDTO, PartnerWardDTO } from '../../dto/partner/partner.dto';
import { AddressService } from '../../services/address.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'tpage-check-address',
  templateUrl: './tpage-check-address.component.html',
  styleUrls: ['./tpage-check-address.component.scss']
})
export class TpageCheckAddressComponent implements OnInit, OnChanges, OnDestroy {

  @Input() streetText: string = "";
  @Input() city!: CityDTO;
  @Input() district!: DistrictDTO;
  @Input() ward!: WardDTO;

  @Input() isExpand: boolean = false;

  @Output() onChangeAddress: EventEmitter<CheckAddressDTO> = new EventEmitter<CheckAddressDTO>();

  formAddress!: FormGroup;

  lstCity: CityDTO[] = [];
  lstDistrict: DistrictDTO[] = [];
  lstWard: WardDTO[] = [];

  index: number = 0;

  currentExpand: boolean = false;

  lstResultCheck: ResultCheckAddressDTO[] = [];
  private destroy$ = new Subject();

  constructor(private fb: FormBuilder,
    private addressService: AddressService,
    private message: TDSMessageService,) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.createForm();
    this.initForm();

    this.district && this.loadDistrict(this.city?.Code);
    this.ward && this.loadWard(this.district?.Code);
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
    if(TDSHelperString.hasValueString(this.streetText)) {
      this.formAddress.controls["street"].setValue(this.streetText);
    }
    if(this.city?.Code) {
      this.formAddress.controls["city"].setValue(this.city);
    }
    if(this.district?.Code) {
      this.formAddress.controls["district"].setValue(this.district);
    }
    if(this.ward?.Code) {
      this.formAddress.controls["ward"].setValue(this.ward);
    }
  }

  loadCity() {
    this.addressService.getCities().pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
      this.lstCity = res;
    });
  }

  loadDistrict(cityCode: string | undefined) {
    if(!cityCode) return;
    this.addressService.getDistricts(cityCode).pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
      this.lstDistrict = res;
    });
  }

  loadWard(districtCode: string | undefined) {
    if(!districtCode) return;
    this.addressService.getWards(districtCode).pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
      this.lstWard = res;
    });
  }

  onChangeExpand() {
    this.currentExpand = !this.currentExpand;
  }

  setAddress(ward: WardDTO, district: DistrictDTO, city: CityDTO){
    let address =  (ward? `${ward.Name}, `: '') +
    (district != null? `${district.Name}, `: '' )+
    (city? city.Name: '');
    this.formAddress.controls["street"].setValue(address);
  }

  onSelectCity(event: CityDTO) {
    this.formAddress.controls["district"].setValue(null);
    this.formAddress.controls["ward"].setValue(null);
    this.setAddress(this.formAddress.controls["ward"].value,this.formAddress.controls["district"].value, this.formAddress.controls["city"].value);
    if(event){
      this.loadDistrict(event.Code);
    }else{
      this.lstDistrict = [];
    }
    this.lstWard = [];
    this.prepareAddress();
  }

  onSelectDistrict(event: DistrictDTO) {
    this.formAddress.controls["ward"].setValue(null);
    this.setAddress(this.formAddress.controls["ward"].value,this.formAddress.controls["district"].value, this.formAddress.controls["city"].value);
    if(event){
      this.loadWard(event.Code);
    }else{
      this.lstWard = [];
    }
    this.prepareAddress();
  }

  onSelectWard(event: WardDTO) {
    this.setAddress(this.formAddress.controls["ward"].value,this.formAddress.controls["district"].value, this.formAddress.controls["city"].value);
    this.prepareAddress();
  }

  onSelectStreet() {
    let value = this.formAddress.controls["street"].value;
    if(!TDSHelperString.hasValueString(value)) {
      this.message.error('Vui lòng nhập dữ liệu trước khi kiểm tra!');
      return
    }

    this.addressService.checkAddress(value).pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
      if (res.success && TDSHelperArray.isArray(res.data)) {
        this.index = 0;
        res.success && (this.lstResultCheck = res.data);
        res.success && this.setValueSelect(res.data[0], 0);
      }
      else{
        this.message.error('Không tìm thấy kết quả phù hợp!');
      }
    });
  }

  onchangeInputStreet(ev: TDSSafeAny){
    this.prepareAddress();
  }

  setValueSelect(value: ResultCheckAddressDTO, index: number) {
    this.index = index;
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
