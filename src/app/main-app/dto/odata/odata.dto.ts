import { TDSSafeAny } from "tds-ui/shared/utility"

export interface CTMTagFilterObjDTO  {
  searchText: string,
}

export interface FilterLiveCampaignProductDTO  {
  searchText: '',
}

export interface FilterLiveCampaignDTO  {
  status: '',
  searchText: '',
  dateRange: {
    startDate: Date,
    endDate: Date
  }
}

export interface FilterLiveCampaignBillDTO {
  tags: Array<string>,
  status: string,
  bill: TDSSafeAny,
  deliveryType: string,
  liveCampaignId: string,
  isWaitPayment: boolean,
  searchText: string,
  dateRange: {
      startDate: Date,
      endDate: Date
  }
}

export interface FilterLiveCampaignOrderDTO {
  tags: Array<string>,
  status: string,
  searchText: string,
  dateRange: {
    startDate: Date,
    endDate: Date
  }
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

export interface ODataModelDTO<T> {
  model: T;
}

export interface ODataIdsDTO<T> {
  ids: T;
}

export interface ODataModelTeamDTO<T> {
  model: T;
  teamId?: number;
}

export interface ODataParamsDTO<T> {
  params: T;
}
