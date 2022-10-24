import { TDSTableQueryParams } from 'tds-ui/table';
import { TDSMessageService } from 'tds-ui/message';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSDestroyService } from 'tds-ui/core/services';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { Component, Input, OnInit, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { ModalInfoOrderComponent } from '../modal-info-order/modal-info-order.component';
import { THelperDataRequest } from '@core/services/helper-data.service';

@Component({
  selector: 'modal-live-campaign-order',
  templateUrl: './modal-live-campaign-order.component.html',
  providers: [TDSDestroyService]
})
export class ModalLiveCampaignOrderComponent implements OnInit {

  @Input() livecampaignDetailId: string = '';

  pageSize = 10;
  pageIndex = 1;
  count!: number;
  lstOfData: TDSSafeAny[] = [];
  isLoading: boolean = false;

  constructor(
    private modalRef: TDSModalRef,
    private modal: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private liveCampaignService: LiveCampaignService,
    private destroy$: TDSDestroyService,
    private message: TDSMessageService,
    private cdref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  loadData(pageSize: number, pageIndex: number, text?: string){
    this.isLoading = true;
    let params = THelperDataRequest.convertDataRequestToStringShipTake(pageSize, pageIndex, text);
    this.liveCampaignService.overviewSaleOnlineoOrders(this.livecampaignDetailId, params).pipe(takeUntil(this.destroy$)).subscribe({
      next: res =>{
        this.lstOfData = [...res.Datas];
        this.count = res.TotalCount;
        this.isLoading = false;

        this.cdref.detectChanges();
      },
      error: error=> {
        this.isLoading = false;
        this.message.error(error?.error?.message || 'Tải sản phẩm lỗi')
      }
    })
  }

  onCancel() {
    this.modalRef.destroy();
  }

  showModelInfoOrder(id: string | undefined) {
    this.modal.create({
      title: 'Thông tin đơn hàng',
      size:'xl',
      bodyStyle: {
        padding: '0px'
      },
      content: ModalInfoOrderComponent,
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        orderId: id
      }
    });
  }


  onQueryParamsChange(event: TDSTableQueryParams) {
      this.loadData(event.pageSize, event.pageIndex);
  }

  onRefresh(){
    this.pageIndex = 1;
    this.pageSize = 10;
    this.loadData(this.pageSize, this.pageIndex);
  }
}