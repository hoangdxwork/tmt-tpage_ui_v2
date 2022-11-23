import { Pipe, PipeTransform } from '@angular/core';
import { TopicDetailDto } from '@app/dto/firebase/topics.dto';

@Pipe({
  name: 'firebaseSubscribed'
})

export class FirebaseSubscribedPipe implements PipeTransform {

  constructor(){}

  transform(item: any, ids: any): any {
      item = item as TopicDetailDto;

      let exist = ids?.filter((x: any) => item && x == item.id)[0];
      if(exist) {
          item.isActive = true;
      } else {
          item.isActive = false;
      }

      return item.isActive;
  }

}

