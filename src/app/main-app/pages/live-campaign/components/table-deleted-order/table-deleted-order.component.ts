import { TDSSafeAny, TDSHelperString } from 'tds-ui/shared/utility';
import { TDSDestroyService } from 'tds-ui/core/services';
import { Component, Input, OnInit } from '@angular/core';
import { DeletedOrderDTO } from '@app/dto/order/order-deletedHistories.dto';
import { SaleOnline_OrderService } from '@app/services/sale-online-order.service';
import { takeUntil } from 'rxjs';
import { TDSMessageService } from 'tds-ui/message';
import { TDSTableQueryParams } from 'tds-ui/table';

@Component({
  selector: 'table-deleted-order',
  templateUrl: './table-deleted-order.component.html',
  providers: [TDSDestroyService]
})
export class TableDeletedOrderComponent implements OnInit {

  @Input() liveCampaignId!: string;

  pageSize = 20;
  pageIndex = 1;
  searchText: string = '';
  isLoading: boolean = false;
  count: number = 1;
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  expandSet = new Set<string>();

  lstDeletedOrder!: DeletedOrderDTO[];
  filterDate: string = '';

  constructor(
    private message: TDSMessageService,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private destroy$: TDSDestroyService,
  ) { }

  ngOnInit(): void {
  }

  loadDeletedOrder(liveCampaignId: string, skip: number, take: number) {
    this.isLoading = true;
    this.saleOnline_OrderService.getOrderDeteledHistoriesV1(liveCampaignId, skip, take, this.searchText).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
          if(!res) return;

          this.lstDeletedOrder = [...res.Orders || []];
          this.count = res.TotalCount || 0;

          this.isLoading = false;
        }, 
        error: (error: any) => {
          this.isLoading = false;
          this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
        }
    });
  }

  onSearch(data: TDSSafeAny) {
    this.pageIndex = 1;
    this.searchText = TDSHelperString.stripSpecialChars(data?.value?.trim());
    this.loadDeletedOrder(this.liveCampaignId, this.pageIndex, this.pageSize);
  }

  refreshData() {
    this.pageIndex = 1;
    this.searchText = '';
    this.loadDeletedOrder(this.liveCampaignId, this.pageIndex, this.pageSize);
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.pageSize = params.pageSize;
    this.pageIndex = params.pageIndex;
    let skip = (params.pageIndex -1) * params.pageSize;
    this.removeCheckedRow();
    this.loadDeletedOrder(this.liveCampaignId, skip, params.pageSize);
  }

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

  onChangeFilterDate() {
    let data = this.lstDeletedOrder;
    switch(this.filterDate) {
      case '':
        this.filterDate = 'asc';
        data = data.sort((a: DeletedOrderDTO, b: DeletedOrderDTO) => new Date(a.DateCreated).getTime() - new Date(b.DateCreated).getTime());
      break;

      case 'asc':
        this.filterDate = 'desc';
        data = data.sort((a: DeletedOrderDTO, b: DeletedOrderDTO) => new Date(b.DateCreated).getTime() - new Date(a.DateCreated).getTime());

      break;

      case'desc':
        this.filterDate = '';
      break;
    }

    this.lstDeletedOrder = [...data];
  }

  removeCheckedRow() {
    this.setOfCheckedId.clear();

    this.indeterminate = false;
    this.checked = false;
  }
}
