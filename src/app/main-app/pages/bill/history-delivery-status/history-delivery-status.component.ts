import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { TDSMessageService, TDSTableQueryParams } from 'tmt-tang-ui';
import { FastSaleOrderService } from './../../../services/fast-sale-order.service';
import { HistoryDeliveryDTO } from './../../../dto/bill/bill.dto';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-history-delivery-status',
  templateUrl: './history-delivery-status.component.html'
})
export class HistoryDeliveryStatusComponent implements OnInit, OnDestroy {

  lstHistoryDS:HistoryDeliveryDTO[] = [];
  pageSize = 20;
  pageIndex = 1;
  isLoading: boolean = false;
  count: number = 1;

  private destroy$ = new Subject();

  constructor(private fastSaleOrderService: FastSaleOrderService,
    private message: TDSMessageService) { }

  ngOnInit(): void {
    this.loadHistoryDS(this.pageSize,this.pageIndex);
  }

  loadHistoryDS(pageSize:number,pageIndex:number){
    this.isLoading = true;
    let params = `top=${this.pageSize}&%24skip=${(pageIndex-1)*pageSize}`;

    this.fastSaleOrderService.getHistoryDeliveryStatus(params).pipe(finalize(()=>{this.isLoading = false}), takeUntil(this.destroy$)).subscribe(
      (res)=>{
        this.count = res['@odata.count'];
        this.lstHistoryDS = res.value;
      },
      (err)=>{
        this.message.error(err.error.message ?? 'Tải lịch sử đối soát thất bại')
      }
    )
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.pageSize = params.pageSize;
    this.loadHistoryDS(this.pageSize,this.pageIndex);
  }

  refreshData(){
    this.pageIndex = 1;
    this.loadHistoryDS(this.pageSize,this.pageIndex);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSave(){

  }

  onBack(){
    history.back();
  }
}
