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
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SendDeliveryComponent implements OnInit, OnDestroy {

  @ViewChild(TemplateRef, { static: false }) template?: TemplateRef<{}>;

  @Input() ids: any[] = [];
  lstOrders: OrderSendShipDTO[] = [];
  isVisible: boolean = false;
  lstErrors: any[] = [];
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor( private fastSaleOrderService: FastSaleOrderService,
    private modal: TDSModalRef,
    private message: TDSMessageService,
    private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    if(this.ids) {
      this.isLoading = true;
      this.fastSaleOrderService.getOrderSendShipIds({ids: this.ids})
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res: any) => {
            this.lstOrders = res.value;
            if(TDSHelperArray.isArray(this.lstOrders)) this.isLoading = false;
            this.cdRef.markForCheck();
          },
          err=>{
            this.message.error(err?.error?.message || 'Không tìm thấy đơn hàng phù hợp');
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
      return
    }

    let model = {
        ids: this.lstOrders.map((x: OrderSendShipDTO) => x.Id)
    }
    this.isLoading = true;
    this.cdRef.markForCheck();

    this.fastSaleOrderService.actionSendDelivery(model)
    .pipe(takeUntil(this.destroy$))
    .subscribe((res: any) => {
        if(res.Error && TDSHelperArray.isArray(res.Errors)) {
              this.isVisible = true;
              this.message.error(res.Error);
              this.lstErrors = res.Errors;
              this.isLoading = false;
              this.cdRef.markForCheck();
        } else {
            this.message.success('Thao tác thành công');
            this.modal.destroy(null);
        }
    },
    err=>{
      this.message.error(err?.error?.message || 'Gửi lại vận đơn thất bại');
    })
  }

  onCancel(){
    this.modal.destroy(null);
  }

  handleCancel(): void {
      this.isVisible = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
