import { ReportLiveCampaignDetailDTO } from './../../../../dto/live-campaign/report-livecampain-overview.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { finalize, takeUntil } from 'rxjs/operators';
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
  lstDetails: ReportLiveCampaignDetailDTO[] = [];
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
    this.liveCampaignService.getReport(id)
      .pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.data = res;
        this.lstDetails = [...res?.Details];
      }, error => {
        this.message.error(error.error ? error.error.message : 'Tải dữ liệu thất bại')
      })
  }

  loadLiveCampaign(id: string) {
    this.isLoading = true;
    this.liveCampaignService.getDetailById(id)
      .pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.dataLiveCampaign = res;
      }, error => {
        this.message.error(error.error ? error.error.message : 'Tải dữ liệu thất bại')
      });
  }
}
