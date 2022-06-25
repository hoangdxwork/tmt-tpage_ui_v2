import { PrinterService } from '../../../../services/printer.service';
import { AccountRegisterPayment } from '../../../../dto/fastsaleorder/account-register-payment';
import { Subject, takeUntil, finalize } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { DefaultGetFastSaleOrderDTO } from 'src/app/main-app/dto/bill/action-create-post.dto';
import { AccountPaymentJsonService } from 'src/app/main-app/services/account-payment-json.service';
import { AccountRegisterPaymentService } from 'src/app/main-app/services/account-register-payment.service';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import th from 'date-fns/esm/locale/th/index.js';

@Component({
  selector: 'payment-json-bill',
  templateUrl: './payment-json-bill.component.html'
})

export class PaymentJsonBillComponent implements OnInit, OnDestroy {

  @Input() orderId!: number;
  _form!: FormGroup;
  data!: DefaultGetFastSaleOrderDTO;

  lstAcJournal: AccountRegisterPayment[] = [];
  private destroy$ = new Subject<void>();
  isLoading: boolean = false;

  constructor(private modal: TDSModalRef,
    private fb: FormBuilder,
    private accountPaymentJsonService: AccountPaymentJsonService,
    private accRegisterPayment: AccountRegisterPaymentService,
    private message: TDSMessageService,
    private printerService: PrinterService) {
      this.createForm();
  }

  ngOnInit(): void {
    if(this.orderId) {
      this.loadData();
      this.loadAccountPayment();
    }
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
    this.isLoading = true;
    this.accountPaymentJsonService.defaultGetFastSaleOrder({ orderId: this.orderId })
      .pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false)).subscribe((res: any) => {
        if(res) {
          delete res['@odata.context'];
          if(res.PaymentDate) {
            res.PaymentDate = new Date(res.PaymentDate);
          }

          this.data = res;
          this.updateForm(this.data);
        }
    }, error => {
        this.message.error(`${error?.error?.message}`);
    })
  }

  updateForm(data: DefaultGetFastSaleOrderDTO) {
    this._form.controls['Amount'].setValue(data.Amount);
    this._form.controls['Name'].setValue(data.FastSaleOrders[0]?.PartnerDisplayName);
    this._form.controls['PaymentDate'].setValue(data.PaymentDate);
    this._form.controls['Communication'].setValue(data.Communication);
  }

  loadAccountPayment() {
    this.accRegisterPayment.getWithCompanyPayment().pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
          this.lstAcJournal = [...res.value];
      },(error) => {
          this.message.error(`${error?.error?.message}` ? `${error?.error?.message}`: 'Không tải được dữ liệu PT thanh toán')
      })
  }

  onChangeJournal(event: any) {
    this.isLoading = true;
    this.accountPaymentJsonService.onChangeJournal(event.Id).pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false))
      .subscribe((res: any) => {
          if(res) {
            this.data.Currency = res.Currency;
            this.data.CurrencyId = res.CurrencyId;
            this.data.WriteoffAccountId = res.WriteoffAccountId;
            this.data.PaymentMethodId = res.PaymentMethodId;

            this._form.controls['Journal'].setValue(event);
            this.data.JournalId = event.Id;
          }
      }, error => {
        this.message.error(`${error?.error?.message}`);
      })
  }

  cancel() {
    this.modal.destroy(null);
  }

  onSave(type: string) {
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

    this.isLoading = false;
    this.accountPaymentJsonService.actionCreatePost({model: model}).pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false))
      .subscribe((obs: any) => {

        if(obs && obs.value) {
          this.message.success('Xác nhận thanh toán thành công');
          if(type == 'print') {
              let printer = this.printerService.printUrl(`/AccountPayment/PrintThuChiThuan?id=${obs?.value}`);
              printer.pipe(takeUntil(this.destroy$)).subscribe((a: TDSSafeAny) => {
                  this.printerService.printHtml(a);
              })
          }
        }
      }, error => {
        this.message.error(`${error?.error?.message}`);
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
