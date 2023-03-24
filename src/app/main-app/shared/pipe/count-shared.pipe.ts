import { GetSharedDto } from './../../dto/conversation/post/get-shared.dto';
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'countShared'
})
export class CountSharedPipe implements PipeTransform {

  transform(data: GetSharedDto, type: 'group'|'personal'): number {
    if(type == 'group') {
      return data?.permalink_url?.includes('/groups/') ? 1 : 0;
    } else {
      return !data?.permalink_url?.includes('/groups/') ? 1 : 0;
    }
  }
}
