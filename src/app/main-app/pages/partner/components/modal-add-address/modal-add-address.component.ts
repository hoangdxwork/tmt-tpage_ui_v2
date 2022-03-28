import { TDSModalRef } from 'tmt-tang-ui';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-add-address',
  templateUrl: './modal-add-address.component.html',
  styleUrls: ['./modal-add-address.component.scss']
})
export class ModalAddAddressComponent implements OnInit {

  formAddAddress!: FormGroup
  dataAddress = [
    { id: 1, value: 'status 1' },
    { id: 2, value: 'status 2' },
  ]
  constructor( private fb: FormBuilder,
    private modal: TDSModalRef) { }

  ngOnInit(): void {
    this.formAddAddress = this.fb.group({
      numberStreet: new FormControl(''),
      province: new FormControl(''),
      district: new FormControl(''),
      wards: new FormControl(''),

    })
  }
  submitAddress(){
    if (!this.formAddAddress.invalid) {
      this.modal.destroy(this.formAddAddress.value);
  }
  }

cancel() {
    this.modal.destroy(null);
}

save() {
}
}
