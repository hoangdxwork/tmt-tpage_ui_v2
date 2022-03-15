import { CompanyDTO } from '../company/company.dto';

export interface IRAttachmentDTO {
  id: number;
  resModel: string;
  resName: string;
  dbDatas: any;
  fileSize?: number;
  companyId?: number;
  company: CompanyDTO;
  eesId?: number;
  type: string;
  public?: boolean;
  storeFname: string;
  description: string;
  eesField: string;
  mineType: string;
  name: string;
  url: string;
  checksum: string;
  datasFname: string;
}
