import { QuickReplyDTO } from './../../dto/quick-reply.dto.ts/quick-reply.dto';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { Pipe, PipeTransform } from '@angular/core';
import * as lodash from 'lodash';

@Pipe({   name: 'simpleSearch' })
  export class SimpleSearchPipe implements PipeTransform {

  public transform(value: TDSSafeAny[] , keys: string, term: string) {

    if (!TDSHelperString.hasValueString(term)) return value;

    let invalid = /[°"§%()\[\]{}=\\?´`'#<>|,;.:+_-]+/g;
    let regexTerm = term.replace(invalid, "");
    regexTerm = regexTerm.toLocaleLowerCase().trim();

    return (value || [])
      .filter((item: any) =>
        keys.split(',').some((x: any) => {
            const val = lodash.get(item, x, undefined);
            return val !== undefined && new RegExp(regexTerm, 'gi').test(val);
        })
      );
  }
}

@Pipe({  name: 'simpleSearchV2' })
  export class SimpleSearchV2Pipe implements PipeTransform {

  public transform(datas: any, term: string) {

      if (!TDSHelperString.hasValueString(term)) return datas;

      term = TDSHelperString.stripSpecialChars(term.toLocaleLowerCase()).trim();

      let data = datas?.filter((x: any) => (x.value && x.value.ProductCode && x.value.ProductCode.indexOf(term) !== -1)
        || (x.value && x.value.ProductName && TDSHelperString.stripSpecialChars(x.value.ProductName.toLocaleLowerCase()).trim().indexOf(term) !== -1)
        || (x.value && x.value.ProductNameGet && TDSHelperString.stripSpecialChars(x.value.ProductNameGet.toLocaleLowerCase()).trim().indexOf(term) !== -1));

      return [...data];
  }
}

@Pipe({  name: 'simpleSearchLiveCampaignDetail' })
  export class SimpleSearchLiveCampaignDetailPipe implements PipeTransform {

  public transform(datas: any, term: string) {

      if (!TDSHelperString.hasValueString(term)) return datas;

      term = TDSHelperString.stripSpecialChars(term.toLocaleLowerCase()).trim();
      let data = datas.filter((item: any) =>
          TDSHelperString.stripSpecialChars(item.ProductName?.toLocaleLowerCase()).trim().indexOf(term) !== -1
          || item.ProductCode?.indexOf(term) !== -1
          || TDSHelperString.stripSpecialChars(item.UOMName?.toLocaleLowerCase()).trim().indexOf(term) !== -1);
      
      return [...data];
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
              || TDSHelperString.stripSpecialChars((item.Name || '').toLocaleLowerCase()).trim().indexOf(term || '') !== -1);

         return [...data];

      }

      return datas;
  }
}
