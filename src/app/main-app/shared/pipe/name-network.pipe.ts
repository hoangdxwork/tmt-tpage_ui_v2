import { Pipe, PipeTransform } from "@angular/core";
import * as _ from "lodash";

@Pipe({
  name: "nameNetWork"
})

export class NameNetWorkPipe implements PipeTransform {

  transform(value: string): any {
    switch (value) {
        case 'Viettel':
            return 'error'
        case 'Vietnamobile':
            return 'warning'
        case 'Mobifone':
            return 'success'
        case 'Vinaphone':
            return 'info'
        case 'Gmobile':
            return 'lime'
        default:
            return 'secondary'
    }
  }
}
