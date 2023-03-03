import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { CRMTeamService } from '@app/services/crm-team.service';
import { TDSDestroyService } from 'tds-ui/core/services';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'filter-team-dropdown',
  templateUrl: './filter-team-dropdown.component.html',
  providers: [TDSDestroyService]
})

export class FilterTeamDropdownComponent implements OnInit, OnChanges {

  data$!: Observable<Array<CRMTeamDTO> | null>;
  currentTeam!: CRMTeamDTO | null;

  @Output() readonly tdsClickItem = new EventEmitter<CRMTeamDTO | null>();
  @Output() isRefresh = new EventEmitter<boolean>();
  @Input() currentTeamId!: number | null;
  @Input() visible: boolean = false;
  @Input() showAvatar: boolean = false;
  @Input() isRefreshing: boolean = false;
  @Input() disableRefresh: boolean = true;

  constructor(private crmTeamService: CRMTeamService) {}

  ngOnInit(): void {
    this.loadListTeam();
    this.loadCurrentTeam();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["currentTeamId"] && !changes["currentTeamId"].firstChange) {
      this.currentTeamId = changes["currentTeamId"].currentValue;
      this.loadCurrentTeam();
    }
  }

  loadListTeam() {
    this.data$ = this.crmTeamService.onChangeListFaceBook();
  }

  loadCurrentTeam() {
    if(this.currentTeamId) {
      let team = this.crmTeamService.getCacheFilterTeam();
      if(this.currentTeamId == team?.Id) {
        this.currentTeam = team;
      }
    } else {
      this.currentTeam = null;
      this.crmTeamService.removeCacheFilterTeam();
    }
  }

  onClick(e: MouseEvent, data: CRMTeamDTO) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if (data.Id == this.currentTeam?.Id) return;
    this.currentTeam = data;
    this.crmTeamService.setCacheFilterTeam(data);

    this.visible = false;
    this.tdsClickItem.emit(data);
  }

  onRemove() {
    this.currentTeam = null;
    this.visible = false;
    this.crmTeamService.removeCacheFilterTeam();
    this.tdsClickItem.emit(null);
  }

  onRefresh(){
    this.isRefresh.emit(true);
  }
}
