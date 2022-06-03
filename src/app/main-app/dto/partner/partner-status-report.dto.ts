export interface PartnerStatusReport {
  count_birthDay: number,
  item: Array<PartnerStatusReportDTO>
}

export interface PartnerStatusReportDTO {
  StatusText: string;
  Count: number;
  StatusStyle: string;
}
