import { TDSDestroyService } from 'tds-ui/core/services';
import { Message } from 'src/app/lib/consts/message.const';
import { Component, Input, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { takeUntil, finalize } from 'rxjs';
import { GetLineOrderDTO } from 'src/app/main-app/dto/saleonlineorder/getline-order.dto';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { InfoPartnerComponent } from '../info-partner/info-partner.component';

@Component({
  selector: 'expand-order-detail',
  templateUrl: './expand-order-detail.component.html',
  providers: [TDSDestroyService]
})
export class ExpandOrderDetailComponent implements OnInit, OnDestroy {

  @Input() dataOrder: any = {};

  isLoading: boolean = false;
  data: TDSSafeAny;
  lstDetail: GetLineOrderDTO[] = [];

  constructor(private modal: TDSModalService,
    private message: TDSMessageService,
    private destroy$: TDSDestroyService,
    private viewContainerRef: ViewContainerRef,
    private saleOnline_OrderService: SaleOnline_OrderService) { }

  ngOnInit(): void {
    if(this.dataOrder) {
      this.loadDetail();
    }
  }

  onInfo() {
    this.modal.create({
      title: 'Thông tin khách hàng',
      content: InfoPartnerComponent,
      size: 'xl',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        dataOrder: this.dataOrder,
        partnerId: this.dataOrder.PartnerId
      }
    });
  }

  loadDetail() {
    this.isLoading = true;

    this.saleOnline_OrderService.getLines(this.dataOrder.Id)
      .pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false)).subscribe((res: TDSSafeAny) => {
          this.lstDetail = res.value;
    }, error => {
      this.message.error(`${error?.error?.message}` || Message.CanNotLoadData)
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
