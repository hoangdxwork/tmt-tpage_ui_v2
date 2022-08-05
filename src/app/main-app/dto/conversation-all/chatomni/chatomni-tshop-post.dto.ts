export interface ChatomniDataTShopPostDto {
  Id: number;
  Kind: string;
  KindValue: number;
  Content: TShopContentDto;
  Medias: TShopMediaNormalDto[];//Nội dung offstream
  MediaLive: TShopMediaLiveDto;//Nội dung livestream
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
  IsBroadcasting: boolean;
  RecordUrl?: any;
  ThumbnailUrl: string;
}

export interface TShopMediaNormalDto {
  Id: string;
  Content: TShopContentDto;
  FileSize: number;
  Extention: string;
  Url: string;
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