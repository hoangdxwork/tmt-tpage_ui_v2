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
