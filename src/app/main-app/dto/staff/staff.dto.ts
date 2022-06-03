import { SaleOnlineOrderStatusType } from "../saleonlineorder/sale-online-order.dto";

export interface  SearchStaffReportDTO {
  relationship: number;
  dateTo: string;
  dateFrom: string;
  defaultTime?: TimeReport;
  staffId: string;
  partnerId?: number;
  isNoCustomer: boolean;
  endDate?: Date;
  beginDate?: Date;
  orderType: string;
  typeReport: number;
  companyId?: number;

  shipStatus: string;
  state: string;
  status: SaleOnlineOrderStatusType;

  q: string;

  productId?: number;
  companyIds: Array<string>;
  list: Array<ColumReportOrderDTO>;
  date?: Date;

  /// <summary>
  /// TypeTab = "T" // Tổng quan
  /// TypeTab = "NV" // Nhân viên
  /// TypeTab = "KH" // Khách hàng
  /// </summary>
  typeTab: string;
  cityCode: string;
  reportBy: string;
}

export interface ColumReportOrderDTO {
  nameColumn: string;
  textColumn: string;
  location: number;
}

export enum TimeReport
{
    //[Description("Hôm nay")]
    //D = 1,
    //[Description("Hôm qua")]
    //T = 2,
    WP = 3, // Tuần trước
    WC = 4, // Tuần này
    CM = 5, // Tháng này
    PM = 6, // Tháng trước
    SD = 7, // 7 ngày qua
    TD = 8, // 30 ngày qua
    QTYC = 9, // Quý này
    QTNP = 10, // Quý trước
    YC = 11, // Năm này
    YP = 12 // Năm trước
}
