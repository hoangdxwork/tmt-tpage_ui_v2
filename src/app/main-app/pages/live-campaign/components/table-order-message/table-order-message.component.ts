import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { MessageDeliveryHistoryLiveCampaignParamsDTO, MessageHistorySaleOnlineDTO } from 'src/app/main-app/dto/common/table.dto';
import { CommonService } from 'src/app/main-app/services/common.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSTableQueryParams } from 'tds-ui/table';

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

  isOpenDrawerOrderMessage: boolean = false;
  openMessageByOrderId!: string;

  constructor(
    private commonService: CommonService,
    private message: TDSMessageService,
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
      .pipe(finalize(() => this.isLoading = false))
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

}
