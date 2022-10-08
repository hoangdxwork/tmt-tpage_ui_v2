import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { OdataOrderStatusDTO, orderStatusDTO } from '@app/dto/order/order-status.dto';
import { SaleOnline_OrderService } from '@app/services/sale-online-order.service';
import { Subject, takeUntil } from 'rxjs';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { CreateOrderStatusComponent } from '../components/create-order-status/create-order-status.component';

@Component({
  selector: 'app-status-order',
  templateUrl: './status-order.component.html',
  host: {
    class: 'w-full h-full flex'
  }
})
export class StatusOrderComponent implements OnInit {
  private destroy$ = new Subject<void>();

  pageSize = 20;
  pageIndex = 1;
  isLoading = false;
  count: number = 1;
  lstOfData!: orderStatusDTO[];
  public filterObj: any = {
      searchText: ''
  }

  constructor(
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private saleOnlineOrderService: SaleOnline_OrderService,
    private message: TDSMessageService) { }

  ngOnInit(): void {
    this.loadData()
  }

  loadData() {
    this.saleOnlineOrderService.getStatusExtra().subscribe({
      next: (res: OdataOrderStatusDTO) => {
        this.lstOfData = [...res.value];
      }
    })
  }

  updateStatus(data: any) {

  }

  showEditModal(data: orderStatusDTO): void {
    const modal = this.modalService.create({
      title: 'Chỉnh sửa trạng thái đơn hàng',
      content: CreateOrderStatusComponent,
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        data: data
      }
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe(result => {
      this.loadData();
    });
  }

  showCreateModal() {
    const modal = this.modalService.create({
      title: 'Thêm mới trạng thái đơn hàng',
      content: CreateOrderStatusComponent,
      viewContainerRef: this.viewContainerRef,
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe(result => {
      this.loadData();
    });
  }

  showRemoveStatus(data: orderStatusDTO) {
    const modal = this.modalService.error({
      title: 'Xác nhận xóa trạng thái',
      content: 'Bạn có chắc muốn xóa trạng thái đơn hàng này không?',
      iconType: 'tdsi-trash-fill',
      onOk: () => {
        this.saleOnlineOrderService.deleteStatusExtra(data.Id).pipe(takeUntil(this.destroy$)).subscribe(
          (res) => {
            this.message.success('Xóa thành công');
            this.loadData();
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

  refreshData() {

  }

  onQueryParamsChange(params: any) {

  }

}
