import { Pipe, PipeTransform } from '@angular/core';
import { TruncateString } from 'tds-report';

@Pipe({
  name: 'truncateString'
})

export class TruncateStringPipe implements PipeTransform {
  transform(value: string, limit?: number): any {
    return TruncateString(value, limit || 10, 'end');
  }
}