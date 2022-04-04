export interface AddressDTO {
  id: string;
  partnerId?: number;
  cityCode: string;
  cityName: string;
  districtCode: string;
  districtName: string;
  wardCode: string;
  wardName: string;
  isDefault?: boolean;
  street: string;
  address: string;
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
  street: string;
  city?: CityDTO;
  district?: DistrictDTO;
  ward?: WardDTO;
}

export interface CityDTO {
  code?: number;
  name: string;
}

export interface DistrictDTO {
  cityCode?: number;
  cityName?: string;
  code?: number;
  name: string;
}

export interface WardDTO {
  cityCode?: number;
  cityName?: string;
  districtCode?: number;
  districtName?: string;
  code?: number;
  name: string;
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
