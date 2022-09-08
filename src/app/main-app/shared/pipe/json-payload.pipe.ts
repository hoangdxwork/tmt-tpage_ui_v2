import { Pipe, PipeTransform } from "@angular/core";
import { TDSHelperString, TDSHelperObject } from "tds-ui/shared/utility";

@Pipe({
  name: 'jsonPayload'
})

export class jsonPayloadPipe implements PipeTransform {

  constructor(){}

  transform(json: any) : any {
    if(TDSHelperString.hasValueString(json) && json.includes(`{"attachment":`)) {
      let model = JSON.parse(json);
      console.log(model)
      if(model.attachment && model.attachment.payload){
        let message = `${model.attachment.payload.recipient_name} đã tạo đơn hàng <span class="font-semibold code-bill">${model.attachment.payload.order_number}</span>`
        return message
      }
    };
   
    return json;
  }
}


