import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'detail-order',
  templateUrl: './detail-order.component.html'
})
export class DetailOrderComponent implements OnInit {

  @Input() liveCampaignId!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
