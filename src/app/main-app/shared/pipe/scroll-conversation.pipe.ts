import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'scrollConversation' })
export class ScrollConversationPipe implements PipeTransform {

    constructor(private cdRef: ChangeDetectorRef) {}

    transform(value: any[], element: any) {

      let data = [...value];
      let lockYOffset = 40;

      if(element && value?.length > 0) {
        const yBottom = (element.scrollHeight - element.scrollTop - element.clientHeight ) as number;

        if(yBottom < Number(lockYOffset)) {
          setTimeout(() => {
            element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
            this.cdRef.markForCheck();
          }, 750)
        }
      }
      return data;
    }
}
