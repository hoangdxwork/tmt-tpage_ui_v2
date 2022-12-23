
export interface ODataPartnerStartusDTO {
  "@odata.context": string,
  "@odata.count"?: number;
  value: PartnerStatusDTO[]
}

export interface PartnerStatusDTO {
  Id: number;
  Code: string;
  Name: string;
}

export interface PartnerChangeStatusDTO {
  UserId: string;
  Name: string;
  Code: string;
}

export interface PartnerStatusModalDTO {
  Code: string;
  Name: string;
}
export interface FilterObjDTO  {
  searchText: string,
}

