import { PartnerTimeStampItemTagsDto } from './../../dto/partner/partner-timestamp.dto';
import { ChatomniConversationTagDto } from 'src/app/main-app/dto/conversation-all/chatomni/chatomni-conversation';
import { Pipe, PipeTransform } from '@angular/core';

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