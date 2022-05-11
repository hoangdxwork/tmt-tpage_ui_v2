import { DateFormat } from 'src/app/lib/consts/date-format.const';
import { DatePipe, formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
   name: 'yiDateTimeV3'
})

export class YiDateTimeV3Pipe extends DatePipe implements PipeTransform {

    transform(value: any): any {

      // const input = formatDate(value, 'YYYYMMDD', 'en-US');
      // const today = formatDate(new Date(), 'YYYYMMDD', 'en-US');
      // const yesterday = moment().subtract(1, 'days').format('YYYYMMDD');

      // if(input == today) {
      //   return "Hôm nay, " + moment(value).format("DD-MM-YYYY HH:mm");
      // }

      // if(input == yesterday) {
      //   return "Hôm qua, " + moment(value).format("DD-MM-YYYY HH:mm");
      // }

      // return moment(value).format("dddd, DD-MM-YYYY HH:mm");
    }
}
