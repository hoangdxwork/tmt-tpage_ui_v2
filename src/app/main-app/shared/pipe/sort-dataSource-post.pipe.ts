import { ChatomniDataItemDto } from './../../dto/conversation-all/chatomni/chatomni-data.dto';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortDataSourcePost'
})

export class SortDataSourcePostPipe implements PipeTransform {

  constructor(){}

  transform(data: ChatomniDataItemDto[]): any {
    let model: ChatomniDataItemDto[] = [];
    data.map(x=>{
        if(!x.ParentId)
            model = [...model, ...[x]]
    })

    return model;
  }
}

@Pipe({
  name: 'sortDataSourceMessage'
})

export class SortDataSourceMessagePipe implements PipeTransform {

  constructor(){}

  transform(data: ChatomniDataItemDto[]): any {
    let model: ChatomniDataItemDto[] = [];
    model = data.sort((a: ChatomniDataItemDto, b: ChatomniDataItemDto) => Date.parse(a.CreatedTime) - Date.parse(b.CreatedTime))

    return [...model];
  }
}

