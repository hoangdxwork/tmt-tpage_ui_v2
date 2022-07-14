import { PrinterService } from './../../../../services/printer.service';
import { Subject, takeUntil } from 'rxjs';
import { Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Message } from 'src/app/lib/consts/message.const';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSSafeAny, TDSHelperArray, TDSHelperObject } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-create-bill-fast-error',
  templateUrl: './create-bill-fast-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateBillFastErrorComponent implements OnInit, OnDestroy {

  @Input() lstOrder!: TDSSafeAny[];
  @Input() lstError!: TDSSafeAny[];

  lstErrorSelected: TDSSafeAny[] = [];
  checkedAll = false;
  indeterminate = false;
  isLoading = false;
  printType = '';

  private destroy$ = new Subject<void>();

  constructor(
    private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private fastSaleOrderService: FastSaleOrderService,
    private printerService: PrinterService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.lstError.forEach((item)=>{
      this.lstErrorSelected.push({isSelected: false, error: item});
    });
    this.cdr.markForCheck();
  }

  changeAll(checked: TDSSafeAny){
    this.lstErrorSelected.map((item)=>{
      item.isSelected = checked;
    });
    
    this.checkAllStatus();
  }

  change(checked: TDSSafeAny, i: number) {
    this.lstErrorSelected[i].isSelected = checked;
    this.checkAllStatus();
  }

  checkAllStatus(){
    let countChecked = 0;

    this.lstErrorSelected.forEach((item)=>{
      if(item.isSelected){
        countChecked += 1;
      }
    })

    if(countChecked == this.lstErrorSelected.length){
      this.checkedAll = true;
      this.indeterminate = false;
    }else{
      if(countChecked == 0){
        this.checkedAll = false;
        this.indeterminate = false;
      }else{
        this.indeterminate = true;
      }
    }
  
    this.cdr.detectChanges();
  }

  changePrintType(type:string){
    this.printType = type;
  }

  print(type:string, data:TDSSafeAny){
    let obs: TDSSafeAny;
    
    switch(type){
      case 'print': 
        obs = this.printerService.printUrl(`fastsaleorder/print?ids=${data.Ids}`);
        break;
      case 'printShip':
        obs = this.printerService.printIP(`odata/fastsaleorder/OdataService.PrintShip`, {
          ids: data.Ids,
        });
        break;
    }
    
    if (TDSHelperObject.hasValue(obs)) {
      obs.pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
          this.printerService.printHtml(res);
          
      }, (error: TDSSafeAny) => {
        if(error?.error?.message) {
          this.message.error(error?.error?.message);
        }
      });
    }
  }

  onCancel(result: TDSSafeAny) {
    this.modalRef.destroy(result);
  }

  onSave() {
    let lstInsertOrder:any[] = [];
    let lstChecked:number[] = [];

    this.lstErrorSelected.forEach((item,i)=>{
      if(item.isSelected){
        //TODO: lấy danh sách đơn hàng cần thêm
        lstInsertOrder.push(this.lstOrder[i]);
        lstChecked.push(i);
      }
    });

    if(lstChecked.length == 0){
      this.message.error(Message.EmptyData);
      return;
    }

    this.isLoading = true;

    //TODO: check danh sách lỗi và đơn hàng còn lại chưa được chọn
    this.lstErrorSelected = this.lstErrorSelected.filter((f,i)=> !lstChecked.includes(i));
    this.lstOrder = this.lstOrder.filter((f,i)=> !lstChecked.includes(i));
    this.checkAllStatus();

    let model = {
      is_approve: false,
      model: lstInsertOrder,
    };

    this.fastSaleOrderService.insertListOrderModel(model, true).subscribe(res =>{
      if(res.Success){
        this.message.success(Message.Bill.InsertSuccess);
      }else{
        this.message.error(res.Error);
      }

      this.isLoading = false;
      
      this.print(this.printType, res);
      this.printType = '';

      if(!TDSHelperArray.hasListValue(this.lstOrder)){
        this.modalRef.destroy(null);
      }
      this.cdr.markForCheck();
    }, error => {
      this.message.error(error?.error?.message || Message.InsertFail);
      this.isLoading = false;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
