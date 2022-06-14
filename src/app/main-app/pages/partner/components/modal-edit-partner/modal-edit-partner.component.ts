import { ModalAddAddressComponent } from '../modal-add-address/modal-add-address.component';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { Component, OnInit, ViewContainerRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { CommonService } from 'src/app/main-app/services/common.service';
import { formatDate } from '@angular/common';
import { ResultCheckAddressDTO } from 'src/app/main-app/dto/address/address.dto';
import { AddressesV2, PartnerDetailDTO } from 'src/app/main-app/dto/partner/partner-detail.dto';
import { PartnerCategoryDTO, StatusDTO } from 'src/app/main-app/dto/partner/partner.dto';
import { SharedService } from 'src/app/main-app/services/shared.service';
import { SuggestCitiesDTO, SuggestDistrictsDTO, SuggestWardsDTO } from 'src/app/main-app/dto/suggest-address/suggest-address.dto';
import { TDSUploadFile } from 'tds-ui/upload';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray, TDSHelperObject, TDSHelperString } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-modal-edit-partner',
  templateUrl: './modal-edit-partner.component.html'
})

export class ModalEditPartnerComponent implements OnInit {

  @Input() partnerId: any;
  data!: PartnerDetailDTO;
  isLoading: boolean = false;

  _form!: FormGroup;
  lstCategory: Array<PartnerCategoryDTO> = [];
  lstStatus: Array<StatusDTO> = [];
  lstPrice: Array<PartnerCategoryDTO> = [];
  fileList: TDSUploadFile[] = [];
  formatterPercent = (value: number) => `${value} %`;
  parserPercent = (value: string) => value.replace(' %', '');
  formatterVND = (value: number) => `${value} VNĐ`;
  parserVND = (value: string) => value.replace(' VNĐ', '');

  _cities!: SuggestCitiesDTO;
  _districts!: SuggestDistrictsDTO;
  _wards!: SuggestWardsDTO;
  _street!: string;

  constructor(private fb: FormBuilder,
    private modal: TDSModalRef,
    private message: TDSMessageService,
    private partnerService: PartnerService,
    private commonService: CommonService,
    private modalService: TDSModalService,
    private sharedService: SharedService,
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
        Phone: [null],
        Email: [null],
        Zalo: [null],
        Facebook: [null],
        Website: [null],
        TaxCode: [null],
        City: [null],
        District: [null],
        Ward: [null],
        Customer: [null],
        PropertyProductPricelist: [0],
        Discount: [0],
        AmountDiscount: [0],
        Supplier: [false],
        Addresses: this.fb.array([]),
        CompanyType: ['person'],
        Street: [null],
    })
  }

  ngOnInit(): void {
    if(this.partnerId) {
      this.loadPartner()
    } else {
      this.loadDefault();
    }
  }

  loadDefault() {
    this.isLoading = true;
    let model = {
        Customer: true,
        Supplier: false
    }

    this.partnerService.getDefault(model).subscribe((res: any) => {
      delete res['@odata.context'];

      this.isLoading = false;
      this.data = res;
      this.updateForm(this.data);

    }, error => {
      this.isLoading = false;
      this.message.error('Tải dữ liệu mặc định khách hàng thất bại');
    })
  }

  loadPartner() {
    this.isLoading = true;
    this.partnerService.getById(this.partnerId).subscribe((res: any) => {
        delete res['@odata.context'];
        this.data = res;

        if(this.data.BirthDay) {
          this.data.BirthDay = new Date(this.data.BirthDay);
        }

        this.updateForm(this.data);
        this.isLoading = false;

        this.mappingAddress(res);

    }, error => {
        this.isLoading = false;
        this.message.error('Tải dữ liệu khách hàng thất bại');
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

  updateForm(data: any) {
    if(TDSHelperArray.hasListValue(data.Addresses)) {
      data.Addresses.forEach((value: any) => {
        (this._form.controls.Addresses as FormArray).push(this.fb.control(value));
      });
    }
    this._form.patchValue(data);
  }

  openCategory(event: any) {
    this.partnerService.getPartnerCategory().subscribe((res: any) =>  {
      if(TDSHelperString.hasValueString(res.value)) {
        this.lstCategory = [...res.value];
      }
    })
  }

  openStatus(event: any) {
    this.commonService.getPartnerStatus().subscribe((res: any) => {
        this.lstStatus = res.map((x: any) => x.text);
    })
  }

  openlstPrice(event: any) {
    let date = formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'en-US');
    this.commonService.getPriceListAvailable(date).subscribe((res: any) => {
      if(TDSHelperString.hasValueString(res.value)) {
          this.lstPrice = [...res.value];
      }
    })
  }

  onCancel() {
    this.modal.destroy(null);
  }

  onSave() {
    let model = this.prepareModel();
    if(!TDSHelperString.hasValueString(model.Name)) {
        this.message.error('Vui lòng nhập tên khách hàng');
    }
    if(this.partnerId) {
      this.isLoading = true;
      this.partnerService.update(this.partnerId, model).subscribe((res: any) => {
          this.isLoading = false;
          this.message.success('Cập nhật khách hàng thành công!');
          this.modal.destroy(this.partnerId);
      }, error => {
          this.isLoading = false;
          this.message.error('Cập nhật khách hàng thất bại!');
          this.modal.destroy(null);
      })
    } else {
      this.isLoading = false;
      this.partnerService.insert(model).subscribe((res: any) => {
          this.isLoading = false;
          this.message.success('Thêm mới khách hàng thành công!');
          this.modal.destroy(res.Id);
      }, error => {
          this.isLoading = false;
          this.message.error('Thêm mới khách hàng thất bại!');
          this.modal.destroy(null);
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
            Street:[data.Street],
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
            Street:  [null],
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

  showModalAddAddress(){
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

  getUrl(urlImage: string){
    if(urlImage){
      this._form.controls["ImageUrl"].setValue(urlImage);
    }
  }

  prepareModel() {
    const formModel = this._form.value;
    if(formModel.Name != null) {
        this.data['Name'] = formModel.Name;
    }
    if(formModel.Image != null && !this.partnerId) {
        this.data['Image'] =  formModel.ImageUrl
    }
    if(formModel.ImageUrl != null && this.partnerId) {
        this.data['ImageUrl'] = formModel.ImageUrl;
    }
    if(formModel.Ref != null) {
        this.data['Ref'] = formModel.Ref;
    }
    if(formModel.BirthDay != null) {
        this.data['BirthDay'] = formModel.BirthDay;
    }
    if(formModel.Categories != null) {
        this.data['Categories'] = formModel.Categories;
    }
    if(formModel.StatusText != null) {
        this.data['StatusText'] = formModel.StatusText;
    }
    if(formModel.Active != null) {
        this.data['Active'] = formModel.Active as boolean;
    }
    if(formModel.Phone != null) {
        this.data['Phone'] = formModel.Phone as string;
    }
    if(formModel.Email != null) {
        this.data['Email'] = formModel.Email;
    }
    if(formModel.Zalo != null) {
        this.data['Zalo'] = formModel.Zalo ;
    }
    if(formModel.Facebook != null) {
        this.data['Facebook'] = formModel.Facebook;
    }
    if(formModel.Website != null) {
        this.data['Website'] = formModel.Website ;
    }
    if(formModel.TaxCode != null) {
        this.data['TaxCode'] = formModel.TaxCode ;
    }
    this.data['City'] = formModel.City ;
    this.data['District'] = formModel.District;
    this.data['Ward'] = formModel.Ward;
    if(formModel.Customer != null) {
        this.data['Customer'] = formModel.Customer;
    }
    if(formModel.PropertyProductPricelist != null) {
        this.data['PropertyProductPricelistId'] = this._form.controls['PropertyProductPricelist'].value.Id;
    }
    if(formModel.Discount != null) {
        this.data['Discount'] = formModel.Discount;
    }
    if(formModel.AmountDiscount != null) {
        this.data['AmountDiscount'] =  formModel.AmountDiscount;
    }
    if(formModel.Supplier != null) {
        this.data['Supplier'] = formModel.Supplier;
    }
    if(TDSHelperArray.hasListValue(formModel.Addresses)) {
        this.data['Addresses'] = formModel.Addresses;
    }
    if(formModel.CompanyType != null) {
        this.data['CompanyType'] = formModel.CompanyType;
    }
    if(formModel.Street != null){
      this.data['Street'] = formModel.Street;
    }

    if(this.data['CompanyType'] === 'person'){
      this.data['TaxCode'] = null;
    }

    return this.data;
  }

}
