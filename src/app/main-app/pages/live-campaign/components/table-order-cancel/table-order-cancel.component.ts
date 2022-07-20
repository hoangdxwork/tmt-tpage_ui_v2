import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Message } from 'src/app/lib/consts/message.const';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { ODataLiveCampaignService } from 'src/app/main-app/services/mock-odata/odata-live-campaign.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSTableQueryParams } from 'tds-ui/table';
import { TDSTagStatusType } from 'tds-ui/tag';
import { ModalHistoryCartComponent } from '../modal-history-cart/modal-history-cart.component';

@Component({
  selector: 'table-order-cancel',
  templateUrl: './table-order-cancel.component.html'
})
export class TableOrderCancelComponent implements OnInit {

  @Input() liveCampaignId!: string;
  @Input() productId!: number;

  lstOfData: any[] = [];

  pageSize = 20;
  pageIndex = 1;

  isLoading: boolean = false;
  count: number = 1;

  constructor(
    private message: TDSMessageService,
    private modal: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private oDataLiveCampaignService: ODataLiveCampaignService
  ) { }

  ngOnInit(): void {
  }

  loadData(pageSize: number, pageIndex: number) {
  }

  getViewData(params: string) {

  }

  refreshData(){
    this.pageIndex = 1;
    this.loadData(this.pageSize, this.pageIndex);
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.pageSize = params.pageSize;
    this.loadData(params.pageSize, params.pageIndex);
  }

  getColorStatusText(status: string): TDSTagStatusType {
    switch(status) {
      case "Nháp":
        return "info";
      case "Đơn hàng":
        return "success";
      case "Hủy":
        return "error";
      default:
        return "warning";
    }
  }

  showModelHistory(orderId: string | undefined) {
    this.modal.create({
      title: 'Lịch sử giỏ hàng',
      size:'lg',
      content: ModalHistoryCartComponent,
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        type: "SO",
        liveCampaignId: this.liveCampaignId,
        productId: this.productId,
        orderId: orderId
      }
    });
  }

}
