
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { TCommonService } from 'src/app/lib';
import { BaseSevice } from '../base.service';
import { SharedService } from '../shared.service';

@Injectable({
  providedIn: 'root'
})

export class GeneralConfigsFacade extends BaseSevice {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";

  public saleConfigs$!: Observable<any>;
  public currentCompany$!: Observable<any>;

  constructor(private apiService: TCommonService,
      private sharedService: SharedService) {
      super(apiService)
  }

  getSaleConfigs(){
    if (!this.saleConfigs$) {
      this.saleConfigs$ = this.sharedService.getConfigs().pipe(shareReplay(1));
    }

    return this.saleConfigs$;
  }

  public getCurrentCompany() {
    if (!this.currentCompany$) {
        this.currentCompany$ = this.sharedService.getCurrentCompany()
            .pipe(shareReplay(1));
    }

    return this.currentCompany$;
}


}
