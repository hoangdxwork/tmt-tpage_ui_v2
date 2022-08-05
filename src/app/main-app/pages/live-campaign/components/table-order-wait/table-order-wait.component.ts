import { LiveCampaignService } from './../../../../services/live-campaign.service';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { ModalHistoryCartComponent } from '../modal-history-cart/modal-history-cart.component';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSTableQueryParams } from 'tds-ui/table';
import { TDSTagStatusType } from 'tds-ui/tag';
import { Observable, Subject } from 'rxjs';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'table-order-wait',
  templateUrl: './table-order-wait.component.html'
})
export class TableOrderWaitComponent implements OnInit {

  @Input() liveCampaignId!: string;
  @Input() productId!: number;

  lstOfData: any[] = [];
  pageSize = 20;
  pageIndex = 1;

  isLoading: boolean = false;
  count: number = 1;
  private destroy$ = new Subject<void>();

  constructor(
    private message: TDSMessageService,
    private modal: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private liveCampaignService: LiveCampaignService,
  ) { }

  ngOnInit(): void {
  }

  loadData(pageSize: number, pageIndex: number) {
    this.lstOfData = [];
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex);
    this.getViewData(params).subscribe(res=>{
      this.count = res['@odata.count'] as number;
      this.lstOfData = [...res.value];
    }, error => {
      this.message.error(error.error ? error.error.message : 'Tải dữ liệu thất bại')
    })
  }

  getViewData(params: string): Observable<TDSSafeAny> {
    this.isLoading = true;
    return this.liveCampaignService.getSOOrder(this.liveCampaignId,this.productId, params)
      .pipe(takeUntil(this.destroy$), finalize(()=>{ this.isLoading = false }))
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
