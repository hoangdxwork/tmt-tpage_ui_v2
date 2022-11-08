import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'sortDateName'
})
export class SortDateNamePipe implements PipeTransform {

  transform(type: string): string {
    switch (type) {
        case 'asc':
        return 'Ngày tăng dần';
        case 'desc':
        return 'Ngày giảm dần';
        default: 
        return 'Sắp xếp theo ngày';
    }
  }
}

@Pipe({
    name: 'sortDateClass'
  })
  export class SortDateClassPipe implements PipeTransform {
  
    transform(type: string): string {
      switch (type) {
          case 'asc':
          return 'tdsi-sort-arrow-up-fill';
          case 'desc':
          return 'tdsi-sort-arrow-down-fill';
          default: 
          return 'tdsi-sort-up-down-fill !text-neutral-1-500';
      }
    }
  }