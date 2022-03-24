import { ModalAddAddressComponent } from '../modal-add-address/modal-add-address.component';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { TDSModalRef, TDSModalService, TDSHelperObject } from 'tmt-tang-ui';

@Component({
  selector: 'app-modal-add-partner',
  templateUrl: './modal-add-partner.component.html',
  styleUrls: ['./modal-add-partner.component.scss']
})
export class ModalAddPartnerComponent implements OnInit {

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
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef
    ) { }

  ngOnInit(): void {
    this.formAddPartner = this.fb.group({
      namePartner: new FormControl(''),
      personalOrCompany: new FormControl(''),
      code: new FormControl(''),
      phone: new FormControl(''),
      birthday: new FormControl(''),
      email: new FormControl(''),
      group: new FormControl(''),
      zalo: new FormControl(''),
      status: new FormControl(''),
      facebook: new FormControl(''),
      address: new FormControl(''),
      numberStreet: new FormControl(''),
      province: new FormControl(''),
      district: new FormControl(''),
      wards: new FormControl(''),
      website: new FormControl(''),
      active: new FormControl(false),
      isCustomer: new FormControl(true),
      isSupplier: new FormControl(false),
      priceList: new FormControl(''),
      defaultDiscountByPercent: new FormControl(0),
      defaultDiscountByMoney: new FormControl(0),
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
  cancel() {
    this.modal.destroy(null);
  }
  save() {
    this.submitAddPartner()
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
}
