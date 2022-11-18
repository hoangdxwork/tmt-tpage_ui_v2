
export interface Product {
    ProductId: number;
    ProductCode: string;
    ProductName: string;
    ProductNameGet: string;
    Price: number;
    UOMId: number;
    UOMName: string;
    Quantity: number;
    QtyLimit: number;
    QtyDefault?: any;
    IsEnableRegexQty: boolean;
    IsEnableRegexAttributeValues: boolean;
    IsEnableOrderMultiple: boolean;
    AttributeValues: string[];
    DescriptionAttributeValues: string[];
}

export interface TextContentToOrderV2Dto {
    Index: number;
    Content: string;
    ContentWithAttributes: string;
    IsActive: boolean;
    Product: Product;
}

export interface ApiContentToOrdersV2Dto {
    LiveCampaignId: string;
    LiveCampaignName: string;
    EnableQuantityHandling: boolean;
    IsAssignToUserNotAllowed: boolean;
    TextContentToOrders: TextContentToOrderV2Dto[];
    Users: any[];
}

