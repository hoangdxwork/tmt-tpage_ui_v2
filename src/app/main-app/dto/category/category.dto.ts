export class POS_CategoryDTO {
  public id: number;
  public name: string;
  public parentId?: number;
  public parent: POS_CategoryDTO;
  public sequence?: number;
  public nameGet: string;
}
