import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberCustom'
})

export class NumberCustomPipe implements PipeTransform {

  constructor(){}

  transform(value: any) {
    return value;
  }

}
