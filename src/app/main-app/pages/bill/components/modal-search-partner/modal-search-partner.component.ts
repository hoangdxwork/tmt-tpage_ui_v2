import { FormBuilder } from '@angular/forms';
import { TDSModalRef } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';

export interface dataPartner {
  id: number;
  name: string;
  phone: string;
  address: string;
  facebook: string;
  createdDate: string;
}

@Component({
  selector: 'app-modal-search-partner',
  templateUrl: './modal-search-partner.component.html',
})
export class ModalSearchPartnerComponent implements OnInit {

  listPartner!: dataPartner[]
  inputsearch : string = '';
  constructor(private fb: FormBuilder,
    private modal: TDSModalRef) { }

  ngOnInit(): void {
    this.listPartner = new Array(60).fill(0).map((_, index) => ({
      id: index,
      name: `[A${index}] Diễm Mi`,
      phone: '09355213147',
      address: 'Ấp Long Phú, Xã Phước Thái, Huyện Long Thành, Tỉnh Đồng Nai',
      facebook: 'fb.com/151839215125',
      createdDate: '20/2/2002  16:20'
  }));
  }

  cancel() {
    this.modal.destroy(null);
}

  save() {
  }
}
