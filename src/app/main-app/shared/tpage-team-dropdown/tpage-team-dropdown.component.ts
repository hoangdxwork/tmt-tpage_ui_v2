import { TDSDestroyService } from 'tds-ui/core/services';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { Component, EventEmitter, Host, Input, OnDestroy, OnInit, Optional, Output, ChangeDetectorRef } from '@angular/core';
import { Observable, takeUntil } from 'rxjs';
import { TDSHeaderComponent } from 'tds-ui/header';
import { TDSHelperObject } from 'tds-ui/shared/utility';
import { CRMTeamDTO } from '../../dto/team/team.dto';
import { CRMTeamService } from '../../services/crm-team.service';

@Component({
  selector: 'tpage-team-dropdown',
  templateUrl: './tpage-team-dropdown.component.html',
  providers: [TDSDestroyService]
})

export class TpageTeamDropdownComponent implements OnInit, OnDestroy {

  data$!: Observable<Array<CRMTeamDTO> | null>;
  currentTeam!: CRMTeamDTO | null;
  visible = false;

  @Output() readonly tdsClickItem = new EventEmitter<CRMTeamDTO>();
  @Output() isRefresh = new EventEmitter<boolean>();
  @Input() isRefreshing!: boolean;
  @Input() disableRefresh!: boolean;

  constructor(private crmTeamService: CRMTeamService,
    @Optional() @Host() public headerCmp: TDSHeaderComponent,
    private destroy$: TDSDestroyService,
    private liveCampaignService: LiveCampaignService) {
  }

  ngOnInit(): void {
    this.loadListTeam();
    this.crmTeamService.onChangeTeam().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.currentTeam = res;
      }
    });

    this.eventEmitter();
  }

  eventEmitter() {
    this.crmTeamService.loginOnChangeTeam$.subscribe(res => {
      this.crmTeamService.onRefreshListFacebook();
      this.loadListTeam();
    })
  }

  loadListTeam() {
    this.data$ = this.crmTeamService.onChangeListFaceBook();
  }

  onClick(e: MouseEvent, data: CRMTeamDTO) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if (data.Id == this.currentTeam?.Id) return;

    this.visible = false;
    this.liveCampaignService.removeLocalStorageDrawer();

    this.tdsClickItem.emit(data);
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
