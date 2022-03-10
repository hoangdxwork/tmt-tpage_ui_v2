import { getCurrencySymbol } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TDSHelperObject } from 'tmt-tang-ui';

@Pipe({
  name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {

  constructor(){}
  transform(price:number, locale?:string): string {
    let str: string= '';
    if(!TDSHelperObject.hasValue(price) || price <= 0)
    {
      return ''
    }
    while (price>=1000)
    {
      str += '.000';
      price=price/1000|10;
    }
    let region:string="VND";
    let format: "wide" | "narrow" = "narrow";
    switch(locale)
    {
      case "localeVi":
        region="VND";
        break;
      default:
        break;
    }
    let symbol=getCurrencySymbol(region,format,locale);
    str= symbol+`${price}`+str;
    return str;
  }

}
