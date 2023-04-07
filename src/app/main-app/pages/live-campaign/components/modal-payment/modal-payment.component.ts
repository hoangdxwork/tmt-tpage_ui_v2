import { takeUntil } from 'rxjs';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSSafeAny, TDSHelperString } from 'tds-ui/shared/utility';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AccountRegisterPaymentDTO } from 'src/app/main-app/dto/fastsaleorder/payment.dto';
import { Message } from 'src/app/lib/consts/message.const';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { AccountJournalService } from 'src/app/main-app/services/account-journal.service';
import { AccountJournalDTO } from 'src/app/main-app/dto/account/account.dto';
import { AccountRegisterPaymentService } from 'src/app/main-app/services/account-register-payment.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';

@Component({
  selector: 'modal-payment',
  templateUrl: './modal-payment.component.html',
  providers: [TDSDestroyService]
})
export class ModalPaymentComponent implements OnInit {

  @Input() id!: number[];

  _form!: FormGroup;
  data!: AccountRegisterPaymentDTO;
  isLoading: boolean = false;
  lstAccountJournal: AccountJournalDTO[] = [];

  numberWithCommas =(value:TDSSafeAny) =>{
    if(value != null)
    {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return value;
  };

  parserComas = (value: TDSSafeAny) =>{
    if(value != null)
    {
      return TDSHelperString.replaceAll(value,'.','');
    }
    return value;
  };

  constructor(private message: TDSMessageService,
    private formBuilder: FormBuilder,
    private destroy$: TDSDestroyService,
    private fastSaleOrderService: FastSaleOrderService,
    private accountJournalService: AccountJournalService,
    private accountRegisterPaymentService: AccountRegisterPaymentService,
    private modalRef: TDSModalRef) {
      this.createForm();
   }

  ngOnInit(): void {
    this.loadData(this.id);
    this.loadAccountPayment();
  }

  loadData(id: number[]) {
    this.fastSaleOrderService.getRegisterPaymentV2({ ids: id}).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        delete res['@odata.context'];
        this.data = res;
        this.updateForm(res);
      },
      error: error => {
        this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
      }
    });
  }

  loadAccountPayment(){
    this.accountJournalService.getWithCompanyPayment().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.lstAccountJournal = [...(res?.value || [])];
      },
      error: (error) => {
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}`: 'Không tải được dữ liệu PT thanh toán')
      }
    })
  }

  createForm() {
    this._form = this.formBuilder.group({
      Amount: [null, Validators.required],
      Communication: [null, Validators.required],
      Journal: [null, [Validators.required]],
      Name: [{value:null, disabled:true}],
      PaymentDate: [null, Validators.required]
    });
  }

  updateForm(data: AccountRegisterPaymentDTO) {
    data.PaymentDate = new Date();
    data.Journal = undefined;
    data.JournalId = undefined;

    if(data.PaymentDate){
      data.PaymentDate = new Date(data.PaymentDate);
    }

    this._form.controls['Name'].setValue(data.Partner?.DisplayName || data.Partner?.Name);
    this._form.patchValue(data);
  }

  onChangeJournal(data: AccountJournalDTO) {
    this.data.Journal = data;

    this.isLoading = true;
    this.accountRegisterPaymentService.onchangeJournal({ model: this.data }).pipe(takeUntil(this.destroy$)).subscribe({
        next: res => {
          this.data.PaymentMethodId = res?.PaymentMethodId;
          this.isLoading = false;
        },
        error: error => {
          this.isLoading = false;
          this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
        }
      });
  }

  onSave() {
      if (!TDSHelperString.hasValueString(this._form.controls["Journal"].value)) {
        this.message.error('Phương thức không được để trống!');
        return;
      }
      if (!TDSHelperString.hasValueString(this._form.controls["Amount"].value)) {
        this.message.error('Số tiền không được để trống!');
          return;
      }
      if (!TDSHelperString.hasValueString(this._form.controls["PaymentDate"].value)) {
        this.message.error('Ngày thanh toán không được để trống!');
        return;
      }

      this.prepareModel();
      this.isLoading = true;

      this.accountRegisterPaymentService.insertV2(this.data).pipe(takeUntil(this.destroy$)).subscribe({
          next: res => {
            this.createPayment(res);
          },
          error: error => {
            this.isLoading = false;
            this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
          }
        });
  }

  createPayment(data: AccountRegisterPaymentDTO) {
    this.accountRegisterPaymentService.createPayment({ id: data.Id }).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.message.success(Message.Bill.PaymentSuccess);
          this.modalRef.destroy(res);
        },
        error: (error: any) => {
          this.isLoading = false
          this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
        }
      });
  }

  isCheckValue() {
    let formValue = this._form.value;

    if(!formValue.Journal) {
      this.message.error(Message.LiveCampaign.MethodPaymentEmpty);
      return 0;
    }

    return 1;
  }

  prepareModel() {
    let formValue = this._form.value;

    this.data.Amount = formValue.Amount;
    this.data.Communication = formValue.Communication;
    this.data.JournalId = formValue.Journal.Id;
    this.data.PaymentDate = formValue.PaymentDate;
  }

  onCancel() {
    this.modalRef.destroy();
  }

}
