import { Component, Input, OnInit } from '@angular/core';
import { ViewReportFastSaleOrderLiveCampaignDTO } from 'src/app/main-app/dto/live-campaign/live-campaign.dto';

@Component({
  selector: 'modal-live-campaign-bill',
  templateUrl: './modal-live-campaign-bill.component.html'
})
export class ModalLiveCampaignBillComponent implements OnInit {

  @Input() data: ViewReportFastSaleOrderLiveCampaignDTO[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
