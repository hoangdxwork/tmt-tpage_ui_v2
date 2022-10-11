import { TDSSafeAny } from 'tds-ui/shared/utility';
import { Pipe, PipeTransform } from '@angular/core';
import * as lodash from 'lodash';

@Pipe({   name: 'simpleSearch' })
  export class SimpleSearchPipe implements PipeTransform {

  public transform(value: TDSSafeAny[] , keys: string, term: string) {

    var invalid = /[°"§%()\[\]{}=\\?´`'#<>|,;.:+_-]+/g;
    var term = term.replace(invalid, "");

    if (!term) return value;
    return (value || [])
      .filter(item =>
        keys.split(',').some(key => {
          const val = lodash.get(item, key, undefined);
          return val !== undefined && new RegExp(term, 'gi').test(val);
        })
      );
  }
}