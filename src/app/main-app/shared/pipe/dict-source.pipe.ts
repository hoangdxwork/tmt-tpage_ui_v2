import { TDSHelperString } from 'tds-ui/shared/utility';
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
      case 'TShopComment': 
      case 'UnofficialTikTokComment':
        return 'Bình luận';

      case 'FacebookMessage': 
      case 'TShopConversation': 
      case 'UnofficialTikTokConversation':
        return 'Tin nhắn';

      case 'FacebookBot': 
      case 'TShopBot': 
      case 'UnofficialTikTokBot':
        return 'Tự động';
        
      default:
        return '';
    }
  }

}

@Pipe({
  name: 'createBillSourcePipe'
})

export class CreateBillSourcePipe implements PipeTransform {

  constructor(){}

  transform(source: string | undefined, createByName?: string, isString?: boolean): any {

    if(isString) {

      if(!source) return (createByName || '');

      switch (source) {

        case 'SHOPAPP':
          return 'Tạo từ giỏ hàng';
  
        default:
          return (createByName || '');
      }
    }

    if(!source) return false;

    switch (source) {

      case 'SHOPAPP':
        return true;

      default:
        return false;
    }
    
  }

}
