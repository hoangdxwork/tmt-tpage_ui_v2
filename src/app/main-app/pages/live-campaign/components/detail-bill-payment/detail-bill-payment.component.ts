import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'detail-bill-payment',
  templateUrl: './detail-bill-payment.component.html'
})
export class DetailBillPaymentComponent implements OnInit {

  @Input() liveCampaignId!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
