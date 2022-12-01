export interface ChatomniObjectDataTiktokDto {
  id: string;
  id_str: string;
  owner: TiktokOwnerDto;
  create_time: number;
}

export interface TiktokOwnerDto {
  id: string;
  id_str: string;
  nickname: string;
  bg_img_url: string;
  bio_description: string;
}

