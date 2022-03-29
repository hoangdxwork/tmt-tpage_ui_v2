import { Component, Input, OnInit } from "@angular/core";
import { FastSaleOrderService } from "src/app/main-app/services/fast-sale-order.service";
import { TDSMessageService, TDSModalRef } from "tmt-tang-ui";

@Component({
  selector: 'payment-request',
  templateUrl: './payment-request.component.html',
})

export class PaymentRequestComponent implements OnInit{

  @Input() dataPayment: any[] = []
  data: any[] = [];
  team: any = {};

  lstPaymentRequest = [
      {value: "MoMo", text: "MoMo"},
      {value: "ZaloPay", text: "ZaloPay"},
      {value: "VNPay", text: "VNPay"},
      {value: "COD", text: "COD"}
  ];

  constructor( private fastSaleOrderService: FastSaleOrderService,
    private modal: TDSModalRef,
    private message: TDSMessageService,) {
  }

  ngOnInit(): void {
  }

  onChangePayment(event: any, item: any){
    let exits = this.dataPayment.filter(x => x.Id == item.Id)[0];
      if(exits) {
        exits.PaymentMethod = event.value;
      }
  }

  onSave() {
    let model: any [] = [];
    this.dataPayment.forEach((x: any) => {
        let item = {
            Id: x.Id,
            Number: x.Number,
            PaymentMethod: x.PaymentMethod,
            AmountTotal: x.AmountTotal as number,
            PartnerId: x.PartnerId,
            TeamId: x.TeamId,
        }
        model.push(item);
    });

    this.fastSaleOrderService.sendPaymentRequest(model).subscribe((res: any) => {
        this.modal.destroy(null);
        this.message.success('Gửi thanh toán thành công!');
    }, error => {
        this.modal.destroy(null);
        this.message.error('Gửi thanh toán thất bại!');
    })
  }

  onCancel(){
    this.modal.destroy(null);
  }
}
