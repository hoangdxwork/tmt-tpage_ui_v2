import { LiveCampaignModel } from './../../dto/live-campaign/odata-live-campaign.dto';
import { SaleOnlineFacebookPostDTO, SaleOnlineFacebookFromDTO } from './../../dto/saleonlineorder/sale-online-order.dto';
import { MDB_Facebook_Mapping_PostDto } from './../../dto/conversation-all/chatomni/chatomni-objects.dto';
import { Injectable } from "@angular/core";

@Injectable()

export class PrepareFacebookPostHandler {
    public prepareModel(data: MDB_Facebook_Mapping_PostDto, newCampaign?: LiveCampaignModel) {
        return {
            action: newCampaign ? 'update' : 'cancel',
            model: this.prepareLiveCampaignModel(data, newCampaign)
        }
    }

    public prepareLiveCampaignModel(data: MDB_Facebook_Mapping_PostDto, liveCampaign?: LiveCampaignModel) {

        let facebookPost: SaleOnlineFacebookPostDTO = this.prepareFacebookPost(data)
        let result = {} as any;
    
        result.DateCreated = new Date().toISOString();
        result.Facebook_LiveId = facebookPost.facebook_id;
        result.Facebook_Post = facebookPost;
        result.Facebook_UserAvatar = "";
        result.Facebook_UserId = data.from?.id || "";
        result.Facebook_UserName  = data.from?.name || "";

        if(liveCampaign){
            result.IsActive = true;
            result.Id = liveCampaign.Id || null;
            result.Name = liveCampaign.Name || null;
            result.Note = liveCampaign.Note || null;
        }
    
        return {...result};
      }
    
    public prepareFacebookPost(data: MDB_Facebook_Mapping_PostDto): SaleOnlineFacebookPostDTO {
        let model = {} as SaleOnlineFacebookPostDTO;
        model.from = {} as SaleOnlineFacebookFromDTO;
    
        model.created_time = data.created_time;
        model.facebook_id = data.id;
        model.from.picture = data.from?.picture?.data?.url || "";
        model.from.id = data.from?.id;
        model.from.name = data.from?.name;
        model.full_picture = data.full_picture || "";
        model.message = data.message;
        model.picture = data.picture || "";
        model.source = "";
    
        return {...model};
      }
}