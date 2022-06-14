import { TDSSafeAny } from "tds-ui/shared/utility";


export interface PagedList2<T> {
    Items: Array<T>;
    Extras: TDSSafeAny;
    PageIndex: number;
    PageSize: number;
    TotalCount: number;
    TotalPages: number;
    NextPage: string;
    PreviousPage: string;
    HasPreviousPage: boolean;
    HasNextPage: boolean;
}
