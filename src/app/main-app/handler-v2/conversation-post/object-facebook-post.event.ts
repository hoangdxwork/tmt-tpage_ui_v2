import { ChatomniObjectsItemDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';
import { EventEmitter, Injectable } from "@angular/core";

@Injectable()

export class ObjectFacebookPostEvent{
  //TODO: Cập nhật chiến dịch live coversation-post-view-v3 và Object-facebook-post
  public changeUpdateLiveCampaignFromObject$: EventEmitter<ChatomniObjectsItemDto> = new EventEmitter<ChatomniObjectsItemDto>();
  public changeDeleteLiveCampaignFromObject$: EventEmitter<ChatomniObjectsItemDto> = new EventEmitter<ChatomniObjectsItemDto>();

  // TODO: Áp dụng ngay cho những bình luận đã có
  public onChangeRescanAutoOrder$: EventEmitter<boolean> =  new EventEmitter<boolean>();
}
