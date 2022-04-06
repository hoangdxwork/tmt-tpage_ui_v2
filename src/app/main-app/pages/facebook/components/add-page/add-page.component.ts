import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TDSModalRef, TDSSafeAny } from 'tmt-tang-ui';

@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.scss']
})
export class AddPageComponent implements OnInit { 
  @Input() data: TDSSafeAny; 

  addPageForm!: FormGroup;

  constructor(private modal: TDSModalRef , private fb: FormBuilder ) {
    this.addPageForm = this.fb.group({
      fullname :[{value: 'Nguyễn Thành Công', disabled: true}, Validators.required],
      page : [{value: 'Mèo nhạt nhẽo', disabled: true}, Validators.required],
      name:['' , Validators.required],
    })
   }

  ngOnInit(): void { 
    
  }

  onSubmit(): void {
    console.log(this.addPageForm);
    this.modal.destroy(null);
  }

  cancel() {
    this.modal.destroy(null);
  }
}
