import { finalize, Subject, takeUntil } from 'rxjs';
import { TDSTableQueryParams } from 'tds-ui/table';
import { HistoryChatDTO, orderHistoryChatDTO, paramsHistoryChatDTO } from './../../../../dto/order/order-history-chat.dto';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSMessageService } from 'tds-ui/message';
import { CommonService } from './../../../../services/common.service';
import { TDSModalRef } from 'tds-ui/modal';
import { Component, Input, OnInit } from '@angular/core';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-modal-history-chat',
  templateUrl: './modal-history-chat.component.html'
})
export class ModalHistoryChatComponent implements OnInit {
  @Input() type!: string;
  @Input() liveCampaignId!: string;
  @Input() orderId!: string
  @Input() partnerId!: string;

  isLoading: boolean = false;
  listOfData!: HistoryChatDTO[];
  historySelect: TDSSafeAny;
  detailLiveCapagins: Array<TDSSafeAny> = [];
  activeId!: number;
  total!: number;
  pageSize: number = 10;
  pageIndex: number = 1;
  private destroy$ = new Subject<void>();

  constructor(
    private modal: TDSModalRef,
    private commonService: CommonService,
    private message: TDSMessageService,
  ) { }

  ngOnInit(): void {
  }

  getHistoryMessageSent(params: TDSTableQueryParams) {
    this.isLoading = true;
    var model: paramsHistoryChatDTO = {};
    if (this.liveCampaignId) {
      model.liveCampaignId = this.liveCampaignId;
    }
    if (this.orderId) {
      model.orderId = this.orderId;
    }
    if (this.partnerId) {
      model.partnerId = this.partnerId;
    }
    model.skip = params.pageIndex - 1;
    model.take = params.pageIndex * params.pageSize;

    this.commonService.getHistoryMessageSent(model).pipe(takeUntil(this.destroy$)).pipe(finalize(() => { this.isLoading = false }))
    .subscribe((res: orderHistoryChatDTO) => {
      this.listOfData = res.Datas;
      this.total = res.Total;
    }, err => {
      this.message.error(err.error ? err.error.message : Message.CanNotLoadData)
    });
  }

  onQueryParamsChange(params: TDSTableQueryParams): void {
    this.getHistoryMessageSent(params);
  }

  onCancel() {
    this.modal.destroy(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
