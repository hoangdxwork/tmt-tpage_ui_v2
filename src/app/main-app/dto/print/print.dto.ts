export interface PrinterDTO {
  Id: string;
  Name: string;
}

export interface PrinterConfigDTO {
  Code: string;
  Name: string;
  Template: PrinterTemplateEnum;
  PrinterId: string;
  PrinterName: string;
  Ip: string;
  Port: string;
  Note: string;
  FontSize: string;
  NoteHeader: string;
  IsUseCustom: boolean;
  IsPrintProxy: boolean;
  IsPrintTpos: boolean;
  Others: PrinterConfig_OtherDTO[];
}

export interface PrinterConfig_OtherDTO {
  Text: string;
  Key: string;
  Value: boolean;
}

export enum PrinterTemplateEnum
{
    BILL80,
    A6,
    A5,
    A4,
    BILL58,
    BILL50x50,
    BILL80x35,
    BILL80x60,
    BILL80x80,
    BILL80x100,
    BILL100x150,
    BILL80_Image,
}
