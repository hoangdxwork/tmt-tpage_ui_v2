import { Component, Input, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FastSaleOrderService } from "src/app/main-app/services/fast-sale-order.service";
import { TDSHelperArray, TDSMessageService, TDSModalRef, TDSNotificationService } from "tmt-tang-ui";

@Component({
  selector: 'send-delivery',
  templateUrl: './send-delivery.component.html',
})

export class SendDeliveryComponent implements OnInit {

  @ViewChild(TemplateRef, { static: false }) template?: TemplateRef<{}>;

  @Input() ids: any[] = [];
  orders: any[] = [];
  isVisible: boolean = false;
  lstErrors: any[] = [];

  constructor( private fastSaleOrderService: FastSaleOrderService,
    private notificationService: TDSNotificationService,
    private modal: TDSModalRef,
    private message: TDSMessageService,) {
  }

  ngOnInit() {
    if(this.ids) {
      this.fastSaleOrderService.getOrderSendShipIds({ids: this.ids}).subscribe((res: any) => {
          this.orders = res.value;
      })
    }
  }

  remoteItem(i: number, item: any) {

  }

  onSave() {
    let model = {
        ids: this.orders.map((x: any) => x.Id)
    }

    this.fastSaleOrderService.actionSendDelivery(model).subscribe((res: any) => {
        if(res && TDSHelperArray.isArray(res.Errors)) {
              this.isVisible = true;
              // this.notificationService.template(this.template!, { data: res.Errors })
              return
        } else {
            this.message.success('Thao tác thành công!');
            this.modal.destroy(null);
        }
    })
  }

  onCancel(){
    this.modal.destroy(null);
  }

  handleCancel(): void {
      this.isVisible = false;
  }


}
