import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSSafeAny, TDSHelperString } from 'tds-ui/shared/utility';
import { finalize, takeUntil } from 'rxjs/operators';
import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { FastSaleOrderModelDTO, ListUpdateDepositDTO, UpdateDepositDTO } from 'src/app/main-app/dto/fastsaleorder/fastsaleorder.dto';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';

@Component({
  selector: 'modal-confirmed-deposit',
  templateUrl: './modal-confirmed-deposit.component.html',
  providers: [ TDSDestroyService ]
})

export class ModalConfirmedDepositComponent implements OnInit {

  @Input() data!: FastSaleOrderModelDTO;

  isLoading: boolean = false;
  isConfirmed: boolean = false;

  currentDeposit: number = 0;

  numberWithCommas =(value:TDSSafeAny) => {
    if(value != null)
    {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return value;
  } ;

  parserComas = (value: TDSSafeAny) =>{
    if(value != null)
    {
      return TDSHelperString.replaceAll(value,'.','');
    }
    return value;
  };

  constructor(private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private fastSaleOrderService: FastSaleOrderService,
    private destroy$: TDSDestroyService) {
  }

  ngOnInit(): void {
  }

  onConfirmed() {
    if(this.data) {
      let model = this.prepareModel();

      this.isLoading = true;
      this.fastSaleOrderService.listUpdateDeposit(model).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res: any) => {
            this.data.IsDeposited = true;
            this.message.success(Message.UpdatedSuccess);

            this.isConfirmed = true;
            this.isLoading = false;

            this.onCancel();
          },
          error: (error: any) => {
            this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
            this.isLoading = false;
          }
        }
      );
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

  onCancel() {
    this.modalRef.destroy(this.isConfirmed);
  }

  getAmountDeposit(){
    this.currentDeposit = this.data.AmountDeposit || 0;
  }
}
