import { Pipe, PipeTransform } from "@angular/core";
import { ChatomniConversationItemDto } from "@app/dto/conversation-all/chatomni/chatomni-conversation";
import { ChatomniMessageType } from "@app/dto/conversation-all/chatomni/chatomni-data.dto";

@Pipe({
  name: 'latestMessageType'
})

export class LatestMessageTypePipe implements PipeTransform {

  transform(item: ChatomniConversationItemDto, type: string, ) : any {

    if(type === 'comment' &&
      (item.LatestMessage?.MessageType == ChatomniMessageType.FacebookComment || item.LatestMessage?.MessageType == ChatomniMessageType.TShopComment)) {
        return item;
    }

    if(type === 'message' &&
      (item.LatestMessage?.MessageType == ChatomniMessageType.FacebookMessage || item.LatestMessage?.MessageType == ChatomniMessageType.TShopMessage)) {
        return item;
    }

    if(type === 'all') {
      return item;
    }

    return null;
  }
}


