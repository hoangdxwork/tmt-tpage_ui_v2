import { vi_VN } from 'tmt-tang-ui';
import { isToday, isYesterday } from 'date-fns';
import { DatePipe, formatDate, WeekDay } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
   name: 'yiDateTimeV3'
})

export class YiDateTimeV3Pipe extends DatePipe implements PipeTransform {

    transform(value: any): any {
        const input = new Date(value);
        
        if(isToday(input)) {
            return "Hôm nay, " + formatDate(input,'dd-MM-yyyy hh:mm',vi_VN.locale);
        }

        if(isYesterday(input)) {
            return "Hôm qua, " + formatDate(input,'dd-MM-yyyy hh:mm',vi_VN.locale);
        }

        return formatDate(input,'EEEE, dd-MM-yyyy hh:mm',vi_VN.locale);
    }
}
