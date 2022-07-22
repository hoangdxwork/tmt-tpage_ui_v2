import { CommonService } from './../../../../services/common.service';
import { Message } from './../../../../../lib/consts/message.const';
import { Subject, finalize } from 'rxjs';
import { takeUntil } from 'rxjs';
import { SaleOnline_OrderDTO, UpdateStatusTextSaleOnlineDTO } from './../../../../dto/saleonlineorder/sale-online-order.dto';
import { Component, Input, OnInit } from '@angular/core';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'update-status-order',
  templateUrl: './update-status-order.component.html',
})
export class UpdateStatusOrderComponent implements OnInit {

  @Input() listData: any[] = [];

  statusAll: any;
  lstStatus: any[] = [];
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private message: TDSMessageService,
    private modal: TDSModalRef,
    private commonService: CommonService,
    private saleOnline_OrderService: SaleOnline_OrderService
  ) { }

  ngOnInit(): void {
    this.loadStatusTypeExt();
  }

  loadStatusTypeExt() {
    this.commonService.getStatusTypeExt().subscribe(res => {
      this.lstStatus = [...res];
    });
  }

  onChangeStatus(event: any, item: any) {
    item.StatusText = event.text;
    item.Status = event.value.charAt(0).toUpperCase();
  }

  onAllStatus() {
    if(!this.statusAll) {
      this.message.error("Hãy chọn trạng thái!");
      return;
    }

    this.listData.forEach((item: any) => {
      item.StatusText = this.statusAll.text;
      item.Status = this.statusAll.value.charAt(0).toUpperCase();
    });
  }

  onSave() {
    if(!this.listData || this.listData.length < 1) {
      this.message.error("Dữ liệu trống!");
      return;
    }

    this.isLoading = true;

    let model = this.listData.map((x: SaleOnline_OrderDTO) => {
      let item: UpdateStatusTextSaleOnlineDTO = {
        Id: x.Id,
        Code: x.Code,
        Name: x.Name,
        StatusText: x.StatusText,
        TotalAmount: x.TotalAmount
      };

      return item;
    });

    this.saleOnline_OrderService.updateStatusTextSaleOnline({model: model})
    .pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false)).subscribe(res => {
      this.message.success("Cập nhật thành công");
      this.onCancel(true);
    },
    err=>{
      this.message.error(err?.error?.message || Message.UpdatedFail);
    });
  }

  onCancel(result: TDSSafeAny) {
    this.modal.destroy(result);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
