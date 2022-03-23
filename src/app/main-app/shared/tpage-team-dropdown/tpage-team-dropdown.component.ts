import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { TDSHelperObject, TDSSafeAny } from 'tmt-tang-ui';
import { PagedList2 } from '../../dto/pagedlist2.dto';
import { CRMTeamDTO } from '../../dto/team/team.dto';
import { CRMTeamService } from '../../services/crm-team.service';

@Component({
  selector: 'tpage-team-dropdown',
  templateUrl: './tpage-team-dropdown.component.html',
  styleUrls: ['./tpage-team-dropdown.component.scss']
})
export class TpageTeamDropdownComponent implements OnInit {
  data$!:Observable<PagedList2<CRMTeamDTO> | null>;
  constructor(private crmTeamService: CRMTeamService) { }

  ngOnInit(): void {
    this.loadListTeam()
  }
  loadListTeam(){
    this.data$ = this.crmTeamService.onChangeListFaceBook();
  }
}
