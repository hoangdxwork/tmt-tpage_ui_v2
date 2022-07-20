import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { ReportLiveCampaignOverviewDTO } from 'src/app/main-app/dto/live-campaign/report-livecampain-overview.dto';
import { TDSMessageService } from 'tds-ui/message';
import { Subject, takeUntil, finalize } from 'rxjs';
import { CommonHandler, TDSDateRangeDTO } from 'src/app/main-app/services/handlers/common.handler';
import { ODataLiveCampaignService } from 'src/app/main-app/services/mock-odata/odata-live-campaign.service';

@Component({
  selector: 'live-campaign',
  templateUrl: './live-campaign.component.html',
})

export class LiveCampaignComponent implements OnInit {

  currentDateRanges!: TDSDateRangeDTO;
  tdsDateRanges: TDSDateRangeDTO[] = [];

  dataReports!: ReportLiveCampaignOverviewDTO;
  private destroy$ = new Subject<void>();

  overviewModel: any = {
    Ids: [],
    Text: '',
    StartDate: null,
    EndDate: null,
  }

  isLoadingReport: boolean = false;

  constructor(private router: Router,
    private message: TDSMessageService,
    private commonHandler: CommonHandler,
    private liveCampaignService: LiveCampaignService) {

      this.tdsDateRanges = this.commonHandler.tdsDateRanges;
      this.currentDateRanges = this.commonHandler.currentDateRanges;
  }

  ngOnInit(): void {
    this.loadReportLiveCampaignOverview();
  }

  loadReportLiveCampaignOverview() {
    if(!this.overviewModel.StartDate && !this.overviewModel.EndDate) {
      this.overviewModel.StartDate = this.currentDateRanges.startDate;
      this.overviewModel.EndDate = this.currentDateRanges.endDate;
    }

    let model = this.overviewModel;

    this.isLoadingReport = true;
    this.liveCampaignService.getReportLiveCampaignOverview({ model: model })
      .pipe(takeUntil(this.destroy$), finalize(() => this.isLoadingReport = false)).subscribe(res => {
          if(res) {
            delete res['@odata.context'];
            this.dataReports = { ...res };
          }
      }, error => {
          this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi')
      })
  }

  onCreate() {
    this.router.navigateByUrl(`live-campaign/create`);
  }

  onChangeFilter(item: any) {
    this.currentDateRanges = item;

    this.overviewModel.StartDate = item.StartDate;
    this.overviewModel.EndDate = item.EndDate;

    this.loadReportLiveCampaignOverview();
  }

}
