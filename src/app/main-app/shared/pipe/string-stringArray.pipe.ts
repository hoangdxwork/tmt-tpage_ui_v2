import { TDSHelperArray, TDSHelperString } from 'tds-ui/shared/utility';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'stringToStringArray'
})
export class StringToStringArrayPipe implements PipeTransform {

    transform(value: string | string[]): any {
        
        if(TDSHelperString.isString(value)){
            return (value as string).split(",");
        }

        if(TDSHelperArray.isArray(value)){
            return value;
        }
    }
  }