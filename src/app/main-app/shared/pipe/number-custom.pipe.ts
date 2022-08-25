import { formatNumber } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { vi_VN } from 'tds-ui/i18n';

@Pipe({
  name: 'numberCustom'
})

export class NumberCustomPipe implements PipeTransform {

  constructor(){}

  transform(value: any, form: string): any {
    if(value) {
      let format = formatNumber(value, vi_VN.locale).replace(',', form);
      return format
    }
    return null;
  }

}
