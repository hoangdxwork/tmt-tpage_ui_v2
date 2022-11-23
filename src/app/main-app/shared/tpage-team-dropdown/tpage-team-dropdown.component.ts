import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { Component, EventEmitter, Host, Input, OnDestroy, OnInit, Optional, Output } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { TDSHeaderComponent } from 'tds-ui/header';
import { TDSHelperObject } from 'tds-ui/shared/utility';
import { CRMTeamDTO } from '../../dto/team/team.dto';
import { CRMTeamService } from '../../services/crm-team.service';

@Component({
  selector: 'tpage-team-dropdown',
  templateUrl: './tpage-team-dropdown.component.html'
})

export class TpageTeamDropdownComponent implements OnInit, OnDestroy {

  data$!: Observable<Array<CRMTeamDTO> | null>;
  currentTeam!: CRMTeamDTO | null;
  visible = false;

  private destroy$ = new Subject<void>();

  @Output() readonly tdsClickItem = new EventEmitter<CRMTeamDTO>();
  @Output() isRefresh = new EventEmitter<boolean>();
  @Input() isRefreshing!: boolean

  constructor(private crmTeamService: CRMTeamService,
    @Optional() @Host() public headerCmp: TDSHeaderComponent,
    private liveCampaignService: LiveCampaignService) {
  }

  ngOnInit(): void {

    this.loadListTeam()
    this.crmTeamService.onChangeTeam().pipe(takeUntil(this.destroy$)).subscribe(res => {
        this.currentTeam = res;
    });
  }

  loadListTeam() {
    this.data$ = this.crmTeamService.onChangeListFaceBook();
  }

  onClick(e: MouseEvent, data: CRMTeamDTO) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if (data.Id == this.currentTeam?.Id) {
      return
    } else {
      this.visible = false;
      this.tdsClickItem.emit(data);

      // TODO: Xóa local chiến dịch live của bài viết
      this.liveCampaignService.removeLocalStorageDrawer();
    }
  }

  get parentIsHeaderCpm() {
    return TDSHelperObject.hasValue(this.headerCmp);
  }

  onRefresh(){
    this.isRefresh.emit(true);
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }
}
