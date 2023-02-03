import { SocketioChatomniCreatePostDto } from './../../dto/socket-io/chatomni-create-post.dto';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { Injectable } from "@angular/core";
import { ChatomniFacebookDataDto, ChatomniMessageType, ChatomniTShopDataDto } from "@app/dto/conversation-all/chatomni/chatomni-data.dto";
import { SocketioOnMessageDto } from "@app/dto/socket-io/chatomni-on-message.dto";
import { CRMTeamDTO } from "@app/dto/team/team.dto";
import { map, Subject, mergeMap } from "rxjs";
import { CRMTeamService } from "../crm-team.service";
import { SocketService } from "./socket.service";
import { ChatmoniSocketEventName } from "./soketio-event";
import { OnSocketOnSaleOnline_OrderDto } from '@app/dto/socket-io/chatomni-on-order.dto';
import { TikTokLiveItemDataDto } from '@app/dto/conversation-all/chatomni/tikitok-live.dto';

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
  private readonly socketAction$ = new Subject<any>();

  public isRegisteredEvent: boolean = false;

  constructor(private crmTeamService: CRMTeamService,
    private socketService: SocketService) {

    this.socketService.isConnectedSocket$.subscribe({
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
      mergeMap((socketData: any) => {
        let channelId = null;
        switch (socketData?.EventName) {

          case ChatmoniSocketEventName.chatomniOnUpdate:
            channelId = socketData.Data.ChannelId;
            break;

          case ChatmoniSocketEventName.chatomniMarkseen:
            channelId = socketData.Data?.Conversation?.ChannelId;
            break;

          case ChatmoniSocketEventName.chatomniOnMessage:
            let tshopCmt = socketData?.Message?.ChannelId && socketData?.Message?.MessageType == ChatomniMessageType.TShopComment;
            if(tshopCmt) {
                channelId = socketData.Message.ChannelId;
            } else {
                channelId = socketData.Conversation?.ChannelId;
                let isNull = !TDSHelperString.hasValueString(channelId) && TDSHelperString.hasValueString(socketData.Data.Conversation?.ChannelId);
                if(isNull) {
                    channelId = socketData.Data.Conversation?.ChannelId;
                }
            }
            break;

          case ChatmoniSocketEventName.chatomniCreatePost:
            channelId = socketData?.Data?.Data?.ShopId;
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

          if(socketData.action == ChatmoniSocketEventName.inventory_updated && socketData.type == "Product") {
            this.publishSocketAction(socketData);
            return;
          }

          if(socketData.action == ChatmoniSocketEventName.producttemplate_create && socketData.type == "ProductTemplate") {
            this.publishSocketAction(socketData);
            return;
          }

          let existTeam = team && team?.Id;
          let existLive = socketData.EventName == ChatmoniSocketEventName.livecampaign_Quantity_AvailableToBuy
              || socketData.EventName == ChatmoniSocketEventName.livecampaign_Quantity_Order_Pending_Checkout
              || socketData.EventName == ChatmoniSocketEventName.chatomniPostLiveEnd
              || socketData.EventName == ChatmoniSocketEventName.onCreatedSaleOnline_Order
              || socketData.EventName == ChatmoniSocketEventName.onUpdateSaleOnline_Order
              || socketData.EventName == ChatmoniSocketEventName.onDeleteSaleOnline_Order
              || socketData.EventName == ChatmoniSocketEventName.livecampaign_CartCheckout;

          if(existLive) existTeam = true;
          if (!existTeam) return;

          switch (socketData.EventName) {
            // TODO: thông báo tin nhắn, comment
            case ChatmoniSocketEventName.chatomniOnMessage:
                let notificationMessage = this.prepareOnMessage(socketData, team);
                this.publishSocketEvent(notificationMessage, socketData, team); //SocketioOnMessageDto
            break;

            // TODO: cập nhật tin nhắn lỗi
            case ChatmoniSocketEventName.chatomniOnUpdate:
                let notificationUpdate = null as any;
                let status = socketData && socketData.Data && socketData.Data.Status == 1;
                if (status) {
                    notificationUpdate = this.prepareOnUpdateMessageError(socketData, team);
                }
                this.publishSocketEvent(notificationUpdate, socketData, team); //SocketioOnUpdateDto
            break;

            // TODO: tạo đơn hàng bài viết
            case ChatmoniSocketEventName.onCreatedSaleOnline_Order:
                let notificationCreate = this.prepareOnCreatedOrder(socketData);
                this.publishSocketEvent(notificationCreate, socketData, team); //OnSocketOnSaleOnline_OrderDto
            break;

            // TODO: update đơn hàng bài viết
            case ChatmoniSocketEventName.onUpdateSaleOnline_Order:
                let notificationOrder = this.prepareOnUpdateOrder(socketData);
                this.publishSocketEvent(null, socketData, team); //OnSocketOnSaleOnline_OrderDto
            break;

            // TODO: delete đơn hàng bài viết
            case ChatmoniSocketEventName.onDeleteSaleOnline_Order:
                let notificationDelete = this.prepareDeleteOrder(socketData);
                this.publishSocketEvent(notificationDelete, socketData, team); //OnSocketOnSaleOnline_OrderDto
            break;

            // TODO: tạo hóa đơn bài viết
            case ChatmoniSocketEventName.livecampaign_CartCheckout:
                this.publishSocketEvent(null, socketData, team); //OnSocketOnSaleOnline_OrderDto
            break;

            // TODO: user đang xem
            case ChatmoniSocketEventName.chatomniMarkseen:
                this.publishSocketEvent(null, socketData, team); //SocketioOnMarkseenDto
              break;

              // Thông báo Số lượng sản phẩm chiến dịch chờ chốt
            case ChatmoniSocketEventName.livecampaign_Quantity_Order_Pending_Checkout:
                this.publishSocketEvent(null, socketData, team); //SocketLiveCampaignPendingCheckoutDto
              break;

            // Thông báo Số lượng sản phẩm chiến dịch có thểm mua
            case ChatmoniSocketEventName.livecampaign_Quantity_AvailableToBuy:
                this.publishSocketEvent(null, socketData, team); //SocketLiveCampaignAvailableToBuyDto
              break;

            // Thông báo kết thúc live TShop
            case ChatmoniSocketEventName.chatomniPostLiveEnd:
                this.publishSocketEvent(null, socketData, team); //SocketioChatomniPostLiveEndDto
              break;

            // Thông báo bài viết mới TShop
            case ChatmoniSocketEventName.chatomniCreatePost:
                let notificationCreatePost = this.prepareCreatePost(socketData, team);
                this.publishSocketEvent(notificationCreatePost, socketData, team); //SocketioChatomniCreatePostDto
              break;
          }
        },
        error: (error: any) => {
            console.log(`Thông báo đến từ kênh chưa được kết nối: \n ${error}`)
        }
      })
  }

  publishSocketEvent(notification: SocketEventNotificationDto | any, socketData: any, team: CRMTeamDTO | any) {
    this.socketEvent$.next({
        Notification: notification,
        Data: socketData,
        Team: team,
        EventName: socketData.EventName
    });
  }

  publishSocketAction(socketData: any) {
    this.socketAction$.next({
        Data: socketData,
        Action: socketData.action
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
            Title: `TShop: <span class="font-semibold"> ${socketData.Conversation?.Name || cTShop?.Actor?.Name || 'Người dùng TShop'} </span> vừa bình luận`,
            Message: `${socketData.Message?.Message}`,
            Attachments: cTShop?.AttachmentDto,
            Url: `/conversation/all?teamId=${team?.Id}&type=all&csid=${socketData.Conversation?.UserId}`
        };
        break;

      case ChatomniMessageType.UnofficialTikTokChat:
        let tikitok = {...socketData.Message?.Data} as TikTokLiveItemDataDto;
        model = {
            Title: `TikTok: <span class="font-semibold"> ${socketData.Conversation?.Name || tikitok?.nickname || 'Người dùng Tiktok'} </span> vừa bình luận`,
            Message: `${socketData.Message?.Message}`,
            Attachments: null,
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

  prepareOnCreatedOrder(socketData: any) {
    let model = {...socketData} as OnSocketOnSaleOnline_OrderDto;
    let notification = {
        Title: `Đơn hàng mới: ${model.Data?.Facebook_UserName}`,
        Message: `Mã đơn hàng <span class="font-semibold">${model.Data?.Code}</span>`,
        Attachments: null,
        Url: ''
    } as SocketEventNotificationDto;

    return {...notification};
  }

  prepareOnUpdateOrder(socketData: any) {
    let model = {...socketData} as OnSocketOnSaleOnline_OrderDto;
    let notification = {
        Title: `Cập nhật đơn hàng: ${model.Data?.Facebook_UserName}`,
        Message: `Mã đơn hàng <span class="font-semibold">${model.Data?.Code}</span>`,
        Attachments: null,
        Url: ''
    } as SocketEventNotificationDto;

    return {...notification};
  }

  prepareDeleteOrder(socketData: any) {
    let model = {...socketData} as OnSocketOnSaleOnline_OrderDto;
    let notification = {
        Title: `Xóa đơn hàng: ${model.Data?.Facebook_UserName}` ,
        Message: `Đơn hàng <span class="font-semibold">${model.Data?.Code}</span> vừa được xóa`,
        Attachments: null,
        Url: ''
    } as SocketEventNotificationDto;

    return {...notification};
  }

  prepareCreatePost(socketData: any, team: CRMTeamDTO) {
    let createPost = {...socketData} as SocketioChatomniCreatePostDto;
    let notification = {
        Title: `TShop: <span class="font-semibold">${team?.Name || 'Kênh TShop'}</span> vừa tạo bài viết mới` ,
        Message: `${createPost.Data.Description || ''}`,
        Attachments: null,
        Url: `/conversation/post?teamId=${team.Id}&type=post&post_id=${socketData.Data?.ObjectId}`
    } as SocketEventNotificationDto;

    return {...notification};
  }

  public onEventSocket() {
    return this.socketEvent$.asObservable();
  }

  public onActionSocket() {
    return this.socketAction$.asObservable();
  }
}
