import { TDSMessageService } from 'tds-ui/message';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { TDSDestroyService } from 'tds-ui/core/services';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSTableQueryParams } from 'tds-ui/table';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { Component, OnInit, Input } from '@angular/core';
import { OrderDeteledHistoriesDto, OrderHistoriesDto, paramsOrderDeteledHistoriesDTO } from '@app/dto/order/order-order-deleted.dto';

@Component({
  selector: 'app-modal-order-deleted',
  templateUrl: './modal-order-deleted.component.html',
  providers: [TDSDestroyService]
})
export class ModalOrderDeletedComponent implements OnInit {

  @Input() livecampaignId!: string;

  isLoading: boolean = false;
  listOfData: OrderDeteledHistoriesDto[] = [];
  historySelect: TDSSafeAny;
  total!: number;
  pageSize: number = 10;
  pageIndex: number = 1;

  expandSet = new Set<string>();

  constructor(private modalRef: TDSModalRef,
    private saleOnlineOrderService: SaleOnline_OrderService,
    private destroy$: TDSDestroyService,
    private message: TDSMessageService) { }

  ngOnInit(): void {
  }

  loadData(params: any) {

    let model = {} as paramsOrderDeteledHistoriesDTO;
    model.liveCampaignId = this.livecampaignId;
    model.skip = params.pageIndex - 1;
    model.take = params.pageIndex * params.pageSize;

    this.saleOnlineOrderService.getOrderDeteledHistories(model).pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res: OrderHistoriesDto ) => {
          if(res && res.Orders && res.Orders.length > 0) {
            this.listOfData = [...res.Orders];
            this.total = res.TotalCount;
          }
        },
        error: error => {
          this.message.error(error ? error.error?.message : 'Tải dữ liệu thất bại')
        }
      }
    )
  }

  onQueryParamsChange(params: TDSTableQueryParams): void {
    if(this.livecampaignId) {
      this.loadData(params);
    }
  }

  onCancel() {
    this.modalRef.destroy(null);
  }

  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet = new Set<string>();
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

}
