import { ChatomniDataTShopPostDto } from '@app/dto/conversation-all/chatomni/chatomni-tshop-post.dto';
import { LiveCampaignModel } from '../../dto/live-campaign/odata-live-campaign-model.dto';
import { ChatomniObjectsItemDto, MDB_Facebook_Mapping_PostDto } from '../../dto/conversation-all/chatomni/chatomni-objects.dto';
import { Injectable } from "@angular/core";
import { ChatomniObjectDataTiktokDto } from '@app/dto/conversation-all/chatomni/chatomni-object-tiktok.dto';

@Injectable()

export class PrepareUpdateTShopByLiveCampaign {

    public prepareUpdateTShopLiveCampaign(item: ChatomniObjectsItemDto, liveCampaign?: LiveCampaignModel, action?: string) {
        let x = {} as any;

        x.action = action as string;
        x.model = { ...this.prepareTShopPost(item, liveCampaign) };

        return {...x};
    }

    public prepareTShopPost(item: ChatomniObjectsItemDto, liveCampaign?: LiveCampaignModel) {
        let x = {} as any;

        x.Facebook_LiveId = item.ObjectId;
        x.ChatomniObject = {
          ChannelType: "TShop",
          ObjectId: item.ObjectId
        }
        x.Facebook_UserAvatar = item.Thumbnail?.Url;
        x.Facebook_UserId = (item.Data as ChatomniDataTShopPostDto)?.ShopId;
        x.Facebook_UserName = '';
        x.IsActive = true;
        x.Id = liveCampaign?.Id;
        x.Name = liveCampaign?.Name;
        x.Note = liveCampaign?.Note;

        return {...x};
    }

    public prepareUpdateTiktokLiveCampaign(item: ChatomniObjectsItemDto, liveCampaign?: LiveCampaignModel, action?: string) {
      let x = {} as any;

      x.action = action as string;
      x.model = { ...this.prepareTiktokPost(item, liveCampaign) };

      return {...x};
  }

  public prepareTiktokPost(item: ChatomniObjectsItemDto, liveCampaign?: LiveCampaignModel) {
      let x = {} as any;

      x.Facebook_LiveId = item.ObjectId;
      x.ChatomniObject = {
        ChannelType: "UnofficialTikTok",
        ObjectId: item.ObjectId
      }
      x.Facebook_UserAvatar = item.Thumbnail?.Url;
      x.Facebook_UserId = (item.Data as ChatomniObjectDataTiktokDto)?.owner?.id;
      x.Facebook_UserName = (item.Data as ChatomniObjectDataTiktokDto)?.owner?.nickname;
      x.IsActive = true;
      x.Id = liveCampaign?.Id;
      x.Name = liveCampaign?.Name;
      x.Note = liveCampaign?.Note;

      return {...x};
  }
}
