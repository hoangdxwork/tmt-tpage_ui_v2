import { Pipe, PipeTransform } from "@angular/core";
import * as _ from "lodash";

@Pipe({
  name: "orderByFilter"
})

export class OderByFilterPipe implements PipeTransform {

  transform(items: any[], column: string, searchText: string): any[] {

    if (items.length > 0 && searchText && searchText != '') {

      searchText = searchText.toLocaleLowerCase().trim();
      searchText = String(searchText).toLocaleLowerCase().trim();

      let item = _.filter(items, function (element) {
        return String(element[column]).toLowerCase().includes(searchText) && String(element[column]).toLowerCase().includes(searchText);
      });

      if (item && item.length > 0) {
        items = _.filter(items, function (element, index) {
          return !String(element[column]).toLowerCase().includes(searchText) && !String(element[column]).toLowerCase().includes(searchText);
        });

        items.unshift(item[0]);
      }
    }

    return items;
  }
}
