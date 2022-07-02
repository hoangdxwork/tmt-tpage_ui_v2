import { Component, OnInit } from '@angular/core';
import { TDSModalRef } from 'tds-ui/modal';

@Component({
  selector: 'app-modal-post',
  templateUrl: './modal-post.component.html',
})
export class ModalPostComponent implements OnInit {

  constructor(
    private modal: TDSModalRef,
  ) { }

  ngOnInit(): void {
  }

  cancel(){
    this.modal.destroy(null);
  }
}
