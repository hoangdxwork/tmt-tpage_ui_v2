export interface Data {
  Id: number;
  Number: string;
  CarrierId: number;
}

export interface CreateFastSaleOrderDTO {
  Success: boolean;
  Data: Data;
  Message: string;
}
