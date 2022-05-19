import { OnDestroy } from '@angular/core';
import { TDSSafeAny } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';
import { CRMMatchingService } from 'src/app/main-app/services/crm-matching.service';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { SummaryFacade } from 'src/app/main-app/services/facades/summary.facede';
import { SummaryFilterDTO } from 'src/app/main-app/dto/dashboard/summary-overview.dto';
import { ConversationSummaryByTagDTO } from 'src/app/main-app/dto/conversation/conversation.dto';

@Component({
  selector: 'app-dashboard-tag-report',
  templateUrl: './dashboard-tag-report.component.html',
  styleUrls: ['./dashboard-tag-report.component.scss']
})
export class DashboardTagReportComponent implements OnInit, OnDestroy {
//#region variable
  // filterList= [
  //   {id:1, name:'Tuần này'},
  //   {id:2, name:'Tháng này'}
  // ]
  // currentFilter = this.filterList[0].name;
  tableData:Array<TDSSafeAny> = [];
  emptyData = false;
  //#endregion

  currentFilter!: SummaryFilterDTO;
  filterList: SummaryFilterDTO[] = [];

  private destroy$ = new Subject<void>();
  currentTeam!: CRMTeamDTO | null;

  lstDataTagReport: ConversationSummaryByTagDTO[] = [];

  constructor(
    private summaryFacade: SummaryFacade,
    private crmTeamService: CRMTeamService,
    private crmMatchingService: CRMMatchingService
  ) { }

  ngOnInit(): void {
    this.loadFilter();
    this.loadCurrentTeam();
  }

  loadFilter() {
    this.filterList = this.summaryFacade.getFilter();
    this.currentFilter = this.filterList[0];
  }

  loadCurrentTeam() {
    this.crmTeamService.onChangeTeam().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.currentTeam = res;
      this.loadSummaryByTags(this.currentTeam?.Facebook_PageId);
    });
  }

  loadSummaryByTags(pageId: string | undefined) {
    let startDate = this.currentFilter.startDate.toISOString();
    let endDate = this.currentFilter.endDate.toISOString();

    this.crmMatchingService.getSummaryByTags(pageId || '', startDate, endDate).subscribe(res => {
      this.lstDataTagReport = res;
    }, error => this.emptyData = true);
  }

  loadData(){
    this.tableData = [
      {
        id:1,
        tagName:'Bom hàng',
        position:1,
        numberOfTag:60,
        rateOfAppearance:20,
        color:'#EB3B5B',
        decrease:false
      },
      {
        id:2,
        tagName:'Đang vận chuyển',
        position:2,
        numberOfTag:48,
        rateOfAppearance:20,
        color:'#2395FF'
      },
      {
        id:3,
        tagName:'Hoàn thành',
        position:3,
        numberOfTag:40,
        rateOfAppearance:20,
        color:'#28A745'
      },
      {
        id:4,
        tagName:'Khách hẹn',
        position:4,
        numberOfTag:32,
        rateOfAppearance:20,
        color:'#FFC107'
      },
      {
        id:5,
        tagName:'Khách nguy cơ bom hàng',
        position:5,
        numberOfTag:26,
        rateOfAppearance:20,
        color:'#FF8900'
      }
    ];

    // if(this.tableData.length == 0){
    //   this.emptyData = true;
    // }
  }

  onChangeFilter(data:any){
    this.currentFilter = data;
    this.loadSummaryByTags(this.currentTeam?.Facebook_PageId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
