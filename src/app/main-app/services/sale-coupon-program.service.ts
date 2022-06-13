import { EventEmitter, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TAPIDTO, TApiMethodType, TCommonService } from "src/app/lib";
import { TDSSafeAny } from "tds-ui/shared/utility";
import { SaleCouponProgramDTO } from "../dto/configs/sale-coupon-program.dto";
import { ODataModelDTO } from "../dto/odata/odata.dto";
import { PagedList2 } from "../dto/pagedlist2.dto";
import { BaseSevice } from "./base.service";


@Injectable()
export class SaleCouponProgramService extends BaseSevice {
  prefix: string = "odata";
  table: string = "SaleCouponProgram";
  baseRestApi: string = "";

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  getById(id: number): Observable<SaleCouponProgramDTO> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})?$expand=Details($expand%3DRuleProduct,RewardProduct,DiscountSpecificProduct,RuleCombo,RewardCombo),
      Company,RewardProduct,RuleProduct,RuleCategory,DiscountSpecificProduct,DiscountSpecificCategory,DiscountLineProduct`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<SaleCouponProgramDTO>(api, null);
  }

  getDefault(data: ODataModelDTO<TDSSafeAny>): Observable<SaleCouponProgramDTO> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/OdataService.DefaultGet?$expand=Company`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<SaleCouponProgramDTO>(api, data);
  }

  insert(data: SaleCouponProgramDTO): Observable<SaleCouponProgramDTO> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<SaleCouponProgramDTO>(api, data);
  }

  update(id: number, data: SaleCouponProgramDTO): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})`,
      method: TApiMethodType.put,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  remove(id: number): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}(${id})`,
      method: TApiMethodType.delete,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

  setActive(data: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.SetActive`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, data);
  }

  updateNullValue(): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.prefix}/${this.table}/ODataService.UpdateNullValue`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<TDSSafeAny>(api, null);
  }

}
