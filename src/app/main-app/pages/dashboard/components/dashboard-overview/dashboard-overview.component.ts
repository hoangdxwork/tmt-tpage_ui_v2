import { TDSMessageService } from 'tds-ui/message';
import { takeUntil } from 'rxjs/operators';
import { TDSDestroyService } from 'tds-ui/core/services';
import { Component, OnInit } from '@angular/core';
import { ReportFacebookService } from 'src/app/main-app/services/report-facebook.service';
import { EventSummaryDTO, InputSummaryOverviewDTO, ReportSummaryOverviewResponseDTO, } from 'src/app/main-app/dto/dashboard/summary-overview.dto';
import { CommonHandler, TDSDateRangeDTO } from 'src/app/main-app/handler-v2/common.handler';

@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  providers: [TDSDestroyService]
})

export class DashboardOverviewComponent implements OnInit {

  currentDateRanges!: TDSDateRangeDTO;
  tdsDateRanges: TDSDateRangeDTO[] = [];

  emptyData = false;
  isLoading = false;
  dataSummaryOverview!: EventSummaryDTO;

  constructor(private reportFacebookService: ReportFacebookService,
    private commonHandler: CommonHandler,
    private destroy$: TDSDestroyService,
    private message: TDSMessageService) {
    this.tdsDateRanges = this.commonHandler.tdsDateRanges;
    this.currentDateRanges = this.commonHandler.currentDateRanges;
  }

  ngOnInit(): void {
    this.loadData();
  }

  // loadData(){
  //   let model = {} as InputSummaryOverviewDTO;

  //   model.PageId = undefined;
  //   model.DateStart = this.currentDateRanges.startDate;
  //   model.DateEnd = this.currentDateRanges.endDate;
  //   this.isLoading = true;

  //   this.reportFacebookService.getSummaryOverview(model).pipe(takeUntil(this.destroy$)).subscribe({
  //     next:(res) => {
  //       this.dataSummaryOverview = {...res};
  //       this.isLoading = false;
  //     },
  //     error:(err) => {
  //       this.emptyData = true;
  //       this.isLoading = false;
  //       this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
  //     }
  //   });
  // }

  loadData() {
    this.isLoading = true;

    this.reportFacebookService.getEventSummary(this.currentDateRanges.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.dataSummaryOverview = { ...res };
        this.isLoading = false;
      },
      error: (err) => {
        this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
      }
    });
  }

  onChangeFilter(data: any) {
    this.currentDateRanges = { ...data };
    this.loadData();
  }
}
