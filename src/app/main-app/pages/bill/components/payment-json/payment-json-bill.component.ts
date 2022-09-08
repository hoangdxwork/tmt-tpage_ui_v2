import { TDSDestroyService } from 'tds-ui/core/services';
import { PrinterService } from '../../../../services/printer.service';
import { AccountRegisterPayment } from '../../../../dto/fastsaleorder/account-register-payment';
import { takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { DefaultGetFastSaleOrderDTO } from 'src/app/main-app/dto/bill/action-create-post.dto';
import { AccountPaymentJsonService } from 'src/app/main-app/services/account-payment-json.service';
import { AccountRegisterPaymentService } from 'src/app/main-app/services/account-register-payment.service';
import { TDSSafeAny, TDSHelperString } from 'tds-ui/shared/utility';

@Component({
  selector: 'payment-json-bill',
  templateUrl: './payment-json-bill.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TDSDestroyService]
})

export class PaymentJsonBillComponent implements OnInit {
  @Input() data!: DefaultGetFastSaleOrderDTO;

  _form!: FormGroup;
  lstAcJournal: AccountRegisterPayment[] = [];
  isLoading: boolean = false;

  numberWithCommas =(value:TDSSafeAny) =>{
    if(value != null) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return value
  };

  parserComas = (value: TDSSafeAny) =>{
    if(value != null) {
      return TDSHelperString.replaceAll(value,',','');
    }
    return value
  };

  constructor(private modal: TDSModalRef,
    private fb: FormBuilder,
    private accountPaymentJsonService: AccountPaymentJsonService,
    private accRegisterPayment: AccountRegisterPaymentService,
    private message: TDSMessageService,
    private printerService: PrinterService,
    private destroy$: TDSDestroyService,
    private cdr: ChangeDetectorRef) {
      this.createForm();
  }

  ngOnInit(): void {
    this.loadData();
    this.loadAccountPayment();
  }

  createForm() {
    this._form = this.fb.group({
      Amount: [null, Validators.required],
      Communication: [null, Validators.required],
      Journal: [null, Validators.required],
      Name: [null],
      PaymentDate: [null, Validators.required]
    });
  }

  loadData() {
    this.updateForm(this.data);
    this.cdr.detectChanges();
  }

  updateForm(data: DefaultGetFastSaleOrderDTO) {
    this._form.controls['Amount'].setValue(data.Amount);
    this._form.controls['Name'].setValue(data.FastSaleOrders[0]?.PartnerDisplayName);
    this._form.controls['PaymentDate'].setValue(data.PaymentDate);
    this._form.controls['Communication'].setValue(data.Communication);
  }

  loadAccountPayment() {
    this.accRegisterPayment.getWithCompanyPayment().pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: any) => {
        this.lstAcJournal = [...res.value];
      },
      error:(error) => {
          this.message.error(error?.error?.message || 'Không tải được dữ liệu PT thanh toán');
      }
    })
  }

  onChangeJournal(event: any) {
    this.isLoading = true;
    this.accountPaymentJsonService.onChangeJournal(event.Id).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: any) => {
        if(res) {
          this.data.Currency = res.Currency;
          this.data.CurrencyId = res.CurrencyId;
          this.data.WriteoffAccountId = res.WriteoffAccountId;
          this.data.PaymentMethodId = res.PaymentMethodId;

          this._form.controls['Journal'].setValue(event);
          this.data.JournalId = event.Id;
        }

        this.isLoading = false;
      }, 
      error:(error) => {
        this.isLoading = false;
        this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
      }
    })
  }

  cancel() {
    this.modal.destroy(null);
  }

  onSave(type?: string) {
    let model = this.prepareModel();

    if(!model.PaymentDate) {
      this.message.error('Vui lòng chọn ngày thanh toán');
    }
    if(!model.Amount) {
      this.message.error('Vui lòng chọn số tiền thanh toán');
    }
    if(!model.JournalId && this._form.controls['Journal'].value) {
      this.message.error('Vui lòng chọn PT thanh toán');
    }
    
    this.isLoading = true;
    this.accountPaymentJsonService.actionCreatePost({model: model}).pipe(takeUntil(this.destroy$)).subscribe({
        next:(obs: any) => {
          
          if(obs && obs.value) {
            this.message.success('Xác nhận thanh toán thành công');
            if(type && type == 'print') {
                let printer = this.printerService.printUrl(`/AccountPayment/PrintThuChiThuan?id=${obs?.value}`);
                printer.pipe(takeUntil(this.destroy$)).subscribe((content: TDSSafeAny) => {
                    this.printerService.printHtml(content);
                })
            }

            this.cdr.detectChanges();
            this.modal.destroy(true);
          }

          this.isLoading = false;
        }, 
        error:(error) => {
          this.isLoading = false;
          this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
        }
      })
  }

  prepareModel() {
    let formModel = this._form.value;
    const model = this.data;

    if(formModel.PaymentDate) {
      model.PaymentDate = formModel.PaymentDate.toISOString();
    }
    if(formModel.Journal) {
      model.JournalId = formModel.Journal?.Id;
      model.JournalName = formModel.Journal?.Name;
      model.JournalType = formModel.Journal?.Type;
    }
    if(formModel.Communication) {
      model.Communication = formModel.Communication;
    }
    if(formModel.Amount) {
      model.Amount = formModel.Amount;
    }
    model.CurrencyId = model.Currency?.Id;

    return model;
  }
}