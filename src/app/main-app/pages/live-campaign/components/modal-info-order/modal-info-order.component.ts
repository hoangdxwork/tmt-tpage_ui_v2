import { finalize } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { SaleOnline_OrderDTO } from 'src/app/main-app/dto/saleonlineorder/sale-online-order.dto';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { TDSModalRef } from 'tmt-tang-ui';

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
        console.log(res);
        this.data = res;
      });
  }

  onCancel() {
    this.modalRef.destroy();
  }

}
