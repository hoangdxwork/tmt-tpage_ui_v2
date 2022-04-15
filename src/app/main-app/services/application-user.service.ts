import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { TDSSafeAny } from 'tmt-tang-ui';
import { ODataApplicationUserDTO } from '../dto/user/application-user.dto';
import { BaseSevice } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationUserService extends BaseSevice {

  prefix: string = "odata";
  table: string = "ApplicationUser";
  baseRestApi: string = "api/applicationuser";

  public data: any;
  public dataActive: any = [];

  public dataSource$ = new BehaviorSubject<any>([]);
  public dataActive$ = new BehaviorSubject<any>(this.dataActive);

  constructor(private apiService: TCommonService) {
    super(apiService);
    this.initialize();
  }

  initialize() {
    if (this.data) {
        this.dataSource$.next(this.data);
    } else {
        this.get().pipe(map(res => res.value)).subscribe((res: any) => {
          this.data = res;
          this.dataSource$.next(this.data);
          this.loadDataActive();
        });
    }
  }

  loadDataActive() {
    if(this.data) {
      this.dataActive = this.data.filter((x: any) => x.Active == true) || [];
      this.dataActive$.next(this.dataActive);
    }
  }

  get(): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<ODataApplicationUserDTO>(api,null);
  }

  getActive(): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}?$filter=Active eq true`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api,null);
  }

}
