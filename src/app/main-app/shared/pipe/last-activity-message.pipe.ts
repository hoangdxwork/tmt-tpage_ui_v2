import { Pipe, PipeTransform } from "@angular/core";
import { ConversationMatchingItem } from "../../dto/conversation-all/conversation-all.dto";

@Pipe({
  name: 'lastActivityMessage'
})

export class LastActivityMessagePipe implements PipeTransform {

    transform(item: ConversationMatchingItem, type: any): any {
      if(type && type == "message" && item && item.last_message) return item.last_message;

      else if(type && type == "comment" && item && item.last_comment) return item.last_comment;

      else if(item && item.last_activity) return item.last_activity || {};

      return null;
    }
}
