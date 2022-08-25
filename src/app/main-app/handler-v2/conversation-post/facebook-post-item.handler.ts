import { ChatomniObjectsItemDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';
import { LiveCampaignModel } from './../../dto/live-campaign/odata-live-campaign.dto';
import { Injectable } from "@angular/core";
import { TDSHelperObject } from "tds-ui/shared/utility";

@Injectable()

export class FaceBookPostItemHandler {
    public updateLiveCampaignPost(data: ChatomniObjectsItemDto, liveCampaign?: LiveCampaignModel): ChatomniObjectsItemDto {

        if(data) {
            data.Id = data.Id
            if(liveCampaign && TDSHelperObject.hasValue(liveCampaign)){
                data.LiveCampaignId = liveCampaign.Id;

                data.LiveCampaign = {
                    Id: liveCampaign.Id,
                    Name: liveCampaign.Name,
                    Note: liveCampaign.Note
                }
            }else{
                
                data = { ...data, ...{ live_campaign_id: null, live_campaign: null } } as any;
            }

            return {...data};
        }else{
            return data;
        }
    }
}