import { TDSSafeAny } from 'tds-ui/shared/utility';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'selectMultipleValue'
})

export class SelectMultipleValuePipe implements PipeTransform {

  constructor(){}

  transform(list: TDSSafeAny[]): any {
    let arr:number[] = [];
    
    list.forEach(item => {
      arr.push(item.Id);
    });

    return arr
  }

}