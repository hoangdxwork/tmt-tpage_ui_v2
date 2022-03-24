import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TDSModalRef } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-convert-partner',
  templateUrl: './modal-convert-partner.component.html',
  styleUrls: ['./modal-convert-partner.component.scss']
})
export class ModalConvertPartnerComponent implements OnInit {

  formConvertPartner!: FormGroup
  public contactOptions = [
    { id: 1, name: 'Elton John' },
    { id: 2, name: 'Elvis Presley' },
    { id: 3, name: 'Paul McCartney' },
    { id: 4, name: 'Elton John' },
    { id: 5, name: 'Elvis Presley' },
    { id: 6, name: 'Paul McCartney' },
]
  constructor(    
    private modal: TDSModalRef,
    private fb : FormBuilder
    ) { }

  ngOnInit(): void {
    this.formConvertPartner = this.fb.group({
      partnerSource: new FormControl(''),
      partnerDestination : new FormControl('')
    })
  }
  cancel() {
    this.modal.destroy(null);
  }
  save() {
    this.modal.destroy(this.submitConvert());
   
  }
  submitConvert(){
    
  }
}
