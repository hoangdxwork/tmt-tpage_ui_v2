export interface SocketioChatomniPostLiveEndDto {
  Type: string;
  Message: string;
  Data: ChatomniPostLiveEndDataDto;
  Event: string;
}

export interface ChatomniPostLiveEndDataDto {
  ShopId: string;
  ObjectId: string;
}
