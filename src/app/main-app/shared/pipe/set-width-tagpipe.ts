import { TDSHelperArray } from 'tds-ui/shared/utility';
import { ChatomniConversationTagDto } from 'src/app/main-app/dto/conversation-all/chatomni/chatomni-conversation';
import { ElementRef, Pipe, PipeTransform, QueryList } from '@angular/core';

@Pipe({
  name: 'onSetWidthTag'
})
export class OnSetWidthTagPipe implements PipeTransform {

  transform(tags: ChatomniConversationTagDto[], totalWidthTag:number, widthTag: QueryList<ElementRef>, isChangeTag: boolean): number {
    // setTimeout(() => {
       
    // }, 1000);
    if(tags && tags.length == 0) {
        return 0;
    }
    if(widthTag == undefined) {
        return 0;
    }

    let displayTag = 0;
    let widthItemPlush = 35;
    let gapTag = 4;
    let plusWidthTag = 0;


    widthTag.forEach(x=> {
        if(plusWidthTag >= totalWidthTag - widthItemPlush){
          return;
        }
        displayTag += 1;
        plusWidthTag = plusWidthTag + x.nativeElement?.offsetWidth + gapTag;
    });
    
    if(TDSHelperArray.hasListValue(tags)) {
      let  countHiddenTag = (tags!.length - displayTag) || 0;
      return countHiddenTag;
    }

    return 0;

  }
}