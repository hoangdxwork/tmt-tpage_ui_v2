import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'src/app/lib/consts/message.const';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-create-bill-default-error',
  templateUrl: './create-bill-default-error.component.html'
})
export class CreateBillDefaultErrorComponent implements OnInit {

  @Input() model: TDSSafeAny;
  @Input() lstError!: TDSSafeAny[];

  lstErrorSelected: TDSSafeAny[] = [];

  constructor(
    private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private fastSaleOrderService: FastSaleOrderService
  ) { }

  ngOnInit(): void {
  }

  change(event: TDSSafeAny, error: TDSSafeAny) {
    console.log(event);
    if (error) {
      this.lstErrorSelected.push(event);
    } else {
      let index = this.lstErrorSelected.indexOf(event);
      this.lstErrorSelected.splice(index, 1);
    }
  }

  onCancel(result: TDSSafeAny) {
    this.modalRef.destroy(result);
  }

  onSave() {
    this.fastSaleOrderService.insertOrderProductDefaultWithForce({model: this.model}).subscribe(res => {
      this.message.success(Message.Bill.InsertSuccess);
      this.onCancel(res);
    }, error => this.onCancel(null));
  }

}
