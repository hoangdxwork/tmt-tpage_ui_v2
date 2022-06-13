import { TDSSafeAny } from "tds-ui/shared/utility";

export class DateHelperV2 {
  public static getCountDownTimer(expirationDate: TDSSafeAny) {
    var now = new Date();
    var total = Date.parse(expirationDate.toString()) - Date.parse(now.toString());
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return {
        days: days,
        hours: hours,
        minutes: minutes,
    }
}
}
