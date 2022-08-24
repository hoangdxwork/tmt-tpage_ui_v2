import { TDSDestroyService } from 'tds-ui/core/services';
import { Message } from 'src/app/lib/consts/message.const';
import { Component, Input, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { takeUntil, finalize } from 'rxjs';
import { GetLineOrderDTO } from 'src/app/main-app/dto/saleonlineorder/getline-order.dto';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'detail-expand',
  templateUrl: './expand-order-livecampaign.component.html'
})
export class ExpandOrderLivecampaignComponent implements OnInit, OnDestroy {

  @Input() dataOrder: any = {};

  isLoading: boolean = false;
  data: TDSSafeAny;
  lstDetail: GetLineOrderDTO[] = [];

  constructor(
    private message: TDSMessageService,
    private destroy$: TDSDestroyService,
    private saleOnline_OrderService: SaleOnline_OrderService) { }

  ngOnInit(): void {
    if(this.dataOrder) {
      this.loadDetail();
    }
  }

  loadDetail() {
    this.isLoading = true;

    this.saleOnline_OrderService.getLines(this.dataOrder.Id)
      .pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false)).subscribe((res: TDSSafeAny) => {
          this.lstDetail = res.value;
          console.log(this.lstDetail);
    }, error => {
      this.message.error(`${error?.error?.message}` || Message.CanNotLoadData)
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
