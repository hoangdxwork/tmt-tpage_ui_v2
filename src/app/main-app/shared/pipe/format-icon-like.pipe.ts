import { Pipe, PipeTransform } from "@angular/core";
import { TDSHelperString } from "tds-ui/shared/utility";
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

