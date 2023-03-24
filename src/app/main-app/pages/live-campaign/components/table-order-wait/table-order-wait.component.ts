import { LiveCampaignService } from './../../../../services/live-campaign.service';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { ModalHistoryCartComponent } from '../modal-history-cart/modal-history-cart.component';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSTableQueryParams } from 'tds-ui/table';
import { TDSTagStatusType } from 'tds-ui/tag';
import { Observable, Subject } from 'rxjs';
import { TDSHelperArray, TDSSafeAny } from 'tds-ui/shared/utility';
import { OrderPrintService } from '@app/services/print/order-print.service';
import { SaleOnline_OrderService } from '@app/services/sale-online-order.service';

@Component({
  selector: 'table-order-wait',
  templateUrl: './table-order-wait.component.html'
})
export class TableOrderWaitComponent implements OnInit {

  @Input() liveCampaignId!: string;
  @Input() productId!: number;
  @Output() onLoadOption = new EventEmitter<boolean>();

  lstOfData: any[] = [];
  pageSize = 20;
  pageIndex = 1;

  isLoading!: boolean;
  count: number = 1;

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();

  private destroy$ = new Subject<void>();

  constructor(
    private message: TDSMessageService,
    private modal: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private liveCampaignService: LiveCampaignService,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private orderPrintService: OrderPrintService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
  }

  loadData(pageSize: number, pageIndex: number) {
    this.lstOfData = [];
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex);
    this.getViewData(params).subscribe(res=>{
      this.count = res['@odata.count'] as number;
      this.lstOfData = [...res.value];
      console.log(res.value);


      this.setOfCheckedId = new Set<string>();
      this.checked = false;
      this.indeterminate = false;

      this.cdr.detectChanges();
    }, error => {
      this.message.error(error.error ? error.error.message : 'Tải dữ liệu thất bại');
      this.cdr.detectChanges();
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

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.lstOfData.forEach(item => this.updateCheckedSet(item.OrderId, value));
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    this.checked = this.lstOfData.every(item => this.setOfCheckedId.has(item.OrderId));
    this.indeterminate = this.lstOfData.some(item => this.setOfCheckedId.has(item.OrderId)) && !this.checked;
  }


  printMulti() {
    if(this.isLoading){
      return
    }

    this.isLoading = true;

    if(this.checkValueEmpty() == 1) {
      let ids = [...this.setOfCheckedId];
      ids.map((x: string) => {
        this.saleOnline_OrderService.getById(x).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res: any) => {
            if (res) {
              this.orderPrintService.printIpFromOrder(res);
            }
            this.isLoading = false;
          },
          error: (error: any) => {
            this.isLoading = false;
            this.message.error(`${error?.error?.message}` || 'In đơn hàng đã xảy ra lỗi');
          }
        })
      })
    }
  }

  checkValueEmpty() {
    let ids = [...this.setOfCheckedId];
    if (ids.length == 0) {
      this.message.error('Vui lòng chọn tối thiểu một dòng!');
      return 0;
    }
    return 1;
  }



  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
