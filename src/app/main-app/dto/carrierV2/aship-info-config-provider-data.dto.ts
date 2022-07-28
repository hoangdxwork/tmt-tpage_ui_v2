export interface AshipGetInfoConfigProviderDto {
  ConfigName: string;
  Type: string;
  InputType: string;
  IsRequried: boolean;
  IsHidden: boolean;
  Description: string;
  DisplayName: string;
  ConfigValue: string;
  ConfigsValue: Array<AshipGetInfoConfigProviderDataDto>
}

export interface AshipGetInfoConfigProviderDataDto {
  Id: string;
  Name: string;
}
