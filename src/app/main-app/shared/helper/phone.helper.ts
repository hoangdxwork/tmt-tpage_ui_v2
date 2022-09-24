import { TDSHelperString } from "tds-ui/shared/utility";

export class PhoneHelper {

  public static getMultiplePhoneFromText(text: string, companyCurrents?: any) {

    if(TDSHelperString.hasValueString(text)) {
      let removeDots = text.toString().replace(/\./g, '');
      let removeSpace = removeDots.toString().replace(/\s/g, '');
      let changePrefix = removeSpace.toString().replace(/\+84/g, '0');

      let myRe = /(09|03|07|08|05)([\d+]{8})/g;
      if(companyCurrents && companyCurrents.Configs) {
          let config = JSON.parse(companyCurrents.Configs);

          let phoneRegex = config.PhoneRegex;
          phoneRegex = new RegExp(`${phoneRegex}`, 'g');
          myRe = phoneRegex;
      }

      let listPhones = "";
      while (true) {
        let re = myRe.exec(changePrefix);

        if (re && re[1] && re[2]) {
          let phone = re[1] + re[2];
          listPhones += listPhones.length > 1 ? ` - ${phone}` : phone;
        } else {
          break;
        }
      }

      return listPhones;
    }
    return null;
  }

}
