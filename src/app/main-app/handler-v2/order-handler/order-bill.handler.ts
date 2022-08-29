import { TDSDestroyService } from 'tds-ui/core/services';
import { FastSaleOrder_DefaultDTOV2 } from 'src/app/main-app/dto/fastsaleorder/fastsaleorder-default.dto';
import { PrepareOrderBill } from './prepare-order-bill.handler';
import { TDSMessageService } from 'tds-ui/message';
import { SaleOnline_OrderService } from '@app/services/sale-online-order.service';
import { BehaviorSubject, Subject, takeUntil, Observable } from 'rxjs';
import { ChangeDetectorRef, Injectable, OnDestroy } from "@angular/core";

@Injectable()

export class OrderBillHandler{

  public orderBillEvent$ = new BehaviorSubject<any>(null);
  // private destroy$ = new Subject<void>();

  constructor(private saleOnline_OrderService: SaleOnline_OrderService,
    private prepareOrderBill: PrepareOrderBill,
    private message: TDSMessageService) { }

  // public setOrderBill(ids: string[]) {
  //   let model = {
  //     ids: ids
  //   }

  //   this.saleOnline_OrderService.getDetails(model).subscribe({
  //     next: (res) => {
  //       delete res['@odata.context'];
  //       let data = this.prepareOrderBill.prepareModel(res);
        
  //       this.orderBillEvent$.next(data);
  //     },
  //     error: (err) => {
  //       this.message.error(err?.error?.message || 'Không thể tạo hóa đơn');
  //     }
  //   })
  // }

  // public getOrderBill() {
  //   return this.orderBillEvent$.asObservable();
  // }

  // ngOnDestroy(): void {
  //   this.destroy$.next();
  //   this.destroy$.complete();
  // }
}