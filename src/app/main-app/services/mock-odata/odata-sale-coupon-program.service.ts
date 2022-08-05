import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OperatorEnum, CoreAPIDTO, CoreApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { FilterDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { TDSHelperString } from 'tds-ui/shared/utility';
import { SaleCouponProgramDTO } from '../../dto/configs/sale-coupon-program.dto';
import { ODataCRMTagDTO } from '../../dto/crm-tag/odata-crmtag.dto';
import { BaseSevice } from '../base.service';

@Injectable()
export class OdataSaleCouponProgramService extends BaseSevice {

  prefix: string = "odata";
  table: string = "SaleCouponProgram";
  baseRestApi: string = "";

  constructor(private apiService: TCommonService,
      public caheApi: THelperCacheService
  ) {
    super(apiService)
  }

  getView(params: string): Observable<any>{
    const api: CoreAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}?${params}&$count=true`,
        method: CoreApiMethodType.get,
    }

    return this.apiService.getData<any>(api, null);
  }

  public buildFilter(filterObj: any) {
    let dataFilter: FilterDataRequestDTO = {
        logic: "and",
        filters: []
    }

    if (TDSHelperString.hasValueString(filterObj?.searchText)) {
        dataFilter.filters.push( {
            filters: [
              { field: "Name", operator: OperatorEnum.contains, value: filterObj.searchText }
            ],
            logic: 'or'
        })
    }

    if(TDSHelperString.hasValueString(filterObj?.programType)) {
        dataFilter.filters.push( {
          filters: [
            { field: "ProgramType", operator: OperatorEnum.eq, value: filterObj.programType }
          ],
          logic: 'and'
        })
    }

    return dataFilter;
  }

}
