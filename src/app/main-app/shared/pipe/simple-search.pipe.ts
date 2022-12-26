import { QuickReplyDTO } from './../../dto/quick-reply.dto.ts/quick-reply.dto';
import { TDSHelperString } from 'tds-ui/shared/utility';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({  name: 'simpleSearchV2' })
  export class SimpleSearchV2Pipe implements PipeTransform {

  public transform(datas: any[], term: string) {
      if (!TDSHelperString.hasValueString(term)) return datas;

      term = TDSHelperString.stripSpecialChars(term.toLocaleLowerCase()).trim();

      let items = datas?.filter((x: any) => (x.value && x.value.ProductCode && (x.value.ProductCode || '').indexOf(term || '') !== -1)
        || (x.value && x.value.ProductName && TDSHelperString.stripSpecialChars((x.value.ProductName || '').toLocaleLowerCase()).trim().indexOf(term || '') !== -1)
        || (x.value && x.value.ProductNameGet && TDSHelperString.stripSpecialChars((x.value.ProductNameGet || '').toLocaleLowerCase()).trim().indexOf(term || '') !== -1)
        || (x.value && (x.value.Tags || '')?.includes(term || '')));

      return items;
  }
}

@Pipe({  name: 'simpleSearchLiveCampaignDetail' })
  export class SimpleSearchLiveCampaignDetailPipe implements PipeTransform {

  public transform(datas: any, term: string) {

      if (!TDSHelperString.hasValueString(term)) return datas;

      term = TDSHelperString.stripSpecialChars(term.toLocaleLowerCase()).trim();
      let items = datas.filter((item: any) =>
          TDSHelperString.stripSpecialChars((item.ProductName || '')?.toLocaleLowerCase()).trim().indexOf(term || '') !== -1
          || (item.ProductCode || '')?.indexOf(term || '') !== -1
          || TDSHelperString.stripSpecialChars((item.UOMName || '')?.toLocaleLowerCase()).trim().indexOf(term || '') !== -1);

      return items;
  }
}

@Pipe({  name: 'simpleSearchQuickRepply' })
  export class SimpleSearchQuickRepplyPipe implements PipeTransform {

  public transform(datas: QuickReplyDTO[], term?: string): any {
      if (!TDSHelperString.hasValueString(term))
          return datas;

      if (term && term.charAt(0) == '/' && term.length > 1) {
          term = term.slice(1, term.length);

          term = TDSHelperString.stripSpecialChars(term.toLocaleLowerCase()).trim();
          let data = datas.filter((item: QuickReplyDTO) =>
              TDSHelperString.stripSpecialChars((item.BodyPlain || '').toLocaleLowerCase()).trim().indexOf(term || '') !== -1
              || TDSHelperString.stripSpecialChars((item.Name || '').toLocaleLowerCase()).trim().indexOf(term || '') !== -1
              || TDSHelperString.stripSpecialChars((item.Command || '').toLocaleLowerCase()).trim().indexOf(term || '') !== -1);

         return data;

      }

      return datas;
  }
}

@Pipe({  name: 'simpleSearchProductPostConfig' })
  export class SimpleSearchProductPostConfiglPipe implements PipeTransform {

  public transform(datas: any, term: any) {
    let type = typeof(term);

    if(type == 'number') {
      if (!term) return datas;

      let items = datas.filter((x: any) => x.Index == term);
      return items;
    } else {
      if (!TDSHelperString.hasValueString(term)) return datas;

      term = TDSHelperString.stripSpecialChars(term?.toLocaleLowerCase()).trim();
      let items = datas?.filter((item: any) =>
          TDSHelperString.stripSpecialChars((item.Product?.ProductName || '')?.toLocaleLowerCase()).trim().indexOf(term || '') !== -1
          || (item.Product?.ProductCode || '')?.indexOf(term || '') !== -1
          || TDSHelperString.stripSpecialChars((item.Product?.UOMName || '')?.toLocaleLowerCase()).trim().indexOf(term || '') !== -1
          || TDSHelperString.stripSpecialChars((item.Content || '')?.toLocaleLowerCase()).trim().indexOf(term || '') !== -1
          || TDSHelperString.stripSpecialChars((item.ContentWithAttributes || '')?.toLocaleLowerCase()).trim().indexOf(term || '') !== -1)

      return items;
    }
  }
}

@Pipe({  name: 'indexTextContentOrder' })
  export class IndexTextContentOrderPipe implements PipeTransform {

  public transform(item: any, datas: any) {
    let index = 0;

    if(item && item.Product) {
      let findIndex = datas.findIndex((x:any) => x.Product.ProductId == item.Product.ProductId && x.Product.UOMId == item.Product.UOMId);
      index = findIndex + 1;
    } else {
      index = item.Index;
    }

    return index;
  }
}
