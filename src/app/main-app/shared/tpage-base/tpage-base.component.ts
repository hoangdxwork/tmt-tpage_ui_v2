import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, of, Subject } from 'rxjs';
import { map, mergeMap, takeUntil, tap, filter } from 'rxjs/operators';
import { TDSHelperArray, TDSHelperObject, TDSSafeAny } from 'tmt-tang-ui';
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
  private _listFaceBook: Array<CRMTeamDTO> = [];
  constructor(public crmService: CRMTeamService,
    public activatedRoute: ActivatedRoute,
    public router: Router) { }

  ngOnInit(): void {
    let that = this;
    /**
     * chỉ load lại data khi url thay đổi
     */
    this.activatedRoute.queryParamMap.pipe(
      tap((queryParamMap: TDSSafeAny) => {
        that._params = { ...queryParamMap?.params };
      }),
      mergeMap((params: TDSSafeAny) => {
        return that.crmService.onChangeListFaceBook().pipe(
          tap((listFb) => {
            that._listFaceBook = listFb?.Items || [];
          }),
          map((listTeam) => {
            const team = that.findTeamById(listTeam?.Items || [], that.paramsUrl?.teamId, false);
            return team;
          })
        )
      }),
      takeUntil(this._destroy)
    ).subscribe(
      team => {      
        if (!TDSHelperObject.hasValue(team)) {
          this.onRedirect();
        } else {
          this._currentTeam = team;
          this.onInit();
        }
      }
    );
  }

  get paramsUrl() {
    return this._params;
  }

  get currentTeam(): any {
    return this._currentTeam;
  }

  // viết lại hàm này
  onInit(): void {
  }

  // viết lại hàm này
  onDestroy() {

  }

  //có thể viết lại hàm này
  onRedirect() {
    console.warn("không có queryparams và team")
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
    this.onDestroy();
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
  findTeamById(dataTeam: Array<CRMTeamDTO>, teamId: TDSSafeAny, getFirstItem: boolean = false) {
    let team: CRMTeamDTO | null = null;
    if (!TDSHelperArray.hasListValue(dataTeam)) {
      return team;
    }
    for (let index = 0; index < dataTeam?.length; index++) {
      const item = dataTeam[index];
      for (let index = 0; index < item.Childs.length; index++) {
        const child = item.Childs[index];
        if (teamId == child.Id) {
          team = child;
          break;
        }
      }
      if (TDSHelperObject.hasValue(team)) {
        break
      }
    }
    if (!TDSHelperObject.hasValue(team) && getFirstItem) {
      const firstItem = dataTeam.find(res => {
        return res.Childs.length > 0
      });
      team = firstItem?.Childs[0] || null;
    }
    return team;
  }
 
}
