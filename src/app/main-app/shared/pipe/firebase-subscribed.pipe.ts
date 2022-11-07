import { PartnerTimeStampItemTagsDto } from '../../dto/partner/partner-timestamp.dto';
import { ChatomniConversationTagDto } from 'src/app/main-app/dto/conversation-all/chatomni/chatomni-conversation';
import { Pipe, PipeTransform } from '@angular/core';
import { LiveCampaignSimpleDetail } from '@app/dto/live-campaign/livecampaign-simple.dto';
import { TopicDetailDto } from '@app/dto/firebase/topics.dto';

@Pipe({
  name: 'firebaseSubscribed'
})

export class FirebaseSubscribedPipe implements PipeTransform {

  constructor(){}

  transform(isActive: boolean, ids: any, item: any): any {
      item = item as TopicDetailDto;

      let exist = ids?.filter((x: any) => item && x == item.id)[0];
      if(exist) {
          item.isActive = true;
      } else {
          item.isActive = false;
      }

      isActive = item.isActive;
      return isActive;
  }

}

