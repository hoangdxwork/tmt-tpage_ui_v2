import { TDSModalRef } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-list-product',
  templateUrl: './modal-list-product.component.html',
  styleUrls: ['./modal-list-product.component.scss']
})
export class ModalListProductComponent implements OnInit {

  listOfData = ['']
  constructor(
    private modal: TDSModalRef
  ) { }

  ngOnInit(): void {
  }

  cancel(){
    this.modal.destroy(null)
  }

}
