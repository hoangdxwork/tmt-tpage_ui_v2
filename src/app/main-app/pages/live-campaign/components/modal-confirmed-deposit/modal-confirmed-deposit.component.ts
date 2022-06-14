import { finalize } from 'rxjs/operators';
import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { FastSaleOrderModelDTO, ListUpdateDepositDTO, UpdateDepositDTO } from 'src/app/main-app/dto/fastsaleorder/fastsaleorder.dto';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';

@Component({
  selector: 'modal-confirmed-deposit',
  templateUrl: './modal-confirmed-deposit.component.html'
})
export class ModalConfirmedDepositComponent implements OnInit, OnChanges {

  @Input() data!: FastSaleOrderModelDTO;
  @Output() eventOrderBefore = new EventEmitter();
  @Output() eventOrderNext = new EventEmitter();
  @Output() eventConfirmed = new EventEmitter();

  isLoading: boolean = false;

  currentDeposit: number = 0;

  constructor(
    private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private fastSaleOrderService: FastSaleOrderService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    debugger;
  }

  ngOnInit(): void {
    console.log(this.data);
  }

  onConfirmed() {
    if(this.data) {
      let model = this.prepareModel();

      this.isLoading = true;
      this.fastSaleOrderService.listUpdateDeposit(model)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe(res => {
          this.data.IsDeposited = true;
          this.message.success(Message.UpdatedSuccess);
          this.eventConfirmed.emit(this.currentDeposit);
        }, error => {
          this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
        });
    }
  }

  prepareModel() {
    let model = {} as UpdateDepositDTO;

    model.Id = this.data.Id;
    model.AmountDeposit = this.currentDeposit;
    model.IsConfirmed = false;

    let result = {} as ListUpdateDepositDTO;

    result.IsConfirmed = false;
    result.List = [model];

    return result;
  }

  onBefore() {

  }

  onNext() {

  }

  onCancel() {
    this.modalRef.destroy();
  }

}
