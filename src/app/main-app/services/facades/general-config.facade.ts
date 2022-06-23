
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { TCommonService } from 'src/app/lib';
import { InitSaleDTO } from '../../dto/setting/setting-sale-online.dto';
import { BaseSevice } from '../base.service';
import { SharedService } from '../shared.service';

@Injectable({
  providedIn: 'root'
})

export class GeneralConfigsFacade extends BaseSevice {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";

  public saleConfigs$!: Observable<InitSaleDTO>;
  public saleOnineSettingConfig$!: Observable<any>;
  public currentCompany$!: Observable<any>;

  constructor(private apiService: TCommonService,
      private sharedService: SharedService) {
      super(apiService)
  }

  getSaleConfigs(): Observable<InitSaleDTO> {
    if (!this.saleConfigs$) {
      this.saleConfigs$ = this.sharedService.getConfigs().pipe(shareReplay({ bufferSize: 1, refCount: true }));
    }

    return this.saleConfigs$;
  }

  getSaleOnineSettingConfig(): Observable<any> {
    if (!this.saleOnineSettingConfig$) {
      this.saleOnineSettingConfig$ = this.sharedService.getSaleOnineSettingConfig().pipe(shareReplay({ bufferSize: 1, refCount: true }));
    }
    return this.saleOnineSettingConfig$;
  }

  public getCurrentCompany() {
    if (!this.currentCompany$) {
        this.currentCompany$ = this.sharedService.getCurrentCompany()
            .pipe(shareReplay({ bufferSize: 1, refCount: true }));
    }

    return this.currentCompany$;
  }

}
