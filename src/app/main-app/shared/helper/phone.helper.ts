import { TDSHelperString } from "tds-ui/shared/utility";

export class PhoneHelper {

  public static getMultiplePhoneFromText(text: string, companyCurrents?: any) {
    let phone: string = '';

    if(TDSHelperString.hasValueString(text)) {

      let format = text.indexOf('[format') && text.indexOf('[end_format]');

      if(format > 0) {
        let start =  text.indexOf("value='");
        let end =  text.indexOf( "']");

        if(start > 0 && end > 0) {
            text = text.substring(start, end).replace("value='", "").trim();
        }
      }

      if(companyCurrents && companyCurrents.Configs) {
        let config = JSON.parse(companyCurrents.Configs);

        let phoneRegex = config.PhoneRegex || null;
        phoneRegex = new RegExp(`${phoneRegex}`, 'g');

        if(phoneRegex) {
            let exec = phoneRegex.exec(text);
            if(exec && exec[1]) {
                phone = exec[1].trim();
            }
        } else {
            phone = this.setRegexDefault(text);
        }
      } else {
          phone = this.setRegexDefault(text);
      }
    }

    phone = phone?.toString().replace(/\./g, '');
    phone = phone?.toString().replace(/\s/g, '');
    return phone;
  }

  public static setRegexDefault(text: string) {
    let phone: string = '';

    let removeDots = text.toString().replace(/\./g, '');
    let removeSpace = removeDots.toString().replace(/\s/g, '');

    let myRe = /(?:\b|[^0-9])((o|0|84|\+84)(\s?)([2-9]|1[0-9])((\d|o)(\s|\.)?){8})(?:\b|[^0-9])/g;
    let exec = myRe.exec(removeSpace);

    if(exec && exec[1]) {
        phone = exec[1];
    }

    return phone;
  }

}
