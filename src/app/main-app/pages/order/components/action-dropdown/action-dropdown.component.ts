import { ODataSaleOnline_OrderModel } from './../../../../dto/saleonlineorder/odata-saleonline-order.dto';
import { FilterObjSOOrderModel } from './../../../../services/mock-odata/odata-saleonlineorder.service';
import { Component, Input, OnInit, Output, ViewContainerRef, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Message } from 'src/app/lib/consts/message.const';
import { OdataSaleOnline_OrderService } from 'src/app/main-app/services/mock-odata/odata-saleonlineorder.service';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { DuplicateUserComponent } from '../duplicate-user/duplicate-user.component';
import { UpdateStatusOrderComponent } from '../update-status-order/update-status-order.component';
import { CheckDuplicatePartnertDTO } from '@app/dto/partner/checked-partner.dto';

@Component({
  selector: 'action-dropdown',
  templateUrl: './action-dropdown.component.html',
})
export class ActionDropdownComponent implements OnInit {

  @Input() filterObj!: FilterObjSOOrderModel;
  @Input() setOfCheckedId!: Set<string>;
  @Input() lstOfData: ODataSaleOnline_OrderModel[] = [];

  @Output() onRefreshData =new EventEmitter<any>();

  isProcessing: boolean = false;
  idsModel: string[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private modal: TDSModalService,
    private message: TDSMessageService,
    private modalService: TDSModalService,
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
          that.odataSaleOnline_OrderService.removeIds({ ids: that.idsModel }).pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
            that.message.success('Xóa đơn thành công!');
            that.isProcessing = false;
            this.onRefreshData.emit(true);
          }, error => {
            that.message.error(`${error?.error?.message}`);
            that.isProcessing = false;
          })
        },
        onCancel: () => { that.isProcessing = false; },
        okText: "Xác nhận",
        cancelText: "Đóng",
        confirmViewType:"compact"
      });
    }
  }

  openUpdateStatusText() {
    if (this.checkValueEmpty() == 1) {
      let listData:ODataSaleOnline_OrderModel[] = [];
      this.lstOfData.forEach(a => {
        if(this.idsModel.includes(a.Id)){
          listData.push(a)
        }
      });

      const modal = this.modal.create({
        title: 'Cập nhật trạng thái đơn hàng',
        content: UpdateStatusOrderComponent,
        size: 'xl',
        viewContainerRef: this.viewContainerRef,
        componentParams: {
          listData: listData
        }
      });

      modal.afterClose.subscribe(result => {
        if(result) {
          this.onRefreshData.emit(true);
        }
      });
    }
  }

  checkDuplicateASIdPhoneUId() {
    if (this.checkValueEmpty() == 1) {
      let ids = this.idsModel;

      this.saleOnline_OrderService.getCheckDuplicatePhone({ids: ids}).pipe(takeUntil(this.destroy$)).subscribe((res: any ) => {
        if(res) {
          delete res['@odata.context'];

          this.modalService.create({
            title: 'Danh sách khách hàng trùng',
            content: DuplicateUserComponent,
            size: 'xl',
            viewContainerRef: this.viewContainerRef,
            componentParams: {
              duplicateUser: res.value as CheckDuplicatePartnertDTO[]
            }
          });
        }
      }, err => {
        this.message.error(err.error.message ?? 'Không tải được dữ liệu');
      })
    }
  }

  getUpdateUIds() {
    this.saleOnline_OrderService.getUpdateUIds().subscribe(res => {
      this.message.success(Message.UpdatedSuccess);
      this.onRefreshData.emit(true);
    });
  }

  checkValueEmpty() {
    this.idsModel = [...this.setOfCheckedId];

    if (this.idsModel.length == 0) {
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
