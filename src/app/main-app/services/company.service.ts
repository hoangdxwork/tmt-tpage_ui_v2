import { ODataResponsesDTO } from '../dto/odata/odata.dto';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { TAPIDTO, TApiMethodType, TCommonService, THelperCacheService } from 'src/app/lib';
import { TDSSafeAny } from 'tmt-tang-ui';
import { CompanyDTO } from '../dto/company/company.dto';
import { ODataPartnerCategoryDTO } from '../dto/partner/partner-category.dto';
import { PartnerStatusReport } from '../dto/partner/partner-status-report.dto';
import { StatusDTO } from '../dto/partner/partner.dto';
import { BaseSevice } from './base.service';

@Injectable()

export class CompanyService extends BaseSevice {

  prefix: string = "odata";
  table: string = "Company";
  baseRestApi: string = "rest/v1.0/company";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  get(): Observable<ODataResponsesDTO<CompanyDTO>> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<ODataResponsesDTO<CompanyDTO>>(api, null);
  }

  getCompanyList(): Observable<ODataResponsesDTO<CompanyDTO>> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.GetCompanyList?$filter=(Active eq true)`,
        method: TApiMethodType.get,
    }

    return this.apiService.getData<ODataResponsesDTO<CompanyDTO>>(api, null);
  }

}
