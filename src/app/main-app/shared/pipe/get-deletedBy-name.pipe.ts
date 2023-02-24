import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getDeletedByName'
})

export class GetDeletedByNamePipe implements PipeTransform {

  constructor(){}

  transform(option: any): any {
    switch(option) {
        case 'cancel_checkout': 
            return 'Hủy giỏ hàng'
        case 'checkout':
            return 'Giỏ hàng checkout'
        case 'user':
            return 'Shop xóa'
        default:
            return '';
    }
  }

}