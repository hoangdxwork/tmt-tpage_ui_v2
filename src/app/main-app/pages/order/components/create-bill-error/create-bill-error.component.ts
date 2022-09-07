import { CreateBillDefaultErrorDTO } from './../../../../dto/order/default-error.dto';
import { OrderBillDefaultDTO } from './../../../../dto/order/order-bill-default.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { PrinterService } from '../../../../services/printer.service';
import { takeUntil } from 'rxjs';
import { Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Message } from 'src/app/lib/consts/message.const';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSSafeAny, TDSHelperArray, TDSHelperObject } from 'tds-ui/shared/utility';
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

  lstErrorSelected: TDSSafeAny[] = [];
  checkedAll = false;
  indeterminate = false;
  isLoading = false;
  isPrint = false;
  isPrintShip = false;
  isOpenCheckBox = true;

  constructor(private notification: TDSNotificationService,
    private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private fastSaleOrderService: FastSaleOrderService,
    private printerService: PrinterService,
    private cdr: ChangeDetectorRef,
    private destroy$: TDSDestroyService
  ) { }

  ngOnInit(): void {
    this.lstDataErrorDefault.forEach((err) => {
      this.lstErrorSelected.push({ isSelected: false, error: err });
    });

    this.cdr.detectChanges();
  }

  changeAll(checked: TDSSafeAny) {
    this.lstErrorSelected.map((item) => {
      item.isSelected = checked;
    });

    this.checkAllStatus();
  }

  change(checked: TDSSafeAny, i: number) {
    this.lstErrorSelected[i].isSelected = checked;
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

  printOrder() {
    let data = this.lstDataErrorDefault as any;debugger
    let obs: TDSSafeAny;

    if (this.isPrint == true) {
      obs = this.printerService.printUrl(`/fastsaleorder/print?ids=${data.Ids}`);
    }

    if (this.isPrintShip == true) {
      obs = this.printerService.printUrl(`/fastsaleorder/printshipthuan?ids=${data.Ids}`);
    }

    if (obs) {
      obs.pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
          this.printerService.printHtml(res);
          this.onCancel();

      }, (error: TDSSafeAny) => {
          if(error?.error?.message) {
              this.notification.error( 'Lỗi in phiếu', error?.error?.message);
          }
          this.onCancel();
      });
    }
  }

  onCancel() {
    this.modalRef.destroy(null);
  }

  onSave() {
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

          if(this.lstErrorSelected.length == 0){
            this.isOpenCheckBox = false;

            if(this.lstErrors.length == 0){
              this.onCancel();
            }
          }

          if(this.isPrintShip || this.isPrint) {
            this.printOrder();
          }

          this.cdr.detectChanges();
        },
        error:(err) => {
          this.isLoading = false;

          this.onCancel();
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
        is_approve: false,
        model: lstInsertOrder,
      };

      this.fastSaleOrderService.insertListOrderModel(model, true).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res) => {
          debugger

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

          if(this.lstErrorSelected.length == 0){
            this.isOpenCheckBox = false;
          }

          // if (this.isPrint || this.isPrintShip) {
          //     this.printOrder();
          // }

          if (!TDSHelperArray.hasListValue(this.lstOrder)) {
            this.modalRef.destroy(true);
          }

          this.cdr.detectChanges();
        },
        error:(error) => {
          this.message.error(error?.error?.message || Message.InsertFail);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
}
