import { Pipe, PipeTransform } from "@angular/core";
import { TDSHelperString } from "tds-ui/shared/utility";

@Pipe({
  name: 'splitComma'
})
export class SplitCommaPipe implements PipeTransform {

  transform(value: string): Array<any> {
    if(TDSHelperString.hasValueString(value)) {
      return value.split(",");
    }
    return [];
  }

}
