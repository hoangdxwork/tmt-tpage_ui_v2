import { SaleOnlineOrderStatusType } from "../saleonlineorder/sale-online-order.dto";

export class  SearchStaffReportDTO {
  public relationship: number;
  public dateTo: string;
  public dateFrom: string;
  public defaultTime?: TimeReport;
  public staffId: string;
  public partnerId?: number;
  public isNoCustomer: boolean;
  public endDate?: Date;
  public beginDate?: Date;
  public orderType: string;
  public typeReport: number;
  public companyId?: number;

  public shipStatus: string;
  public state: string;
  public status: SaleOnlineOrderStatusType;

  public q: string;

  public productId?: number;
  public companyIds: Array<string>;
  public list: Array<ColumReportOrderDTO>;
  public date?: Date;

  /// <summary>
  /// TypeTab = "T" // Tổng quan
  /// TypeTab = "NV" // Nhân viên
  /// TypeTab = "KH" // Khách hàng
  /// </summary>
  public typeTab: string;
  public cityCode: string;
  public reportBy: string;

  constructor() {
    this.relationship = 0;
    this.companyId = -1;
    this.isNoCustomer = false;
    this.companyIds = new Array<string>();
    this.list = new Array<ColumReportOrderDTO>();
  }
}

export class ColumReportOrderDTO {
  public nameColumn: string;
  public textColumn: string;
  public location: number;
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
