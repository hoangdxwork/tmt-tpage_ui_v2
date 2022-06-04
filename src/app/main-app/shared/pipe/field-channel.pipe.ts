import { Pipe, PipeTransform } from '@angular/core';
import { CRMTeamDTO } from '../../dto/team/team.dto';

@Pipe({
  name: 'fieldChannel'
})

export class FieldChannelPipe implements PipeTransform {

  constructor(){}

  transform( lstChannel: CRMTeamDTO[], value: number): CRMTeamDTO[] {
    if(!lstChannel || lstChannel.length < 1) return lstChannel;

    let result: CRMTeamDTO[] = [];

    if(value == 1) return lstChannel;
    else if(value == 2) {
      result = lstChannel.filter(x => x.Active);
    }
    else if(value == 3) {
      result = lstChannel.filter(x => !x.Active);
    }
    else if(value == 4) {
      return result;
    }

    return result;
  }

}
