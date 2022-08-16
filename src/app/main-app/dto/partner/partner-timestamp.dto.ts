
export interface PartnerTimeStampItemTagsDto {
  tpid: string;
  name: string;
  color_class: string;
}

export interface PartnerTimeStampItemDto {
  i: number;
  c: string;
  p: boolean;
  a: boolean;
  s: string;
  st: string;
  ss: string;
  t: PartnerTimeStampItemTagsDto[];
}

export interface Data {
  [key: string]: PartnerTimeStampItemDto
}

export interface PartnerTimeStampDto {
  Next?: any;
  Last: number;
  Data: PartnerTimeStampItemDto;
}
