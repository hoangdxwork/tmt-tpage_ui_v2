export interface AutoOrderProductDTO {
    ProductId: number;
    ProductCode: string;
    ProductName: string;
    ProductNameGet: string;
    Price: number;
    UOMId: number;
    UOMName: string;
    Quantity: number;
    QtyLimit?: any;
    QtyDefault?: any;
    IsEnableRegexQty: boolean;
    IsEnableRegexAttributeValues: boolean;
    IsEnableOrderMultiple: boolean;
    AttributeValues: string[];
    DescriptionAttributeValues: string[];
}

export interface TextContentToOrderDTO {
    Index: number;
    Content: any;
    // selectedWord2s?: string[];// 
    ContentWithAttributes?: any;
    // selectedWord3s?: string[];//
    IsActive: boolean;
    Product: AutoOrderProductDTO | null;
}

export interface ConfigUserDTO {
    Id: string;
    UserName: string;
    Name: string;
    Avatar: string;
}

export interface PostOrderConfigV2DTO {
    LiveTitle?: any;
    IsEnableOrderAuto: boolean;
    IsForceOrderWithAllMessage: boolean;
    IsOnlyOrderWithPartner: boolean;
    IsOnlyOrderWithPhone: boolean;
    IsForceOrderWithPhone: boolean;
    IsForcePrintWithPhone: boolean;
    MinLengthToOrder: number;
    MaxCreateOrder: number;
    TextContentToExcludeOrder: string;
    PhonePattern: string;
    EmailPattern: string;
    LiveCampaignId: string;
    LiveCampaignIsActive: boolean;
    TeamId: number;
    TextContentToOrders: TextContentToOrderDTO[];
    ExcludedPhones: string[];
    ExcludedStatusNames: string[];
    IsEnableAutoAssignUser: boolean;
    Users: ConfigUserDTO[] | null;
    IsEnableOrderReplyAuto: boolean;
    OrderReplyTemplate: string;
    IsEnableShopLink: boolean;
    ShopLabel: string;
    ShopLabel2: string;
    IsOrderAutoReplyOnlyOnce: boolean;
}