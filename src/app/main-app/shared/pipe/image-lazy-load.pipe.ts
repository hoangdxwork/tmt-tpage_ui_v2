import { Pipe, PipeTransform } from '@angular/core';
import { TDSHelperString } from 'tds-ui/shared/utility';

@Pipe({
  name: 'imageLazyLoad'
})

export class ImageLazyLoadPipe implements PipeTransform {

  transform(url: any, isNextData: boolean) {
    if(!TDSHelperString.hasValueString(url) || isNextData)
        return 'error';
    return url;
  }

}
