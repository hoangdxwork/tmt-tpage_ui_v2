import { SaleOnlineOrderStatusType } from "../saleonlineorder/sale-online-order.dto";

export class  SearchStaffReportDTO {
  public Relationship: number;
  public DateTo: string;
  public DateFrom: string;
  public DefaultTime?: TimeReport;
  public StaffId: string;
  public PartnerId?: number;
  public IsNoCustomer: boolean;
  public EndDate?: Date;
  public BeginDate?: Date;
  public OrderType: string;
  public TypeReport: number;
  public CompanyId?: number;

  public ShipStatus: string;
  public State: string;
  public Status: SaleOnlineOrderStatusType;

  public q: string;

  public ProductId?: number;
  public CompanyIds: Array<string>;
  public list: Array<ColumReportOrderDTO>;
  public Date?: Date;

  /// <summary>
  /// TypeTab = "T" // Tổng quan
  /// TypeTab = "NV" // Nhân viên
  /// TypeTab = "KH" // Khách hàng
  /// </summary>
  public TypeTab: string;
  public CityCode: string;
  public ReportBy: string;

  constructor() {
    this.Relationship = 0;
    this.CompanyId = -1;
    this.IsNoCustomer = false;
    this.CompanyIds = new Array<string>();
    this.list = new Array<ColumReportOrderDTO>();
  }
}

export class ColumReportOrderDTO {
  public NameColumn: string;
  public TextColumn: string;
  public Location: number;
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
