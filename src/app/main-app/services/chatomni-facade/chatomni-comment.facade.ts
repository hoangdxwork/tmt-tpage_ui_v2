import { Injectable, OnDestroy } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { TCommonService } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { CRMTeamService } from "../crm-team.service";
import { get as _get } from 'lodash';
import { set as _set } from 'lodash';

@Injectable()

export class ChatomniPostFacade extends BaseSevice implements OnDestroy  {

  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "rest/v2.0/chatomni";

  postDataSource: { [id: string] : any } = {}; //this.postDataSource[id]

  private destroy$ = new Subject<void>();

  constructor(private apiService: TCommonService,
    private crmTeamService: CRMTeamService) {
    super(apiService)
  }

  setData(id: string, value: any | null) {
    _set(this.postDataSource, [id], value);
  }

  getData(id: string) {
    let data = _get(this.postDataSource, id) || undefined;
    return data;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
