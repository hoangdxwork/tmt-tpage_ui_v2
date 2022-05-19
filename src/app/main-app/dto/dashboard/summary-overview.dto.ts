export interface SummaryOverviewDTO {
  pageId: string;
  pageIds: Array<string>;
  dateStart: Date;
  dateEnd: Date;
}

export interface SummaryFilterDTO {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
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
  PageIds: string[];
  DateStart: Date;
  DateEnd: Date;
}

export interface MDBSummaryByPostDTO {
  TotalMessage: number;
  TotalComment: number;
  TotalLike: number;
  TotalConversation: number;
  TotalPost: number;
}
