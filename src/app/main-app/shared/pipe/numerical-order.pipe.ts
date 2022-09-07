import { formatNumber } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { vi_VN } from 'tds-ui/i18n';

@Pipe({
  name: 'numericalOrder'
})

export class NumericalOrder implements PipeTransform {

  constructor(){}

  transform(index: number, pageSize: number, pageIndex: number ): number {
    return pageSize * (pageIndex - 1) + index + 1;
  }

}
