import { Journal } from './../../../../dto/fastsaleorder/register-payment';
import { PrinterService } from '../../../../services/printer.service';
import { OdataAccountRegisterPayment, AccountRegisterPayment } from '../../../../dto/fastsaleorder/account-register-payment';
import { AccountRegisterPaymentService } from '../../../../services/account-register-payment.service';
import { RegisterPayment } from '../../../../dto/fastsaleorder/register-payment';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { map, Subject, mergeMap, finalize } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';

@Component({
  selector: 'app-modal-payment',
  templateUrl: './modal-payment.component.html'
})
export class ModalPaymentComponent implements OnInit, OnDestroy {

  @Input() dataModel!: RegisterPayment;
  _form!: FormGroup;

  lstAcJournal: AccountRegisterPayment[] = [];
  private destroy$ = new Subject<void>();
  isSubmit = false;
  isLoading: boolean = false;

  constructor( private modal: TDSModalRef,
    private fb: FormBuilder,
    private fastSaleOrderService: FastSaleOrderService,
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

  numberWithCommas =(value:TDSSafeAny) =>{
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

  createForm(){
    this._form = this.fb.group({
      Amount: [null,Validators.required],
      Communication: [null],
      Journal: [null,[Validators.required]],
      Name: [{value:null, disabled:true }],
      PaymentDate: [null,Validators.required]
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
    this.isLoading = true;
    this.accRegisterPayment.getWithCompanyPayment().pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false))
      .subscribe((res: OdataAccountRegisterPayment) => {
          this.lstAcJournal = [...res.value];
      },(error) => {
          this.message.error(`${error?.error?.message}` ? `${error?.error?.message}`: 'Không tải được dữ liệu PT thanh toán')
      })
  }

  onchangeJournal(event: Journal){
    if(event) {
      this.isLoading = true;
      this.dataModel.Journal = event;
      this.accRegisterPayment.onchangeJournal({model: this.dataModel}).pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false))
        .subscribe((res) => {
          this.dataModel.PaymentMethodId = res.PaymentMethodId;
        },(error)=>{
          this.message.error(`${error?.error?.message}` ? `${error?.error?.message}`:'Lỗi tải phương thức thanh toán');
      })
    }
  }

  prepareModel(){
    let formModel = this._form.value as RegisterPayment;

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

  onSave(type:string){

    if (!TDSHelperString.hasValueString(this._form.controls["Journal"].value)) {
      this.message.error('Phương thức không được để trống!');
        return
    }
    if (!TDSHelperString.hasValueString(this._form.controls["Amount"].value)) {
      this.message.error('Số tiền không được để trống!');
        return
    }
    if (!TDSHelperString.hasValueString(this._form.controls["PaymentDate"].value)) {
      this.message.error('Ngày thanh toán không được để trống!');
        return
    }
    let x = this.prepareModel();
    this.isLoading = true;
    this.accRegisterPayment.registerPayment(x).pipe(map((res) => res), mergeMap((res) => {
          let model =  {
            id: res.Id
          }
          return this.accRegisterPayment.createPayment(model);
      }))
      .pipe(takeUntil(this.destroy$), finalize(() => this.fastSaleOrderService.onLoadPage$.emit('onLoadPage')))
      .subscribe({
        next: (obs: any) => {
          if(obs) {
            this.message.success('Xác nhận thanh toán thành công');

            if(type == 'print') {
                let printer = this.printerService.printUrl(`/AccountPayment/PrintThuChiThuan?id=${obs?.value}`);
                printer.pipe(takeUntil(this.destroy$)).subscribe({
                  next: (a: TDSSafeAny) => {
                    this.printerService.printHtml(a);
                  },
                  error: (error: any) => {
                    let err: any;

                    if(typeof(error) === "string") {
                      err = JSON.parse(error) as any;
                    } else {
                      err = error;
                    }

                    this.isLoading = false;
                    this.message.error(err?.error?.message || err?.message);
                  }
                })
            }
          }
          this.isLoading = false;
          this.modal.destroy('onLoadPage');
      },
      error: (error: any) => {
          this.isLoading = false;
          this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
          this.modal.destroy(null);
        }
      })
  }

  cancel() {
      this.modal.destroy(null);
  }

}
