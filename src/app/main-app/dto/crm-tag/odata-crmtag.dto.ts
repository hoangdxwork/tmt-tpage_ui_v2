export interface CRMTagDTO {
  Id: string;
  Icon?: any;
  ColorClassName: string;
  Name: string;
  IsDeleted: boolean;
  DateCreated: Date;
}

export interface CRMTagModelDTO {
  ColorClassName: string;
  Name: string;
  IsDeleted: boolean;
}

export interface ODataCRMTagDTO {
  "@odata.context"?: string;
  "@odata.count"?: number;
  value: CRMTagDTO[];
}
