import { TDSMessageService } from 'tds-ui/message';
import { EditOrderV2Component } from '@app/pages/order/components/edit-order/edit-order-v2.component';
import { TDSModalService, TDSModalRef } from 'tds-ui/modal';
import { TDSDestroyService } from 'tds-ui/core/services';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { SocketioOnOrderDto } from './../../dto/socket-io/chatomni-on-order.dto';
import { DataComentTShop, DataMessageTshop } from './../../dto/socket-io/chatomni-on-message.dto';
import { Injectable, ViewContainerRef } from "@angular/core";
import { Attachments, ChatomniMessageType } from "@app/dto/conversation-all/chatomni/chatomni-data.dto";
import { SocketioOnMessageDto } from "@app/dto/socket-io/chatomni-on-message.dto";
import { CRMTeamDTO } from "@app/dto/team/team.dto";
import { map, Subject, tap, mergeMap, takeUntil } from "rxjs";
import { CRMTeamService } from "../crm-team.service";
import { SocketService } from "./socket.service";
import { ChatmoniSocketEventName } from "./soketio-event";

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

export class SocketOnEventService  {

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
          return this.crmTeamService.getActiveByPageIds$([socketData.Conversation?.ChannelId]).pipe((map((teams: CRMTeamDTO[]) => {
              let team = teams[0] as CRMTeamDTO;
              return [(socketData || {}), (team || {})];
          })))
      }))
      .subscribe({
          next: ([socketData, team]: any) => {
            if(!(team && team.Id)){
                return;
            }

            console.log(socketData)

            switch(socketData.EventName) {
              case ChatmoniSocketEventName.chatomniOnMessage:
                  socketData = {...socketData} as SocketioOnMessageDto;
                  let model = {...this.prepareChatomniOnMessage(socketData, team)};

                  this.socketEvent$.next({
                      Notification: model,
                      Data: socketData,
                      Team: team,
                      EventName: socketData.EventName
                  });

                  break;

              case ChatmoniSocketEventName.onUpdate:
                  socketData = {...socketData} as SocketioOnOrderDto;
                  let modelOrder = {...this.prepareChatomniOnOrder(socketData)};

                  this.socketEvent$.next({
                      Notification: modelOrder,
                      Data: socketData,
                      Team: team,
                      EventName: socketData.EventName
                  })

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

    switch(socketData.Message.MessageType) {
        case ChatomniMessageType.FacebookMessage:
          model = {
              Title: `Facebook: <span class = "font-semibold"> ${socketData.Conversation?.Name} </span> vừa nhắn tin`,
              Message: `${socketData.Message?.Message}`,
              Attachments: socketData.Message.Data?.attachments,
              Url: `/conversation/inbox?teamId=${team?.Id}&type=message&csid=${socketData.Conversation?.UserId}`
          };

          break;

        case ChatomniMessageType.FacebookComment:
          model = {
              Title: `Facebook: <span class = "font-semibold"> ${socketData.Conversation?.Name} </span> vừa bình luận`,
              Message: `${socketData.Message?.Message}`,
              Attachments: socketData.Message.Data?.attachments,
              Url: `/conversation/comment?teamId=${team?.Id}&type=comment&csid=${socketData.Conversation?.UserId}`
          };

        break;

        case ChatomniMessageType.TShopMessage:
          let message = {...socketData.Message?.Data} as DataMessageTshop;
          model = {
              Title: `TShop: <span class = "font-semibold"> ${socketData.Conversation?.Name || message?.Recipient?.Name} </span> vừa nhắn tin`,
              Message: `${socketData.Message?.Message}`,
              Attachments: socketData.Message.Data?.attachments,
              Url: `/conversation/all?teamId=${team?.Id}&type=all&csid=${socketData.Conversation?.UserId}`
          };

        break;

        case ChatomniMessageType.TShopComment:
          let comment = {...socketData.Message?.Data} as DataComentTShop;
          model = {
              Title: `TShop: <span class = "font-semibold"> ${socketData.Conversation?.Name || comment?.Actor?.Name} </span> vừa binh luận`,
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

    return {...model};

  }

  prepareChatomniOnOrder(socketData: SocketioOnOrderDto) {
    let model: SocketEventNotificationDto = {} as any;
    model = {
      Title: `Order: ${socketData.Data?.Facebook_UserName} vừa cập nhật đơn hàng`,
      Message: `${socketData.Message}`,
      Attachments: {} as any,
      Url: ''
    } as any;

    return {...model};
  }

  showModalSocketOrder(orderId : string){
    if(this.modalRef){
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
                autoClose:false
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
