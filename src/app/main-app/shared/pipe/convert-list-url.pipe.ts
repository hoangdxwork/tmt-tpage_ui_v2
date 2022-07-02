import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertListUrl'
})

export class ConvertListUrlPipe implements PipeTransform {

  constructor(){}

  transform(listImages: any[]): string[] {
    let result:string[] = [];

    listImages.forEach(img => {
        result.push(img.Url);
    });

    return result;
  }
}
