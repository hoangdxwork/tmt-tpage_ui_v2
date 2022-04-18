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

export interface CalculatorListFeeDTO {
    CarrierId: number;
    CarrierName: string;
    TotalFee: number;
    DeliveryType: string;
    ExtrasText: string;
    Success: boolean;
    CashOnDelivery: number;
    DeliveryPrice?: any;
    Config_DefaultFee?: any;
    Config_DefaultWeight?: any;
    Services: Service[];
    Costs: any[];
}

export interface ODataCalculatorListFeeDTO {
  "@odata.context": string;
  value: CalculatorListFeeDTO[];
}
