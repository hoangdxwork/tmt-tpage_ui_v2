import { TDSHelperArray, TDSHelperString } from 'tds-ui/shared/utility';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'stringToStringArray'
})
export class StringToStringArrayPipe implements PipeTransform {

    transform(value: string): any {

      let result: any = [];
      if(TDSHelperString.hasValueString(value)){
          if(!value.includes(',')) {
              result.push(value);
          } else {
              result = value.split(',');
          }
      }

      return result;
    }
  }
