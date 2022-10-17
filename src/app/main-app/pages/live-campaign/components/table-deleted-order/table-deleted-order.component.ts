import { Component, Input, OnInit } from '@angular/core';
import { DeletedOrderDetail, DeletedOrderDTO } from '@app/dto/order/order-deletedHistories.dto';
import { SaleOnline_OrderService } from '@app/services/sale-online-order.service';
import { finalize } from 'rxjs';
import { TDSMessageService } from 'tds-ui/message';
import { TDSTableQueryParams } from 'tds-ui/table';

@Component({
  selector: 'table-deleted-order',
  templateUrl: './table-deleted-order.component.html',
})
export class TableDeletedOrderComponent implements OnInit {

  @Input() liveCampaignId!: string;

  pageSize = 20;
  pageIndex = 1;
  isLoading: boolean = false;
  count: number = 1;
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  expandSet = new Set<string>();

  lstDeletedOrder!: DeletedOrderDTO[]

  constructor(
    private message: TDSMessageService,
    private saleOnline_OrderService: SaleOnline_OrderService,
  ) { }

  ngOnInit(): void {
    this.loadDeletedOrder(this.liveCampaignId, this.pageIndex, this.pageSize)
  }

  loadDeletedOrder(liveCampaignId: string, skip: number, take: number) {
    this.isLoading = true;
    this.saleOnline_OrderService.getOrderDeteledHistories(liveCampaignId, skip, take)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.lstDeletedOrder = res.Orders;
      }, error => {
        this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
      });
  }

  refreshData() {
    this.pageIndex = 1;
    this.loadDeletedOrder(this.liveCampaignId, this.pageIndex, this.pageSize);
  }

  // onQueryParamsChange(params: TDSTableQueryParams) {
  //   this.pageSize = params.pageSize;
  //   this.loadDeletedOrder(this.liveCampaignId, params.pageSize, params.pageIndex);
  // }

  onAllChecked(value: boolean): void {
    this.lstDeletedOrder.forEach(item => this.updateCheckedSet(item.OrderId, value));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.lstDeletedOrder.every(item => this.setOfCheckedId.has(item.OrderId));
    this.indeterminate = this.lstDeletedOrder.some(item => this.setOfCheckedId.has(item.OrderId)) && !this.checked;
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }


}
