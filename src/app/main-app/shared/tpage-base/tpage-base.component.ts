import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { TDSSafeAny } from 'tmt-tang-ui';
import { CRMTeamDTO } from '../../dto/team/team.dto';
import { CRMTeamService } from '../../services/crm-team.service';
import { TPageHelperService } from '../../services/helper.service';

@Component({
  selector: 'app-tpage-base',
  templateUrl: './tpage-base.component.html',
  styleUrls: ['./tpage-base.component.scss']
})

export class TpageBaseComponent  {

  private _params!: TDSSafeAny;
  private _currentTeam!: CRMTeamDTO | null;
  private _listFaceBook: Array<CRMTeamDTO> = [];
  public isFirstLoad: boolean = true;

  type!: string;
  subscription!: Observable<any>;
  destroy$ = new Subject();

  constructor(public crmService: CRMTeamService,
    public activatedRoute: ActivatedRoute,
    public router: Router) {
  }

  loadQueryParamMap(): Observable<any> {
    let that = this;
    return that.activatedRoute.queryParamMap.pipe(
      tap((queryParamMap: TDSSafeAny) => { that._params = { ...queryParamMap?.params } }),
      mergeMap((params: TDSSafeAny) => {
        return that.crmService.onChangeListFaceBook()
          .pipe(tap((listFb: TDSSafeAny) => {  that._listFaceBook = listFb?.Items || [] }),
          map((listTeam) => {
              const team = TPageHelperService.findTeamById(listTeam?.Items || [], that.paramsUrl?.teamId, false);
              return [team, params];
          })
        )}));
  }

  get paramsUrl() {
    return this._params;
  }

  setParamsUrl(data: any): any {
    return this._params = data;
  }

  get currentTeam(): any {
    return this._currentTeam;
  }

  setCurrentTeam(data: any): any {
    return this._currentTeam = data;
  }

  //có thể viết lại hàm này
  onRedirect() {
    console.warn("không có queryparams và team")
    this.router.navigate(['/']);
  }
}


