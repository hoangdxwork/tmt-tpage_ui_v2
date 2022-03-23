import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TDSHelperObject, TDSSafeAny } from 'tmt-tang-ui';
import { CRMTeamDTO } from '../../dto/team/team.dto';
import { CRMTeamService } from '../../services/crm-team.service';
import { TPageHelperService } from '../../services/helper.service';

@Component({
  selector: 'app-tpage-base',
  templateUrl: './tpage-base.component.html',
  styleUrls: ['./tpage-base.component.scss']
})
export class TpageBaseComponent implements OnInit, OnDestroy {
  type!: string;
  private _destroy = new Subject<void>();
  private _params!: TDSSafeAny;
  private _currentTeam!: CRMTeamDTO | null;
  constructor(public crmService: CRMTeamService, public activatedRoute: ActivatedRoute, public router: Router) { }
  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
    this.onDestroy();
  }

  ngOnInit(): void {
    console.log("ngOnInit")
    combineLatest([this.activatedRoute.queryParams, this.crmService.onChangeTeam(), this.crmService.onChangeListFaceBook()])
      .pipe(takeUntil(this._destroy)).subscribe(([params, team, listTeam]) => {
        this._params = params;
        this._currentTeam = team;
        console.log("params", params)
        console.log("team", team)
        if ((!TDSHelperObject.hasValue(params) || !TDSHelperObject.hasValue(params.teamId))) {
          if (!TDSHelperObject.hasValue(team)) {
            this.onRedirect();
          } else {
            let url = this.router.url.split("?")[0];
            if (this.paramsUrl.psid) {
              this.router.navigateByUrl(`${url}?teamId=${this.currentTeam?.Id}&type=${this.type}&psid=${this.paramsUrl.psid}`);
            } else {
              this.router.navigateByUrl(`${url}?teamId=${this.currentTeam?.Id}&type=${this.type}`);
            }
          }
        } else {

          if (!TDSHelperObject.hasValue(team) || (team?.Id != params.teamId)) {
            const team = TPageHelperService.findTeamById(listTeam?.Items || [], params.teamId, false);
            if (team)
              this.crmService.onUpdateTeam(team);
            else
              this.onRedirect();
          } else {
            this.onInit();
          }
        }

      })
    // this.activatedRoute.queryParams.subscribe(params => {
    //   this.teamId = params['teamId'];
    //   this.type = params['type'];
    //   this.post_id = params['post_id'];
    //   this.post_id = params['psid'];
    //   console.log(this.crmService.getCurrentTeam())
    //   this.onInit();
    //   console.log("activatedRoute")
    // });

  }
  get paramsUrl() {
    return this._params;
  }
  get currentTeam() {
    return this._currentTeam;
  }
  // viết lại hàm này
  onInit(): void {
    console.log("onInit")
  }
  // viết lại hàm này
  onDestroy() {

  }
  //có thể viết lại hàm này
  onRedirect() {
    console.warn("không có queryparams và team")
    this.router.navigate(['/']);
  }
}
