import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OdataSaleOnline_OrderService } from 'src/app/main-app/services/mock-odata/odata-saleonlineorder.service';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { TDSMessageService, TDSModalService, TDSSafeAny } from 'tmt-tang-ui';
import { UpdateStatusOrderComponent } from '../update-status-order/update-status-order.component';

@Component({
  selector: 'action-dropdown',
  templateUrl: './action-dropdown.component.html',
})
export class ActionDropdownComponent implements OnInit {

  private _destroy = new Subject<void>();
  @Input() filterObj: any;
  @Input() setOfCheckedId: any = [];
  @Input() lstOfData: any = [];

  isProcessing: boolean = false;
  idsModel: any = [];

  constructor(
    private modal: TDSModalService,
    private message: TDSMessageService,
    private viewContainerRef: ViewContainerRef,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private odataSaleOnline_OrderService: OdataSaleOnline_OrderService
  ) { }

  ngOnInit(): void {

  }

  removeIds() {
    let that = this;
    if (this.isProcessing) {
      return;
    }

    if (this.checkValueEmpty() == 1) {
      that.isProcessing = true;
      this.modal.error({
        title: 'Xóa đơn hàng',
        content: 'Bạn có chắc muốn xóa!',
        onOk: () => {
          that.odataSaleOnline_OrderService.removeIds({ ids: that.idsModel }).pipe(takeUntil(this._destroy)).subscribe((res: TDSSafeAny) => {
            that.message.success('Xóa đơn thành công!');
            that.isProcessing = false;
          }, error => {
            that.message.error(`${error?.error?.message}`);
            that.isProcessing = false;
          })
        },
        onCancel: () => { that.isProcessing = false; },
        okText: "Xác nhận",
        cancelText: "Đóng",
        // confirmViewType:"compact"
      });
    }
  }

  openUpdateStatusText() {
    if (this.checkValueEmpty() == 1) {
      let listData = this.lstOfData.filter((a: any) => this.idsModel.includes(a.Id));
      this.modal.create({
        title: 'Cập nhật trạng thái đơn hàng',
        content: UpdateStatusOrderComponent,
        size: 'xl',
        viewContainerRef: this.viewContainerRef,
        componentParams: {
          listData: listData
        }
    });
    }
  }

  checkDuplicateASIdPhoneUId() {

  }

  sendMessage() {

  }

  getUpdateUIds() {

  }

  checkValueEmpty() {
    var ids: any[] = [...this.setOfCheckedId][0];
    this.idsModel = [...ids];

    if (this.idsModel.length == 0) {
      this.message.error('Vui lòng chọn tối thiểu một dòng!');
      return 0;
    }

    return 1;
  }

}
