import { TDSMessageService } from 'tds-ui/message';
import { CommonHandler, TDSDateRangeDTO } from 'src/app/main-app/handler-v2/common.handler';
import { EventSummaryService } from './../../../../services/event-summary.service';
import { SummaryTagDTO } from './../../../../dto/dashboard/summary-daily.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-dashboard-tag-report',
  templateUrl: './dashboard-tag-report.component.html',
  providers: [TDSDestroyService]
})
export class DashboardTagReportComponent implements OnInit {
  tableData: Array<TDSSafeAny> = [];
  emptyData = false;
  isLoading: boolean = false;
  dataModel: SummaryTagDTO[] = [];
  currentDateRanges!: TDSDateRangeDTO;
  tdsDateRanges: TDSDateRangeDTO[] = [];

  constructor(private commonHandler: CommonHandler,
    private eventSummaryService: EventSummaryService,
    private message: TDSMessageService,
    private destroy$: TDSDestroyService) { 
      this.tdsDateRanges = this.commonHandler.tdsDateRanges;
      this.currentDateRanges = this.commonHandler.currentDateRanges;
    }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    let day = this.currentDateRanges?.id || 0;

    this.eventSummaryService.getSummaryByTags(day).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res) => {
        this.dataModel = [...res];
        this.isLoading = false;
        this.emptyData = false;
      }, 
      error:(err) => {
        this.isLoading = false;
        this.emptyData = true;
        this.message.error(err?.error?.message || 'Tải dữ liệu nhãn hội thoại bị lỗi');
      }
    });
  }

  onChangeFilter(data:any){
    this.loadData();
  }
}
