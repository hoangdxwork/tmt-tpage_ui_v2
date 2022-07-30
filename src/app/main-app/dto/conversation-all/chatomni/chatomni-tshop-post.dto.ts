export interface ChatomniDataTShopPostDto {
  Id: number;
  Kind: string;
  KindValue: number;
  Content: TShopContentDto;
  Medias: TShopMediaNormalDto[];
  MediaLive: TShopMediaLiveDto;
  ShopId: string;
  CommentPinIds: any[];
  CreatorId: string;
  CreationTime: Date;
  HiddenKind: string;
  HiddenKindValue: number;
}

export interface TShopMediaLiveDto {
  Id: string;
  ReadUrl: string;
  WriteUrl: string;
  RecordUrls?: any;
  IsBroadcasting: boolean;
}

export interface TShopMediaNormalDto {
  Id: string;
  Content: TShopContentDto;
}

export interface TShopContentDto {
  Text: string;
  Tags: TShopTag[]
}

export interface TShopTag {
  ObjectKind: number;
  ObjectId: string;
  Offset: number;
  Length: number;
}
