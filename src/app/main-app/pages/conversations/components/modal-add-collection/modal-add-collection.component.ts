import { TDSModalRef } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'modal-add-collection',
  templateUrl: './modal-add-collection.component.html'
})
export class ModalAddCollectionComponent implements OnInit {

  constructor(
    private modalRef: TDSModalRef
  ) { }

  ngOnInit(): void {
  }

  onCancel() {
    this.modalRef.destroy(null);
  }

}
