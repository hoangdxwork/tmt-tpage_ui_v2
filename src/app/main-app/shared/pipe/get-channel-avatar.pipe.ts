import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'getChannelAvatar'
})

export class GetChannelAvatarPipe implements PipeTransform {

  constructor(){}

  transform(team: CRMTeamDTO) : any {
    return team?.ChannelAvatar || team?.OwnerAvatar;
  }
}