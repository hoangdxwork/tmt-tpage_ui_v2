import { Component, Input, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { MessageDeliveryHistoryLiveCampaignParamsDTO, MessageHistoryFSOrderDTO } from 'src/app/main-app/dto/common/table.dto';
import { ODataParamsDTO } from 'src/app/main-app/dto/odata/odata.dto';
import { CommonService } from 'src/app/main-app/services/common.service';
import { TDSMessageService, TDSTableQueryParams } from 'tmt-tang-ui';

@Component({
  selector: 'table-bill-message',
  templateUrl: './table-bill-message.component.html'
})
export class TableBillMessageComponent implements OnInit {

  @Input() liveCampaignId!: string;

  pageIndex = 1;
  pageSize = 20;
  count: number = 0;
  filterObj = {} as MessageDeliveryHistoryLiveCampaignParamsDTO;

  isLoading: boolean = false;
  lstData: MessageHistoryFSOrderDTO[] = [];

  isOpenMessageFacebook: boolean = false;

  constructor(
    private commonService: CommonService,
    private message: TDSMessageService
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

    this.commonService.getHistoryMessageSentFSOrder(this.filterObj)
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

  openDrawerMessage() {
    this.isOpenMessageFacebook = true;
  }

  closeDrawerMessage() {
    this.isOpenMessageFacebook = false;
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
