export interface Extra {
  ServiceId: string;
  ServiceName: string;
  Fee: number;
  Type?: any;
  ExtraMoney?: any;
}

export interface Service {
  ServiceId: string;
  ServiceName: string;
  TotalFee: number;
  Extras: Extra[];
}

export interface CalculatorFeeV2DTO {
  TotalFee: number;
  Costs: any[];
  Services: Service[];
  CarrierName?: any;
  CarrierId: number;
  DeliveryType?: any;
}
