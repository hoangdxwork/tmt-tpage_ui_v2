import { TDSMessageService, TDSTableQueryParams, TDSTagStatusType } from 'tmt-tang-ui';
import { Component, Input, OnInit } from '@angular/core';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { Message } from 'src/app/lib/consts/message.const';
import { LiveCampaignSOOrderDTO } from 'src/app/main-app/dto/live-campaign/live-campaign.dto';
import { ODataLiveCampaignService } from 'src/app/main-app/services/mock-odata/odata-live-campaign.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'table-order-wait',
  templateUrl: './table-order-wait.component.html'
})
export class TableOrderWaitComponent implements OnInit {

  @Input() liveCampaignId!: string;
  @Input() productId!: number;

  lstOfData: LiveCampaignSOOrderDTO[] = [];
  pageSize = 20;
  pageIndex = 1;

  isLoading: boolean = false;
  count: number = 1;

  constructor(
    private message: TDSMessageService,
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
        .getSOOrder(this.liveCampaignId, this.productId, params)
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

}
