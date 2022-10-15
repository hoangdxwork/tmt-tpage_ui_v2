import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: 'detail-order-livecampaign',
  templateUrl: './detail-order-livecampaign.component.html',
})

export class DetailOrderLiveCampaignComponent implements OnInit {

  @Input() liveCampaignId!: string;

  currentTab: number = 0;
  isLoading: boolean = false;

  constructor( ) { }

  ngOnInit(): void {
  }

  selectedIndexChange(event: number) {
    this.currentTab = event;
  }


}
