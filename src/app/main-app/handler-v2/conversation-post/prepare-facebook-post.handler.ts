import { LiveCampaignModel } from '../../dto/live-campaign/odata-live-campaign-model.dto';
import { ChatomniObjectsItemDto, MDB_Facebook_Mapping_PostDto } from './../../dto/conversation-all/chatomni/chatomni-objects.dto';
import { Injectable } from "@angular/core";

@Injectable()

export class PrepareUpdateFacebookByLiveCampaign {

    public prepareUpdateFbLiveCampaign(item: ChatomniObjectsItemDto, liveCampaign?: LiveCampaignModel, action?: string) {
        let x: UpdateFacebookByLiveCampaignDto = {} as any;

        x.action = action as string;
        x.model = { ...this.prepareFbPost(item, liveCampaign) };

        return {...x};
    }

    public prepareFbPost(item: ChatomniObjectsItemDto, liveCampaign?: LiveCampaignModel) {
        let x: UpdateFacebookPostDto = {} as any;

        x.Facebook_LiveId = item.ObjectId;
        x.Facebook_UserAvatar = '';
        x.Facebook_UserId = (item.Data as MDB_Facebook_Mapping_PostDto)?.from_id || (item.Data as MDB_Facebook_Mapping_PostDto)?.from?.id;
        x.Facebook_UserName = (item.Data as MDB_Facebook_Mapping_PostDto)?.from.name;
        x.IsActive = true;
        x.Id = liveCampaign?.Id;
        x.Name = liveCampaign?.Name;
        x.Note = liveCampaign?.Note;

        x.Facebook_Post = {
          from: {
            picture: (item.Data as MDB_Facebook_Mapping_PostDto)?.from.picture?.data?.url,
            id: (item.Data as MDB_Facebook_Mapping_PostDto)?.from_id || (item.Data as MDB_Facebook_Mapping_PostDto)?.from?.id,
            name: (item.Data as MDB_Facebook_Mapping_PostDto)?.from?.name
          },
          created_time: (item.Data as MDB_Facebook_Mapping_PostDto)?.created_time,
          facebook_id: item.ObjectId,
          full_picture: (item.Data as MDB_Facebook_Mapping_PostDto)?.full_picture,
          message: (item.Data as MDB_Facebook_Mapping_PostDto)?.message,
          picture: (item.Data as MDB_Facebook_Mapping_PostDto)?.picture,
          source: ''
        }

        return {...x};
    }
}

export interface From {
  picture: string;
  id: string;
  name: string;
}

export interface FacebookPostByLiveCampaign {
  from: From;
  created_time: Date;
  facebook_id: string;
  full_picture: string;
  message: string;
  picture: string;
  source: string;
}

export interface UpdateFacebookPostDto {
  DateCreated: Date;
  Facebook_LiveId?: string;
  Facebook_Post: FacebookPostByLiveCampaign;
  Facebook_UserAvatar: string;
  Facebook_UserId: string;
  Facebook_UserName: string;
  IsActive: boolean;
  Id?: string;
  Name?: string;
  Note?: any;
}

export interface UpdateFacebookByLiveCampaignDto {
  action: string;
  model: UpdateFacebookPostDto;
}
