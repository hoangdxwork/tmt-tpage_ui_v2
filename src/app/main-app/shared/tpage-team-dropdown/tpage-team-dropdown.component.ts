import { Component, EventEmitter, Host, Input, OnInit, Optional, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { TDSHeaderComponent } from 'tds-ui/header';
import { TDSHelperObject } from 'tds-ui/shared/utility';
import { PagedList2 } from '../../dto/pagedlist2.dto';
import { CRMTeamDTO } from '../../dto/team/team.dto';
import { CRMTeamService } from '../../services/crm-team.service';

@Component({
  selector: 'tpage-team-dropdown',
  templateUrl: './tpage-team-dropdown.component.html'
})

export class TpageTeamDropdownComponent implements OnInit {
  data$!: Observable<PagedList2<CRMTeamDTO> | null>;
  currentTeam!: CRMTeamDTO | null;
  visible = false;
  @Output() readonly tdsClickItem = new EventEmitter<CRMTeamDTO>();
  @Output() isRefresh = new EventEmitter<boolean>();
  @Input() isRefreshing!: boolean 

  constructor(
    private crmTeamService: CRMTeamService,
    @Optional() @Host() public headerCmp: TDSHeaderComponent
  ) { }

  ngOnInit(): void {
    this.loadListTeam()
    this.crmTeamService.onChangeTeam().subscribe(res => {
      this.currentTeam = res;
    });

  }
  loadListTeam() {
    this.data$ = this.crmTeamService.onChangeListFaceBook();
  }
  onClick(e: MouseEvent, data: CRMTeamDTO) {
    e.stopPropagation();
    if (data.Id == this.currentTeam?.Id) {
      return
    } else {
      this.visible = false;
      this.tdsClickItem.emit(data);
    }
  }
  get parentIsHeaderCpm() {
    return TDSHelperObject.hasValue(this.headerCmp);
  }
  onRefresh(){
    this.isRefresh.emit(true);
  }
}
