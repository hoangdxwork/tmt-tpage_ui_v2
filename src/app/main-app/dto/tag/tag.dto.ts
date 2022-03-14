export class TagDTO {
  public id: number;
  public name: string;
  public nameNosign: string;
  public color: string;
  public type: string;
}

export class UpdateTagMappingDTO {
  public pageId: string;
  public tagId: string;
  public action: string;
}
