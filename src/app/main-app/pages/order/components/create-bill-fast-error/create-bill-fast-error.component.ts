import { TDSSafeAny, TDSModalRef, TDSMessageService } from 'tmt-tang-ui';
import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'src/app/lib/consts/message.const';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';

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

  onCancel() {
    this.modalRef.destroy(null);
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
      this.onCancel();
    });
  }

}
