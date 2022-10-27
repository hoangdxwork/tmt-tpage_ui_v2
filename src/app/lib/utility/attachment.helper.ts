import { TDSHelperString } from "tds-ui/shared/utility";
import { AttachmentType } from "../consts/show-attachment";

export class AttachmentHelper {
  public static getType(type: string) {
    let existType = TDSHelperString.hasValueString(type);
    let existEnum = Object.keys(AttachmentType);

    if(existType && existEnum.length > 0) {
      let find = existEnum.find(x => AttachmentType[x] == type);
      if(find){
        return AttachmentType[find];
      }
    }

    return null;
  }

  public static getTypeByUrl(url: string) {
    if(TDSHelperString.hasValueString(url)) {
      if(url.includes("https://video.xx.fbcdn.net/")) {
        return AttachmentType.VIDEO_MP4
      };
      if(url.includes("https://cdn.fbsbx.com/")){
        return AttachmentType.IMAGE_JPEG
      }
    }
    return null;
  }
}


