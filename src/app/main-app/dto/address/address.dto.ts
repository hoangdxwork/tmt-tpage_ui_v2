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
