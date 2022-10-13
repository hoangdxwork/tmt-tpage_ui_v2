import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { Pipe, PipeTransform } from '@angular/core';
import * as lodash from 'lodash';
import { LiveCampaignSimpleDetail } from '@app/dto/live-campaign/livecampaign-simple.dto';
import { FormArray } from '@angular/forms';

@Pipe({   name: 'simpleSearch' })
  export class SimpleSearchPipe implements PipeTransform {

  public transform(value: TDSSafeAny[] , keys: string, term: string) {debugger

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

  public transform(value: any, term: string) {

      if (!TDSHelperString.hasValueString(term)) return value;

      term = TDSHelperString.stripSpecialChars(term.toLocaleLowerCase()).trim();

      let data = value?.filter((x: any) => (x.value && x.value.ProductCode && x.value.ProductCode.indexOf(term) !== -1)
        || (x.value && x.value.ProductName && TDSHelperString.stripSpecialChars(x.value.ProductName.toLocaleLowerCase()).trim().indexOf(term) !== -1)
        || (x.value && x.value.ProductNameGet && TDSHelperString.stripSpecialChars(x.value.ProductNameGet.toLocaleLowerCase()).trim().indexOf(term) !== -1));

      return [...data];
  }
}
