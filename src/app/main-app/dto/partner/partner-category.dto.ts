export interface ODataPartnerCategoryDTO {
  "@odata.context"?: string,
  "@odata.count"?: number;
  value: Array<PartnerCategoryDTO>
}

export interface PartnerCategoryDTO {
    Id: number;
    Name: string;
    ParentId?: number;
    CompleteName: string;
    Active: boolean;
    ParentLeft: number;
    ParentRight: number;
    Discount?: number;
}
