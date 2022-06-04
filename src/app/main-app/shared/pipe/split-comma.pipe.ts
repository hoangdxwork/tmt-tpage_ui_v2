import { Pipe, PipeTransform } from "@angular/core";
import { TDSHelperString, TDSSafeAny } from "tmt-tang-ui";

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
