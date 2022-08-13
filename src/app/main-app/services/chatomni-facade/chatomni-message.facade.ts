import { Tag, MDBByPSIdDTO } from './../../dto/crm-matching/mdb-by-psid.dto';
import { ChatomniLastMessageEventEmitterDto, ChatomniConversationItemDto, ChatomniTagsEventEmitterDto, ChatomniConversationTagDto } from './../../dto/conversation-all/chatomni/chatomni-conversation';
import { ChatomniFacebookDataDto, ChatomniDataItemDto, ChatomniDataDto } from './../../dto/conversation-all/chatomni/chatomni-data.dto';
import { Injectable, OnDestroy } from "@angular/core";
import { TCommonService } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { get as _get } from 'lodash';
import { set as _set } from 'lodash';
import { TDSHelperString, TDSSafeAny } from "tds-ui/shared/utility";
import { responseAddMessCommentDto } from '@app/dto/conversation-all/chatomni/response-mess.dto';

@Injectable()

export class ChatomniMessageFacade extends BaseSevice  {

  prefix: string = "odata";
  table: string = "";
  baseRestApi: string = "rest/v2.0/chatomni";

  dataSource: { [id: string] : ChatomniDataDto } = {}; //this.chatomniDataSource[id]

  constructor(private apiService: TCommonService) {
    super(apiService)
  }

  setData(id: string, value: ChatomniDataDto | null) {
      _set(this.dataSource, [id], value);
  }

  getData(id: string) {
      let data = _get(this.dataSource, id) || undefined;
      return data;
  }

  createDataAttachments(attachment_url: string) {
    const model = {} as any;

    if (TDSHelperString.hasValueString(attachment_url)) {
      model["data"] = [];
      model["data"].push({
          image_data: {
            url: attachment_url
          }
      });
    }

    return {...model};
  }

  mappingChatomniDataItemDto(data:responseAddMessCommentDto){
    let model  = {
      Id: data.id,
      Type: data.type,
      IsOwner: data.is_admin,
      Data: {
        id: data.message?.id,
        message: data.message?.message,
        from: data.message?.from,
        to: data.message?.to?.data[0],
        attachments: data?.attachments,
        has_admin_required: data.has_admin_required
      } as unknown as ChatomniFacebookDataDto,
      CreatedTime: data.DateCreated,
      Message: data.message_formatted,
      Status: data.status as number,
      Error: undefined,
      CreatedBy: data.CreatedBy,
      UserId: data.to_id
    } as unknown as ChatomniDataItemDto;

    return  {...model};
  }


  mappingModelTag(tag:TDSSafeAny){
    let model = {
        Id: tag.Id,
        Name: tag.Name,
        Icon: tag.Icon,
        ColorClass: tag.ColorClassName,
        CreatedTime: tag.DateCreated
    } as ChatomniConversationTagDto

    return  {...model};
  }

  mappingModelTagMess(tag:Tag){
    let model = {
        Id: tag.id,
        Name: tag.name,
        Icon: tag.icon,
        ColorClass: tag.color_class,
        CreatedTime: tag.created_time
    } as ChatomniConversationTagDto

    return  {...model};
  }

  mappinglTagsEmiter(data: ChatomniConversationItemDto){
    let model = {
      ConversationId: data.ConversationId,
      Tags: data.Tags
    } as ChatomniTagsEventEmitterDto

    return  {...model};
  }

  mappinglLastMessageEmiter(ConversationId: string, data: ChatomniDataItemDto){
    let model = {
      ConversationId: ConversationId,
      LatestMessage: {
        Message: data.Message,
        CreatedTime: data.CreatedTime
      }
    } as ChatomniLastMessageEventEmitterDto

    return  {...model};
  }

  mappingCurrentConversation(res: MDBByPSIdDTO){
    let model = { ...res } as any
    model.ConversationId = res.psid
    model.Name = res.name
    model.Tags = [];

    if (res.tags && res.tags.length > 0){
      res.tags.map(x=>{
        let data = this.mappingModelTagMess(x);
        model.Tags.push(data);
      })
    }

    return  {...model};
  }
}
