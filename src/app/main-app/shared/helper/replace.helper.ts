import { QuickReply } from "src/app/lib/consts/quick-reply.const";
import { NumberHelper } from "./number.helper";


export class ReplaceHelper {

  public static quickReply(text: string, partner: any) {
    if (partner && text) {
        text = text.replace(new RegExp(QuickReply.partner_name, 'g'), partner.Name || "{partner.name}");
        text = text.replace(new RegExp(QuickReply.partner_code, 'g'), partner.Ref || "");
        text = text.replace(new RegExp(QuickReply.partner_phone, 'g'), partner.Phone || "chưa có số điện thoại");
        text = text.replace(new RegExp(QuickReply.partner_address, 'g'), partner.Street || "chưa có địa chỉ");
    }

    if (partner && partner.LastOrder) {
        let lastOrder = partner.LastOrder;
        text = text.replace(new RegExp(QuickReply.partner_debt, 'g'), lastOrder.Partner.Debit || "0");
        text = text.replace(new RegExp(QuickReply.order_code, 'g'), lastOrder.Code || "");
        text = text.replace(new RegExp(QuickReply.order_tracking_code, 'g'), "");
        text = text.replace(new RegExp(QuickReply.order_total_amount, 'g'), NumberHelper.formatMoney(lastOrder.TotalAmount) + "đ" || "0");
    }

    return text;
  }

  public static messageConversation(text: string) {
    if(text && text != "" && typeof text == "string") {
      text = text.replace('(y)', '👍');
    }

    return text;
  }

}
