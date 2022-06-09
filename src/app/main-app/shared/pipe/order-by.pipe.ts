import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({ name: 'orderBy' })
export class OrderByPipe implements PipeTransform {

    transform(value: any[], column: string, mess = ''): any[] {

        if (!value || !column || column === '' || mess === '') { return value; }
        if (value.length <= 1) { return value }

        // column is date
        if(!isNaN(Date.parse(value[0][column]) )) {
          return _.orderBy(value, [(obj: any) => new Date(obj[column]).getTime()], [mess] as any);
        }

        return _.orderBy(value, [column], [mess] as any);
    }
}
