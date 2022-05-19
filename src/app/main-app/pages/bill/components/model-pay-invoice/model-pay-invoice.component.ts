import { PrinterService } from './../../../../services/printer.service';
import { TDSSafeAny } from 'tmt-tang-ui';
import { OdataAccountRegisterPayment, AccountRegisterPayment } from './../../../../dto/fastsaleorder/account-register-payment';
import { AccountRegisterPaymentService } from './../../../../services/account-register-payment.service';
import { RegisterPayment } from './../../../../dto/fastsaleorder/register-payment';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs';
import { TDSMessageService } from 'tmt-tang-ui';
import { TDSModalRef } from 'tmt-tang-ui';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-model-pay-invoice',
  templateUrl: './model-pay-invoice.component.html'
})
export class ModelPayInvoiceComponent implements OnInit, OnDestroy {
  @Input() dataModel!:RegisterPayment;

  lstOfAccPayment:AccountRegisterPayment[] = [];
  private destroy$ = new Subject();
  isSubmit = false;

  _form!: FormGroup;

  constructor(
    private modal: TDSModalRef,
    private fb: FormBuilder,
    private message: TDSMessageService,
    private accRegisterPayment: AccountRegisterPaymentService,
    private printerService: PrinterService) { 
      this.createForm();
    }

  ngOnInit(): void {
    if(this.dataModel){
      this.updateForm(this.dataModel);
      this.loadAccountPayment();
    }
  }

  createForm(){
    this._form = this.fb.group({
      Amount: [null,Validators.required],
      Communication: [null,Validators.required],
      Journal: [null,[Validators.required]],
      Name: [{value:null,disabled:true}],
      PaymentDate: [null,Validators.required],
    });
  }

  updateForm(data:RegisterPayment){
    if(data.PaymentDate){
      data.PaymentDate = new Date(data.PaymentDate);
    }
    
    this._form.controls['Name'].setValue(data.Partner?.DisplayName || data.Partner?.Name);

    this._form.patchValue(data);
  }

  loadAccountPayment(){
    this.accRegisterPayment.getWithCompanyPayment().pipe(takeUntil(this.destroy$)).subscribe(
      (res:OdataAccountRegisterPayment)=>{
        this.lstOfAccPayment = res.value;
      },
      (err)=>{
        this.message.error('Không tải được dữ liệu phương thức thanh toán')
      }
    )
  }

  onchangeJournal(data:TDSSafeAny){
    this.dataModel.Journal = data;
    this.accRegisterPayment.onchangeJournal({model: this.dataModel}).pipe(takeUntil(this.destroy$)).subscribe(
      (res)=>{
        this.dataModel.PaymentMethodId = res.PaymentMethodId;
      },
      (err)=>{
        this.dataModel.PaymentMethodId = 0;
        this.message.error(err.error.message??'Lỗi tải phương thức thanh toán');
      }
    )
  }

  prepareModel(){
    let formModel = this._form.value;
    
    this.dataModel.Amount = formModel.Amount ?? this.dataModel.Amount;
    this.dataModel.Communication = formModel.Communication ?? this.dataModel.Communication;
    this.dataModel.JournalId = formModel.Journal.Id ?? this.dataModel.JournalId;
    this.dataModel.PaymentDate = formModel.PaymentDate ?? this.dataModel.PaymentDate;
    
    return this.dataModel
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkValidate(){
    if(this._form.touched)
      return !this._form.valid
    return true
  }

  createPayment(data:TDSSafeAny, type:string){
    this.accRegisterPayment.createPayment({id: data.Id}).pipe(takeUntil(this.destroy$)).subscribe(
      (res)=>{
        this.message.success('Xác nhận thanh toán thành công');
        this.modal.destroy(res);
        if(type === 'saveAndPrint'){
          this.printerService.printUrl(`/AccountPayment/PrintThuChiThuan?id=${res.value}`);
        }
        this.isSubmit = false;
      },
      (err)=>{
        this.message.error(err.error.message??'Xác nhận thanh toán thất bại');
        this.isSubmit = false;
      }
    );
  }

  onSubmit(type:string) {
    let model:any = this.prepareModel();
    this.isSubmit = true;
    this.accRegisterPayment.insert(model).pipe(takeUntil(this.destroy$)).subscribe(
      (res)=>{
        this.createPayment(res,type);
      },
      (err)=>{
        this.message.error('Dữ liệu nhập vào bị lỗi');
        this.isSubmit = false;
      }
    )
  }

  cancel() {
      this.modal.destroy(null);
  }

  save(type:string) {
      this.onSubmit(type);
  }
}
