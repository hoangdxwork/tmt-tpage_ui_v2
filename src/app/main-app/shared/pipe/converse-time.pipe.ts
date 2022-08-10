import { formatDate } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";
import * as _ from "lodash";
import { en_US, vi_VN } from "tds-ui/i18n";

@Pipe({
  name: "converseTime"
})

export class ConverseTimePipe implements PipeTransform {

  transform(timeString: string) {
    let arr = timeString.split('h');
    let hour = Number(arr[0]);
    let minute = Number(arr[1]);
    let time = new Date().setHours(hour,minute);

    return formatDate(new Date(time),'h:mm a',en_US.locale);
  }
}
