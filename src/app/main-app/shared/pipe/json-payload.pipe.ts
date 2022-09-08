import { TDSConversationItemComponent } from './../tds-conversations/tds-conversation-item.component';
import { Pipe, PipeTransform, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
  name: 'jsonPayload'
})

export class jsonPayloadPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer){
  }

  transform(json: any) : any {
    if(typeof json === 'string') {
      if (/^[\[|\{](\s|.*|\w)*[\]|\}]$/.test(json)) {
        let model = JSON.parse(json);
          
        if(model.attachment && model.attachment.payload){
          let message = `${model.attachment.payload.recipient_name} đã tạo đơn hàng <span class="font-semibold code-bill" (click)="child()">${model.attachment.payload.order_number}</span>`
          
          return message
        }
      }
    }
   
    return json;
  }
}


