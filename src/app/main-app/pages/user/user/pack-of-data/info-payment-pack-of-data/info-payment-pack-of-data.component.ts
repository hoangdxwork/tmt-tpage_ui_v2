import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-info-payment-pack-of-data',
  templateUrl: './info-payment-pack-of-data.component.html',
  styleUrls: ['./info-payment-pack-of-data.component.scss']
})
export class InfoPaymentPackOfDataComponent implements OnInit {

  @Output() outputBackPageExtendData = new EventEmitter<boolean>()
  isPaymentInfoData=true
  isNextPaymentQR = false
  constructor() { }

  ngOnInit(): void {
  }

  clickBackPageExtendData(){
    this.outputBackPageExtendData.emit(true)
  }
  clickNextPaymentQR(){
    this.isPaymentInfoData = false
    this.isNextPaymentQR = true
  }
  clickBackPageInfoPaymentData(){
    this.isPaymentInfoData = true
    this.isNextPaymentQR = false
  }
}
