
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AccountTaxService } from 'src/app/main-app/services/account-tax.service';
import { map, finalize, concat } from 'rxjs/operators';
import { AccountTaxDTO } from 'src/app/main-app/dto/account/account.dto';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'modal-tax',
  templateUrl: './modal-tax.component.html'
})
export class ModalTaxComponent implements OnInit {

  @Input() currentTax?: AccountTaxDTO;
  @Output() onSuccess = new EventEmitter<AccountTaxDTO>();

  lstTax!: AccountTaxDTO[];
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
    let defaultTax: AccountTaxDTO = { Id: 0, Amount: 0, AmountType: "percent", Name: "Thuế GTGT 0%" } as AccountTaxDTO;
    this.accountTaxService.getTax().pipe(finalize(() => this.isLoading = false)).subscribe(res => {

      this.lstTax = [...res.value];
      this.lstTax.push(defaultTax);

      this.lstTax.sort((preTax, nextTax) => { return preTax.Amount - nextTax.Amount });//TODO: sắp xếp % thuế theo thứ tự tăng dần
    });
  }

  changeTax(event: TDSSafeAny, tax?: AccountTaxDTO) {
    if(event?.checked === true) {
      this.taxSelect = tax;
    }
  }

  onSave() {
    this.message.info(Message.Order.UpdateTax);
    this.modelRef.destroy(this.taxSelect);
  }

  onCannel() {
    this.modelRef.destroy(null);
  }

}
