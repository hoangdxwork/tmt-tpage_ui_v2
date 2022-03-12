import { MailTemplateDTO } from "../mailtemplate/mail-template.dto";
import { ProductInnerDTO } from "../product/product.dto";

export class FacebookGraphMessageDTO {
  public id: string;
  public message: string;
  public message_formatted: string;
  public created_time: Date;
  public from: FacebookGraphUserSimpleDTO;
  public to: FacebookInnerListDTO<FacebookInnerUserSimpleDTO>;
  public attachments: FacebookInnerDataListDTO<FacebookGraphAttachmentDTO>;
}

export class FacebookInnerUserSimpleDTO {
  public id: string;
  public name: string;
}

export class FacebookGraphAttachmentDTO {
  public image_data: ImageData;
  public video_data: VideoData;
}

export class ImageData {
  public url: string;
}

export class VideoData {
  public url: string;
}

export class FacebookGraphUserSimpleDTO {
  public id: string;
  public name: string;
  public uid: string;
}

export class FacebookInnerListDTO<T> {
  public data: Array<T>;
}

export class FacebookInnerDataListDTO<T> {
  public data: Array<T>;
  public paging: FacebookInnerPagingDTO;
}

export class FacebookInnerPagingDTO {
  public cursors: FacebookInnerCursorDTO;
  public next: string;
  public previous: string;
}

export class FacebookInnerCursorDTO {
  public before: string;
  public after: string;
}

export class ObjectDataDTO {
  public id: string;
}

export class GenerateMessageDTO {
  public orderIds: Array<string>;
  public saleIds: Array<number>;
  public template: MailTemplateDTO;

  constructor() {
    this.orderIds = new Array<string>();
    this.saleIds = new Array<number>();
    this.template = new MailTemplateDTO();
  }
}

export class AddTemplateMessageDTO {
  public page_id: string;
  public to_id: string;
  public product: ProductInnerDTO;

  constructor() {
    this.product = new ProductInnerDTO();
  }
}
