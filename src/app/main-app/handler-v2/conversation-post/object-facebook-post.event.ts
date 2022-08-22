import { ChatomniObjectsItemDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';
import { EventEmitter, Injectable } from "@angular/core";

@Injectable()

export class ObjectFacebookPostEvent{
  //TODO: Cập nhật chiến dịch live coversation-post-view-v3 và Object-facebook-post
  public changeLiveCampaignFromObject$: EventEmitter<ChatomniObjectsItemDto> = new EventEmitter();
}