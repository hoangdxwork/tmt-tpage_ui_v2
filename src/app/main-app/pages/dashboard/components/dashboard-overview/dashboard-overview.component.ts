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
  data!: EventSummaryDTO;

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

  loadData() {
    this.isLoading = true;

    this.reportFacebookService.getEventSummary(this.currentDateRanges.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.data = { ...res };
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

  onCalcPercent(data: EventSummaryDTO, type: string) {
    let percent: number = 0;
    if(!data) {
      return percent;
    }
   
    switch(type) {
      case 'Conversation':
            percent = data.Previous.Conversation != 0 ? ((data.Current.Conversation - data.Previous.Conversation)/ data.Previous.Conversation) * 100 : data.Current.Conversation*100;
        break;
      case 'Partner':
            percent = data.Previous.Partner != 0 ? ((data.Current.Partner - data.Previous.Partner)/ data.Previous.Partner) * 100 : data.Current.Partner*100;
        break;
      case 'FastSaleOrder':
            percent = data.Previous.FastSaleOrder != 0 ? ((data.Current.FastSaleOrder - data.Previous.FastSaleOrder)/ data.Previous.FastSaleOrder) * 100 : data.Current.FastSaleOrder*100;
        break;
      case 'SaleOnlineOrder':
            percent = data.Previous.SaleOnlineOrder != 0 ? ((data.Current.SaleOnlineOrder - data.Previous.SaleOnlineOrder)/ data.Previous.SaleOnlineOrder) * 100 : data.Current.SaleOnlineOrder*100;
        break;
    }

    return percent;
  }
}
