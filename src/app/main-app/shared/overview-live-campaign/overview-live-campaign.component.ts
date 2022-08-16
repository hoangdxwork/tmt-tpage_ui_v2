import { ReportLiveCampaignDTO } from './../../dto/live-campaign/report-livecampain-overview.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { Component, Input, OnInit } from '@angular/core';
import { TDSModalRef } from 'tds-ui/modal';

@Component({
  selector: 'overview-live-campaign',
  templateUrl: './overview-live-campaign.component.html',
  providers : [TDSDestroyService]
})

export class OverviewLiveCampaignComponent implements OnInit {

  @Input() lstOfData!: ReportLiveCampaignDTO;
  @Input() liveCampaignId!: string;

  isLoading: boolean = false;
  indClickStatus:string = '';
  currentQuantity:number = 0;

  constructor(private modelRef: TDSModalRef) { }

  ngOnInit(): void {}

  onCannel() {
    this.modelRef.destroy(null);
  }
}
