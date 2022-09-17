import { TDSDestroyService } from 'tds-ui/core/services';
import { takeUntil } from 'rxjs/operators';
import { LiveCampaignService } from './../../../../services/live-campaign.service';
import { Component, Input, OnInit } from '@angular/core';
import { TDSMessageService } from 'tds-ui/message';

@Component({
  selector: 'detail-report',
  templateUrl: './detail-report.component.html',
  providers: [TDSDestroyService]
})
export class DetailReportComponent implements OnInit {

  @Input() liveCampaignId!: string;

  isLoading: boolean = false;
  data!: any;
  dataLiveCampaign!: any;

  constructor(private liveCampaignService: LiveCampaignService,
    private destroy$: TDSDestroyService,
    private message: TDSMessageService
  ) { }

  ngOnInit(): void {
    this.loadReportLiveCampaign(this.liveCampaignId);
    this.loadLiveCampaign(this.liveCampaignId);
  }

  loadReportLiveCampaign(id: string) {
    this.isLoading = true;
    this.liveCampaignService.getReport(id).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res) => {
          this.data = {...res};
          this.isLoading = false;
        }, 
        error:(err) => {
          this.isLoading = false;
          this.message.error(err?.error?.message || 'Tải dữ liệu thất bại');
        }
      })
  }

  loadLiveCampaign(id: string) {
    this.isLoading = true;
    this.liveCampaignService.getDetailById(id).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res) => {
          this.dataLiveCampaign = res;
          this.isLoading = false;
        }, 
        error:(err) => {
          this.isLoading = false;
          this.message.error(err?.error?.message || 'Tải dữ liệu thất bại');
        }
      });
  }
}
