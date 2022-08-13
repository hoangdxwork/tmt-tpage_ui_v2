import { QuickSaleOnlineOrderModel } from "../saleonlineorder/quick-saleonline-order.dto";

export interface City {
  name: string;
  nameNoSign?: any;
  code: string;
}

export interface District {
  name: string;
  nameNoSign?: any;
  code: string;
  cityName?: any;
  cityCode?: any;
}

export interface Ward {
  name: string;
  nameNoSign?: any;
  code: string;
  cityName?: any;
  cityCode?: any;
  districtName?: any;
  districtCode?: any;
}

export interface TabPartnerCvsRequestModel {
  Id: number; // id partner
  Name: string;
  Ref: string;
  Phone: string;
  PhoneReport: boolean;
  Status: number;
  StatusText: string;
  Email?: any;
  Street: string;
  Facebook_UserPhone: string;
  Facebook_UserAddress: string;
  Facebook_ASUserId: string;
  Facebook_UserName: string;
  City: City | any;
  District: District | any;
  Ward: Ward | any;
  LastOrder: QuickSaleOnlineOrderModel; // get dữ liệu từ QuickSaleOnlineOrderModel dto
  Comment?: any;

  page_id: string; // field gán thêm để mapping, không có trong request trả về, xử lí trong loadData conversation-partner
  psid: string; // field gán thêm để mapping, không có trong request trả về, xử lí trong loadData conversation-partner
}

export interface TabPartnerCvsRequestDTO {
  Success: boolean;
  Data: TabPartnerCvsRequestModel;
}
