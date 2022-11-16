import { TDSSafeAny } from 'tds-ui/shared/utility';
import { Injectable } from "@angular/core";
import { ChatomniFacebookDataDto, ChatomniMessageType, ChatomniTShopDataDto } from "@app/dto/conversation-all/chatomni/chatomni-data.dto";
import { SocketioOnMessageDto } from "@app/dto/socket-io/chatomni-on-message.dto";
import { CRMTeamDTO } from "@app/dto/team/team.dto";
import { map, Subject, mergeMap } from "rxjs";
import { CRMTeamService } from "../crm-team.service";
import { SocketService } from "./socket.service";
import { ChatmoniSocketEventName } from "./soketio-event";
import { SocketioOnUpdateDto } from '@app/dto/socket-io/chatomni-on-update.dto';
import { OnSocketOnSaleOnline_OrderDto } from '@app/dto/socket-io/chatomni-on-order.dto';

export interface SocketEventNotificationDto {
  Title: string;
  Message: string;
  Attachments: any,
  Url: string;
}

export interface SocketEventSubjectDto {
  Notification: SocketEventNotificationDto,
  Data: TDSSafeAny, // SocketioOnMessageDto || SocketioOnOrderDto
  Team: CRMTeamDTO,
  EventName: string
}

@Injectable({
  providedIn: 'root'
})

export class SocketOnEventService {

  private readonly socketEvent$ = new Subject<any>();
  public isRegisteredEvent: boolean = false;

  constructor(private crmTeamService: CRMTeamService,
    private socketService: SocketService) {

    this.socketService.isConnectedSocket.subscribe({
      next: (res: any) => {
          if (res && !this.isRegisteredEvent) {
              this.initialize();
              this.isRegisteredEvent = true;
          }
      }
    });
  }

  // TODO: event socket
  initialize() {
    this.socketService.listenEvent("on-events").pipe(
      map((res: any) => {
          let socketData = JSON.parse(res) as any;
          return socketData;
      }),
      mergeMap((socketData: SocketioOnMessageDto) => {
        let channelId = null;
        switch (socketData.EventName) {

          case ChatmoniSocketEventName.chatomniOnUpdate:
            channelId = socketData.Data.ChannelId;
            break;

          case ChatmoniSocketEventName.chatomniMarkseen:
            channelId = socketData.Data?.Conversation?.ChannelId;
            break;

          case ChatmoniSocketEventName.onUpdateSaleOnline_Order:
            channelId = socketData.Data?.Facebook_PageId;
            break;

          default:
            channelId = socketData.Conversation?.ChannelId;
            break;
        }

        return this.crmTeamService.getActiveByPageIds$([channelId]).pipe((map((teams: CRMTeamDTO[]) => {
            let team = teams[0] as CRMTeamDTO;
            return [(socketData || {}), (team || {})];
        })))
      }))
      .subscribe({
        next: ([socketData, team]: any) => {

          if(!socketData) return;

          let existTeam = team && team?.Id;
          let existLive = socketData?.EventName == ChatmoniSocketEventName.livecampaign_Quantity_AvailableToBuy
              || socketData?.EventName == ChatmoniSocketEventName.livecampaign_Quantity_Order_Pending_Checkout
              || socketData?.EventName == ChatmoniSocketEventName.chatomniPostLiveEnd;

          if(existLive) existTeam = true;
          if (!existTeam) return;

          switch (socketData.EventName) {

            // TODO: thông báo tin nhắn, comment
            case ChatmoniSocketEventName.chatomniOnMessage:
                let notificationMessage = this.prepareOnMessage(socketData, team);
                this.pubSocketEvent(notificationMessage, socketData, team); //SocketioOnMessageDto
            break;

            // TODO: cập nhật tin nhắn lỗi
            case ChatmoniSocketEventName.chatomniOnUpdate:
                let notificationUpdate = null as any;
                let status = socketData && socketData.Data && socketData.Data.Status == 1;
                if (status) {
                    notificationUpdate = this.prepareOnUpdateMessageError(socketData, team);
                }
                this.pubSocketEvent(notificationUpdate, socketData, team); //SocketioOnUpdateDto
            break;

            // TODO: update đơn hàng hội thoại
            case ChatmoniSocketEventName.onUpdateSaleOnline_Order:
                let notificationOrder = this.prepareOnUpdateOrder(socketData);
                this.pubSocketEvent(notificationOrder, socketData, team); //SocketioOnMarkseenDto
            break;

            // TODO: user đang xem
            case ChatmoniSocketEventName.chatomniMarkseen:
                this.pubSocketEvent(null, socketData, team); //SocketioOnMarkseenDto
              break;

              // Thông báo Số lượng sản phẩm chiến dịch chờ chốt
            case ChatmoniSocketEventName.livecampaign_Quantity_Order_Pending_Checkout:
                this.pubSocketEvent(null, socketData, team); //SocketLiveCampaignPendingCheckoutDto
              break;

            // Thông báo Số lượng sản phẩm chiến dịch có thểm mua
            case ChatmoniSocketEventName.livecampaign_Quantity_AvailableToBuy:
                this.pubSocketEvent(null, socketData, team); //SocketLiveCampaignAvailableToBuyDto
              break;

            // Thông báo kết thúc live TShop
            case ChatmoniSocketEventName.chatomniPostLiveEnd:
                this.pubSocketEvent(null, socketData, team); //SocketioChatomniPostLiveEndDto
              break;
          }
        },
        error: (error: any) => {
            console.log(`Thông báo đến từ kênh chưa được kết nối: \n ${error}`)
        }
      })
  }

  pubSocketEvent(notification: SocketEventNotificationDto | any, socketData: any, team: CRMTeamDTO) {
    this.socketEvent$.next({
        Notification: notification,
        Data: socketData,
        Team: team,
        EventName: socketData.EventName
    });
  }

  prepareOnMessage(socketData: SocketioOnMessageDto, team: CRMTeamDTO) {
    let model = {} as SocketEventNotificationDto;

    switch (socketData.Message.MessageType) {

      case ChatomniMessageType.FacebookMessage:
        let fbMess = {...socketData.Message?.Data} as ChatomniFacebookDataDto;
        model = {
            Title: `Facebook: <span class="font-semibold"> ${socketData.Conversation?.Name || 'Người dùng Facebook'} </span> vừa nhắn tin`,
            Message: `${socketData.Message?.Message}`,
            Attachments: fbMess?.attachments,
            Url: `/conversation/inbox?teamId=${team?.Id}&type=message&csid=${socketData.Conversation?.UserId}`
        };
        break;

      case ChatomniMessageType.FacebookComment:
        let fbComment = {...socketData.Message?.Data} as ChatomniFacebookDataDto;
        model = {
            Title: `Facebook: <span class="font-semibold"> ${socketData.Conversation?.Name || 'Người dùng Facebook'} </span> vừa bình luận`,
            Message: `${socketData.Message?.Message}`,
            Attachments: fbComment?.attachments,
            Url: `/conversation/comment?teamId=${team?.Id}&type=comment&csid=${socketData.Conversation?.UserId}`
        };
        break;

      case ChatomniMessageType.TShopMessage:
        let mTShop = {...socketData.Message?.Data} as ChatomniTShopDataDto;
        model = {
            Title: `TShop: <span class="font-semibold"> ${socketData.Conversation?.Name || mTShop?.Actor?.Name || 'Người dùng TShop'} </span> vừa nhắn tin`,
            Message: `${socketData.Message?.Message}`,
            Attachments: mTShop?.AttachmentDto,
            Url: `/conversation/all?teamId=${team?.Id}&type=all&csid=${socketData.Conversation?.UserId}`
        };
        break;

      case ChatomniMessageType.TShopComment:
        let cTShop = {...socketData.Message?.Data} as ChatomniTShopDataDto;
        model = {
            Title: `TShop: <span class="font-semibold"> ${socketData.Conversation?.Name || cTShop?.Actor?.Name || 'Người dùng TShop'} </span> vừa binh luận`,
            Message: `${socketData.Message?.Message}`,
            Attachments: cTShop?.AttachmentDto,
            Url: `/conversation/all?teamId=${team?.Id}&type=all&csid=${socketData.Conversation?.UserId}`
        };
        break;

      default:
        model = {
            Title: `${socketData.Conversation?.Name || 'Người dùng'} vừa phản hồi`,
            Message: `${socketData.Message?.Message}`,
            Attachments: null,
            Url: `/conversation/all?teamId=${team.Id}&type=all&csid=${socketData.Conversation?.UserId}`
        };
        break;
    }

    return {...model};
  }

  prepareOnUpdateMessageError(socketData: any, team: CRMTeamDTO) {
    let notification = {
        Title: `${socketData.Message}`,
        Message: `${socketData.Data.MessageError}`,
        Attachments: null,
        Url: `/conversation/inbox?teamId=${team.Id}&type=message&csid=${socketData.Data?.UserId}`
    } as SocketEventNotificationDto;

    return {...notification};
  }

  prepareOnUpdateOrder(socketData: any) {
    let model = {...socketData} as OnSocketOnSaleOnline_OrderDto;
    let notification = {
        Title: `${model.Data?.Facebook_UserName || 'Người dùng'} vừa cập nhật đơn hàng`,
        Message: `Mã đơn hàng <span class="font-semibold">${model.Data?.Code}</span>`,
        Attachments: null,
        Url: ''
    } as SocketEventNotificationDto;

    return {...notification};
  }

  public onEventSocket() {
    return this.socketEvent$.asObservable();
  }
}
