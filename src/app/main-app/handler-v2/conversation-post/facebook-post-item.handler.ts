import { MDB_Facebook_Mapping_PostDto } from './../../dto/conversation-all/chatomni/chatomni-objects.dto';
import { LiveCampaignModel } from './../../dto/live-campaign/odata-live-campaign.dto';
import { Injectable } from "@angular/core";
import { TDSHelperObject } from "tds-ui/shared/utility";

@Injectable()

export class FaceBookPostItemHandler {
    public updateLiveCampaignPost(liveCampaign: LiveCampaignModel, data: MDB_Facebook_Mapping_PostDto) {

        if(liveCampaign && TDSHelperObject.hasValue(liveCampaign)){
            data.live_campaign_id = liveCampaign.Id;

            data.live_campaign = {
                name: liveCampaign.Name,
                note: liveCampaign.Note
            }
        }else{
            data = { ...data, ...{ live_campaign_id: undefined, live_campaign: undefined } } as any;
        }

        return data;
    }
}