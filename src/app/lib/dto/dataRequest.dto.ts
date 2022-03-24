
import { TDSSafeAny } from "tmt-tang-ui";
import { OperatorEnum, SortEnum } from "../enum";

export interface DataRequestDTO {
    maxResultCount?: number,
    skipCount?: number,
    sorting?:string,
    filter?: string,
}
export interface FilterDataRequestDTO {
    logic:'and'|'or' | string,
    filters:Array<FilterDataRequestDTO | FilterItemDataRequestDTO> ,
}
export interface FilterItemDataRequestDTO {
    field: string,
    operator: OperatorEnum | string,
    value: TDSSafeAny;    
}
export interface SortDataRequestDTO {
    field: string,
    dir: SortEnum
}