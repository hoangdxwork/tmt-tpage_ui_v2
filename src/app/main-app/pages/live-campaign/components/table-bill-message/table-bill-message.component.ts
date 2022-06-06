import { Component, Input, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { MessageDeliveryHistoryLiveCampaignParamsDTO, MessageHistoryFSOrderDTO } from 'src/app/main-app/dto/common/table.dto';
import { ODataParamsDTO } from 'src/app/main-app/dto/odata/odata.dto';
import { CommonService } from 'src/app/main-app/services/common.service';
import { TDSMessageService } from 'tmt-tang-ui';

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

    this.commonService.getHistoryMessageSentFSOrder(params)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.count = res?.Total;
        this.lstData = res?.Datas;
      }, error => {
        this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
      });
  }

}
