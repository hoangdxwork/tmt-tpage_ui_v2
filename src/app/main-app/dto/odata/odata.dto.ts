export interface CTMTagFilterObjDTO  {
  searchText: '',
}

export interface TposLoggingFilterObjDTO {
  name: '',
  searchText: '',
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
