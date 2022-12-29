import {Pipe, PipeTransform} from "@angular/core";
import { MakeActivityItemWebHook } from "../../dto/conversation/make-activity.dto";

@Pipe({
  name: "showAvatar"
})
export class ShowAvatarPipe implements PipeTransform {

  transform(items: Array<MakeActivityItemWebHook>): any[] {
    if(items && items.length == 1) {
      items[0].is_show_avatar = true;
    } else if (items && items.length > 0) {
      items.reduce((a, c, i) => {
        // Show avatar
        if (i + 1 <= items.length) {
          if (a.is_admin != c.is_admin) {
            a.is_show_avatar = true;

            if(items[i -2] && items[i -2].is_show_avatar && !items[i - 2].is_admin && !a.is_admin && a.type != 2) {
              items[i -2].is_show_avatar = false;
            }
          }
        }

        // Add break
        let isDiffDate = this.differenceDate(a.DateCreated, c.DateCreated);
        if(isDiffDate) {
          c.is_show_break = true;
          !a.is_admin && (a.is_show_avatar = true);
        }

        // Show avatar
        if(c.comment && c.type == 2 && a.type != 2) {
          a.is_show_avatar = true;
        }

        if (i + 1 == items.length) {
          c.is_show_avatar = true;
          if(a.is_admin == c.is_admin && !isDiffDate) {
            a.is_show_avatar = false;

            return a;
          }
        }

        return c;
      });
    }

    return items as any;
  }

  differenceDate(start: Date, end: Date): boolean {

    let dateStart = new Date(start);
    let dateEnd = new Date(end);

    if(dateStart.getFullYear() != dateEnd.getFullYear() ||
      dateStart.getMonth() != dateEnd.getMonth() ||
      dateStart.getDate() != dateEnd.getDate()) {
        return true;
    }

    return false;
  }
}

@Pipe({
  name: "sizeAvatarPipe"
})
export class SizeAvatarPipe implements PipeTransform {

  transform(size: string | number): any {
    switch (size) {
      case 'xl':
        return 64;

      case 'lg':
        return 48;

      case 'md':
        return 36;

      case 'sm':
        return 24;

      default:
        if(Number(size) > 0)
        return Number(size);
    }
  }
}
