import { Component, Input, OnInit, EventEmitter, Output, SimpleChanges, OnChanges, AfterViewInit, HostListener, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, fromEvent, Observable, of, Subject } from 'rxjs';
import { SuggestCitiesDTO, SuggestDistrictsDTO, SuggestWardsDTO } from '../../dto/suggest-address/suggest-address.dto';
import { SuggestAddressService } from '../../services/suggest-address.service';
import { ResultCheckAddressDTO } from '../../dto/address/address.dto';
import { catchError, debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray, TDSHelperString } from 'tds-ui/shared/utility';

const ESCAPE_KEYUP = 'ArrowUp';
const ESCAPE_KEYDOWN = 'ArrowDown';
const ESCAPE_ENTER = 'Enter';

@Component({
  selector: 'suggest-address',
  templateUrl: './suggest-address.component.html',
})

export class SuggestAddressComponent implements  OnChanges, AfterViewInit, OnDestroy {

  // @ViewChild('streetInput') streetInput!: ElementRef;
  _form!: FormGroup;
  @Input() _isExpanded!: boolean;
  @Input() _street!: string;
  @Input() _cities!: SuggestCitiesDTO;
  @Input() _districts!: SuggestDistrictsDTO;
  @Input() _wards!: SuggestWardsDTO;

  lstCities!: Array<SuggestCitiesDTO>;
  lstDistricts!: Array<SuggestDistrictsDTO>;
  lstWards!: Array<SuggestWardsDTO>;
  innerText: string = '';

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
    this.suggestService.getCities().pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.lstCities = res;
        this.citySubject.next(res);
    });
  }

  loadDistricts(code: string) {
    this.suggestService.getDistricts(code).pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.lstDistricts = res;
        this.districtSubject.next(res);
      });
  }

  loadWards(code: string) {
    this.suggestService.getWards(code).pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.lstWards = res;
        this.wardSubject.next(res);
      });
  }

  handleCityFilter(value: string) {
      var result = this.lstCities.filter((x: SuggestCitiesDTO) => (x.name && TDSHelperString.stripSpecialChars(x.name.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(value.toLowerCase())) !== -1));
      this.citySubject.next(result);
  }

  handleFilterDistrict(value: string) {
    if(TDSHelperString.hasValueString(value)){
      var result = this.lstDistricts.filter((x: SuggestDistrictsDTO) => (x.name && TDSHelperString.stripSpecialChars(x.name.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(value.toLowerCase())) !== -1));
      this.districtSubject.next(result);
    }
  }

  handleFilterWard(value: string) {
    if(TDSHelperString.hasValueString(value)){
      var result = this.lstWards.filter((x: SuggestWardsDTO) => (x.name && TDSHelperString.stripSpecialChars(x.name.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(value.toLowerCase())) !== -1));
      this.wardSubject.next(result);
    }
  }

  changeStreet(event: any){
    if(event) {
      this._form.controls['Street'].setValue(event.target.value);

      let item: ResultCheckAddressDTO = {
        Telephone: null,
        Address: this._form.controls['Street'].value,
        ShortAddress: '',
        CityCode: this._form.controls['City'].value.code,
        CityName: this._form.controls['City'].value.name,
        DistrictCode: this._form.controls['District'].value.code,
        DistrictName: this._form.controls['District'].value.code,
        WardCode: this._form.controls['Ward'].value.code,
        WardName: this._form.controls['Ward'].value.code,
        Score: 0
      }

      this.onLoadSuggestion.emit(item);
    }
  }

  changeCity(event: SuggestCitiesDTO) {
    if (event) {
      this.loadDistricts(event.code);

      this._form.controls['City'].setValue(event);
      this._form.controls['District'].setValue(null);
      this._form.controls['Ward'].setValue(null);

      let item: ResultCheckAddressDTO = {
        Telephone: null,
        Address: this._form.controls['Street'].value,
        ShortAddress: '',
        CityCode: event.code,
        CityName: event.name,
        DistrictCode: '',
        DistrictName: '',
        WardCode: '',
        WardName: '',
        Score: 0
      }
      this.onLoadSuggestion.emit(item);
    }else{
      this.lstDistricts = [];
      this.lstWards = []
      this._form.controls['City'].setValue(null);
      this._form.controls['District'].setValue(null);
      this._form.controls['Ward'].setValue(null);

      let item: ResultCheckAddressDTO = {
        Telephone: null,
        Address: this._form.controls['Street'].value,
        ShortAddress: '',
        CityCode: '',
        CityName: '',
        DistrictCode: '',
        DistrictName: '',
        WardCode: '',
        WardName: '',
        Score: 0
      }
      this.onLoadSuggestion.emit(item);
    }
  }

  changeDistrict(event: SuggestDistrictsDTO) {
    if (event) {
      this.loadWards(event.code);
      this._form.controls['District'].setValue(event);
      this._form.controls['Ward'].setValue(null);

      let item: ResultCheckAddressDTO = {
        Telephone: null,
        Address: this._form.controls['Street'].value,
        ShortAddress: '',
        CityCode: event.cityCode,
        CityName: event.cityName,
        DistrictCode: event.code,
        DistrictName: event.name,
        WardCode: '',
        WardName: '',
        Score: 0
      }

      this.onLoadSuggestion.emit(item);
    }else{
      this.lstWards = []
      this._form.controls['District'].setValue(null);
      this._form.controls['Ward'].setValue(null);

      let item: ResultCheckAddressDTO = {
        Telephone: null,
        Address: this._form.controls['Street'].value,
        ShortAddress: '',
        CityCode: this._form.controls['City'].value.code,
        CityName: this._form.controls['City'].value.name,
        DistrictCode: '',
        DistrictName: '',
        WardCode: '',
        WardName: '',
        Score: 0
      }

      this.onLoadSuggestion.emit(item);
    }
  }

  changeWard(event: SuggestWardsDTO) {
    if(event) {
      this._form.controls['Ward'].setValue(event);
      let item: ResultCheckAddressDTO = {
          Telephone: null,
          Address: this._form.controls['Street'].value,
          ShortAddress: '',
          CityCode: event.cityCode,
          CityName: event.cityName,
          DistrictCode: event.districtCode,
          DistrictName: event.districtName,
          WardCode: event.code,
          WardName: event.name,
          Score: 0
      }

      this.onLoadSuggestion.emit(item);
    }else{
      let item: ResultCheckAddressDTO = {
        Telephone: null,
        Address: this._form.controls['Street'].value,
        ShortAddress: '',
        CityCode: this._form.controls['City'].value.code,
        CityName: this._form.controls['City'].value.name,
        DistrictCode: this._form.controls['District'].value.code,
        DistrictName: this._form.controls['District'].value.name,
        WardCode: '',
        WardName: '',
        Score: 0
    }

    this.onLoadSuggestion.emit(item);
    }
  }

  expanded() {
     this._isExpanded = !this._isExpanded;
  }

  ngAfterViewInit(): void {
    // fromEvent(this.streetInput.nativeElement, 'keyup')
    //   .pipe(map((event: any) => {
    //     if (event.key === "Enter") {
    //       if (this.arrowkeyLocation < 0) {
    //         this.checkAddress(event.target.value);
    //         event.preventDefault();
    //       }

    //       return;
    //     } else {
    //       return event.target.value;
    //     }
    //   }), debounceTime(750), distinctUntilChanged())
    //   .subscribe((text: string) => {
    //     if (text) {
    //       this.suggestions$ = this.suggest(text);
    //     }
    //   }, () => { });
  }

  suggest(text: string): Observable<any[]> {
    this.arrowkeyLocation = -1;
    text = encodeURIComponent(text);

    return this.suggestService.suggest(text)
      .pipe(map(res => {
          this.suggestCount = res.data.length;
          return res.data;
      }));
  }

  checkAddress(event: any) {
    let text = this.innerText;

    if(!TDSHelperString.hasValueString(text)) {
        this.message.error('Vui lòng nhập dữ liệu trước khi kiểm tra!');
    }

    text = encodeURIComponent(text);
    this.suggestService.checkAddress(text).pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
      if (res.success && TDSHelperArray.isArray(res.data)) {
          this.index = 0;
          this.selectAddress(res.data[0], 0);

          this.tempAddresses = res.data;
      }
      else {
        this.message.error('Không tìm thấy kết quả phù hợp!');
      }
    })
  }

  selectAddress(item: ResultCheckAddressDTO, index: number) {
    if(item) {
        this.index = index;
        this._form.controls['Street'].setValue(item.Address);
        if(item.CityCode) {
            this._form.controls['City'].patchValue({
                code: item.CityCode,
                name: item.CityName
            });
        }
        if(item.DistrictCode) {
          this._form.controls['District'].patchValue({
                code: item.DistrictCode,
                name: item.DistrictName
            });
        }
        if(item.WardCode) {
          this._form.controls['Ward'].patchValue({
                code: item.WardCode,
                name: item.WardName
            });
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
