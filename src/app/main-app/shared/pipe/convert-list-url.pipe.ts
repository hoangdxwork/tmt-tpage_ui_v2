import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertListUrl'
})

export class ConvertListUrlPipe implements PipeTransform {

  constructor(){}

  transform(listImages: any[]): string[] {
    return listImages.map(img => {
        return img.Url;
    }) as string[];
  }
}
