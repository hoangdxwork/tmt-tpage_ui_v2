import { CRMTeamDTO } from './../../../../dto/team/team.dto';
import { CRMTeamService } from './../../../../services/crm-team.service';
import { TDSDestroyService } from 'tds-ui/core/services';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'filter-team-dropdown',
  templateUrl: './filter-team-dropdown.component.html',
  providers: [TDSDestroyService]
})

export class FilterTeamDropdownComponent implements OnInit {

  data$!: Observable<Array<CRMTeamDTO> | null>;
  currentTeam!: CRMTeamDTO | null;

  @Output() readonly tdsClickItem = new EventEmitter<CRMTeamDTO>();
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
  }

  onRefresh(){
    this.isRefresh.emit(true);
  }
}
