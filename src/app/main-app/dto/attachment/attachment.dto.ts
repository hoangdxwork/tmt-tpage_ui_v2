import { CompanyDTO } from '../company/company.dto';

export class IRAttachmentDTO {
  public id: number;
  public resModel: string;
  public resName: string;
  public dbDatas: any;
  public fileSize?: number;
  public companyId?: number;
  public company: CompanyDTO;
  public eesId?: number;
  public type: string;
  public public?: boolean;
  public storeFname: string;
  public description: string;
  public eesField: string;
  public mineType: string;
  public name: string;
  public url: string;
  public checksum: string;
  public datasFname: string;
}
