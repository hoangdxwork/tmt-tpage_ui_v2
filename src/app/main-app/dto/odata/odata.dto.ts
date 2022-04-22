export interface CTMTagFilterObjDTO  {
  searchText: string,
}

export interface TposLoggingFilterObjDTO {
  name: string,
  searchText: string,
  dateRange: {
    startDate: Date,
    endDate: Date
  }
}

export interface SaleCouponProgramFilterObjDTO {
  searchText: string,
  programType: string
}

export interface ODataResponsesDTO<T> {
  "@odata.context"?: string,
  "@odata.count"?: number;
  value: Array<T>
}
