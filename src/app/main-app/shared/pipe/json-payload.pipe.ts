import { TDSConversationItemComponent } from './../tds-conversations/tds-conversation-item.component';
import { Pipe, PipeTransform, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { MessagePayloadDto } from '@app/dto/conversation-all/chatomni/message-payload.dto';

@Pipe({
  name: 'jsonPayload'
})

export class jsonPayloadPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer){
  }

  transform(json: any) : any {
    if(typeof json === 'string') {
      if (/^[\[|\{](\s|.*|\w)*[\]|\}]$/.test(json)) {
        let model = JSON.parse(json) as MessagePayloadDto;

        let order_url = model.attachment?.payload?.order_url;
        let check = order_url.lastIndexOf('/');
        if(check !== -1) {
          order_url = order_url.substring(check).replace('/', '');
        }

        if(model.attachment && model.attachment.payload){
          let message = `${model.attachment.payload.recipient_name} đã tạo đơn hàng <span class="font-semibold code-bill" id="${order_url}">${model.attachment.payload.order_number}</span>`

          return message
        }
      }
    }

    return json;
  }
}


