import { ReplaceHelper } from './../helper/replace.helper';
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'replacePartner'
})
export class ReplacePartnerPipe implements PipeTransform {

  transform(value: string, partner: any): string {
    value = ReplaceHelper.quickReply(value, partner);
    return value;
  }
}
