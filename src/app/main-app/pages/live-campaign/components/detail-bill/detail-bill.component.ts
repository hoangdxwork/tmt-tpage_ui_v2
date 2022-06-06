import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'detail-bill',
  templateUrl: './detail-bill.component.html'
})
export class DetailBillComponent implements OnInit {

  @Input() liveCampaignId!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
