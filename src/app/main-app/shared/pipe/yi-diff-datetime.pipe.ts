import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
   name: 'yiDiffDateTime'
})

export class YiDiffDateTimePipe extends DatePipe implements PipeTransform {

  transform(value: any): any {
      var second=1000, minute=second*60, hour=minute*60, day=hour*24, week=day*7;
      var date1:any = new Date(value);
      var date2:any = new Date();

      var timediff = date2 - date1;
      if (isNaN(timediff)) return NaN;

      var minutes =  Math.floor(timediff / minute);
      var hours =  Math.floor(timediff / hour);
      var days = Math.floor(timediff / day);
      var weeks = Math.floor(timediff / week);
      var years = Math.floor(date2.getFullYear() - date1.getFullYear());

      if(minutes > 1 && minutes < 60) {
        return `${minutes} phút trước`;
      }
      if(hours >= 1 && hours < 24) {
        return `${hours} giờ trước`;
      }
      if(days >= 1 && days < 7) {
        return `${days} ngày trước`;
      }
      if(weeks >= 1 && weeks < 52) {
        return `${weeks} tuần trước`;
      }
      if(years >= 1) {
        return `${years} năm trước`;
      }

      return '1 phút trước';
  }
}
