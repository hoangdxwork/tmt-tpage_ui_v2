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
