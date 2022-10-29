import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'seenedMessage'
})

export class SeenedMessagePipe implements PipeTransform {

  constructor(){}

  transform(type: string, countUnread: number): any {
    return (type == 'all' && countUnread > 0) || (type == 'message' && countUnread > 0) || (type == 'comment' && countUnread > 0)

  }

}