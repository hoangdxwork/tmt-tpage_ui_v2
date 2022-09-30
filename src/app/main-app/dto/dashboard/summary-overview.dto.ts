export interface SummaryOverviewDTO {
  pageId: string;
  pageIds: Array<string>;
  dateStart: Date;
  dateEnd: Date;
}

export interface InputSummaryOverviewDTO {
  PageId?: string;
  PageIds: string[];
  DateStart: Date;
  DateEnd: Date;
}

export interface ReportSummaryOverviewResponseDTO {
  TotalPartner: number;
  TotalOrder: number;
  TotalBill: number;
  TotalReaction: number;
}

export interface InputSummaryPostDTO {
  PageId?: string;
  PageIds?: string[];
  DateStart: Date;
  DateEnd: Date;
}

export interface InputSummaryTimelineDTO {
  PageId?: string;
  DateStart: Date;
  DateEnd: Date;
}

export interface MDBTotalCommentMessageFbDTO {
  Date: Date;
  Hours: number;
  TotalMessage: number;
  TotalComment: number;
  TotalLike: number;
}

export interface MDBSummaryByPostDTO {
  TotalMessage: number;
  TotalComment: number;
  TotalLike: number;
  TotalConversation: number;
  TotalPost: number;
  TotalShare: number;
}

export interface SummaryActivityByStaffDTO {
  StaffId: string;
  StaffName: string;
  TotalCount: number;
}

export interface Current {
  Conversation: number;
  Partner: number;
  SaleOnlineOrder: number;
  FastSaleOrder: number;
}

export interface Previous {
  Conversation: number;
  Partner: number;
  SaleOnlineOrder: number;
  FastSaleOrder: number;
}

export interface EventSummaryDTO {
  Current: Current;
  Previous: Previous;
}