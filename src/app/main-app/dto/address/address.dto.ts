export interface AddressDTO {
  Id: string;
  PartnerId?: number;
  CityCode: string;
  CityName: string;
  DistrictCode: string;
  DistrictName: string;
  WardCode: string;
  WardName: string;
  IsDefault?: boolean;
  Street: string;
  Address: string;
}

export interface DataSuggestionDTO {
  Street: string;
  CityCode?: number;
  CityName: string;
  DistrictCode?: number;
  DistrictName: string;
  WardCode?: number;
  WardName: string;
}

export interface CheckAddressDTO {
  Street: string;
  City?: CityDTO;
  District?: DistrictDTO;
  Ward?: WardDTO;
}

export interface CityDTO {
  Code?: number;
  Name: string;
}

export interface DistrictDTO {
  CityCode?: number;
  CityName?: string;
  Code?: number;
  Name: string;
}

export interface WardDTO {
  CityCode?: number;
  CityName?: string;
  DistrictCode?: number;
  DistrictName?: string;
  Code?: number;
  Name: string;
}

export interface ResultCheckAddressDTO {
  Telephone: string;

  Address: string;

  ShortAddress: string;
  CityCode: string;
  CityName: string;
  DistrictCode: string;
  DistrictName: string;
  WardCode: string;
  WardName: string;

  Score?: number;
}
