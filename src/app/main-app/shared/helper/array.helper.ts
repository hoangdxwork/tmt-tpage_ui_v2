
export class ArrayHelper {
  public static mergeArray(arr1: any, arr2: any): any[] {
    if (!arr1) return arr2;
    if (!arr2) return arr1;

    return [...arr1, ...arr2];
  }

  public static makeUniqueArray(arr1: any, arr2: any, fied: any): any[] {
    let arr = ArrayHelper.mergeArray(arr1, arr2);

    let unique = arr
      .map((item: any) => item[fied])
      // store the keys of the unique objects
      .map((item: any, i, final) => final.indexOf(item) === i && i)
      // eliminate the duplicate keys & store unique objects
      .filter((item: any) => arr[item]).map((item: any) => arr[item]);

    return unique;
  }

  public static isArray(obj: any) {
    if(obj && obj.constructor.name == "Array") return true;
    return false;
  }

}
