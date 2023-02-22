import { FormBuilder } from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { CustomerDTO } from 'src/app/main-app/dto/partner/customer.dto';
import { fromEvent} from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray, TDSHelperString } from 'tds-ui/shared/utility';
import { TDSModalRef } from 'tds-ui/modal';

@Component({
  selector: 'app-modal-search-partner',
  templateUrl: './modal-search-partner.component.html',
})
export class ModalSearchPartnerComponent implements OnInit {

  @ViewChild('innerText') innerText!: ElementRef;

  lstCustomers!: CustomerDTO[];
  keyFilter!: string;
  page: number = 1;
  limit: number = 20;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder,
    private message: TDSMessageService,
    private partnerService: PartnerService,
    private modal: TDSModalRef) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.isLoading = true;
    this.partnerService.getCustomers(this.page, this.limit, this.keyFilter).subscribe({
      next: (res: any) => {
        if(res?.value && TDSHelperArray.hasListValue(res.value)) {
            this.lstCustomers = [...res.value];
            this.isLoading = false;
        }
      }, 
      error: (error: any) => {
          this.isLoading = false;
          this.message.error('Load danh sách khách hàng đã xảy ra lỗi');
      }
    })
  }

  onSearch() {
    this.keyFilter = this.innerText.nativeElement.value;
    this.keyFilter = TDSHelperString.stripSpecialChars(this.keyFilter.trim());
    this.loadCustomers();
  }

  ngAfterViewInit(): void {
    fromEvent(this.innerText.nativeElement, 'keyup').pipe(
        map((event: any) => {
            return event.target.value
        }), debounceTime(750), distinctUntilChanged()).subscribe((text: string) => {
          this.keyFilter = text;
          this.loadCustomers();
    });
  }

  onCancel() {
    this.modal.destroy(null);
  }

  selectCustomer(event: any): void {
     this.modal.destroy(event);
  }
}
