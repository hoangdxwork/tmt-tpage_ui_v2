import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { TDSModalRef } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-payment',
  templateUrl: './modal-payment.component.html',
  styleUrls: ['./modal-payment.component.scss']
})
export class ModalPaymentComponent implements OnInit {

  formPayment !: FormGroup
  price = 100000
  numberWithCommas = (value: number ) => `${value }`;
    public listData = [
        { id: 1, name: 'Tiền mặt' },
        { id: 2, name: 'Visa' },
        { id: 3, name: 'paypal' },
        { id: 4, name: 'Naspas' },
    ]
  constructor(    private modal: TDSModalRef,
    private fb: FormBuilder,
    ) { }

  ngOnInit(): void {
    this.formPayment = this.fb.group({
      methodPayment : new FormControl(1),
      price: new FormControl(100000),
      datePayment: new FormControl(new Date()),
      content: new FormControl('')
    })
  }
  cancel() {
    this.modal.destroy(null);
  }
  submitPayment(){
    console.log(this.formPayment)
  }
  payment() {
    this.submitPayment()
    this.modal.destroy(true);
  }
  paymentAndPrint(){
    this.modal.destroy(null);

  }


}
