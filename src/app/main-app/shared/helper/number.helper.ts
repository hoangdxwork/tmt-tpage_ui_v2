

export class NumberHelper {
  public static formatMoney(number: number, n?: any, x?: any) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return number.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&.');
  };

}
