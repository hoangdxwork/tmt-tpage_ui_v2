import { Pipe, PipeTransform } from "@angular/core";
import { ChatomniConversationItemDto } from "../../dto/conversation-all/chatomni/chatomni-conversation";
import { CrmMatchingV2Detail } from "../../dto/conversation-all/crm-matching-v2/crm-matching-v2.dot";

@Pipe({
  name: 'lastActivityMessage'
})

export class LastActivityMessagePipe implements PipeTransform {

    transform(item: any, type: any): any {

      // if(type && type == "message" && item && item.last_message) return item.last_message;

      // else if(type && type == "comment" && item && item.last_comment) return item.last_comment;

      // else if(item && item.last_activity) return item.last_activity || {};

      return null;
    }
}
