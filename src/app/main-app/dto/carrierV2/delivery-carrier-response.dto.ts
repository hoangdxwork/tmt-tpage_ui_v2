import { TDSSafeAny } from "tds-ui/shared/utility";
import { StringHelperV2 } from "../../shared/helper/string.helper";

export interface DeliveryResponseDto<T> {
  Data?: T;
  Error: DeliveryErrorResponseDto;
  Success: boolean;
}

export interface DeliveryErrorResponseDto {
  Code: string;
  Message: string;
}

export interface CaculateFeeResponseDto {
  Services: Array<CalculateFeeServiceResponseDto>;
  InsuranceInfo : CalculateFeeInsuranceInfoResponseDto
}

export interface CalculateFeeServiceResponseDto {
  ServiceId: string;
  ServiceName: string;
  TotalFee: number;
  InsuranceFee: number;
  Extras: Array<CalculateFeeServiceExtrasResponseDto>
}

export interface CalculateFeeInsuranceInfoResponseDto {
  IsInsurance: boolean,
  Value: number
}

export interface CalculateFeeServiceExtrasResponseDto {
  ServiceId: string;
  ServiceName: string;
  Fee: number;
}
