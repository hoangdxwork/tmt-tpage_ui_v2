export interface TagDTO { // /odata/Tag/ODataService.GetByType?type=fastsaleorder
  Id: number;
  Name: string;
  NameNosign: string;
  Color: string;
  Type: string;
}

export interface UpdateTagMappingDTO {
  pageId: string;
  tagId: string;
  action: string;
}

export interface PagesDTO { // /rest/v1.0/partner/11/pages
  page_id: string;
  psid: string;
}
