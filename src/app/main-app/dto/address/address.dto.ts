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
