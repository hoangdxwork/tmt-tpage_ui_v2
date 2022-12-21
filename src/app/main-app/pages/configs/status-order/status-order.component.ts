import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { OdataOrderStatusDTO, OrderStatusDTO } from '@app/dto/order/order-status.dto';
import { SaleOnline_OrderService } from '@app/services/sale-online-order.service';
import { FilterDataRequestDTO, SortDataRequestDTO } from '@core/dto/dataRequest.dto';
import { SortEnum } from '@core/enum';
import { THelperDataRequest } from '@core/services/helper-data.service';
import { finalize, Observable, Subject, takeUntil } from 'rxjs';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSTableQueryParams } from 'tds-ui/table';
import { CreateOrderStatusComponent } from '../components/create-order-status/create-order-status.component';
import { PartnerStatusComponent } from '../components/partner-status/partner-status.component';

@Component({
  selector: 'app-status-order',
  templateUrl: './status-order.component.html',
  host: {
    class: 'flex h-full w-full',
  }
})
export class StatusOrderComponent implements OnInit {

  @ViewChild(PartnerStatusComponent) PartnerStatusComponent!: PartnerStatusComponent

  private destroy$ = new Subject<void>();

  pageSize = 20;
  pageIndex = 1;
  isLoading = false;
  count: number = 1;
  selectedIndex = 0;
  innerText: string = '';
  textSearchFilterComment: string = '';
  lstOfData!: OrderStatusDTO[];
  public filterObj: any = {
    searchText: ''
  }

  sort: Array<SortDataRequestDTO> = [
    {
      field: "Default",
      dir: SortEnum.desc,
    },
    {
      field: "Id",
      dir: SortEnum.desc,
    }
  ];

  onLoadData: boolean = false

  constructor(
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private saleOnlineOrderService: SaleOnline_OrderService,
    private message: TDSMessageService) { }

  ngOnInit(): void {
  }

  onSearch(data: TDSSafeAny) {
    this.pageIndex = 1;
    let filters;

    switch (this.selectedIndex) {
      case 0:
        if (TDSHelperString.hasValueString(this.innerText)) {
          this.filterObj.searchText = this.innerText.toLocaleLowerCase().trim();
          filters = this.saleOnlineOrderService.buildFilter(this.filterObj);
        }

        let orderparams = THelperDataRequest.convertDataRequestToString(this.pageSize, this.pageIndex, filters, this.sort);

        this.getViewData(orderparams).subscribe({
          next: (res: any) => {
            this.count = res['@odata.count'] as number;
            this.lstOfData = res.value;
          },
          error: (error: any) => {
            this.message.error(error?.error?.message || 'Tải dữ liệu phiếu bán hàng thất bại!');
          }
        })
        break;
      case 1:
        this.PartnerStatusComponent.onSearch(this.innerText);
        break;
    }
  }

  loadData(pageSize: number, pageIndex: number, filters?: FilterDataRequestDTO) {
    if (TDSHelperString.hasValueString(this.filterObj.searchText)) {
      filters = this.saleOnlineOrderService.buildFilter(this.filterObj);
    }

    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters, this.sort);

    this.getViewData(params).subscribe((res: OdataOrderStatusDTO) => {
      this.count = res['@odata.count'] as number;
      this.lstOfData = res.value;
    }, err => {
      this.message.error('Tải dữ liệu thất bại!');
    });
  }

  private getViewData(params: string): Observable<OdataOrderStatusDTO> {
    this.isLoading = true;
    return this.saleOnlineOrderService
      .getStatusExtra(params).pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => { this.isLoading = false }));
  }

  updateStatus(data: OrderStatusDTO) {
    let modelUpdate = {
      Name: data?.Name,
      StyleCSS: data?.StyleCSS,
      Id: data?.Id,
      Index: data?.Index,
      Type: data?.Type,
      Default: data?.Default,
      IsNotOrder: data?.IsNotOrder
    }

    this.saleOnlineOrderService.updateOrderStatusExtra(modelUpdate).pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        this.message.success('Cập nhật thành công !');
      },
      (err) => {
        this.message.error('Cập nhật thất bại !');
      }
    );
  }

  showEditModal(data: OrderStatusDTO): void {
    const modal = this.modalService.create({
      title: 'Chỉnh sửa trạng thái đơn hàng',
      content: CreateOrderStatusComponent,
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        data: data
      }
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe(result => {
      if (result) {
        this.loadData(this.pageSize, this.pageIndex);
      }
    });
  }

  showCreateModal() {
    switch (this.selectedIndex) {
      case 0:
        this.showCreateOrderModal()
        break;
      case 1:
        this.PartnerStatusComponent.showCreateModal();
        break;
    }
  }

  showCreateOrderModal() {
    const modal = this.modalService.create({
      title: 'Thêm mới trạng thái đơn hàng',
      content: CreateOrderStatusComponent,
      viewContainerRef: this.viewContainerRef,
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
        this.pageIndex = 1;
        this.filterObj.searchText = '';
        this.loadData(this.pageSize, this.pageIndex);
      }
    });
  }

  showRemoveStatus(data: OrderStatusDTO) {
    const modal = this.modalService.error({
      title: 'Xác nhận xóa trạng thái',
      content: 'Bạn có chắc muốn xóa trạng thái đơn hàng này không?',
      iconType: 'tdsi-trash-fill',
      onOk: () => {
        this.saleOnlineOrderService.deleteStatusExtra(data.Id).pipe(takeUntil(this.destroy$)).subscribe(
          (res) => {
            this.message.success('Xóa thành công');
            if (this.lstOfData.length <= 1) {
              this.pageIndex = 1;
              this.filterObj.searchText = '';
              this.loadData(this.pageSize, this.pageIndex);
            }
            this.loadData(this.pageSize, this.pageIndex);
          },
          err => {
            this.message.error(err.error.message || "Xóa thất bại !!");
          }
        );
      },
      onCancel: () => {
        modal.close();
      },
      okText: "Xác nhận",
      cancelText: "Hủy bỏ"
    });
  }

  onClearAll(event: MouseEvent) {
    event.stopPropagation();
    this.refreshData();
  }

  refreshData() {
    this.pageIndex = 1;
    this.filterObj.searchText = '';
    this.loadData(this.pageSize, this.pageIndex);
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.loadData(params.pageSize, params.pageIndex);
  }

  onSelectChange() {
    switch (this.selectedIndex) {
      case 0:
        this.innerText = '';
        this.refreshData();
        break;
      case 1:
        this.innerText = '';
        this.PartnerStatusComponent.refreshData();
        break;
    }
  }

}
