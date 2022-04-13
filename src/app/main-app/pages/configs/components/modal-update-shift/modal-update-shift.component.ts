import { TDSModalRef } from 'tmt-tang-ui';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal-update-shift',
  templateUrl: './modal-update-shift.component.html',
  styleUrls: ['./modal-update-shift.component.scss']
})
export class ModalUpdateShiftComponent implements OnInit {

  @Input() shiftId!: number 
  isLoading = false
  formAddShift!: FormGroup
  constructor(
    private fb: FormBuilder,
    private modal: TDSModalRef,
  ) {
    this.loadForm()
   }

  ngOnInit(): void {
    
  }

  loadForm(){
    this.isLoading= true
    this.formAddShift = this.fb.group({
      name: new FormControl(''),
      timeStart: new FormControl(null),
      timeEnd: new FormControl(null),
    })
    this.isLoading= false
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
