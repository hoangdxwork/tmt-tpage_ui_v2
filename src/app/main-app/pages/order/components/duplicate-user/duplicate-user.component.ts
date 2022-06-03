import { Component, OnInit } from '@angular/core';
import { TDSModalRef } from 'tmt-tang-ui';

@Component({
  selector: 'duplicate-user',
  templateUrl: './duplicate-user.component.html'
})
export class DuplicateUserComponent implements OnInit {

  constructor(
    private modal: TDSModalRef,
  ) { }

  ngOnInit(): void {
  }

  onSave() {

  }

  onCancel() {
    this.modal.close();
  }

}
