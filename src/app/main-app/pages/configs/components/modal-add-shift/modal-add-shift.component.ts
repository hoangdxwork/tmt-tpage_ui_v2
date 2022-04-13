import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TDSModalRef } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-add-shift',
  templateUrl: './modal-add-shift.component.html',
  styleUrls: ['./modal-add-shift.component.scss']
})
export class ModalAddShiftComponent implements OnInit {

  formAddShift!: FormGroup
  constructor(
    private fb: FormBuilder,
    private modal: TDSModalRef,
  ) { }

  ngOnInit(): void {
    this.formAddShift = this.fb.group({
      name: new FormControl(''),
      timeStart: new FormControl(null),
      timeEnd: new FormControl(null),

    })
  }
  onSubmitAddShift(){
    this.modal.destroy(this.formAddShift);
  }
  cancel() {
    this.modal.destroy(null);
}

  save() {
      this.onSubmitAddShift();
  }

}
