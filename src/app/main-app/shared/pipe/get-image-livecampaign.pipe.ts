import { Pipe, PipeTransform } from "@angular/core";
import { LiveCampaignService } from "@app/services/live-campaign.service";

@Pipe({
  name: 'getImageLiveCampaign'
})
export class GetImageLiveCampaignPipe implements PipeTransform {

  transform(value: any, lstImage: any): any {
    if(value && value.ImageUrl) {
      return value.ImageUrl
    } else {
      return lstImage[value?.ProductId]
    }
  }
}

