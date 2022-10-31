import { PartnerTimeStampItemTagsDto } from './../../dto/partner/partner-timestamp.dto';
import { ChatomniConversationTagDto } from 'src/app/main-app/dto/conversation-all/chatomni/chatomni-conversation';
import { Pipe, PipeTransform } from '@angular/core';
import { LiveCampaignSimpleDetail } from '@app/dto/live-campaign/livecampaign-simple.dto';

@Pipe({
  name: 'checkTagSelected'
})

export class CheckTagSelectedPipe implements PipeTransform {

  constructor(){}

  transform(id: string, lstData: ChatomniConversationTagDto[]): any {
    for( let item of lstData){
        if(item.Id == id)
            return true
    }
    return false
  }

}

@Pipe({
  name: 'checkTagSelectedComment'
})

export class CheckTagSelectedCommnetPipe implements PipeTransform {

  constructor(){}

  transform(id: string, lstData: PartnerTimeStampItemTagsDto[]): any {
    for( let item of lstData){
        if(item.tpid == id)
            return true;
    }
    return false;
  }

}

@Pipe({
  name: 'indexSimpleDetailLiveCampain'
})

export class IndexSimpleDetailLiveCampainPipe implements PipeTransform {

  constructor(){}

  transform(item: LiveCampaignSimpleDetail, data: any): any {
    let formDetails = data;
    let index = formDetails.findIndex((x: any) => x.value && (x.value.ProductId === item.ProductId) && (x.value.UOMId == item.UOMId));
    return index;
  }

}
