import { Component, Input, OnInit } from "@angular/core";
import { AccountRegisterPaymentService } from "src/app/main-app/services/account-register-payment..service";
import { FastSaleOrderService } from "src/app/main-app/services/fast-sale-order.service";
import { TDSMessageService, TDSModalRef } from "tmt-tang-ui";

@Component({
  selector: 'payment-multip',
  templateUrl: './payment-multip.component.html',
})

export class PaymentMultipComponent implements OnInit{

  @Input() lstCustomer: any = [];

  lstAcJournal: any = [];
  acJournal: any = {};

  constructor( private fastSaleOrderService: FastSaleOrderService,
    private modal: TDSModalRef,
    private registerPaymentService: AccountRegisterPaymentService,
    private message: TDSMessageService,) {
  }

  ngOnInit(): void {
    this.fastSaleOrderService.getWithCompanyPayment().subscribe((res: any) => {
        this.lstAcJournal = res.value;
        this.acJournal = res.value[0];
    })
  }

  onCancel(){
    this.modal.destroy(null);
  }

  onSave(){
    this.lstCustomer.forEach((x: any) => {
        x['JournalId'] = this.acJournal.Id;
        x['Journal'] = this.acJournal;
    });

    let model = {
      models: this.lstCustomer
    }

    this.registerPaymentService.createMultip(model).subscribe((res: any) => {
        this.message.success('Xác nhận thanh toán thành công');
        this.modal.destroy(null);
    }, error => {
      this.message.error(`${error.message}`);
      this.modal.destroy(null);
    })
  }

  onChangeAcJournal(event: any) {
      this.acJournal = event;
  }

}
