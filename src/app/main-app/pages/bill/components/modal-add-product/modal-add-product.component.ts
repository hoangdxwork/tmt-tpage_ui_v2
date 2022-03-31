import { FormBuilder, FormGroup } from '@angular/forms';
import { TDSModalRef } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-add-product',
  templateUrl: './modal-add-product.component.html',
})
export class ModalAddProductComponent implements OnInit {

  // select loai san pham
  optionsProduct = [
    { id: 1, name: 'loai 1' },
    { id: 2, name: 'loai 2' }
  ]

  formProduct!: FormGroup
  constructor(private fb: FormBuilder,
    private modal: TDSModalRef) { }

  ngOnInit(): void {

  }

  cancel() {
    this.modal.destroy(null);
}

  save() {
  }
}
