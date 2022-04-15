import { da } from 'date-fns/locale';
import { TDSHelperArray, TDSHelperString, TDSUploadFile } from 'tmt-tang-ui';
import { ModalAddAddressComponent } from '../modal-add-address/modal-add-address.component';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { Component, OnInit, ViewContainerRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TDSModalRef, TDSModalService, TDSHelperObject, TDSMessageService } from 'tmt-tang-ui';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { CommonService } from 'src/app/main-app/services/common.service';
import { formatDate } from '@angular/common';
import { AddressDTO, CheckAddressDTO, CityDTO, DataSuggestionDTO, DistrictDTO, ResultCheckAddressDTO, WardDTO } from 'src/app/main-app/dto/address/address.dto';
import { AddressesV2, PartnerDetailDTO } from 'src/app/main-app/dto/partner/partner-detail.dto';
import { PartnerCategoryDTO, StatusDTO } from 'src/app/main-app/dto/partner/partner.dto';
import { SharedService } from 'src/app/main-app/services/shared.service';
import { Message } from 'src/app/lib/consts/message.const';
import { SuggestCitiesDTO, SuggestDistrictsDTO, SuggestWardsDTO } from 'src/app/main-app/dto/suggest-address/suggest-address.dto';

@Component({
  selector: 'app-modal-edit-partner',
  templateUrl: './modal-edit-partner.component.html',
  styleUrls: ['./modal-edit-partner.component.scss']
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

  _cities!: SuggestCitiesDTO;
  _districts!: SuggestDistrictsDTO;
  _wards!: SuggestWardsDTO;
  _street!: string;

  formatterPercent = (value: number) => `${value} %`;
  parserPercent = (value: string) => value.replace(' %', '');
  formatterVND = (value: number) => `${value} VNĐ`;
  parserVND = (value: string) => value.replace(' VNĐ', '');

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
        Name: [null],
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
    this.loadData();
  }

  loadData() {
    if(this.partnerId) {
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
  }

  mappingAddress(data: PartnerDetailDTO) {
    this._cities = {
        code: data.CityCode,
        name: data.CityName
    }
    this._districts = {
        cityCode: data.CityCode,
        cityName: data.CityName,
        code: data.DistrictCode,
        name: data.DistrictName
    }
    this._wards = {
        cityCode: data.CityCode,
        cityName: data.CityName,
        districtCode: data.DistrictCode,
        districtName: data.DistrictName,
        code: data.WardCode,
        name: data.WardName
    }
    this._street = data.Street;
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
        this.lstCategory = res.value;
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
        this.lstPrice = res.value;
    })
  }

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  onCancel() {
    this.modal.destroy(null);
  }

  onSave() {
    let model = this.prepareModel();
    if(!TDSHelperString.hasValueString(model.Name)) {
        this.message.error('Vui lòng nhập tên khách hàng');
    }
    if(!TDSHelperString.hasValueString(model.StatusText)) {
        this.message.error('Vui lòng nhập trạng thái khách hàng');
    }
    if(!TDSHelperString.hasValueString(model.Street)) {
        this.message.error('Vui lòng nhập địa chỉ khách hàng');
    }

    if(this.partnerId) {
      this.isLoading = true;
      this.partnerService.update(this.partnerId, model).subscribe((res: any) => {
          this.isLoading = false;
          this.message.success('Cập nhật khách hàng thành công!');
          this.modal.destroy(null);
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
          this.modal.destroy(null);
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
          Address: [data.Address],
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
    this._cities = {
        code: data.CityCode,
        name: data.CityName
    };
    this._districts = {
        cityCode: data.CityCode,
        cityName: data.CityName,
        code: data.DistrictCode,
        name: data.DistrictName
    };
    this._wards = {
        cityCode: data.CityCode,
        cityName: data.CityName,
        districtCode: data.DistrictCode,
        districtName: data.DistrictName,
        code: data.WardCode,
        name: data.WardName
    };
    this._street = data.Street;

    const modal = this.modalService.create({
        title: 'Chỉnh sửa địa chỉ',
        content: ModalAddAddressComponent,
        size: "lg",
        viewContainerRef: this.viewContainerRef,
        componentParams: {
          _cities: this._cities,
          _districts: this._districts,
          _wards: this._wards,
          _street: this._street
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
          }

          this.addAddresses(item);
      }
    });
  }

  onLoadSuggestion(item: ResultCheckAddressDTO) {
      if(item && item.Address) {
        this._form.controls['Street'].setValue(item.Address);
      }
      if(item && item.CityCode) {
        this._form.controls['City'].patchValue({
            code: item.CityCode,
            name: item.CityName
        });
      }
      if(item && item.DistrictCode) {
        this._form.controls['District'].patchValue({
              code: item.DistrictCode,
              name: item.DistrictName
          });
      }
      if(item && item.WardCode) {
        this._form.controls['Ward'].patchValue({
              code: item.WardCode,
              name: item.WardName
          });
      }
  }

  onChangeAddress(event: CheckAddressDTO) {
    const formModel = this._form.controls;
    formModel["Street"].setValue(event.Street);

    formModel["City"].setValue( event.City ? {
      code: event.City?.Code,
      name: event.City?.Name
    } : null);

    formModel["District"].setValue( event.District ? {
      code: event.District?.Code,
      name: event.District?.Name,
    } : null);

    formModel["Ward"].setValue( event.Ward ? {
      code: event.Ward?.Code,
      name: event.Ward?.Name,
    } : null);
  }

  beforeUpload = (file: TDSUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);

    this.handleUpload(file);
    return false;
  };

  handleUpload(file: TDSUploadFile) {
    let formData: any = new FormData();
    formData.append("files", file as any, file.name);
    formData.append('id', '0000000000000051');

    return this.sharedService.saveImageV2(formData).subscribe((res: any) => {
      this.message.success(Message.Upload.Success);
      if(this.partnerId) {
        this._form.controls["ImageUrl"].setValue(res[0].urlImageProxy);
      }

    }, error => {
      this.message.error('Upload Image đã xảy ra lỗi!')
    });
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
    if(formModel.City != null) {
        this.data['City'] = formModel.City ;
    }
    if(formModel.District != null) {
        this.data['District'] = formModel.District;
    }
    if(formModel.Ward != null) {
        this.data['Ward'] = formModel.Ward;
    }
    if(formModel.Customer != null) {
        this.data['Customer'] = formModel.Customer;
    }
    if(formModel.PropertyProductPricelist != null) {
        this.data['PropertyProductPricelist'] = formModel.PropertyProductPricelist;
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
    if(formModel.Addresses != null) {
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
