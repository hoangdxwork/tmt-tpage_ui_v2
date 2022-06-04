import { finalize } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { addDays } from 'date-fns';
import { TDSSafeAny } from 'tmt-tang-ui';
import { ReportLiveCampaignOverviewDTO, SearchReportLiveCampaignOverviewDTO } from 'src/app/main-app/dto/live-campaign/live-campaign.dto';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { ODataModelDTO } from 'src/app/main-app/dto/odata/odata.dto';
import { SummaryFacade } from 'src/app/main-app/services/facades/summary.facede';
import { SummaryFilterDTO } from 'src/app/main-app/dto/dashboard/summary-overview.dto';

@Component({
  selector: 'live-campaign',
  templateUrl: './live-campaign.component.html',
})
export class LiveCampaignComponent implements OnInit {

  public filterObj: SearchReportLiveCampaignOverviewDTO = {
    Ids: [],
    Text: '',
    StartDate: addDays(new Date(), -6),
    EndDate: new Date(),
  }

  expandSet = new Set<number>();

  currentSelectReport!: string;
  dropdownList: SummaryFilterDTO[] = [];

  dataReport!: ReportLiveCampaignOverviewDTO;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private summaryFacade: SummaryFacade,
    private liveCampaignService: LiveCampaignService
  ) { }

  ngOnInit(): void {
    this.loadDropdownList();
    this.getReportLiveCampaignOverview();
  }

  loadDropdownList() {
    this.dropdownList = this.summaryFacade.getMultipleFilter();
    this.currentSelectReport = this.dropdownList[0].name;
  }

  getReportLiveCampaignOverview() {
    let model: ODataModelDTO<SearchReportLiveCampaignOverviewDTO> = {model: this.filterObj};

    this.isLoading = true;
    this.liveCampaignService.getReportLiveCampaignOverview(model)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.dataReport = res;
      });
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  onCreate() {
    this.router.navigateByUrl(`live-campaign/create`);
  }

  selectDateReport(startDate: Date, endDate: Date, name: string) {
    this.filterObj.StartDate = startDate;
    this.filterObj.EndDate = endDate;
    this.currentSelectReport = name;

    this.getReportLiveCampaignOverview();
  }

}
