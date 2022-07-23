import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buttonStatusColor'
})

export class ButtonStatusColorPipe implements PipeTransform {

  constructor(){}

  transform(color: string, isBg?: boolean): any {
    let opacity = 30;
    return { 'border-color': color, 'color': color, 'background-color': isBg?'none':( color + opacity)};
  }

}