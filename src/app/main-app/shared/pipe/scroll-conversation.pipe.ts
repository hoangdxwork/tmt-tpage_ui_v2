import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'scrollConversation' })
export class ScrollConversationPipe implements PipeTransform {

    transform(value: any[], element: any) {
      // let lockYOffset = 40;
      // if(element && value?.length > 0) {
      //   const yBottom = (element.scrollHeight - element.scrollTop - element.clientHeight ) as number;

      //   if(yBottom < Number(lockYOffset)) {
      //     setTimeout(() => {
      //       element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
      //     }, 750)
      //   }
      // }
      return value;
    }
}
