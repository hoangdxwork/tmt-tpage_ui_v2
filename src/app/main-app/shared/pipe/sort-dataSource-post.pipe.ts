import { filter } from 'rxjs/operators';
import { ChatomniDataItemDto, ChatomniMessageType } from './../../dto/conversation-all/chatomni/chatomni-data.dto';
import { Pipe, PipeTransform } from '@angular/core';
import { TDSHelperString, TDSHelperArray } from 'tds-ui/shared/utility';

@Pipe({
  name: 'sortDataSourcePost'
})

export class SortDataSourcePostPipe implements PipeTransform {

  constructor(){}

  transform(data: ChatomniDataItemDto[]): any { 
    let dataChild: ChatomniDataItemDto[] = [];
    let model: ChatomniDataItemDto[] = [];

    if(data && TDSHelperArray.hasListValue(data)) {
      dataChild = this.sortChildComment(data);
    }

    if(data && data.length > 0) {
      data.map(x => {
          if(x && !TDSHelperString.hasValueString(x.ParentId) && (x.Type == ChatomniMessageType.FacebookComment || x.Type == ChatomniMessageType.TShopComment)) {
              model = [...model, ...[x]]
              let childitem: ChatomniDataItemDto[] = [];

              dataChild.map(child => { 
                if(child && child.ParentId == x.Data?.id) {
                  model = [...model, ...[child]];
                } else {
                  childitem = [...childitem, ...[child]];
                }
              })

              dataChild = [...childitem];
          }
      })
      dataChild.map(x=> { x.isNoPartnerId = true});

      model = [...model, ...dataChild];
    }
    return [...model];
  }

  sortChildComment(data: ChatomniDataItemDto[]){
    let model: ChatomniDataItemDto[] = [];

    data?.map(x => {
      if(x && x.ParentId){
          model = [...model, ...[x]];
      }
    });

    model = model.sort((a: ChatomniDataItemDto, b: ChatomniDataItemDto) => Date.parse(a.CreatedTime) - Date.parse(b.CreatedTime));
    return [...model];
}
}

@Pipe({
  name: 'sortDataSourceMessage'
})

export class SortDataSourceMessagePipe implements PipeTransform {

  constructor(){}

  transform(data: ChatomniDataItemDto[]): any {
    let model: ChatomniDataItemDto[] = [];
    data = data?.sort((a: ChatomniDataItemDto, b: ChatomniDataItemDto) => Date.parse(a.ChannelCreatedTime) - Date.parse(b.ChannelCreatedTime));

    model = data?.map((x: ChatomniDataItemDto, i: number)=>{
      //TODO: Kiểm tra hiện tại
      if(x.Type == ChatomniMessageType.FacebookComment || x.Type == ChatomniMessageType.TShopComment ){
        x.IsShowAvatar = false;
        return x;
      }

      //TODO: kiểm tra item kế item hiện tại là client
      if(i + 1 <  data.length && !x.IsOwner && data[i + 1]?.IsOwner || i + 1 == data.length){
        x.IsShowAvatar = true;
        return x;
      }

      //TODO: kiểm tra item kế item hiện tại là isAdmin
      if(i + 1 <  data.length && x.IsOwner && !data[i + 1]?.IsOwner || i + 1 == data.length){
        x.IsShowAvatar = true;
        return x;
      }

      //TODO: Kiểm tra thời gian của item kế tiếp
      if(data[i+1] && data[i+1].ChannelCreatedTime && x.ChannelCreatedTime && this.setTime(x.ChannelCreatedTime, data[i+1].ChannelCreatedTime) >= 300 ){
        x.IsShowAvatar = true;
        return x;
      }

      x.IsShowAvatar = false;
      return x;
    })

    return [...model];
  }

  setTime(value1: Date, value2: Date){
    let millisecond = 1000;
      var date1:any = new Date(value1);
      var date2:any = new Date(value2);

      var timediff = (date2 - date1) / millisecond;
      if (isNaN(timediff)) return NaN;

    return timediff
  }
}

