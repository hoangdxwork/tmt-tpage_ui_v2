import { TDSNotificationService } from 'tds-ui/notification';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSHelperArray } from 'tds-ui/shared/utility';
import { Subject, takeUntil } from 'rxjs';
import { OrderSendShipDTO } from './../../../../dto/fastsaleorder/fastsaleorder-default.dto';
import { Component, Input, OnInit, OnDestroy,  TemplateRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from "@angular/core";
import { FastSaleOrderService } from "src/app/main-app/services/fast-sale-order.service";
import { TDSMessageService } from "tds-ui/message";
import { TDSModalRef } from "tds-ui/modal";

@Component({
  selector: 'send-delivery',
  templateUrl: './send-delivery.component.html',
  styleUrls: ['./send-delivery.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TDSDestroyService]
})

export class SendDeliveryComponent implements OnInit {

  @ViewChild(TemplateRef, { static: false }) template?: TemplateRef<{}>;
  @Input() ids: any[] = [];

  lstOrders: OrderSendShipDTO[] = [];
  isLoading = false;

  constructor( private fastSaleOrderService: FastSaleOrderService,
    private modal: TDSModalRef,
    private message: TDSMessageService,
    private notification: TDSNotificationService,
    private destroy$: TDSDestroyService,
    private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    if(this.ids) {
      this.isLoading = true;

      this.fastSaleOrderService.getOrderSendShipIds({ids: this.ids}).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            this.isLoading = false;
            
            if(TDSHelperArray.isArray(res.value)) {
              this.lstOrders = [...res.value];
            }
            this.cdRef.detectChanges();
          },
          error: (err: any) => {
            this.message.error(err?.error?.message || 'Không tìm thấy đơn hàng phù hợp');
          }
      })
    } else {
      this.message.error('Không tìm thấy mã vận đơn');
    }
  }

  remoteItem(item: OrderSendShipDTO) {
    let index = this.lstOrders.findIndex(f=>f.Id == item.Id) as number;

    this.lstOrders.splice(index,1);
    this.lstOrders = [...this.lstOrders];
  }

  onSave() {
    if(this.isLoading){
      return;
    }

    let model = {
        ids: this.lstOrders?.map((x: OrderSendShipDTO) => x.Id)
    }

    if(model.ids?.length == 0) {
      this.message.warning('Không có mã vận đơn phù hợp nào');
      return;
    }

    this.isLoading = true;

    this.fastSaleOrderService.actionSendDelivery(model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          if(res.Error && TDSHelperArray.isArray(res.Errors)) {
                res.Errors.forEach((err: string) => {
                  this.notification.error('Lỗi', err);
                });;
                
          } else {
              this.message.success('Thao tác thành công');
              this.fastSaleOrderService.onLoadPage$.emit('onLoadPage');
              this.modal.destroy(null);
          }

          this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        this.message.error(error?.error?.message || 'Gửi lại vận đơn thất bại');
      }
    })
  }

  onCancel(){
    this.modal.destroy(null);
  }
}
