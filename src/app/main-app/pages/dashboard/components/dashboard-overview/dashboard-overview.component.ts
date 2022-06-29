import { SummaryFacade } from 'src/app/main-app/services/facades/summary.facede';
import { Component, OnInit } from '@angular/core';
import { ReportFacebookService } from 'src/app/main-app/services/report-facebook.service';
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek, startOfYesterday, endOfYesterday, subDays, subMonths } from 'date-fns';
import { InputSummaryOverviewDTO, ReportSummaryOverviewResponseDTO, SummaryFilterDTO } from 'src/app/main-app/dto/dashboard/summary-overview.dto';

@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html'
})
export class DashboardOverviewComponent implements OnInit {
  filterList!: SummaryFilterDTO[];

  labelData = [
    {
      value:25,
      percent:20,
      decrease:false
    },
    {
      value:140000,
      percent:20
    },
    {
      value:25,
      percent:20
    },
    {
      value:3,
      percent:20
    }
  ];

  currentFilter!: SummaryFilterDTO;
  emptyData = false;

  dataSummaryOverview!: ReportSummaryOverviewResponseDTO;

  constructor(
    private reportFacebookService: ReportFacebookService,
    private summaryFacade: SummaryFacade,
  ) { }

  ngOnInit(): void {
    this.loadFilter();
    this.loadData();
  }

  loadFilter() {
    this.filterList = this.summaryFacade.getMultipleFilter();
    this.currentFilter = this.filterList[4];
  }

  loadData(){
    let model = {} as InputSummaryOverviewDTO;

    model.PageId = undefined;
    model.DateStart = this.currentFilter.startDate;
    model.DateEnd = this.currentFilter.endDate;

    this.reportFacebookService.getSummaryOverview(model).subscribe(res => {
      this.dataSummaryOverview = res;
    }, error => {
      this.emptyData = true;
    });
  }

  onChangeFilter(data:any){
    this.currentFilter = data;
    this.loadData();
  }
}
