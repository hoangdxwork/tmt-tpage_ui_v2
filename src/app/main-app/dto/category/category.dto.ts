export interface POS_CategoryDTO {
  id: number;
  name: string;
  parentId?: number;
  parent: POS_CategoryDTO;
  sequence?: number;
  nameGet: string;
}
