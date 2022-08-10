import { TDSSafeAny } from "tds-ui/shared/utility";

export interface GetDeliveryResponseDto {
  Providers: Array<DeliveryDataResponseDto>;
}

export interface DeliveryDataResponseDto {
  IsActive: boolean,
  Name: string,
  Description: string,
  Type: string,
  UrlLogo: string,
  Values: Array<TDSSafeAny>
}

