
export interface ODataTagsPartnerDTO {
  "@odata.context"?: string,
  value: Array<TagsPartnerDTO>
}

export interface TagsPartnerDTO {
  Id: number;
  Name: string;
  NameNosign: string;
  Color: string;
  Type: string;
}
