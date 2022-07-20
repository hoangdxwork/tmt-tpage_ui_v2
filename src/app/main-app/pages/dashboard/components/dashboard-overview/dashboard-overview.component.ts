import { Component, OnInit } from '@angular/core';
import { ReportFacebookService } from 'src/app/main-app/services/report-facebook.service';
import { InputSummaryOverviewDTO, ReportSummaryOverviewResponseDTO,  } from 'src/app/main-app/dto/dashboard/summary-overview.dto';
import { CommonHandler, TDSDateRangeDTO } from 'src/app/main-app/services/handlers/common.handler';

@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html'
})

export class DashboardOverviewComponent implements OnInit {

  labelData = [
    { value: 25,  percent: 20, decrease: false },
    { value: 140000,  percent: 20 },
    { value: 25, percent: 20 },
    { value: 3, percent: 20 }
  ];

  currentDateRanges!: TDSDateRangeDTO;
  tdsDateRanges: TDSDateRangeDTO[] = [];

  emptyData = false;
  dataSummaryOverview!: ReportSummaryOverviewResponseDTO;

  constructor(private reportFacebookService: ReportFacebookService,
    private commonHandler: CommonHandler) {
      this.tdsDateRanges = this.commonHandler.tdsDateRanges;
      this.currentDateRanges = this.commonHandler.currentDateRanges;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    let model = {} as InputSummaryOverviewDTO;

    model.PageId = undefined;
    model.DateStart = this.currentDateRanges.startDate;
    model.DateEnd = this.currentDateRanges.endDate;

    this.reportFacebookService.getSummaryOverview(model).subscribe(res => {
      this.dataSummaryOverview = res;
    }, error => {
      this.emptyData = true;
    });
  }

  onChangeFilter(data:any){
    this.currentDateRanges = data;

    this.loadData();
  }
}
