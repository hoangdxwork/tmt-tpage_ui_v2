import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OperatorEnum, TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { FilterDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { TDSHelperString,  TDSSafeAny } from 'tmt-tang-ui';
import { ODataCRMTagDTO } from '../../dto/crm-tag/odata-crmtag.dto';
import { CTMTagFilterObjDTO, TposLoggingFilterObjDTO } from '../../dto/odata/odata.dto';
import { BaseSevice } from '../base.service';

@Injectable()
export class OdataTPosLoggingService extends BaseSevice {

  prefix: string = "odata";
  table: string = "TPosLogging";
  baseRestApi: string = "";

  constructor(private apiService: TCommonService,
      public caheApi: THelperCacheService
  ) {
    super(apiService)
  }

  getView(params: string): Observable<TDSSafeAny>{
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/GetView?${params}&$count=true&$expand=User`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<TposLoggingFilterObjDTO>(api, null);
  }

  public buildFilter(filterObj: TposLoggingFilterObjDTO) {
    let dataFilter: FilterDataRequestDTO = {
        logic: "and",
        filters: []
    }

    if (filterObj?.dateRange && filterObj?.dateRange.startDate && filterObj?.dateRange.endDate) {
      dataFilter.filters.push({
          filters: [
            { field: "DateCreated", operator: OperatorEnum.gte, value: new Date(filterObj.dateRange.startDate) },
            { field: "DateCreated", operator: OperatorEnum.lte, value: new Date(filterObj.dateRange.endDate) }
          ],
          logic: 'and'
      })
    }

    if (TDSHelperString.hasValueString(filterObj?.searchText)) {
        dataFilter.filters.push( {
            filters: [
              { field: "Content", operator: OperatorEnum.contains, value: filterObj.searchText }
            ],
            logic: 'or'
        })
    }

    if (TDSHelperString.hasValueString(filterObj?.name)) {
      dataFilter.filters.push( {
          filters: [
            { field: "Name", operator: OperatorEnum.eq, value: filterObj.name }
          ],
          logic: 'or'
      })
    }

    return dataFilter;
  }

}
