import { finalize } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { SaleOnline_OrderDTO } from 'src/app/main-app/dto/saleonlineorder/sale-online-order.dto';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';

@Component({
  selector: 'modal-info-order',
  templateUrl: './modal-info-order.component.html'
})
export class ModalInfoOrderComponent implements OnInit {

  @Input() orderId!: string;

  data!: SaleOnline_OrderDTO;
  isLoading: boolean = false;

  constructor(
    private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private saleOnline_OrderService: SaleOnline_OrderService
  ) { }

  ngOnInit(): void {
    this.loadData(this.orderId);
  }

  loadData(id: string) {
    this.isLoading = true;
    this.saleOnline_OrderService.getById(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.data = res;
        this.isLoading = false;
      }, error => {
        this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
        this.isLoading = false;
      });
  }

  onCancel() {
    this.modalRef.destroy();
  }

}
