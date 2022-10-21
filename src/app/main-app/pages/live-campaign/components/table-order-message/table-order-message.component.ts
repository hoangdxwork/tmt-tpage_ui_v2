import { ChatomniConversationService } from './../../../../services/chatomni-service/chatomni-conversation.service';
import { ChatomniMessageFacade } from 'src/app/main-app/services/chatomni-facade/chatomni-message.facade';
import { ConversationMatchingItem } from 'src/app/main-app/dto/conversation-all/conversation-all.dto';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { MessageDeliveryHistoryLiveCampaignParamsDTO, MessageHistorySaleOnlineDTO } from 'src/app/main-app/dto/common/table.dto';
import { CommonService } from 'src/app/main-app/services/common.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSTableQueryParams } from 'tds-ui/table';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { CRMMatchingService } from 'src/app/main-app/services/crm-matching.service';
import { MDBByPSIdDTO } from 'src/app/main-app/dto/crm-matching/mdb-by-psid.dto';
import { ChatomniConversationItemDto } from '@app/dto/conversation-all/chatomni/chatomni-conversation';

@Component({
  selector: 'table-order-message',
  templateUrl: './table-order-message.component.html'
})
export class TableOrderMessageComponent implements OnInit {

  @Input() liveCampaignId!: string;

  pageIndex = 1;
  pageSize = 20;
  count: number = 0;
  filterObj = {} as MessageDeliveryHistoryLiveCampaignParamsDTO;

  isLoading: boolean = false;
  lstData: MessageHistorySaleOnlineDTO[] = [];
  private destroy$ = new Subject<void>();

  isOpenDrawerOrderMessage: boolean = false;
  openMessageByOrderId!: string;
  public mappingTeams: any[] = [];
  public currentMappingTeam: any;
  currentConversation!: ChatomniConversationItemDto;
  psid: any;
  isOpenDrawer: boolean = false;
  orderMessage: TDSSafeAny;

  constructor(
    private commonService: CommonService,
    private message: TDSMessageService,
    private partnerService: PartnerService,
    private crmTeamService: CRMTeamService,
    private crmMatchingService: CRMMatchingService,
    private chatomniMessageFacade: ChatomniMessageFacade,
    private chatomniConversationService: ChatomniConversationService
  ) { }

  ngOnInit(): void {
  }

  resetFilter() {
    this.filterObj.Take = this.pageSize;
    this.filterObj.Skip = (this.pageIndex - 1) * this.pageSize;
    this.filterObj.LiveCampaignId = this.liveCampaignId;
  }

  loadData() {
    this.isLoading = true;
    this.resetFilter();

    this.commonService.getHistoryMessageSentSaleOnline(this.filterObj)
      .pipe(takeUntil(this.destroy$) ,finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.count = res?.Total;
        this.lstData = res?.Datas;
      }, error => {
        this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
      });
  }

  getTooltipSuccess(total: number) {
    return `${total || 0} tin nhắn thành công`;
  }

  getTooltipEror(total: number) {
    return `${total || 0} tin nhắn thất bại`;
  }

  openDrawerOrderMessage(orderId: string) {
    this.isOpenDrawerOrderMessage = true;
    this.openMessageByOrderId = orderId;
  }

  closeDrawerOrderMessage() {
    this.isOpenDrawerOrderMessage = false;
  }

  refreshData() {
    this.pageIndex = 1;
    this.filterObj = {} as MessageDeliveryHistoryLiveCampaignParamsDTO;

    this.loadData();
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.pageSize = params.pageSize;
    this.loadData();
  }

  openMiniChat(data: TDSSafeAny) {
    let partnerId = data.PartnerId;
    this.orderMessage = data;

    if (this.orderMessage.DateCreated) {
      this.orderMessage.DateCreated = new Date(this.orderMessage.DateCreated);
    }

    this.partnerService.getAllByMDBPartnerId(partnerId).pipe(takeUntil(this.destroy$)).subscribe((res: any): any => {

      let pageIds: any = [];
      res.map((x: any) => {
        pageIds.push(x.page_id);
      });

      if (pageIds.length == 0) {
        return this.message.error('Không có kênh kết nối với khách hàng này.');
      }

      this.crmTeamService.getActiveByPageIds$(pageIds)
        .pipe(takeUntil(this.destroy$)).subscribe((teams: any): any => {

          if (teams.length == 0) {
            return this.message.error('Không có kênh kết nối với khách hàng này.');
          }

          this.mappingTeams = [];
          let pageDic = {} as any;

          teams.map((x: any) => {
            let exist = res.filter((r: any) => r.page_id == x.ChannelId)[0];

            if (exist && !pageDic[exist.page_id]) {

              pageDic[exist.page_id] = true; // Cờ này để không thêm trùng page vào

              this.mappingTeams.push({
                psid: exist.psid,
                team: x
              })
            }
          })

          if (this.mappingTeams.length > 0) {
            this.currentMappingTeam = this.mappingTeams[0];
            this.loadMDBByPSId(this.currentMappingTeam.team.ChannelId, this.currentMappingTeam.psid);
          }
        });
    }, error => {
      this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Thao tác không thành công');
    })
  }

  loadMDBByPSId(channelId: number, psid: string) {
    // Xoá hội thoại hiện tại
    (this.currentConversation as any) = null;

    // get data currentConversation
    this.chatomniConversationService.getById(channelId, psid).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniConversationItemDto) => {
        if (res) {
            // let model = this.chatomniMessageFacade.mappingCurrentConversation(res);
            this.currentConversation = { ...res };

            this.psid = psid;
            this.isOpenDrawer = true;
        }
      },
      error: (error: any) => {
          this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
      }
    })
  }

  selectMappingTeam(item: any) {
    this.currentMappingTeam = item;
    this.loadMDBByPSId(item.team?.ChannelId, item.psid); // Tải lại hội thoại
  }

  closeDrawer() {
    this.isOpenDrawer = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
