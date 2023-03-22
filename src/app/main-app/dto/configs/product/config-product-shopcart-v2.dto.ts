export interface SearchProductOnShopCartDto {
    q: string;
    cate_id?: number;
    offset: number;
    limit: number;
    sort: string; //sắp xếp dữ liệu (date, date_desc, price, price_desc)
  }
export interface ProductShopCartDto {
    Id: number;
    Name: string;
    NameGet: string;
    NameNoSign: string;
    DefaultCode: string;
    Description?: any;
    Type: string;
    ListPrice: number;
    SaleOK: boolean;
    PurchaseOK: boolean;
    Active: boolean;
    UOMId: number;
    UOMName: string;
    CategId: number;
    CategName: string;
    CategNameNoSign?: any;
    IsCombo: boolean;
    ShopQuantity: number;
    DateCreated: Date;
    LastUpdated: Date;
    ImageUrl: string;
}