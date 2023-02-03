import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dictSourcePipe'
})

export class DictSourcePipe implements PipeTransform {

  constructor(){}

  transform(source: string): string {
    if(!source) return '';

    switch (source) {
      case 'FacebookComment':
        return 'Bình luận';
      case 'FacebookMessage':
        return 'Tin nhắn';
      case 'FacebookBot':
        return 'Tự động';
      default:
        return '';
    }
  }

}
