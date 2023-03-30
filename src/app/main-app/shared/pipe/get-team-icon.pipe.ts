import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { Pipe, PipeTransform } from '@angular/core';
import { CRMTeamType } from '@app/dto/team/chatomni-channel.dto';

@Pipe({
  name: 'getTeamIcon'
})

export class GetTeamIconPipe implements PipeTransform {

  constructor(){}

  transform(crmTeamId: number, crmTeamList: CRMTeamDTO[]): string {
    let team!: CRMTeamDTO;

    crmTeamList?.map(x => {
      if(x.Childs && x.Childs.length > 0) {
        let exist = x.Childs.find(a=>a.Id == crmTeamId);

        if(exist) {
          team = exist;
        }
      } else {
        if(x.Id == crmTeamId) {
          team = x;
        }
      }
    })

    if(team) {
      switch(team.Type) {
        case CRMTeamType._Facebook:
          return 'tdsi-facebook-1-fill text-info-500 text-[20px]';
        case CRMTeamType._TUser:
        case CRMTeamType._TShop:
          return 'tdsi-play-fill text-base-orange-500 text-[20px]';
        case CRMTeamType._TikTok:
        case CRMTeamType._UnofficialTikTok:
          return 'tdsi-tiktok-fill text-neutral-1-500 text-[20px]';
        default:
          return '';
      }
    }
    return '';
  }

}

@Pipe({
  name: 'getTeamCount'
})
export class GetTeamCountPipe implements PipeTransform {
  constructor(){}
  transform(crmTeamList: CRMTeamDTO[], type: string) {
    if(crmTeamList && crmTeamList.length > 0) {
      return crmTeamList.find(x => x.Type == type)?.Childs?.length || 0;
    }
    return 0;
  }
}