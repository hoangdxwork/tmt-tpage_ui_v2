import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { CRMMatchingService } from 'src/app/main-app/services/crm-matching.service';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, finalize } from 'rxjs';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { SummaryFacade } from 'src/app/main-app/services/facades/summary.facede';
import { SummaryFilterDTO } from 'src/app/main-app/dto/dashboard/summary-overview.dto';
import { ConversationSummaryByTagDTO } from 'src/app/main-app/dto/conversation/conversation.dto';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-dashboard-tag-report',
  templateUrl: './dashboard-tag-report.component.html'
})
export class DashboardTagReportComponent implements OnInit, OnDestroy {
//#region variable

  tableData:Array<TDSSafeAny> = [];
  emptyData = false;
  isLoading: boolean = false;
  //#endregion

  private destroy$ = new Subject<void>();
  currentTeam!: CRMTeamDTO | null;

  lstDataTagReport: ConversationSummaryByTagDTO[] = [];

  constructor(
    private summaryFacade: SummaryFacade,
    private crmTeamService: CRMTeamService,
    private crmMatchingService: CRMMatchingService
  ) { }

  ngOnInit(): void {
    this.loadCurrentTeam();
  }

  loadCurrentTeam() {
    this.crmTeamService.onChangeTeam().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.currentTeam = res;
      this.loadSummaryByTags(this.currentTeam?.Facebook_PageId);
    });
  }

  loadSummaryByTags(pageId: string | undefined) {
    this.isLoading = true
    let startDate = new Date('2000').toISOString();
    let endDate =  new Date().toISOString();

    this.crmMatchingService.getSummaryByTags(pageId || '', startDate, endDate).pipe(finalize(()=>{this.isLoading = false})).subscribe(res => {
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
    this.loadSummaryByTags(this.currentTeam?.Facebook_PageId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
