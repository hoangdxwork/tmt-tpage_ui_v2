import { Component, Input, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Message } from 'src/app/lib/consts/message.const';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { LiveCampaignFSOrderDTO } from 'src/app/main-app/dto/live-campaign/live-campaign.dto';
import { ODataLiveCampaignService } from 'src/app/main-app/services/mock-odata/odata-live-campaign.service';
import { TDSMessageService, TDSTableQueryParams, TDSTagStatusType } from 'tmt-tang-ui';

@Component({
  selector: 'table-bill-cancel',
  templateUrl: './table-bill-cancel.component.html'
})
export class TableBillCancelComponent implements OnInit {

  @Input() liveCampaignId!: string;
  @Input() productId!: number;

  isVisible: boolean = false;

  lstOfData: LiveCampaignFSOrderDTO[] = [];
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

  // modal
  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
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

}
