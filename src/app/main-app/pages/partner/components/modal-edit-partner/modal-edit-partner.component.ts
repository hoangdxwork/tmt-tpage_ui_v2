import { TDSHelperArray, TDSHelperString } from 'tmt-tang-ui';
import { ModalAddAddressComponent } from '../modal-add-address/modal-add-address.component';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { Component, OnInit, ViewContainerRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TDSModalRef, TDSModalService, TDSHelperObject, TDSMessageService } from 'tmt-tang-ui';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { format } from 'date-fns';
import { CommonService } from 'src/app/main-app/services/common.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-modal-edit-partner',
  templateUrl: './modal-edit-partner.component.html',
  styleUrls: ['./modal-edit-partner.component.scss']
})

export class ModalEditPartnerComponent implements OnInit {

  @Input() partnerId: any;
  data: any = {};
  isLoading: boolean = false;

  _form!: FormGroup;
  lstCategory: any = [];
  lstStatus: any = [];
  lstPrice: any = [];

  formAddPartner!: FormGroup
  dataGroupPartner = [
    { id: 1, value: 'nhóm 1' },
    { id: 2, value: 'nhóm 2' },
    { id: 3, value: 'nhóm 3' },
  ]
  dataStatusPartner = [
    { id: 1, value: 'status 1' },
    { id: 2, value: 'status 2' },
  ]

  formatterPercent = (value: number) => `${value} %`;
  parserPercent = (value: string) => value.replace(' %', '');
  formatterVND = (value: number) => `${value} VNĐ`;
  parserVND = (value: string) => value.replace(' VNĐ', '');

  listDataAddress = [{
    id: 1,
    address: '12 CN1, Phường Sơn Kỳ, Quận Tân Phú, Thành phố Hồ Chí Minh'
  },
  {
    id: 2,
    address: 'Lô III - 26, Đường 19/5A, Nhóm CN III, Khu công nghiệp, Tân Bình, Tân Phú, Thành phố Hồ Chí Minh'
  }]
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
        Name: [null],
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
      let id = this.partnerId;
      this.isLoading = true;

      this.partnerService.getById(id).subscribe((res: any) => {
          this.data = res;

          if(this.data.BirthDay) {
            this.data.BirthDay = new Date(this.data.BirthDay);
          }

          this.updateForm(this.data);
          this.isLoading = false;

      }, error => {
          this.isLoading = false;
          this.message.error('Tải dữ liệu khách hàng thất bại');
      })
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

  submitAddPartner() {
    if (!this.formAddPartner.invalid) {
      this.modal.destroy(this.formAddPartner.value);
      console.log(this.formAddPartner.value)
    }
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

  //modal add Address
  showModalAddAddress(){
    const modal = this.modalService.create({
      title: 'Thêm địa chỉ',
      content: ModalAddAddressComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
    });
    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    modal.afterClose.subscribe(result => {
      console.log('[afterClose] The result is:', result);
      if (TDSHelperObject.hasValue(result)) {
        console.log(result)
      }
    });
  }

  prepareModel() {
    const formModel = this._form.value;

    if(formModel.Name != null) {
        this.data['Name'] = formModel.Name;
    }
    if(formModel.Image != null && !this.partnerId) {
        // this.data['Image'] = this.commontService.urlBase64;
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
        this.data['Phone'] =formModel.Phone as boolean;
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
