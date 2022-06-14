import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'src/app/lib/consts/message.const';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-create-bill-fast-error',
  templateUrl: './create-bill-fast-error.component.html'
})
export class CreateBillFastErrorComponent implements OnInit {

  @Input() lstOrder!: TDSSafeAny[];
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
    if(this.lstErrorSelected.length === 0){
      this.message.error(Message.EmptyData);
      return;
    }

    let model = {
      is_approve: false,
      model: this.lstOrder,
    };

    this.fastSaleOrderService.insertListOrderModel(model, true).subscribe(res =>{
      this.message.success(Message.Bill.InsertSuccess);
      this.onCancel(res);
    }, error => this.onCancel(null));
  }

}
