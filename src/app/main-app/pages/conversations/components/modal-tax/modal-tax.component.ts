import { TDSMessageService, TDSSafeAny } from 'tmt-tang-ui';
import { TDSHelperArray, TDSModalRef } from 'tmt-tang-ui';
import { Observable } from 'rxjs';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AccountTaxService } from 'src/app/main-app/services/account-tax.service';
import { map, finalize } from 'rxjs/operators';
import { AccountTaxDTO } from 'src/app/main-app/dto/account/account.dto';
import { Message } from 'src/app/lib/consts/message.const';

@Component({
  selector: 'modal-tax',
  templateUrl: './modal-tax.component.html'
})
export class ModalTaxComponent implements OnInit {

  @Input() currentTax?: AccountTaxDTO;
  @Output() onSuccess = new EventEmitter<AccountTaxDTO>();

  lstTax: AccountTaxDTO[] = [];
  isLoading: boolean = false;
  taxSelect?: AccountTaxDTO;

  constructor(
    private modelRef: TDSModalRef,
    private message: TDSMessageService,
    private accountTaxService: AccountTaxService
  ) { }

  ngOnInit(): void {
    this.taxSelect = this.currentTax;
    this.loadTax();
  }

  loadTax() {
    this.isLoading = true;
    this.accountTaxService.getTax().pipe(finalize(() => this.isLoading = false)).subscribe(res => {
      this.lstTax = res.value;
    });
  }

  changeTax(event: TDSSafeAny, tax?: AccountTaxDTO) {
    if(event?.checked === true) {
      this.taxSelect = tax ? Object.assign({}, tax) : undefined;
    }
    else {
      this.taxSelect = undefined;
    }
  }

  onSave() {
    this.onSuccess.emit(this.taxSelect);
    this.message.info(Message.Order.UpdateTax);
    this.onCannel();
  }

  onCannel() {
    this.modelRef.destroy(null);
  }

}
