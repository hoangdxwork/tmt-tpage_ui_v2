import { Component, OnInit } from '@angular/core';
import { TDSModalRef } from 'tds-ui/modal';

@Component({
  selector: 'app-modal-confirm-payment',
  templateUrl: './modal-confirm-payment.component.html',
  styleUrls: ['./modal-confirm-payment.component.scss']
})
export class ModalConfirmPaymentComponent implements OnInit {

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
  ) { }

  ngOnInit(): void {
  }

  cancel(){
    this.modal.destroy(null)
  }

  onSave(){

  }

}
