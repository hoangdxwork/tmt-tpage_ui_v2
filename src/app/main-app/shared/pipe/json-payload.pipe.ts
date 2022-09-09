import { TDSConversationItemComponent } from './../tds-conversations/tds-conversation-item.component';
import { Pipe, PipeTransform, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { MessagePayloadDto } from '@app/dto/conversation-all/chatomni/message-payload.dto';

@Pipe({
  name: 'jsonPayload'
})

export class jsonPayloadPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {
  }

  transform(json: any): any {
    return json;
  }
}


