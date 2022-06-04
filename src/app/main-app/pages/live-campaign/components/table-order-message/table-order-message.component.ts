import { TDSMessageService } from 'tmt-tang-ui';
import { Component, Input, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { MessageDeliveryHistoryLiveCampaignParamsDTO, MessageHistorySaleOnlineDTO } from 'src/app/main-app/dto/common/table.dto';
import { ODataParamsDTO } from 'src/app/main-app/dto/odata/odata.dto';
import { CommonService } from 'src/app/main-app/services/common.service';

@Component({
  selector: 'table-order-message',
  templateUrl: './table-order-message.component.html'
})
export class TableOrderMessageComponent implements OnInit {

  @Input() liveCampaignId!: string;

  pageIndex = 1;
  pageSize = 20;
  count: number = 0;
  filterObj!: MessageDeliveryHistoryLiveCampaignParamsDTO;

  isLoading: boolean = false;
  lstData: MessageHistorySaleOnlineDTO[] = [];

  constructor(
    private commonService: CommonService,
    private message: TDSMessageService
  ) { }

  ngOnInit(): void {
    this.resetFilter();
    this.loadMessage();
  }

  resetFilter() {
    this.filterObj.Take = this.pageSize;
    this.filterObj.Skip = this.pageIndex * this.pageSize;
    this.filterObj.LiveCampaignId = this.liveCampaignId;
  }

  loadMessage() {
    this.isLoading = true;

    this.resetFilter();
    let params: ODataParamsDTO<MessageDeliveryHistoryLiveCampaignParamsDTO> = {params: this.filterObj};

    this.commonService.getHistoryMessageSentSaleOnline(params)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.count = res?.Total;
        this.lstData = res?.Datas;
      }, error => {
        this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
      });
  }

}
