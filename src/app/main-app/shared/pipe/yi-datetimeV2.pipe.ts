import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { DateFormat } from 'src/app/lib/consts/date-format.const';

@Pipe({
    name: 'yiDateTimeFormat'
})

export class YiDateTimeFormatPipe extends DatePipe implements PipeTransform {

  transform(value: any, args?: any): any {

    let now = new Date();
    let currentDay = now.getDate();
    let currentMonth = now.getMonth();
    let currentYear = now.getFullYear();

    let date = new Date(value);

    let toDay = date.getDate();
    let toMonth = date.getMonth();
    let toYear = date.getFullYear();

    if (currentYear == toYear) {
        if (currentMonth == toMonth) {
          return super.transform(value, DateFormat.ddMMHHmm_FORMAT);
        }
    } else {
        return super.transform(value, DateFormat.ddMMyyyy_FORMAT);
    }
  }
}
