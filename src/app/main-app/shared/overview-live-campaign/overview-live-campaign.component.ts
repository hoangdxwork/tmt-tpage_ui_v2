import { finalize } from 'rxjs/operators';
import { OnChanges, SimpleChanges } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { SaleOnline_LiveCampaignDTO } from '../../dto/live-campaign/live-campaign.dto';
import { LiveCampaignService } from '../../services/live-campaign.service';
import { TDSModalRef } from 'tds-ui/modal';

@Component({
  selector: 'overview-live-campaign',
  templateUrl: './overview-live-campaign.component.html'
})
export class OverviewLiveCampaignComponent implements OnInit {

  @Input() id!: string;

  data!: SaleOnline_LiveCampaignDTO;
  isLoading: boolean = false;

  constructor(
    private modelRef: TDSModalRef,
    private liveCampaignService: LiveCampaignService
  ) { }

  ngOnInit(): void {
    this.loadData(this.id);
  }

  loadData(id: string) {
    this.isLoading = true;
    this.liveCampaignService.getDetailById(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.data = res;
      });
  }

  onCannel() {
    this.modelRef.destroy(null);
  }

}
