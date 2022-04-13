
export interface FBUserPageRequestDTO {
  data: Array<UserPageDTO>;
  paging: FBRequestCursorDTO;
}

export interface FBRequestCursorDTO {
  after: string;
  before: string;
}

export interface UserPageDTO {
  access_token: string;
  category: string;
  category_list: Array<PageCategoryListDTO>;
  id: string;
  link: string;
  name: string;
  picture: PagePictureDTO;
}

export interface PageCategoryListDTO {
  id: string;
  name: string;
}

export interface PagePictureDTO {
  data: PageDataPictureDTO;
}

export interface PageDataPictureDTO {
  height: number;
  is_silhouette?: boolean;
  url: string;
  width: number;
}
