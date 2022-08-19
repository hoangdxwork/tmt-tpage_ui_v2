import { ModalAddAddressComponent } from '../modal-add-address/modal-add-address.component';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Component, OnInit, ViewContainerRef, Input, OnDestroy } from '@angular/core';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { CommonService } from 'src/app/main-app/services/common.service';
import { formatDate, formatNumber } from '@angular/common';
import { ResultCheckAddressDTO } from 'src/app/main-app/dto/address/address.dto';
import { AddressesV2, PartnerDetailDTO } from 'src/app/main-app/dto/partner/partner-detail.dto';
import { PartnerCategoryDTO, StatusDTO } from 'src/app/main-app/dto/partner/partner.dto';
import { SuggestCitiesDTO, SuggestDistrictsDTO, SuggestWardsDTO } from 'src/app/main-app/dto/suggest-address/suggest-address.dto';
import { TDSUploadFile } from 'tds-ui/upload';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray, TDSHelperObject, TDSHelperString } from 'tds-ui/shared/utility';
import { Subject, takeUntil, finalize } from 'rxjs';
import { vi_VN } from 'tds-ui/i18n';

@Component({
  selector: 'app-modal-edit-partner',
  templateUrl: './modal-edit-partner.component.html'
})

export class ModalEditPartnerComponent implements OnInit, OnDestroy {

  @Input() partnerId: any;

  _form!: FormGroup;
  data!: PartnerDetailDTO;
  isLoading: boolean = false;
  price!: PartnerCategoryDTO;
  lstCategory: Array<PartnerCategoryDTO> = [];
  lstStatus: Array<StatusDTO> = [];
  lstPrice: Array<PartnerCategoryDTO> = [];
  fileList: TDSUploadFile[] = [];

  formatterPercent = (value: number) => `${formatNumber(value,vi_VN.locale,'1.2-2')}`;
  formatterVND = (value: number) => `${formatNumber(value,vi_VN.locale)}`;

  _cities!: SuggestCitiesDTO;
  _districts!: SuggestDistrictsDTO;
  _wards!: SuggestWardsDTO;
  _street!: string;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder,
    private modal: TDSModalRef,
    private message: TDSMessageService,
    private partnerService: PartnerService,
    private commonService: CommonService,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef) {
    this.createForm();
  }

  createForm() {
    this._form = this.fb.group({
      Id: [null],
      Name: [null, Validators.required],
      Image: [null],
      ImageUrl: [null],
      Ref: [null],
      BirthDay: [null],
      Categories: [null],
      StatusText: [null],
      Active: [false],
      Phone: [null, Validators.pattern(/^[0-9]{10}$/i)],
      Email: [null],
      Zalo: [null],
      Facebook: [null],
      Website: [null],
      TaxCode: [null],
      City: [null],
      CityCode: [null],
      CityName: [null],
      District: [null],
      DistrictCode: [null],
      DistrictName: [null],
      Ward: [null],
      WardCode: [null],
      WardName: [null],
      Customer: [null],
      PropertyProductPricelist: [0],
      Discount: [0],
      AmountDiscount: [0],
      Supplier: [false],
      Addresses: this.fb.array([]),
      CompanyType: ['person'],
      Street: [null]
    })
  }

  getErrorMessage() {
    if (this._form.get("Phone")?.hasError('required')) {
      return 'Vui lòng nhập số điện thoại';
    }
    return this._form.get("Phone")?.hasError('pattern') ?
      'Vui lòng nhập đủ 10 số, không nhập kí tự' : '';
  }

  ngOnInit(): void {
    if (this.partnerId) {
      this.loadPartner()
    } else {
      this.loadDefault();
    }
    this.openlstPrice();
    this.openStatus();
    this.openCategory();
  }

  loadDefault() {
    this.isLoading = true;
    let model = {
      Customer: true,
      Supplier: false
    }

    this.partnerService.getDefault(model)
      .pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false)).subscribe((res: any) => {
        delete res['@odata.context'];

        this.data = res;
        this.updateForm(this.data);
      }, error => {
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
      })
  }

  loadPartner() {
    this.isLoading = true;
    this.partnerService.getById(this.partnerId)
      .pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false)).subscribe((res: any) => {
        delete res['@odata.context'];

        if (res.BirthDay != null) {
          res.BirthDay = new Date(res.BirthDay);
        }

        this.data = res;
        this.updateForm(this.data);
        this.mappingAddress(res);
      }, error => {
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
      })
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
    if (data && (data.Street)) {
      this._street = data.Street;
    }
  }

  onLoadSuggestion(item: ResultCheckAddressDTO) {
    this._form.controls['Street'].setValue(item.Address ? item.Address : null);

    if (item && item.CityCode) {
      this._form.controls['City'].patchValue({
        code: item.CityCode,
        name: item.CityName
      });
    } else {
      this._form.controls['City'].setValue(null)
    }

    if (item && item.DistrictCode) {
      this._form.controls['District'].patchValue({
        code: item.DistrictCode,
        name: item.DistrictName
      });
    } else {
      this._form.controls['District'].setValue(null)
    }

    if (item && item.WardCode) {
      this._form.controls['Ward'].patchValue({
        code: item.WardCode,
        name: item.WardName
      });
    } else {
      this._form.controls['Ward'].setValue(null)
    }
  }

  updateForm(data: any) {
    if (TDSHelperArray.hasListValue(data.Addresses)) {
      data.Addresses.forEach((value: any) => {
        (this._form.controls.Addresses as FormArray).push(this.fb.control(value));
      });
    }
    this._form.patchValue(data);
  }

  openCategory() {
    this.partnerService.getPartnerCategory().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      if (TDSHelperString.hasValueString(res.value)) {
        this.lstCategory = [...res.value];
      }
    }, error => {
      this.message.error(`${error?.error?.message}`)
    })
  }

  openStatus() {
    this.commonService.getPartnerStatus().pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.lstStatus = res.map((x: any) => x.text);
    }, error => {
      this.message.error(`${error?.error?.message}`)
    })
  }

  openlstPrice() {
    let date = formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'en-US');
    this.commonService.getPriceListAvailable(date).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      if (TDSHelperString.hasValueString(res.value)) {
        this.lstPrice = [...res.value];
        this.price = this.lstPrice[0];
      }
    }, error => {
      this.message.error(`${error?.error?.message}`)
    })
  }

  checkAddressByPhone() {
    let phone = this._form.controls['Phone'].value;
    if (TDSHelperString.hasValueString(phone)) {
      this.isLoading = true;

      this.commonService.checkAddressByPhone(phone)
        .pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false)).subscribe((res: any) => {
          this.message.info('Chưa có dữ liệu');
        }, error => {
          this.message.error(`${error?.error?.message}`)
        })
    }
  }

  onCancel() {
    this.modal.destroy(null);
  }

  onSave(): any {
    if(!this._form.dirty && this.partnerId) {
        return this.modal.destroy(null);
    }

    let model = this.prepareModel();
    if (!TDSHelperString.hasValueString(model.Name)) {
        this.message.error('Vui lòng nhập tên khách hàng');
        return
    }
    if (!TDSHelperString.hasValueString(model.Phone)) {
        this.message.error('Vui lòng nhập số điện thoại');
        return
    }

    if (this.partnerId) {
        this.isLoading = true;
        this.partnerService.update(this.partnerId, model).pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false)).subscribe((res: any) => {
            this.message.success('Cập nhật khách hàng thành công!');
            this.modal.destroy(this.partnerId);
        }, error => {
            this.message.error('Cập nhật khách hàng thất bại!');
        })

    } else {
        this.isLoading = false;
        this.partnerService.insert(model).pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false)).subscribe((res: any) => {
          this.message.success('Thêm mới khách hàng thành công!');
          this.modal.destroy(res.Id);
        }, error => {
          this.message.error('Thêm mới khách hàng thất bại!');
        })
    }
  }

  initAddress(data: AddressesV2 | null) {
    if (data != null) {
      return this.fb.group({
        Id: [data.Id],
        PartnerId: [data.PartnerId],
        CityCode: [data.CityCode],
        CityName: [data.CityName],
        DistrictCode: [data.DistrictCode],
        DistrictName: [data.DistrictName],
        WardCode: [data.WardCode],
        WardName: [data.WardName],
        IsDefault: [data.IsDefault],
        Street: [data.Street],
        Address: [data.Address]
      });
    } else {
      return this.fb.group({
        Id: [null],
        PartnerId: [null],
        CityCode: [null],
        CityName: [null],
        DistrictCode: [null],
        DistrictName: [null],
        WardCode: [null],
        WardName: [null],
        IsDefault: [null],
        Street: [null],
        Address: [null]
      });
    }
  }

  addAddresses(data: any) {
    const control = <FormArray>this._form.controls['Addresses'];
    control.push(this.initAddress(data));
  }

  removeAddresses(i: number) {
    const control = <FormArray>this._form.controls['Addresses'];
    control.removeAt(i);
  }

  openItemAddresses(data: AddressesV2, index: number) {
    let _cities = {
      code: data.CityCode,
      name: data.CityName
    };
    let _districts = {
      cityCode: data.CityCode,
      cityName: data.CityName,
      code: data.DistrictCode,
      name: data.DistrictName
    };
    let _wards = {
      cityCode: data.CityCode,
      cityName: data.CityName,
      districtCode: data.DistrictCode,
      districtName: data.DistrictName,
      code: data.WardCode,
      name: data.WardName
    };
    let _street = data.Street;

    const modal = this.modalService.create({
      title: 'Chỉnh sửa địa chỉ',
      content: ModalAddAddressComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        _cities: _cities,
        _districts: _districts,
        _wards: _wards,
        _street: _street
      }
    });

    modal.afterClose.subscribe((res: ResultCheckAddressDTO) => {
      if (TDSHelperObject.hasValue(res)) {
        let item: AddressesV2 = {
          Id: data.Id,
          PartnerId: this.partnerId,
          CityCode: res.CityCode,
          CityName: res.CityName,
          DistrictCode: res.DistrictCode,
          DistrictName: res.DistrictName,
          WardCode: res.WardCode,
          WardName: res.WardName,
          IsDefault: data.IsDefault,
          Street: res.Address,
          Address: res.Address
        };

        (this._form.controls.Addresses as FormArray).at(index).patchValue(item);
      }
    });
  }

  showModalAddAddress() {
    const modal = this.modalService.create({
      title: 'Thêm địa chỉ',
      content: ModalAddAddressComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef
    });

    modal.afterClose.subscribe((res: ResultCheckAddressDTO) => {
      if (TDSHelperObject.hasValue(res)) {
        let item: AddressesV2 = {
          Id: 0,
          PartnerId: this.partnerId,
          CityCode: res.CityCode,
          CityName: res.CityName,
          DistrictCode: res.DistrictCode,
          DistrictName: res.DistrictName,
          WardCode: res.WardCode,
          WardName: res.WardName,
          IsDefault: null,
          Street: res.Address,
          Address: res.Address
        };
        this.addAddresses(item);
      }
    });
  }

  getUrl(urlImage: string) {
    if (urlImage) {
      this._form.controls["ImageUrl"].setValue(urlImage);
    }
  }

  selectItem(item: AddressesV2) {
    if (item && item.CityCode) {
      this._cities = {
        code: item.CityCode,
        name: item.CityName
      }
      this._form.controls['City'].patchValue({
        code: item.CityCode,
        name: item.CityName
      });
    }
    if (item && item.DistrictCode) {
      this._districts = {
        cityCode: item.CityCode,
        cityName: item.CityName,
        code: item.DistrictCode,
        name: item.DistrictName
      }
      this._form.controls['District'].patchValue({
        code: item.DistrictCode,
        name: item.DistrictName
      });
    }
    if (item && item.WardCode) {
      this._wards = {
        cityCode: item.CityCode,
        cityName: item.CityName,
        districtCode: item.DistrictCode,
        districtName: item.DistrictName,
        code: item.WardCode,
        name: item.WardName
      }
      this._form.controls['Ward'].patchValue({
        code: item.WardCode,
        name: item.WardName
      });
    }
    if (item && (item.Street)) {
      this._street = item.Street;
      this._form.controls['Street'].setValue(item.Street);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  prepareModel() {
    const formModel = this._form.value;
    if (formModel.Name != null) {
      this.data['Name'] = formModel.Name;
    }
    if (formModel.Image != null && !this.partnerId) {
      this.data['Image'] = formModel.ImageUrl
    }
    if (formModel.ImageUrl != null && this.partnerId) {
      this.data['ImageUrl'] = formModel.ImageUrl;
    }
    if (formModel.Ref != null) {
      this.data['Ref'] = formModel.Ref;
    }
    if (formModel.BirthDay != null) {
      this.data['BirthDay'] = formModel.BirthDay;
    }
    if (formModel.Categories != null) {
      this.data['Categories'] = formModel.Categories;
    }
    if (formModel.StatusText != null) {
      this.data['StatusText'] = formModel.StatusText;
    }
    if (formModel.Active != null) {
      this.data['Active'] = formModel.Active as boolean;
    }
    if (formModel.Phone != null) {
      this.data['Phone'] = formModel.Phone as string;
    }
    if (formModel.Email != null) {
      this.data['Email'] = formModel.Email;
    }
    if (formModel.Zalo != null) {
      this.data['Zalo'] = formModel.Zalo;
    }
    if (formModel.Facebook != null) {
      this.data['Facebook'] = formModel.Facebook;
    }
    if (formModel.Website != null) {
      this.data['Website'] = formModel.Website;
    }
    if (formModel.TaxCode != null) {
      this.data['TaxCode'] = formModel.TaxCode;
    }

    this.data['City'] = formModel.City;
    this.data['District'] = formModel.District;
    this.data['Ward'] = formModel.Ward;

    if (formModel.Customer != null) {
      this.data['Customer'] = formModel.Customer;
    }
    if (formModel.PropertyProductPricelist != null) {
      this.data['PropertyProductPricelistId'] = this._form.controls['PropertyProductPricelist'].value.Id;
    }
    if (formModel.Discount != null && formModel.Discount) {
      this.data['Discount'] = formModel.Discount;
    }
    if (formModel.AmountDiscount != null && formModel.Discount) {
      this.data['AmountDiscount'] = formModel.AmountDiscount;
    }
    if (formModel.Supplier != null) {
      this.data['Supplier'] = formModel.Supplier;
    }
    if (TDSHelperArray.hasListValue(formModel.Addresses)) {
      this.data['Addresses'] = formModel.Addresses;
    }
    if (formModel.CompanyType != null) {
      this.data['CompanyType'] = formModel.CompanyType;
    }
    if (formModel.Street != null) {
      this.data['Street'] = formModel.Street;
    }

    if (this.data['CompanyType'] === 'person') {
      this.data['TaxCode'] = null;
    }

    return this.data;
  }

}
