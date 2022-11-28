export interface TUserDto {
  Id: string;
  Name: string;
  Email: string;
  Phone: string;
  Avatar: string;
  Address: string;
  DateOfBirth?: Date;
}


export interface TShopDto {
  Id: string;
  Name: string;
  Email: string;
  Phone: string;
  Avatar: string;
  Address: string;
  DateOfBirth?: Date;
}

export interface ChatOmniTShopDto {
  Id: string;
  Name: string;
  Phone: string;
  Email: string;
  Address: string;
  OwnerId: string;
  Avatar: string;
}