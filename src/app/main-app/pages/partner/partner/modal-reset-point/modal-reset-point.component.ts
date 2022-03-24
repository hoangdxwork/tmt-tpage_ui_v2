import { TDSModalRef } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-reset-point',
  templateUrl: './modal-reset-point.component.html',
  styleUrls: ['./modal-reset-point.component.scss']
})
export class ModalResetPointComponent implements OnInit {


  constructor(    private modal: TDSModalRef,
    ) { }

  ngOnInit(): void {
  }
  cancel() {
    this.modal.destroy(null);
  }
  save() {
    this.modal.destroy(null);
  }
}
