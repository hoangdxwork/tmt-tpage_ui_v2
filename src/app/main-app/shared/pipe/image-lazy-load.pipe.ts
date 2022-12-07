import { Pipe, PipeTransform } from '@angular/core';
import { TDSHelperString } from 'tds-ui/shared/utility';

@Pipe({
  name: 'imageLazyLoad'
})

export class ImageLazyLoadPipe implements PipeTransform {

  transform(url: any, isNextData: boolean) {
    if(!TDSHelperString.hasValueString(url))
      return 'error';

    if(isNextData == true) {
      setTimeout(() => {
        return url;
      }, 500);
    } else {
      return url;
    }
  }

}
