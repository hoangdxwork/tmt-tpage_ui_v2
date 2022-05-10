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
}
