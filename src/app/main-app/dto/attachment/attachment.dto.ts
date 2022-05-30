import { CompanyDTO } from '../company/company.dto';

export interface IRAttachmentDTO {
  Id: number;
  ResModel: string;
  ResName: string;
  DbDatas: any;
  FileSize?: number;
  CompanyId?: number;
  Company: CompanyDTO;
  EesId?: number;
  Type: string;
  Public?: boolean;
  StoreFname: string;
  Description: string;
  EesField: string;
  MineType: string;
  Name: string;
  Url: string;
  Checksum: string;
  DatasFname: string;
}

export interface MDBAttachmentDTO {
  id: string;
  host: string;
  Url: string;
  RelativePath: string;
  Name: string;
  Ext: string;
  Size: number;
  DateCreated: Date;
  LastUpdated?: Date;
  Select?: boolean;
  SelectAddInner?: boolean;
}

export interface MDBCollectionDTO {
  id: string;
  host: string;
  Name: string;
  Attachments: InnerAttachmentDTO[];
  LastUrl?: string;
  LastUrlId?: string;
  DateCreated: Date;
  LastUpdated?: Date;
  Select?: boolean;
}

export interface InnerAttachmentDTO {
  id: string;
  Url: string;
  Name: string;
  RelativePath: string;
  Ext: string;
  Size: number;
  DateCreated: Date;
  Select?: boolean;
}
