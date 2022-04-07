import { AccountDTO } from './../../../../dto/account/account.dto';
import { da } from 'date-fns/locale';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { TDSHelperObject, TDSMessageService, TDSModalRef, TDSSafeAny } from 'tmt-tang-ui';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { AccountRegisterPaymentService } from 'src/app/main-app/services/account-register-payment.service';
import { PrinterService } from 'src/app/main-app/services/printer.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ODataRegisterPartnerDTO } from 'src/app/main-app/dto/partner/partner-register-payment.dto';

@Component({
  selector: 'app-modal-payment',
  templateUrl: './modal-payment.component.html',
  styleUrls: ['./modal-payment.component.scss']
})
export class ModalPaymentComponent implements OnInit {

  @Input() data!: ODataRegisterPartnerDTO;

  isProcessing: boolean = false;
  lstAcJournal: any = [];
  acJournal: any = {};

  modelForm: any = {
    acJournal: {},
    amount: 0,
    paymentDate: new Date(),
    communication: null
  }

  private _destroy = new Subject<void>();

  constructor(private modal: TDSModalRef,
    private message: TDSMessageService,
    private printerService: PrinterService,
    private registerPaymentService: AccountRegisterPaymentService,
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
    if(this.data) {
      this.registerPaymentService.getWithCompanyPayment().subscribe((res: any) => {
          this.lstAcJournal = res.value;
          this.modelForm.acJournal = res.value[0];
      });

      this.modelForm.amount = this.data.Amount;
    }
  }

  onChangeAcJournal(event: any) {
    let exits =  this.lstAcJournal.filter((x: any) => x.Id === event)[0];
    if(exits) {
      this.modelForm.acJournal = exits;
    }
  }

  calendarChange(event: any) {
    this.modelForm.paymentDate = event;
  }

  changeAmount(event: any) {
    this.modelForm.amount = event as number;
  }

  cancel() {
    this.modal.destroy(null);
  }

  onSave(type: string) {
    let that = this;
    if (this.isProcessing) {
      return
    }
    if(!TDSHelperObject.hasValue(this.modelForm.acJournal)) {
        this.message.error('Vui lòng chọn phương thức thanh toán!')
    }

    delete this.data['@odata.context'];

    this.data.Amount = this.modelForm.amount;
    this.data.PaymentDate = this.modelForm.paymentDate;
    this.data.Communication = this.modelForm.communication;
    this.data.JournalId = this.modelForm.acJournal.Id;
    this.data.Journal = this.modelForm.acJournal;
    this.data.PaymentMethodId = this.modelForm.acJournal.Id;

    this.registerPaymentService.insert(this.data).subscribe((res: any) => {
      let model = {
        id: res.Id
      }

      this.registerPaymentService.createPayment(model).subscribe((x: any) => {
        let obs: TDSSafeAny;

        if(type == 'print') {
            obs =  this.printerService.printUrl(`/AccountPayment/PrintThuChiThuan?id=${x.value}`)
        }
        if (TDSHelperObject.hasValue(obs)) {
            obs.pipe(takeUntil(this._destroy)).subscribe((res: TDSSafeAny) => {
              that.printerService.printHtml(res);
              that.isProcessing = false;
            })
        }
        this.message.success('Thanh toán thành công!');
        this.modal.destroy(null);
      }, error => {
        this.modal.destroy(null);
        // this.message.error(`${error?.error.message}`)
      })

    }, error => {
      this.modal.destroy(null);
      this.message.error('Thanh toán đã xảy ra lỗi!');
    })
  }
}
