import { format } from "date-fns";
import { TDSHelperArray, TDSHelperObject } from "tmt-tang-ui";
import { DataRequestDTO, FilterDataRequestDTO, FilterItemDataRequestDTO, SortDataRequestDTO } from "../dto/dataRequest.dto";

// @dynamic
export class THelperDataRequest {
    private static readonly _maxResultCount = "$top";
    private static readonly _skipCount = "$skip";
    private static readonly _filter = "$filter";
    private static readonly _sorting = "$orderby";
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

            result += `${this._filter}=(${this.convertFilterToString(filter!)})`;

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
        }).join(`%20${filter.logic}%20`)
        return str;
    }

    private static p_convertFilterItemToString(filter: FilterItemDataRequestDTO) {
        let str = '';
        const value = filter.value;
        if (typeof value === 'string') {
            str = `${filter.field}%20${filter.operator}%20'${value}'`
        }
        else if(value instanceof Date) {
          let date =format(value, "yyyy-MM-dd'T'HH:mm:ss'Z'");
          str=`${filter.field}%20${filter.operator}%20${date}`

        }
        else {
            //field~gte~10
            str = `${filter.field}%20${filter.operator}%20${value}`
        }
        return str;
    }

    static convertSortToString(sorts: Array<SortDataRequestDTO>) {
        return sorts.map(
            s => {
                return `${s.field} ${s.dir}`
            }
        ).join('%20')
    }

}
