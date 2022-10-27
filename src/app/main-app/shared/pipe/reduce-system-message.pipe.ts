import { Pipe, PipeTransform } from '@angular/core';
import { ChatomniDataItemDto, ChatomniMessageType } from '@app/dto/conversation-all/chatomni/chatomni-data.dto';

@Pipe({
  name: 'reduceSystemMessage'
})

export class ReduceSystemMessagePipe implements PipeTransform {

  constructor(){}

  transform(data: ChatomniDataItemDto[]): any {

    let systems: ChatomniDataItemDto[] = [];

    data.map(x => {
      if(x && x.Type === ChatomniMessageType.System && x.Message) {
          systems = [...systems, ...[x]];
      }
    });

    if(systems.length == 0) return data;

    systems?.forEach((x, index) => {
      if((index + 1) <= systems.length) {
          let prevTime = x.ChannelCreatedTime;
          let nextTime = systems[index + 1]?.ChannelCreatedTime;

          let sqlDatetime = (new Date(nextTime).getTime()) - (new Date(prevTime).getTime());

          if(sqlDatetime < 3600) {
              x.Message = '';
          }
      }
    })

    systems = [...systems];
    return [...data];
  }

}
