import { ChatomniObjectsItemDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';
import { EventEmitter, Injectable } from "@angular/core";
import { LiveCampaignModel } from '@app/dto/live-campaign/odata-live-campaign.dto';

@Injectable()

export class ObjectFacebookPostEvent{
  //TODO: Cập nhật chiến dịch live coversation-post-view-v3 và Object-facebook-post
  public changeUpdateLiveCampaignFromObject$: EventEmitter<ChatomniObjectsItemDto> = new EventEmitter<ChatomniObjectsItemDto>();
  public changeDeleteLiveCampaignFromObject$: EventEmitter<ChatomniObjectsItemDto> = new EventEmitter<ChatomniObjectsItemDto>();
}
