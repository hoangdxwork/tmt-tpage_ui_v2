export interface CheckPartnerDTO {
  Id: number;
  Phone: string;
  Name: string;
  DisplayName: string;
  FacebookId?: any;
  FacebookASIds?: any;
  Street: string;
  StatusText: string;
  DateCreated: Date;
}

export interface CheckDuplicatePartnertDTO {
  Id: number;
  Key: string;
  Values: CheckPartnerDTO[];
}
