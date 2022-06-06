export class BaseHelper {

  public static getBaseUrl(): any {
    return document.getElementsByTagName('base')[0].href;
  }

  public static getBaseApi(): any {
    if (document.getElementsByTagName('server').length > 0) {
      return (document.getElementsByTagName('server')[0].attributes as any)['href'].value;
    } else {
      return '';
    }
  }

}
