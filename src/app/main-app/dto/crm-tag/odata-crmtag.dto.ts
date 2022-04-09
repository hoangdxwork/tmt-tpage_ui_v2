export interface CRMTagDTO {
  Id: string;
  Icon?: any;
  ColorClassName: string;
  Name: string;
  IsDeleted: boolean;
  DateCreated: Date;
}

export interface ODataCRMTagDTO {
  "@odata.context"?: string;
  "@odata.count"?: number;
  value: CRMTagDTO[];
}
