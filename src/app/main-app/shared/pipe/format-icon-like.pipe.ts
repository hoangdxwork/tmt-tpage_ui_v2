import { Pipe, PipeTransform } from "@angular/core";
import { TDSHelperString, TDSSafeAny } from "tmt-tang-ui";
import { ReplaceHelper } from "../helper/replace.helper";

@Pipe({
  name: 'formatIconLike'
})
export class FormatIconLikePipe implements PipeTransform {

  transform(message: any): string {
    if(TDSHelperString.hasValueString(message)) {
      message = ReplaceHelper.messageConversation(message);
    }
    return message;
  }
}

