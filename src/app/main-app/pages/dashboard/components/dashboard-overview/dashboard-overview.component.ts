import { TDSSafeAny } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';
import { ReportFacebookService } from 'src/app/main-app/services/report-facebook.service';
import { addDays, endOfMonth, endOfWeek, startOfMonth, startOfWeek } from 'date-fns';
import { InputSummaryOverviewDTO, ReportSummaryOverviewResponseDTO } from 'src/app/main-app/dto/dashboard/summary-overview.dto';

@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss']
})
export class DashboardOverviewComponent implements OnInit {
  filterList= [
    {id:1, name:'Tuần này', startDate: addDays(new Date(), -7), endDate: new Date()},
    {id:2, name:'Tháng này', startDate: addDays(new Date(), -30), endDate: new Date()}
  ];

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

  currentFilter = this.filterList[0];
  emptyData = false;

  dataSummaryOverview!: ReportSummaryOverviewResponseDTO;

  constructor(
    private reportFacebookService: ReportFacebookService
  ) { }

  ngOnInit(): void {
    this.updateFilter();
    this.loadData();
  }

  updateFilter() {
    let dateNow = new Date();

    let startOFWeek = startOfWeek(dateNow, { weekStartsOn: 1 });
    let endOFWeek = endOfWeek(dateNow, { weekStartsOn: 1 });

    this.filterList[0].startDate = startOFWeek;
    this.filterList[0].endDate = endOFWeek;

    let startOFMonth = startOfMonth(dateNow);
    let endOFMonth = endOfMonth(dateNow);

    this.filterList[1].startDate = startOFMonth;
    this.filterList[1].endDate = endOFMonth;
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
