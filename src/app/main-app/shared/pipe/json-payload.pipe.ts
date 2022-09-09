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
    if(this.tryParseJSONObject(json)) {
      let payload = this.tryParseJSONObject(json) as MessagePayloadDto;
      if(payload && payload.attachment && payload.attachment.payload && payload.attachment.payload){
        let order_url = payload.attachment?.payload?.order_url;

        if(order_url){
          let check = order_url.lastIndexOf('/');
          if(check !== -1) {
            order_url = order_url.substring(check).replace('/', '');
          }
  
          if(payload.attachment && payload.attachment.payload){
            let message = `${payload.attachment.payload.recipient_name} đã tạo đơn hàng <span class="font-semibold cursor-pointer payload" id="${order_url}">#${payload.attachment.payload.order_number}</span>`
  
            return message
          }
        }
      }
    }

    return json;
  }

  tryParseJSONObject (jsonString: any){
    try {
        var o = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns null, and typeof null === "object", 
        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
        if (o && typeof o === "object") {
            return o;
        }
    }
    catch (e) { }

    return false;
};
}


