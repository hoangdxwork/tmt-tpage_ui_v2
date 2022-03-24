export interface TagDTO { // /odata/Tag/ODataService.GetByType?type=fastsaleorder
  id: number;
  name: string;
  nameNosign: string;
  color: string;
  type: string;
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
