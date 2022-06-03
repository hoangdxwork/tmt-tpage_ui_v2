import { TDSModalRef } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-add-quick-reply',
  templateUrl: './modal-add-quick-reply.component.html',
  styleUrls: ['./modal-add-quick-reply.component.scss']
})
export class ModalAddQuickReplyComponent implements OnInit {

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
