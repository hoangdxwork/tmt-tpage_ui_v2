import { TDSTableQueryParams } from 'tds-ui/table';
import { ChangeDetectorRef } from '@angular/core';
import { TDSMessageService } from 'tds-ui/message';
import { TDSDestroyService } from 'tds-ui/core/services';
import { takeUntil } from 'rxjs';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { TDSModalRef } from 'tds-ui/modal';
import { THelperDataRequest } from '@core/services/helper-data.service';

@Component({
  selector: 'modal-live-campaign-bill',
  templateUrl: './modal-live-campaign-bill.component.html',
  providers: [TDSDestroyService]
})
export class ModalLiveCampaignBillComponent implements OnInit {

  @Input() livecampaignDetailId: string = '';
  lstOfData: TDSSafeAny[] = [];
  pageSize = 10;
  pageIndex = 1;
  count!: number;
  isLoading: boolean = false;

  constructor(
    private modalRef: TDSModalRef,
    private router: Router,
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

    this.liveCampaignService.overviewFastSaleOrders(this.livecampaignDetailId, params).pipe(takeUntil(this.destroy$)).subscribe({
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

  showModelInfoOrder(id: number) {
    let returnUrl = `bill/detail/${id}`
    this.router.navigate([returnUrl]);
  }

  onCancel() {
    this.modalRef.destroy();
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
