
import { Component, Input, EventEmitter, Output, SimpleChanges, OnChanges, AfterViewInit, HostListener, OnDestroy, HostBinding, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { SuggestCitiesDTO, SuggestDistrictsDTO, SuggestWardsDTO } from '../../dto/suggest-address/suggest-address.dto';
import { SuggestAddressService } from '../../services/suggest-address.service';
import { ResultCheckAddressDTO } from '../../dto/address/address.dto';
import { map, takeUntil } from 'rxjs/operators';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSConfigService } from 'tds-ui/core/config';

const ESCAPE_KEYUP = 'ArrowUp';
const ESCAPE_KEYDOWN = 'ArrowDown';
const ESCAPE_ENTER = 'Enter';

@Component({
  selector: 'suggest-address-v2',
  templateUrl: './suggest-address-v2.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SuggestAddressV2Component implements OnInit, OnChanges, OnDestroy {

  _form!: FormGroup;

  @Input() _street!: string;
  @Input() _cities!: SuggestCitiesDTO | null;
  @Input() _districts!: SuggestDistrictsDTO | null;
  @Input() _wards!: SuggestWardsDTO | null;
  @Input() isSelectAddress!: boolean; // chọn mở modal từ tab partner và order

  lstCity!: Array<SuggestCitiesDTO>;
  lstDistrict!: Array<SuggestDistrictsDTO>;
  lstWard!: Array<SuggestWardsDTO>;
  innerText: string = '';
  isAlert : boolean = false;
  isLoading : boolean = false;

  tempAddresses: Array<ResultCheckAddressDTO> = [];
  index: number = 0;

  private citySubject = new BehaviorSubject<SuggestCitiesDTO[]>([]);
  private districtSubject = new BehaviorSubject<SuggestDistrictsDTO[]>([]);
  private wardSubject = new BehaviorSubject<SuggestWardsDTO[]>([]);

  arrowkeyLocation = -1;
  public suggestCount: number = 0;
  public suggestions$!: Observable<any[]>;

  @Output() onLoadSuggestion: EventEmitter<ResultCheckAddressDTO> = new EventEmitter<ResultCheckAddressDTO>();
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder,
      private cdRef: ChangeDetectorRef,
      private message: TDSMessageService,
      private readonly tdsConfigService: TDSConfigService,
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

  ngOnInit(): void {
    if(this._cities && this._cities.code) {
        const code = this._cities.code;
        this._form.controls['City'].patchValue(this._cities);
        this.loadDistricts(code);
    }

    if(this._districts && this._districts.code) {
        const code = this._districts.code;
        this._form.controls['District'].patchValue(this._districts);
        this.loadWards(code);
    }

    if(this._wards && this._wards.code) {
        this._form.controls['Ward'].patchValue(this._wards);
    }

    if(this._street) {
      this._form.controls['Street'].setValue(this._street);
        this.innerText = this._street;

        if(!this.isSelectAddress){
            this.checkAddress(null);
        }
    }
  }

  ngOnChanges(changes: SimpleChanges) {

    if(changes['_cities'] && !changes['_cities'].firstChange) {
        this._form.controls['City'].patchValue(null);
        this._cities = {...changes['_cities'].currentValue }

        if(this._cities && this._cities.code) {
            const code = this._cities.code;
            this._form.controls['City'].patchValue(this._cities);
            this.loadDistricts(code);
        }
    }

    if(changes['_districts'] && !changes['_districts'].firstChange) {
        this._form.controls['District'].patchValue(null);
        this._districts = {...changes['_districts'].currentValue }

        if(this._districts && this._districts.code) {
            const code = this._districts.code;
            this._form.controls['District'].patchValue(this._districts);
            this.loadWards(code);
        }
    }

    if(changes['_wards'] && !changes['_wards'].firstChange) {
        this._form.controls['Ward'].patchValue(null);
        this._wards = {...changes['_wards'].currentValue }

        if(this._wards && this._wards.code) {
            this._form.controls['Ward'].patchValue(this._wards);
        }
    }

    if(changes['_street'] && !changes['_street'].firstChange) {
        this._form.controls['Street'].setValue(this._street);
        this.innerText = this._street;

        if(!this.isSelectAddress){
            this.checkAddress(null);
        }
    }
  }

  loadCity(): void {
    this.lstCity = [];
    this.suggestService.setCity();
    this.suggestService.getCity().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        this.lstCity = [...res];
        this.citySubject.next(res);
    });
  }

  loadDistricts(code: string) {
    this.lstDistrict = [];
    this.suggestService.setDistrict(code);
    this.suggestService.getDistrict().subscribe((res: any) => {
        this.lstDistrict = [...res];
        this.districtSubject.next(res);
    });
  }

  loadWards(code: string) {
    this.lstWard = [];
    this.suggestService.setWard(code);
    this.suggestService.getWard().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        this.lstWard = [...res];
        this.wardSubject.next(res);
    });
  }

  handleCityFilter(value: string) {
    if(TDSHelperString.hasValueString(value)){
      let result = this.lstCity?.filter((x: SuggestCitiesDTO) => (x.name && TDSHelperString.stripSpecialChars(x.name.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(value.toLowerCase())) !== -1));
      this.citySubject.next(result);
    }
  }

  handleFilterDistrict(value: string) {
    if(TDSHelperString.hasValueString(value)){
      let result = this.lstDistrict?.filter((x: SuggestDistrictsDTO) => (x.name && TDSHelperString.stripSpecialChars(x.name.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(value.toLowerCase())) !== -1));
      this.districtSubject.next(result);
    }
  }

  handleFilterWard(value: string) {
    if(TDSHelperString.hasValueString(value)){
      let result = this.lstWard?.filter((x: SuggestWardsDTO) => (x.name && TDSHelperString.stripSpecialChars(x.name.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(value.toLowerCase())) !== -1));
      this.wardSubject.next(result);
    }
  }

  changeStreet(event: any){
    if(event) {
      this._form.controls['Street'].setValue(event.target.value);
    }

    let item: ResultCheckAddressDTO = {
        Address: this._form.controls['Street'].value,
        CityCode: this._form.controls['City'].value ? this._form.controls['City'].value?.code :null,
        CityName: this._form.controls['City'].value ? this._form.controls['City'].value?.name : null,
        DistrictCode:  this._form.controls['District'].value ? this._form.controls['District'].value?.code : null,
        DistrictName: this._form.controls['District'].value ? this._form.controls['District'].value?.name : null,
        WardCode: this._form.controls['Ward'].value ? this._form.controls['Ward'].value?.code : null,
        WardName: this._form.controls['Ward'].value ? this._form.controls['Ward'].value?.name : null
    } as any

    this.onLoadSuggestion.emit(item);
  }

  mappingStreet(){
    let street = (this._form.controls['Ward'].value?.name ? (this._form.controls['Ward'].value.name + ', ') : '')
      + (this._form.controls['District'].value?.name ? (this._form.controls['District'].value.name + ', '): '')
      + (this._form.controls['City'].value?.name ? this._form.controls['City'].value?.name: '');

    this._form.controls['Street'].setValue(street);
  }

  changeCity(city: SuggestCitiesDTO) {
    this._form.controls['City'].setValue(null);
    this._form.controls['District'].setValue(null);
    this.lstDistrict = [];
    this._form.controls['Ward'].setValue(null);
    this.lstWard = [];

    if (city && city.code ) {
        this._form.controls['City'].setValue(city);
        this.loadDistricts(city.code);
    }
    this.mappingStreet();

    let item: ResultCheckAddressDTO = {
        Address: this._form.controls['Street'].value,
        CityCode: city ? city.code : null,
        CityName: city ? city.name : null,
        DistrictCode: null,
        DistrictName: null,
        WardCode: null,
        WardName: null
    } as any;

    this.onLoadSuggestion.emit(item);
  }

  changeDistrict(district: SuggestDistrictsDTO) {
    this._form.controls['District'].setValue(null);
    this._form.controls['Ward'].setValue(null);
    this.lstWard = [];

    if (district && district.code) {
        this._form.controls['District'].setValue(district);
        this.loadWards(district.code);
    }
    this.mappingStreet();

    let item: ResultCheckAddressDTO = {
        Address: this._form.controls['Street'].value,
        CityCode: district ? district.cityCode : null,
        CityName:  district ? district.cityName : null,
        DistrictCode: district ? district.code : null,
        DistrictName: district ? district.name : null,
        WardCode: null,
        WardName: null
    } as any;

    this.onLoadSuggestion.emit(item);
  }

  changeWard(ward: SuggestWardsDTO) {
    this._form.controls['Ward'].setValue(null);

    if(ward && ward.code) {
      this._form.controls['Ward'].setValue(ward);
    }
    this.mappingStreet();

    let item: ResultCheckAddressDTO = {
        Address: this._form.controls['Street'].value,
        CityCode: ward ? ward.cityCode : null,
        CityName: ward ? ward.cityName : null,
        DistrictCode: ward ? ward.districtCode : null,
        DistrictName: ward ? ward.districtName : null,
        WardCode: ward ? ward.code : null,
        WardName: ward ? ward.name : null
    } as any;

    this.onLoadSuggestion.emit(item);
  }

  suggest(text: string): Observable<any[]> {
    this.arrowkeyLocation = -1;

    text = TDSHelperString.stripSpecialChars(text.toLowerCase().trim());
    text = encodeURIComponent(text);

    return this.suggestService.suggest(text)
      .pipe(map((res: any) => {
          this.suggestCount = Number(res.data?.length);
          return res?.data;
      }));
  }

  checkAddress(event: any) {

    if(!TDSHelperString.hasValueString(this.innerText)) {
      this.message.error('Vui lòng nhập dữ liệu trước khi kiểm tra!');
      return
    }

    this.isAlert = false;
    this.isLoading = true;
    let text = TDSHelperString.stripSpecialChars(this.innerText.toLowerCase().trim());
    text = encodeURIComponent(text);

    this.suggestService.checkAddress(text).pipe(takeUntil(this.destroy$)).subscribe({
      next : (res: any) => {
          if (res.success && TDSHelperArray.isArray(res.data)) {
              this.index = 0;
              this.selectAddress(res.data[0], 0);
              this.tempAddresses = res.data;
          }

          if (res.data?.length == 0) {
            this.isAlert = true;
          }

          this.isLoading = false;
          this.cdRef.detectChanges();
      }, error: (error: any) => {

          this.isAlert = true;
          this.message.error('Không tìm thấy kết quả phù hợp!');
          this.isLoading = false;
      }
    })
  }

  closeSearchAddress(){
    this.tempAddresses = [];
    this.innerText = ''
  }

  selectAddress(item: ResultCheckAddressDTO, index: number) {
    if(item) {
        this._form.reset();
        this.index = index;

        this._form.controls['Street'].setValue(item.Address);
        if(item.CityCode) {
            this._form.controls['City'].patchValue({
                code: item.CityCode,
                name: item.CityName
            });
            this.loadDistricts(item.CityCode)
        }

        if(item.DistrictCode) {
            this._form.controls['District'].patchValue({
                code: item.DistrictCode,
                name: item.DistrictName
            });
            this.loadWards(item.DistrictCode)
        } else {
          this._form.controls['District'].patchValue(null);
        }

        if(item.WardCode) {
            this._form.controls['Ward'].patchValue({
                code: item.WardCode,
                name: item.WardName
            });
        } else {
          this._form.controls['Ward'].patchValue(null);
        }

        this.onLoadSuggestion.emit(item);
    }
  }

  @HostListener('document:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    if (event && this._form.controls['Street'].value) {
      switch (event.key) {
        case ESCAPE_KEYUP:
          if (this.arrowkeyLocation > 0) {
            this.arrowkeyLocation--;
            event.preventDefault();
            event.stopImmediatePropagation();
          }

          break;

        case ESCAPE_KEYDOWN:
          this.arrowkeyLocation++;
          if (this.arrowkeyLocation > this.suggestCount) {
            this.arrowkeyLocation = 0;
          }
          event.preventDefault();
          event.stopImmediatePropagation();

          break;

        case ESCAPE_ENTER:
          if (this.suggestions$) {
            this.suggestions$.subscribe((res: any) => {
              const index = this.arrowkeyLocation;
              var item = res[index];

              this.selectAddress(item, -1);

              this.arrowkeyLocation = -1;
              this.suggestions$ = of([]);
              this.suggestCount = 0;

              event.stopPropagation();
            }, error => { });
          }
          break;

        default:
          break;
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
