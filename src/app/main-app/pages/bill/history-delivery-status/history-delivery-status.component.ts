import { Router } from '@angular/router';
import { Subject, takeUntil, finalize } from 'rxjs';
import { OnDestroy, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FastSaleOrderService } from './../../../services/fast-sale-order.service';
import { HistoryDeliveryDTO } from './../../../dto/bill/bill.dto';
import { Component, OnInit } from '@angular/core';
import { TDSMessageService } from 'tds-ui/message';
import { TDSResizeObserver } from 'tds-ui/core/resize-observers';
import { TDSTableQueryParams } from 'tds-ui/table';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-history-delivery-status',
  templateUrl: './history-delivery-status.component.html'
})
export class HistoryDeliveryStatusComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('tableWidth') viewChildTableWidth!: ElementRef;
  @ViewChild('detailHDS') viewChildDetail!: ElementRef;

  lstHistoryDS:HistoryDeliveryDTO[] = [];
  expandSet = new Set<number>();
  pageSize = 20;
  pageIndex = 1;
  isLoading: boolean = false;
  count: number = 1;
  tableWidth:number = 0;
  paddingCollapse:number = 36;
  marginLeftCollapse: number = 0;
  teamId!:TDSSafeAny;

  private destroy$ = new Subject<void>();

  constructor(private fastSaleOrderService: FastSaleOrderService,
    private router: Router,
    private message: TDSMessageService,
    private resizeObserver: TDSResizeObserver) { }

  ngOnInit(): void {
    const key = this.fastSaleOrderService._keyCacheUrlParams;
    this.teamId = JSON.parse(localStorage.getItem(key) || '').teamId;
  }

  ngAfterViewInit(): void {
    this.tableWidth = this.viewChildTableWidth?.nativeElement?.offsetWidth - this.paddingCollapse

    this.resizeObserver
      .observe(this.viewChildTableWidth)
      .subscribe(() => {
        this.tableWidth = this.viewChildTableWidth?.nativeElement?.offsetWidth - this.paddingCollapse;
        this.viewChildTableWidth?.nativeElement.click()
      });
      setTimeout(() => {
        let that = this;
        let wrapScroll = this.viewChildDetail?.nativeElement?.closest('.tds-table-body');
        wrapScroll?.addEventListener('scroll', function() {
          let scrollleft = wrapScroll.scrollLeft;
          that.marginLeftCollapse = scrollleft;
        });
      }, 500);
  }

  loadData(pageSize:number,pageIndex:number){
    this.isLoading = true;
    let params = `top=${this.pageSize}&%24skip=${(pageIndex-1)*pageSize}`;

    this.fastSaleOrderService.getHistoryDeliveryStatus(params).pipe(finalize(()=>{this.isLoading = false}), takeUntil(this.destroy$)).subscribe(
      (res)=>{
        this.count = res['@odata.count'];
        this.lstHistoryDS = [...res.value];
      },
      (err)=>{
        this.message.error(err.error.message || 'Tải lịch sử đối soát thất bại');
      }
    )
  }

  directPage(route:string){
    this.router.navigateByUrl(route);
  }

  showDetail(id:TDSSafeAny){
    this.router.navigateByUrl(`bill/historyds/${id}`);
  }

  deleteCrossChecking(data:HistoryDeliveryDTO){
    this.fastSaleOrderService.deleteCrossChecking(data.Id).subscribe(
      (res:any)=>{
        this.message.success('Xóa lịch sử đối soát thành công');
        this.loadData(this.pageSize,this.pageIndex);
      },
      (err)=>{
        this.message.error(err?.error?.message || 'Không thể xóa lịch sử đối soát');
      }
    )
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.pageSize = params.pageSize;
    this.loadData(this.pageSize,this.pageIndex);
  }

  refreshData(){
    this.pageIndex = 1;
    this.loadData(this.pageSize,this.pageIndex);
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
        this.expandSet.add(id);
    } else {
        this.expandSet.delete(id);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
