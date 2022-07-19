import { Pipe, PipeTransform } from "@angular/core";
import * as _ from "lodash";

@Pipe({
  name: "compareToday"
})

export class CompareToday implements PipeTransform {

  transform(date: any) {
    let d = new Date(date);
    let today = new Date();
    if (d.getFullYear() == today.getFullYear() && d.getMonth() - 1 == today.getMonth() && d.getDate() == d.getDate()) {
      return true;
    }
    return false;
    }
}