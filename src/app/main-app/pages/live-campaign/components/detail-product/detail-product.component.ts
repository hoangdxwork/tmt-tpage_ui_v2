import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'detail-product',
  templateUrl: './detail-product.component.html'
})
export class DetailProductComponent implements OnInit {

  @Input() liveCampaignId!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
