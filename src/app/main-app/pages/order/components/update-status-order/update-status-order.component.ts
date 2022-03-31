import { SaleOnline_OrderDTO, UpdateStatusTextSaleOnlineDTO } from './../../../../dto/saleonlineorder/sale-online-order.dto';
import { Component, Input, OnInit } from '@angular/core';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { TDSMessageService, TDSModalRef } from 'tmt-tang-ui';

@Component({
  selector: 'update-status-order',
  templateUrl: './update-status-order.component.html',
})
export class UpdateStatusOrderComponent implements OnInit {

  @Input() listData: any[] = [];

  statusAll: any;

  lstStatus = [
    { text: 'Nháp', value: 'draft' },
    { text: 'Hủy', value: 'canceled' },
    { text: 'Xác nhận', value: 'confirmed' },
  ];

  constructor(
    private message: TDSMessageService,
    private modal: TDSModalRef,
    private saleOnline_OrderService: SaleOnline_OrderService
  ) { }

  ngOnInit(): void {
    console.log(this.listData);
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

    this.saleOnline_OrderService.updateStatusTextSaleOnline({model: model}).subscribe(res => {
      this.message.success("Cập nhật thành công.");
      this.onCancel();
    });
  }

  onCancel() {
    this.modal.destroy(null);
  }

}
