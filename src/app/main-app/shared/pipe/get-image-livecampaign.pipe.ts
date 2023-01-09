import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'getImageLiveCampaign'
})
export class GetImageLiveCampaignPipe implements PipeTransform {

  transform(value: any, lstImage: {[key: string]: string}): string {
    if(value && value.ImageUrl) {
      return value.ImageUrl
    } else {
      if(lstImage && lstImage[value?.ProductId]) {
        return lstImage[value?.ProductId]
      }
    }
    return '';
  }
}

