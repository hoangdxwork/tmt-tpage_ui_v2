import { Component, OnInit } from '@angular/core';
import { TDSModalRef } from 'tds-ui/modal';

@Component({
  selector: 'app-modal-confirm-shipping-address',
  templateUrl: './modal-confirm-shipping-address.component.html',
  styleUrls: ['./modal-confirm-shipping-address.component.scss']
})
export class ModalConfirmShippingAddressComponent implements OnInit {

  listCity = [];
  listDistrict = [];
  listWard = [];
  constructor(
    private modal: TDSModalRef,
  ) { }

  ngOnInit(): void {
  }

  cancel(){
    this.modal.destroy(null)
  }

  onSave(){

  }
}
