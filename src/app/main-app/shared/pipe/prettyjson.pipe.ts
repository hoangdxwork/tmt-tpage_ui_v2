import { Pipe, PipeTransform } from "@angular/core";
import { TDSSafeAny } from "tds-ui/shared/utility";

@Pipe({
  name: 'prettyjson'
})
export class PrettyjsonPipe implements PipeTransform {

  transform(value: TDSSafeAny): any {
      var data =  JSON.parse(value);
      return data;
  }

}
