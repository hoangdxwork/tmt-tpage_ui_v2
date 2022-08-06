import { ChatomniFacebookDataDto, ChatomniDataItemDto, ChatomniDataDto } from './../../dto/conversation-all/chatomni/chatomni-data.dto';
import { Injectable, OnDestroy } from "@angular/core";
import { TCommonService } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { get as _get } from 'lodash';
import { set as _set } from 'lodash';
import { TDSHelperString } from "tds-ui/shared/utility";
import { MakeActivityItemWebHook } from "@app/dto/conversation/make-activity.dto";

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
    return model;
  }

  mappingChatomniDataItemDto(data:MakeActivityItemWebHook){
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
    } as ChatomniDataItemDto

    return model;
  }

  mappinglLastMessageEmiter(){
    // let model = {
    //   ConversationId: this.data.ConversationId,
    //   LatestMessage: this.data.LatestMessage
    // } as ChatomniLastMessageEventEmitterDto
  }
}
