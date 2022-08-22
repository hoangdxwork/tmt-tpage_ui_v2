import { Injectable } from "@angular/core";
import { Attachments, ChatomniMessageType } from "@app/dto/conversation-all/chatomni/chatomni-data.dto";
import { SocketioOnMessageDto } from "@app/dto/socket-io/chatomni-on-message.dto";
import { CRMTeamDTO } from "@app/dto/team/team.dto";
import { map, Subject, tap, mergeMap } from "rxjs";
import { CRMTeamService } from "../crm-team.service";
import { SocketService } from "./socket.service";

export interface SocketEventNotificationDto {
  Title: string;
  Message: string;
  Attachments: Attachments,
  Url: string;
}

export interface SocketEventSubjectDto {
  Notification: SocketEventNotificationDto,
  Data: SocketioOnMessageDto
}

@Injectable({
  providedIn: 'root'
})

export class SocketOnEventService  {

  private readonly socketEvent$ = new Subject<any>();

  constructor(private crmTeamService: CRMTeamService,
    private socketService: SocketService) {
        this.initialize();
  }

  // TODO: event socket
  initialize() {
    this.socketService.listenEvent("on-events").pipe(
      map((res: any) => {
          let socketData = JSON.parse(res) as SocketioOnMessageDto;
          return socketData;
      }),
      mergeMap((socketData: SocketioOnMessageDto) => {
          return this.crmTeamService.getActiveByPageIds$([socketData.Conversation?.ChannelId]).pipe((map((teams: CRMTeamDTO[]) => {
              let team = teams[0] as CRMTeamDTO;
              return [(socketData || {}), (team || {})];
          })))
      }))
      .subscribe({
          next: ([socketData, team]: any) => {

            console.log(socketData);
            let model: SocketEventNotificationDto = {} as any;

            switch(socketData.Message.MessageType) {
                case ChatomniMessageType.FacebookMessage:
                  model = {
                      Title: `Facebook: ${socketData.Conversation?.Name} vừa nhắn tin`,
                      Message: `${socketData.Message?.Message}`,
                      Attachments: socketData.Message.Data?.attachments,
                      Url: `/conversation/inbox?teamId=${team?.Id}&type=message&csid=${socketData.Conversation?.UserId}`
                  };

                  break;

                case ChatomniMessageType.FacebookComment:
                  model = {
                      Title: `Facebook: ${socketData.Conversation?.Name} vừa bình luận`,
                      Message: `${socketData.Message?.Message}`,
                      Attachments: socketData.Message.Data?.attachments,
                      Url: `/conversation/comment?teamId=${team?.Id}&type=comment&csid=${socketData.Conversation?.UserId}`
                  };

                break;

                case ChatomniMessageType.TShopMessage:
                  model = {
                      Title: `TShop: ${socketData.Conversation?.Name} vừa nhắn tin`,
                      Message: `${socketData.Message?.Message}`,
                      Attachments: socketData.Message.Data?.attachments,
                      Url: `/conversation/all?teamId=${team?.Id}&type=all&csid=${socketData.Conversation?.UserId}`
                  };

                break;

                case ChatomniMessageType.TShopComment:
                  model = {
                      Title: `TShop: ${socketData.Conversation?.Name} vừa nhắn tin`,
                      Message: `${socketData.Message?.Message}`,
                      Attachments: socketData.Message.Data?.attachments,
                      Url: `/conversation/all?teamId=${team?.Id}&type=all&csid=${socketData.Conversation?.UserId}`
                  } ;
                break;

                default:
                  model = {
                      Title: `${socketData.Conversation?.Name} vừa phản hồi`,
                      Message: `${socketData.Message?.Message}`,
                      Attachments: socketData.Message.Data?.attachments,
                      Url: `/conversation/all?teamId=${team.Id}&type=all&csid=${socketData.Conversation?.UserId}`
                  };

                break;
            }

            // TODO: return dữ liệu
            this.socketEvent$.next({ Notification: model,  Data: socketData });
          },
          error: (error: any) => {
               console.log(`Thông báo đến từ kênh chưa được kết nối: \n ${error}`)
          }
      })
  }

  public onEventSocket() {
      return this.socketEvent$.asObservable();
  }
}
