export class PhoneHelper {

  public static getMultiplePhoneFromText(text: string) {
    if(text) {
      let removeDots = text.toString().replace(/\./g, '');
      let removeSpace = removeDots.toString().replace(/\s/g, '');
      let changePrefix = removeSpace.toString().replace(/\+84/g, '0');

      let myRe = /(09|03|07|08|05)([\d+]{8})/g;

      let listPhones = "";

      while (true) {
        let re = myRe.exec(changePrefix);

        if (re && re[1] && re[2]) {
          let phone = re[1] + re[2];
          listPhones += listPhones.length > 1 ? ` - ${phone}` : phone;
          // changePrefix = changePrefix.toString().replace(phone, '');
        }
        else {
          break;
        }
      }

      return listPhones;
    }
    return null;
  }

}
