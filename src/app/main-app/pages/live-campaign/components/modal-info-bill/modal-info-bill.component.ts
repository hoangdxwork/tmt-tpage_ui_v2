import { finalize } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { FastSaleOrder_DefaultDTOV2 } from 'src/app/main-app/dto/fastsaleorder/fastsaleorder-default.dto';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';

@Component({
  selector: 'modal-info-bill',
  templateUrl: './modal-info-bill.component.html'
})
export class ModalInfoBillComponent implements OnInit {

  @Input() billId!: number;

  data!: FastSaleOrder_DefaultDTOV2;
  isLoading: boolean = false;

  constructor(
    private fastSaleOrderService: FastSaleOrderService,
    private modalRef: TDSModalRef,
    private message: TDSMessageService
  ) { }

  ngOnInit(): void {
    this.loadData(this.billId);
  }

  loadData(id: number) {
    this.isLoading = true;
    this.fastSaleOrderService.getById(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.data = res;
      }, error => {
        this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
      });
  }

  onCancel() {
    this.modalRef.destroy();
  }

}
