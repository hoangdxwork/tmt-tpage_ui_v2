export interface Role {
  UserId: string;
  RoleId: string;
}

export interface ApplicationUserDTO {
  Avatar: string;
  Email?: any;
  Name: string;
  Id: string;
  UserName: string;
  PasswordNew?: any;
  CompanyId: number;
  CompanyName: string;
  Image?: any;
  Subffix?: any;
  Active: boolean;
  Barcode?: any;
  PosSecurityPin?: any;
  GroupRefs: any[];
  InGroupPartnerManager: boolean;
  PartnerId?: any;
  LastUpdated?: any;
  Functions: any[];
  Fields: any[];
  PhoneNumber?: any;
  Roles: Role[];
}

export interface ODataApplicationUserDTO {
  "@odata.context"?: string;
  value: ApplicationUserDTO[];
}
