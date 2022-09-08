import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberCustom'
})

export class NumberCustomPipe implements PipeTransform {

  constructor(){}

  transform(value: any) {
    if (value != null) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return value
  }

}
