import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, of, Subject, Subscription } from 'rxjs';
import { map, mergeMap, takeUntil, tap, filter, distinctUntilChanged } from 'rxjs/operators';
import { TDSHelperArray, TDSHelperObject, TDSSafeAny } from 'tmt-tang-ui';
import { CRMTeamDTO } from '../../dto/team/team.dto';
import { CRMTeamService } from '../../services/crm-team.service';
import { TPageHelperService } from '../../services/helper.service';

@Component({
  selector: 'app-tpage-base',
  templateUrl: './tpage-base.component.html',
  styleUrls: ['./tpage-base.component.scss']
})

export class TpageBaseComponent implements OnInit {

  type!: string;
  private _destroy = new Subject<void>();
  private _params!: TDSSafeAny;
  private _currentTeam!: CRMTeamDTO | null;
  private _listFaceBook: Array<CRMTeamDTO> = [];
  public isFirstLoad: boolean = true;
  public isChangeTeam: boolean = false;
  subscription!: Observable<any>;

  constructor(public crmService: CRMTeamService,
    public activatedRoute: ActivatedRoute,
    public router: Router) { }

  ngOnInit(): void {
    this.onInit();
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

  // viết lại hàm này
  onInit(): void {
  }

  //có thể viết lại hàm này
  onRedirect() {
    console.warn("không có queryparams và team")
    this.router.navigate(['/']);
  }

  addQueryParams(queryParams: TDSSafeAny): any {
    return this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
      // preserve the existing query params in the route
      skipLocationChange: true
      // do not trigger navigation
    });
  }

}


