export interface POS_CategoryDTO {
  Id: number;
  Name: string;
  ParentId?: number;
  Parent: POS_CategoryDTO;
  Sequence?: number;
  NameGet: string;
}
