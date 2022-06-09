import { finalize } from 'rxjs/operators';
import { TDSMessageService } from 'tmt-tang-ui';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TDSModalRef } from 'tmt-tang-ui';
import { AccountRegisterPaymentDTO } from 'src/app/main-app/dto/fastsaleorder/payment.dto';
import { Message } from 'src/app/lib/consts/message.const';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { AccountJournalService } from 'src/app/main-app/services/account-journal.service';
import { AccountJournalDTO } from 'src/app/main-app/dto/account/account.dto';
import { AccountRegisterPaymentService } from 'src/app/main-app/services/account-register-payment.service';

@Component({
  selector: 'modal-payment',
  templateUrl: './modal-payment.component.html'
})
export class ModalPaymentComponent implements OnInit {

  @Input() id!: number[];

  @Output() eventPaymentSuccess = new EventEmitter();

  formPayment!: FormGroup;
  data!: AccountRegisterPaymentDTO;
  isLoading: boolean = false;
  lstAccountJournal: AccountJournalDTO[] = [];

  constructor(
    private message: TDSMessageService,
    private formBuilder: FormBuilder,
    private fastSaleOrderService: FastSaleOrderService,
    private accountJournalService: AccountJournalService,
    private accountRegisterPaymentService: AccountRegisterPaymentService,
    private modalRef: TDSModalRef,
  ) { }

  ngOnInit(): void {
    this.createForm()
    this.loadData(this.id);
    this.loadAccountPayment();
  }

  loadData(id: number[]) {
    this.fastSaleOrderService.getRegisterPaymentV2({ids: id}).subscribe(res => {
      this.data = res;
      this.updateForm(res);
    }, error => {
      this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
    });
  }

  loadAccountPayment(){
    this.accountJournalService.getWithCompanyPayment().subscribe(res => {
      this.lstAccountJournal = res?.value;
    });
  }

  createForm() {
    this.formPayment = this.formBuilder.group({
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

    this.formPayment.controls['Name'].setValue(data.Partner?.DisplayName || data.Partner?.Name);
    this.formPayment.patchValue(data);
  }

  onChangeJournal(data: AccountJournalDTO) {
    this.data.Journal = data;

    this.isLoading = true;
    this.accountRegisterPaymentService.onchangeJournal({model: this.data})
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.data.PaymentMethodId = res?.PaymentMethodId;
      }, error => {
        this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
      });
  }

  onSave() {
    if(this.isCheckValue() === 1) {
      this.prepareModel();
      this.isLoading = true;

      this.accountRegisterPaymentService.insertV2(this.data)
        .subscribe(res => {
          this.createPayment(res);
        }, error => {
          this.isLoading = false;
          this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
        });
    }
  }

  createPayment(data: AccountRegisterPaymentDTO) {
    this.accountRegisterPaymentService.createPayment({id: data.Id})
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.eventPaymentSuccess.emit(res);
        this.message.success(Message.Bill.PaymentSuccess);
      }, error => {
        this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
      });
  }

  isCheckValue() {
    let formValue = this.formPayment.value;

    if(!formValue.JournalId || !formValue.Journal) {
      this.message.error(Message.LiveCampaign.MethodPaymentEmpty);
      return 0;
    }

    return 1;
  }

  prepareModel() {
    let formValue = this.formPayment.value;

    this.data.Amount = formValue.Amount;
    this.data.Communication = formValue.Communication;
    this.data.JournalId = formValue.Journal.Id;
    this.data.PaymentDate = formValue.PaymentDate;
  }

  onCancel() {
    this.modalRef.destroy();
  }

}
