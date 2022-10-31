import { takeUntil } from 'rxjs';
import { TDSDestroyService } from 'tds-ui/core/services';
import { Component, Input, OnInit } from '@angular/core';
import { SaleOnline_OrderDTO } from 'src/app/main-app/dto/saleonlineorder/sale-online-order.dto';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';

@Component({
  selector: 'modal-info-order',
  templateUrl: './modal-info-order.component.html',
  providers: [TDSDestroyService]
})
export class ModalInfoOrderComponent implements OnInit {

  @Input() orderId!: string;

  data!: SaleOnline_OrderDTO;
  isLoading: boolean = false;

  constructor(
    private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private destroy$: TDSDestroyService
  ) { }

  ngOnInit(): void {
    this.loadData(this.orderId);
  }

  loadData(id: string) {
    this.isLoading = true;

    this.saleOnline_OrderService.getById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: any) => {
        if(res) {
          this.data = {...res};
        }

        this.isLoading = false;
      }, 
      error: (err) => {
        this.isLoading = false;
        this.message.error(`${err?.error?.message || JSON.stringify(err)}`);
      }
    });
  }

  onCancel() {
    this.modalRef.destroy(null);
  }
}
