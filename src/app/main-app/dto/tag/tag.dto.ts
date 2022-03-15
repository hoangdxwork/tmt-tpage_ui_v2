export interface TagDTO {
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
