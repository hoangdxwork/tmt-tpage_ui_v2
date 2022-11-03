import { TDSMessageService } from 'tds-ui/message';
import { EditOrderV2Component } from '@app/pages/order/components/edit-order/edit-order-v2.component';
import { TDSModalService, TDSModalRef } from 'tds-ui/modal';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { DataComentTShop, DataMessageTshop } from './../../dto/socket-io/chatomni-on-message.dto';
import { Injectable } from "@angular/core";
import { Attachments, ChatomniMessageType } from "@app/dto/conversation-all/chatomni/chatomni-data.dto";
import { SocketioOnMessageDto } from "@app/dto/socket-io/chatomni-on-message.dto";
import { CRMTeamDTO } from "@app/dto/team/team.dto";
import { map, Subject, tap, mergeMap } from "rxjs";
import { CRMTeamService } from "../crm-team.service";
import { SocketService } from "./socket.service";
import { ChatmoniSocketEventName } from "./soketio-event";
import { SocketioOnUpdateDto } from '@app/dto/socket-io/chatomni-on-update.dto';
import { SocketioOnMarkseenDto } from '@app/dto/socket-io/chatomni-on-read-conversation.dto';
import { OnSocketOnSaleOnline_OrderDto } from '@app/dto/socket-io/chatomni-on-order.dto';

export interface SocketEventNotificationDto {
  Title: string;
  Message: string;
  Attachments: Attachments,
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
  private modalRef!: TDSModalRef;

  constructor(private crmTeamService: CRMTeamService,
    private socketService: SocketService,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private modalService: TDSModalService,
    private message: TDSMessageService) {
      this.initialize();
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
          if (!(team && team.Id)) {
              return;
          }

          switch (socketData.EventName) {
              // TODO: thông báo tin nhắn, comment
              case ChatmoniSocketEventName.chatomniOnMessage:
                  socketData = { ...socketData } as SocketioOnMessageDto;
                  let modelMesage = { ...this.prepareChatomniOnMessage(socketData, team) };

                  this.socketEvent$.next({
                      Notification: modelMesage,
                      Data: socketData,
                      Team: team,
                      EventName: socketData.EventName
                  });

              break;

              // TODO: cập nhật tin nhắn lỗi
              case ChatmoniSocketEventName.chatomniOnUpdate:
                  socketData = { ...socketData } as SocketioOnUpdateDto;

                  // TODO: thông báo tin nhắn lỗi
                  let modelUpdate = null as any;
                  if(socketData && socketData.Data && socketData.Data.Status == 1) {
                      modelUpdate = { ...this.prepareChatomniOnUpdateMessageError(socketData, team) };
                  }

                  this.socketEvent$.next({
                      Notification: modelUpdate,
                      Data: socketData,
                      Team: team,
                      EventName: socketData.EventName
                  });

              break;

              // TODO: update đơn hàng hội thoại
              case ChatmoniSocketEventName.onUpdateSaleOnline_Order:
                  socketData = { ...socketData } as OnSocketOnSaleOnline_OrderDto;
                  let modelOrder = { ...this.prepareChatomniOnUpdateOrder(socketData) };

                  this.socketEvent$.next({
                      Notification: modelOrder,
                      Data: socketData,
                      Team: team,
                      EventName: socketData.EventName
                  })

              break;

              // TODO: user đang xem
              case ChatmoniSocketEventName.chatomniMarkseen:
                socketData = { ...socketData } as SocketioOnMarkseenDto;

                this.socketEvent$.next({
                    Notification: null,
                    Data: socketData,
                    Team: team,
                    EventName: socketData.EventName
                });

              break;
          }
        },
        error: (error: any) => {
            console.log(`Thông báo đến từ kênh chưa được kết nối: \n ${error}`)
        }
      })
  }

  prepareChatomniOnMessage(socketData: SocketioOnMessageDto, team: CRMTeamDTO) {
    let model: SocketEventNotificationDto = {} as any;

    switch (socketData.Message.MessageType) {
      case ChatomniMessageType.FacebookMessage:
        model = {
          Title: `Facebook: <span class = "font-semibold"> ${socketData.Conversation?.Name || 'Người dùng Facebook'} </span> vừa nhắn tin`,
          Message: `${socketData.Message?.Message}`,
          Attachments: socketData.Message.Data?.attachments,
          Url: `/conversation/inbox?teamId=${team?.Id}&type=message&csid=${socketData.Conversation?.UserId}`
        };

        break;

      case ChatomniMessageType.FacebookComment:
        model = {
          Title: `Facebook: <span class = "font-semibold"> ${socketData.Conversation?.Name || 'Người dùng Facebook'} </span> vừa bình luận`,
          Message: `${socketData.Message?.Message}`,
          Attachments: socketData.Message.Data?.attachments,
          Url: `/conversation/comment?teamId=${team?.Id}&type=comment&csid=${socketData.Conversation?.UserId}`
        };

        break;

      case ChatomniMessageType.TShopMessage:
        let message = { ...socketData.Message?.Data } as DataMessageTshop;
        model = {
          Title: `TShop: <span class = "font-semibold"> ${socketData.Conversation?.Name || message?.Recipient?.Name || 'Người dùng TShop'} </span> vừa nhắn tin`,
          Message: `${socketData.Message?.Message}`,
          Attachments: socketData.Message.Data?.attachments,
          Url: `/conversation/all?teamId=${team?.Id}&type=all&csid=${socketData.Conversation?.UserId}`
        };

        break;

      case ChatomniMessageType.TShopComment:
        let comment = { ...socketData.Message?.Data } as DataComentTShop;
        model = {
          Title: `TShop: <span class = "font-semibold"> ${socketData.Conversation?.Name || comment?.Actor?.Name || 'Người dùng TShop'} </span> vừa binh luận`,
          Message: `${socketData.Message?.Message}`,
          Attachments: socketData.Message.Data?.attachments,
          Url: `/conversation/all?teamId=${team?.Id}&type=all&csid=${socketData.Conversation?.UserId}`
        };
        break;

      default:
        model = {
          Title: `${socketData.Conversation?.Name || 'Người dùng'} vừa phản hồi`,
          Message: `${socketData.Message?.Message}`,
          Attachments: socketData.Message.Data?.attachments,
          Url: `/conversation/all?teamId=${team.Id}&type=all&csid=${socketData.Conversation?.UserId}`
        };

        break;
    }

    return { ...model };

  }

  prepareChatomniOnUpdateMessageError(socketData: SocketioOnUpdateDto, team: CRMTeamDTO) {
    let model: SocketEventNotificationDto = {} as any;
    model = {
        Title: `${socketData.Message}`,
        Message: `${socketData.Data.MessageError}`,
        Attachments: {} as any,
        Url: `/conversation/inbox?teamId=${team.Id}&type=message&csid=${socketData.Data?.UserId}`
    };

    return { ...model };
  }

  prepareChatomniOnUpdateOrder(socketData: OnSocketOnSaleOnline_OrderDto) {
    let model: SocketEventNotificationDto = {} as any;
    model = {
        Title: `${socketData.Data?.Facebook_UserName || 'Người dùng'} vừa cập nhật đơn hàng`,
        Message: `Mã đơn hàng ${socketData.Data?.Code}`,
        Attachments: {} as any,
        Url: ''
    } as any;

    return { ...model };
  }

  showModalSocketOrder(orderId: string) {
    if (this.modalRef) {
      this.modalRef.destroy(null);
    }

    this.saleOnline_OrderService.getById(orderId).subscribe({
      next: (res: any) => {

        if (res && res.Id) {
          delete res['@odata.context'];

          this.modalRef = this.modalService.create({
            content: EditOrderV2Component,
            title: res.Code ? `Thông tin đơn hàng <span class="text-primary-1 font-semibold text-title-1 pl-2">${res.Code}</span>` : `Thông tin đơn hàng`,
            size: 'xl',
            componentParams: {
              dataItem: { ...res }
            },
            autoClose: false
          })
        }
      },
      error: error => {
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
      }
    });
  }

  public onEventSocket() {
    return this.socketEvent$.asObservable();
  }
}
