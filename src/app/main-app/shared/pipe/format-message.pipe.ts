import { Pipe, PipeTransform } from "@angular/core";
import { TDSHelperString, TDSSafeAny } from "tmt-tang-ui";
import { ReplaceHelper } from "../helper/replace.helper";

@Pipe({
  name: 'formatMessage'
})
export class FormatMessagePipe implements PipeTransform {

  transform(message: any): string {
    if(TDSHelperString.hasValueString(message)) {
      message = ReplaceHelper.messageConversation(message);
    }
    return message;
  }
}

