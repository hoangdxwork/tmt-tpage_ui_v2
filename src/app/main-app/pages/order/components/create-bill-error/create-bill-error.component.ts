import { CreateBillDefaultErrorDTO } from './../../../../dto/order/default-error.dto';
import { OrderBillDefaultDTO } from './../../../../dto/order/order-bill-default.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { PrinterService } from '../../../../services/printer.service';
import { takeUntil, Observable } from 'rxjs';
import { Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Message } from 'src/app/lib/consts/message.const';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSSafeAny, TDSHelperArray, TDSHelperString } from 'tds-ui/shared/utility';
import { TDSNotificationService } from 'tds-ui/notification';

@Component({
  selector: 'app-create-bill-error',
  templateUrl: './create-bill-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TDSDestroyService]
})
export class CreateBillErrorComponent implements OnInit {

  @Input() billDefaultModel!: OrderBillDefaultDTO;
  @Input() lstOrder!: TDSSafeAny[];
  @Input() lstDataErrorDefault!: TDSSafeAny[];
  @Input() lstErrors: TDSSafeAny[] = [];
  @Input() type!: string;
  @Input() isApprove!: boolean;

  lstErrorSelected: TDSSafeAny[] = [];
  checkedAll: boolean = false;
  indeterminate = false;
  isLoading = false;
  isPrint = false;
  isPrintShip = false;

  constructor(private notification: TDSNotificationService,
    private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private fastSaleOrderService: FastSaleOrderService,
    private printerService: PrinterService,
    private cdr: ChangeDetectorRef,
    private destroy$: TDSDestroyService
  ) { }

  ngOnInit(): void {
    this.lstErrorSelected = [];
    this.lstDataErrorDefault.forEach((err) => {
      this.lstErrorSelected.push({ isSelected: false, error: err });
    });

    this.lstErrors.map(item => {
      item?.replace('text-info font-bold','text-info-500 font-semibold');
    });

    if(TDSHelperString.hasValueString(this.type)){
      switch(this.type){
        case 'print': 
          this.isPrint = true;
          this.isPrintShip = false;
          break;
        case 'printShip': 
          this.isPrintShip = true;
          this.isPrint = false;
          break;
      }
    }

    this.cdr.detectChanges();
  }

  changeAll(value: TDSSafeAny) {
    this.lstErrorSelected.map((item) => {
      item.isSelected = value;
    });

    this.checkAllStatus();
  }

  onChangeCheckBox() {
    this.checkAllStatus();
  }

  checkAllStatus() {
    let countChecked = 0;

    this.lstErrorSelected.forEach((item) => {
      if (item.isSelected) {
        countChecked += 1;
      }
    })

    if (countChecked == this.lstErrorSelected.length) {
      this.checkedAll = true;
      this.indeterminate = false;
    } else {
      if (countChecked == 0) {
        this.checkedAll = false;
        this.indeterminate = false;
      } else {
        this.indeterminate = true;
      }
    }

    this.cdr.detectChanges();
  }

  changePrint(str: string, active: boolean) {
    switch (str) {
      case 'isPrint':
        this.isPrint = active;
        this.isPrintShip = false;
        break;
      case 'isPrintShip':
        this.isPrintShip = active;
        this.isPrint = false;
    }
  }

  printOrder(ids: TDSSafeAny[]) {
    let obs!: Observable<any>;

    if (this.isPrint == true) {
      obs = this.printerService.printUrl(`/fastsaleorder/print?ids=${ids}`);
    }

    if (this.isPrintShip == true) {
      obs = this.printerService.printUrl(`/fastsaleorder/printshipthuan?ids=${ids}`);
    }

    if (obs) {
      obs.pipe(takeUntil(this.destroy$)).subscribe({
        next:(res: TDSSafeAny) => {
          this.printerService.printHtml(res);
        }, 
        error:(error: TDSSafeAny) => {
          if(error) {
            this.notification.error( 'Lỗi in phiếu', error);
          }
        }
      });
    }
  }

  onCancel(result?:TDSSafeAny) {
    this.modalRef.destroy(result);
  }

  onSave() {
    if(this.isLoading){
      return;
    }

    if(this.billDefaultModel){
      let lstChecked: number[] = [];
      this.billDefaultModel.Lines = [];

      this.lstErrorSelected.forEach((item, i) => {
        if (item.isSelected) {
          //TODO: lấy danh sách cần cần force
          this.billDefaultModel.Lines.push(this.lstErrorSelected[i].error);
          lstChecked.push(i);
        }
      });

      if (lstChecked.length == 0) {
        this.message.error('Không có lỗi nào được chọn');
        return;
      }

      this.isLoading = true;

      //TODO: lọc lại danh sách lỗi
      this.lstErrorSelected = this.lstErrorSelected.filter((f, i) => !lstChecked.includes(i));
      this.checkAllStatus();
      
      this.fastSaleOrderService.insertOrderProductDefaultWithForce({model: this.billDefaultModel}).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res: CreateBillDefaultErrorDTO) => {
          this.isLoading = false;

          if(!res.Error){
            this.message.success(Message.Bill.InsertSuccess);
          }else{
            // TODO: lấy danh sách thông báo lỗi
            if(res.Errors){
              res.Errors.map((item: string)=>{
                this.lstErrors.push(item?.replace('text-info font-bold','text-info-500 font-semibold'));
              });
            }
          }

          if(this.isPrintShip || this.isPrint) {
            this.printOrder(res.Ids);
          }

          this.cdr.detectChanges();
        },
        error:(err) => {
          this.isLoading = false;
          this.message.error(err?.error?.message || Message.InsertFail);
          this.cdr.detectChanges();
        }
      });

    } else {
      let lstInsertOrder: any[] = [];
      let lstChecked: number[] = [];

      this.lstErrorSelected.forEach((item, i) => {
        if (item.isSelected) {
          //TODO: lấy danh sách đơn hàng insert
          lstInsertOrder.push(this.lstOrder[i]);
          lstChecked.push(i);
        }
      });

      if (lstChecked.length == 0) {
        this.message.error('Không có lỗi nào được chọn');
        return;
      }

      this.isLoading = true;

      //TODO: check danh sách lỗi và đơn hàng còn lại chưa được chọn
      this.lstErrorSelected = this.lstErrorSelected.filter((f, i) => !lstChecked.includes(i));
      this.lstOrder = this.lstOrder.filter((f, i) => !lstChecked.includes(i));
      this.checkAllStatus();

      let model = {
        is_approve: this.isApprove,
        model: lstInsertOrder,
      };

      this.fastSaleOrderService.insertListOrderModel(model, true).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res) => {

          this.isLoading = false;
          if(!res.Error){
            this.message.success(Message.Bill.InsertSuccess);
          }else{
            // TODO: lấy danh sách thông báo lỗi
            if(res.Errors){
              res.Errors.forEach((item: string, i:number)=>{
                this.lstErrors.push(item?.replace('text-info font-bold','text-info-500 font-semibold'));
              });
            }
          }

          if (this.isPrint || this.isPrintShip) {
            this.printOrder(res.Ids);
          }

          this.cdr.detectChanges();
        },
        error:(err) => {
          this.isLoading = false;
          this.message.error(err?.error?.message || Message.InsertFail);
          this.cdr.detectChanges();
        }
      });
    }
  }
}
