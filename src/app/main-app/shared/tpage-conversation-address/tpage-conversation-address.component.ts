import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { TDSHelperArray, TDSHelperString, TDSMessageService, TDSSafeAny } from 'tmt-tang-ui';
import { CheckAddressDTO, CityDTO, DistrictDTO, ResultCheckAddressDTO, WardDTO } from '../../dto/address/address.dto';
import { AddressService } from '../../services/address.service';

@Component({
  selector: 'tpage-conversation-address',
  templateUrl: './tpage-conversation-address.component.html',
  styleUrls: ['./tpage-conversation-address.component.scss']
})
export class TpageConversationAddressComponent implements OnInit {

  @Input() streetText: string = "";

  @Input() cityCode!: string;
  @Input() districtCode!: string;
  @Input() wardCode!: string;

  @Output() onChangeAddress: EventEmitter<CheckAddressDTO> = new EventEmitter<CheckAddressDTO>();

  formAddress!: FormGroup;

  lstCity: CityDTO[] = [];
  lstDistrict: DistrictDTO[] = [];
  lstWard: WardDTO[] = [];

  index: number = 0;

  currentExpand: boolean = false;
  isSuggest: boolean = false;

  lstResultCheck: ResultCheckAddressDTO[] = [];
  private destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private message: TDSMessageService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.createForm();
    this.initForm();

    this.loadCity();
    this.loadDistrict(this.cityCode);
    this.loadWard(this.districtCode);
  }

  ngOnInit(): void {
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
    if(this.cityCode) {
      this.formAddress.controls["city"].setValue({Code: this.cityCode});
    }
    if(this.districtCode) {
      this.formAddress.controls["district"].setValue({Code: this.districtCode});
    }
    if(this.wardCode) {
      this.formAddress.controls["ward"].setValue({Code: this.wardCode});
    }
  }

  loadCity() {
    if(TDSHelperArray.hasListValue(this.lstCity)) {
      this.setFormCity();
    }
    else {
      this.addressService.getCities().pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
        this.lstCity = res;
        this.setFormCity();
      });
    }
  }

  loadDistrict(cityCode: string | undefined) {
    if(!cityCode) return;
    this.addressService.getDistricts(cityCode).pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
      this.lstDistrict = res;
      this.setFormDistrict();
    });
  }

  loadWard(districtCode: string | undefined){
    if(!districtCode) return;
    this.addressService.getWards(districtCode).pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
      this.lstWard = res;
      this.setFormWard();
    });
  }

  setFormCity() {
    let findCity = this.lstCity.find(x => x.Code == this.cityCode);
    this.formAddress.controls.city.setValue(findCity);
  }

  setFormDistrict() {
    let findDistrict = this.lstDistrict.find(x => x.Code == this.districtCode);
    this.formAddress.controls.district.setValue(findDistrict);
  }

  setFormWard() {
    let findWard = this.lstWard.find(x => x.Code == this.wardCode);
    this.formAddress.controls.ward.setValue(findWard);
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
        this.isSuggest = true;
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
