import { DeliveryCarrierDTO } from "../carrier/delivery-carrier.dto";

export interface ConversationOrderForm {
  Id?: string;
  Code: string;
  LiveCampaignId: string;
  Facebook_UserId: string;
  Facebook_ASUserId: string;
  Facebook_UserName: string;
  Facebook_CommentId: string;
  Facebook_PostId: string;
  PartnerId?: number;
  PartnerName: string;
  Name: string;
  Email: string;
  TotalAmount: number;
  TotalQuantity: number;
  Street: string;
  City?: Object;
  District?: Object;
  Ward?: Object;
  UserId?: string;
  User?: Object;
  Telephone: string;
  Note: string;
  CRMTeamId?: number;
  PrintCount: number;
  Session: number,
  SessionIndex: number,
  AmountUntaxed: number,
  TotalAmountBill: number,
  DecreaseAmount: number,
  PaymentAmount: number,
  DiscountAmount: number,
  Discount: number,
  Tax: Object,
  AmountTax: number,
  StatusText: string;
  Carrier?: DeliveryCarrierDTO;
  Details: ConversationOrderProductDefaultDTO[]
}

export interface ConversationOrderProductDefaultDTO {
  Note: string | null,
  Price: number,
  ProductCode: string,
  ProductId?: number;
  ProductName: string,
  ProductNameGet: string,
  Quantity: number,
  UOMId: number,
  UOMName: string,
}

