import { TDSHelperArray, TDSHelperObject } from "tmt-tang-ui";
import { DataRequestDTO, FilterDataRequestDTO, FilterItemDataRequestDTO, SortDataRequestDTO } from "../dto/dataRequest.dto";

// @dynamic
export class THelperDataRequest {
    private static readonly _maxResultCount = "maxResultCount";
    private static readonly _skipCount = "skipCount";
    private static readonly _filter = "filter";
    private static readonly _sorting = "sorting";
    /**
     * convertDataRequestToString
     * {
      logic: "or",
      filters: [
         { field: "fieldA", operator: "eq", value: 100 },
        {
           logic: "and",
           filters: [
               { field: "fieldA", operator: "lt", value: 100 },
               { field: "fieldB", operator: "eq", value: true }
           ]
       }
      ]
    }
    return "fieldA~eq~100~or~(fieldA~lt~100~and~fieldB~eq~true)"
     */
    public static convertDataRequest(pageSize: number, pageIndex: number, filter?: FilterDataRequestDTO, sorting?: Array<SortDataRequestDTO>): DataRequestDTO {


        let maxResultCount: number = pageSize;
        let skipCount: number = (pageIndex - 1) * pageSize;
        let result: DataRequestDTO = {
            skipCount: skipCount,
            maxResultCount: maxResultCount,
        }
        if (TDSHelperObject.hasValue(filter) && filter?.filters && filter?.filters?.length > 0) {
            result.filter = this.convertFilterToString(filter!)
        }
        if (TDSHelperObject.hasValue(sorting)) {
            result.sorting = this.convertSortToString(sorting!)

        }
        return result;
    }
    public static convertDataRequestToString(pageSize: number, pageIndex: number, filter?: FilterDataRequestDTO, sorting?: Array<SortDataRequestDTO>): string {

        let result = '';
        let maxResultCount: number = pageSize;
        let skipCount: number = (pageIndex - 1) * pageSize;
        if (TDSHelperObject.hasValue(maxResultCount)) {
            result = `${this._maxResultCount}=${maxResultCount}`
        }
        if (TDSHelperObject.hasValue(skipCount)) {
            if (result.length > 0) {
                result += '&'
            }
            result += `${this._skipCount}=${skipCount}`
        }
        if (TDSHelperObject.hasValue(filter)) {
            if (result.length > 0) {
                result += '&'
            }
            result += `${this._filter}=${this.convertFilterToString(filter!)}`
        }
        if (TDSHelperObject.hasValue(sorting)) {
            if (result.length > 0) {
                result += '&'
            }
            result += `${this._sorting}=${this.convertSortToString(sorting!)}`
        }
        return result;
    }
    static convertFilterToString(filter: FilterDataRequestDTO) {
        let str = '';
        str = filter.filters.map((f: FilterDataRequestDTO | FilterItemDataRequestDTO) => {

            if (!TDSHelperArray.hasListValue((f as FilterDataRequestDTO).filters)) {

                return this.p_convertFilterItemToString(f as FilterItemDataRequestDTO);
            }
            return `(${this.convertFilterToString(f as FilterDataRequestDTO)})`;
        }).join(`~${filter.logic}~`)
        return str;
    }
    private static p_convertFilterItemToString(filter: FilterItemDataRequestDTO) {
        let str = '';
        const value = filter.value;
        if (typeof value === 'string') {         
            str = `${filter.field}~${filter.operator}~'${value}'`
        }
        else {
            //field~gte~10
            str = `${filter.field}~${filter.operator}~${value}`
        }
        return str;
    }
    static convertSortToString(sorts: Array<SortDataRequestDTO>) {
        return sorts.map(
            s => {
                return `${s.field}-${s.dir}`
            }
        ).join('~')
    }

}