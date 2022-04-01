import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { TDSModalRef, TDSSafeAny } from 'tmt-tang-ui';

@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.scss']
})
export class AddPageComponent implements OnInit { 
  @Input() data: TDSSafeAny;
  form = {
    fullname:"Nguyễn Thành Công",
    page: 'Mèo nhạt nhẽo',
    name: '',
  };

  constructor(private modal: TDSModalRef) { }

  ngOnInit(): void {
  }


  onSubmit(form: NgForm): void {
    console.log(form);
    form.resetForm();
  }

  cancel() {
    this.modal.destroy(null);
  }
}
