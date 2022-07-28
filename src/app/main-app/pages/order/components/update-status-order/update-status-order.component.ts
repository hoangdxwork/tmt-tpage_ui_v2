import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { SaleOnlineOrderStatusDTO } from './../../../../dto/saleonlineorder/sale-online-order-status.dto';
import { ODataSaleOnline_OrderModel } from './../../../../dto/saleonlineorder/odata-saleonline-order.dto';
import { CommonService } from './../../../../services/common.service';
import { Message } from './../../../../../lib/consts/message.const';
import { Subject, finalize } from 'rxjs';
import { takeUntil } from 'rxjs';
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'update-status-order',
  templateUrl: './update-status-order.component.html',
})
export class UpdateStatusOrderComponent implements OnInit {

  @Input() listData: ODataSaleOnline_OrderModel[] = [];

  _form!:FormGroup;
  statusAll!: SaleOnlineOrderStatusDTO;
  lstStatus: SaleOnlineOrderStatusDTO[] = [];
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private message: TDSMessageService,
    private modal: TDSModalRef,
    private commonService: CommonService,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { 
    this.createForm();
  }

  ngOnInit(): void {
    this.loadStatusTypeExt();
    this.updateForm();
  }

  createForm(){
    this._form = this.fb.group({
      statusAll:[null],
      data: this.fb.array([])
    })
  }

  updateForm(){
    this.listData.forEach((item)=>{
      this.dataArray.push(this.fb.group({
        Id:[item.Id],
        Name:[item.PartnerName],
        Code:[item.Code],
        TotalAmount:[item.TotalAmount],
        StatusText:[item.StatusText]
      }))
    })
    this.cdr.markForCheck();
  }

  get dataArray(): FormArray {
    return this._form.get('data') as FormArray;
  }

  loadStatusTypeExt() {
    this.commonService.getStatusTypeExt().subscribe(res => {
      this.lstStatus = [...res];
    });
  }

  onAllStatus() {
    if (!this._form.controls["statusAll"].value) {
      this.message.error("Hãy chọn trạng thái!");
      return;
    }

    for (let i = 0; i < this.dataArray.length; i++) {
      let data = this._form.controls["statusAll"].value as string;
      let formData = <FormGroup> this.dataArray.at(i);
      
      formData.controls["StatusText"].setValue(data);
    }
  }

  prepareModel(){
    return this.dataArray.value as ODataSaleOnline_OrderModel[];;
  }

  onSave() {
    if (!this.listData || this.listData.length < 1) {
      this.message.error("Dữ liệu trống!");
      return;
    }

    this.isLoading = true;

    let model = this.prepareModel();

    this.saleOnline_OrderService.updateStatusTextSaleOnline({ model: model })
      .pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false)).subscribe(res => {
          this.message.success(Message.UpdatedSuccess);
          this.onCancel(true);
        },
        err => {
          this.message.error(err?.error?.message || Message.UpdatedFail);
        });
  }

  onCancel(result: TDSSafeAny) {
    this.modal.destroy(result);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
