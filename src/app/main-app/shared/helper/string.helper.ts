import { TDSHelperString } from "tmt-tang-ui";

export class StringHelperV2 {

  public static getSliceAfterSpaceByLength(str: string, length: number, characters?: string): string {
    let result = str;
    if(TDSHelperString.hasValueString(str)) {
      let indexSpace = null;
      for(let i = 0; i < str.length; i++) {
        if(str[i] == " ") indexSpace = i;
        if(i >= length && str[i+1] && str[i+1] == " ") {
          return `${str.slice(0, i + 1)}` + `${characters ? characters : ""}`;
        }
        if(i >= length && i > length + 7) {
          if(indexSpace && indexSpace > 10) {
            return `${str.slice(0, indexSpace)}` + `${characters ? characters : ""}`;
          }
          else {
            return `${str.slice(0, i)}` + `${characters ? characters : ""}`;
          }
        }
      }
    } else {
      result = str;
    }
    return result;
  }

  public static removeSpecialCharacters(alias: string) {
    var str = alias;

    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    str = str.trim();

    return str;
  }

  public static nameNoSignCharacters(alias: string) {
    var str = alias;

    str = str.normalize('NFC').toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/ + /g, " ");
    str = str.trim();

    return str;
  }

  public static nameCharactersSpace(alias: string) {
    var str = alias;

    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    str = str.replace(/\s/g, '');
    str = str.trim();

    return str;
  }
}
