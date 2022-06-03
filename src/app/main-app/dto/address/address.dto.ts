export interface AddressDTO {
  Id: string;
  PartnerId: number;
  CityCode: string;
  CityName: string;
  DistrictCode: string;
  DistrictName: string;
  WardCode: string;
  WardName: string;
  IsDefault: boolean;
  Street: string;
  Address: string | undefined;
}

export interface DataSuggestionDTO {
  Street: string;
  CityCode: string;
  CityName: string;
  DistrictCode: string;
  DistrictName: string;
  WardCode: string;
  WardName: string;
}

export interface CheckAddressDTO {
  Street?: string;
  City?: CityDTO;
  District?: DistrictDTO;
  Ward?: WardDTO;
}

export interface CityDTO {
  Code?: string | undefined;
  Name?: string | undefined;
}

export interface DistrictDTO {
  CityCode?: string;
  CityName?: string;
  Code?: string;
  Name?: string;
}

export interface WardDTO {
  CityCode?: string;
  CityName?: string;
  DistrictCode?: string;
  DistrictName?: string;
  Code?: string;
  Name?: string;
}

export interface ResultCheckAddressDTO {
  Telephone?: any;
  Address: string;
  ShortAddress: string;
  CityCode: string;
  CityName: string;
  DistrictCode: string;
  DistrictName: string;
  WardCode: string;
  WardName: string;
  Score: number;
}
