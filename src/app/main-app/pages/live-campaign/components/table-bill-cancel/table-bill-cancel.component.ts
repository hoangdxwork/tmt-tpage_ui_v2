import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Message } from 'src/app/lib/consts/message.const';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { LiveCampaignFSOrderDTO } from 'src/app/main-app/dto/live-campaign/live-campaign.dto';
import { ODataLiveCampaignService } from 'src/app/main-app/services/mock-odata/odata-live-campaign.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSTableQueryParams } from 'tds-ui/table';
import { TDSTagStatusType } from 'tds-ui/tag';
import { ModalHistoryCartComponent } from '../modal-history-cart/modal-history-cart.component';

@Component({
  selector: 'table-bill-cancel',
  templateUrl: './table-bill-cancel.component.html'
})
export class TableBillCancelComponent implements OnInit {

  @Input() liveCampaignId!: string;
  @Input() productId!: number;

  lstOfData: LiveCampaignFSOrderDTO[] = [];
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
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex);

    this.getViewData(params).subscribe(res => {
        this.count = res['@odata.count'] as number;
        this.lstOfData = res.value;

    }, error => this.message.error(`${error?.error?.message}` || Message.CanNotLoadData));
  }

  getViewData(params: string) {
    this.isLoading = true;
    return this.oDataLiveCampaignService
        .getFSOrderCancel(this.liveCampaignId, this.productId, params)
        .pipe(finalize(() => this.isLoading = false ));
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
      case "draft":
        return "secondary";
      case "paid":
        return "primary";
      case "open":
        return "info";
      case "cancel":
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
