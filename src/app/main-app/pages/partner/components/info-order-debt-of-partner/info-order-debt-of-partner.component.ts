import { ModalPaymentComponent } from './../modal-payment/modal-payment.component';
import { TDSModalService, TDSHelperObject, TDSSafeAny, TDSTableQueryParams, TDSMessageService } from 'tmt-tang-ui';
import { Component, OnInit, Input, ViewContainerRef, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { OdataPartnerService } from 'src/app/main-app/services/mock-odata/odata-partner.service';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';

interface orderDTO{
  code: string;
  createdDate: string;
  type: string;
  creator: string;
  source: string;
  status: number;
  totalPrice: number;
}
interface debtDetailDTO{
  date: string,
  invoiceVoucher: string;
  debt: number
}
interface infoPartnerDto {
  code: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  birthday: string;
  facebook: string;
  zalo:string;
  groupPartner: string;
  codeTax: string;
  status: number;
  saleFirst: number;
  sale: number;
  totalSale: number
}

@Component({
  selector: 'app-info-order-debt-of-partner',
  templateUrl: './info-order-debt-of-partner.component.html',
  styleUrls: ['./info-order-debt-of-partner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class InfoOrderDebtOfPartnerComponent implements OnInit {

  lstCreditDebit: Array<TDSSafeAny> = [];
  pageSize1 = 20;
  pageIndex1 = 1;
  pageSize2 = 20;
  pageIndex2 = 1;
  isLoading: boolean = false;
  countDebit: number = 1;

  lstInvocie: Array<TDSSafeAny> = [];
  countInvocie: number = 1;
  revenues: any = {};

  @Input() dataPartner: any = {};

  constructor(private modalService: TDSModalService,
    private odataPartnerService: OdataPartnerService,
    private partnerService: PartnerService,
    private cdr: ChangeDetectorRef,
    private message: TDSMessageService,
    private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit(): void {
    this.partnerService.getPartnerRevenueById(this.dataPartner.Id).subscribe((res: TDSSafeAny) => {
      this.revenues = res;
    }, error => {
       this.message.error('Load doanh số đã xảy ra lỗi!')
    })
  }

  loadInvoice(partnerId: number, pageSize: number, pageIndex: number) {
    this.isLoading = true;
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex);
    this.odataPartnerService.getInvoicePartner(partnerId, params).subscribe((res: any) => {

        this.countInvocie = res['@odata.count'];
        this.lstInvocie = res.value;
        this.isLoading = false;
        this.cdr.markForCheck();
    })
  }

  loadCreditDebit(partnerId: number, pageSize: number, pageIndex: number) {
    this.isLoading = true;

    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex);
    this.odataPartnerService.getCreditDebitPartner(partnerId, params).subscribe((res: any) => {

        this.countDebit = res['@odata.count'];
        this.lstCreditDebit = res.value;
        this.isLoading = false;
        this.cdr.markForCheck();
    })
  }

  refreshCreditDebit() {
    this.pageIndex1 = 1;
    this.loadCreditDebit(this.dataPartner.Id, this.pageSize1, this.pageIndex1 );
  }

  onQueryParamsChangeCreditDebit(params: TDSTableQueryParams) {
    if(this.dataPartner.Id) {
      this.loadCreditDebit(this.dataPartner.Id, params.pageSize, params.pageIndex);
    }
  }

  refreshInvoice() {
    this.pageIndex2 = 1;
    this.loadInvoice(this.dataPartner.Id, this.pageSize2, this.pageIndex2 );
  }

  onQueryParamsChangeInvocie(params: TDSTableQueryParams) {
    if(this.dataPartner.Id) {
      this.loadInvoice(this.dataPartner.Id, params.pageSize, params.pageIndex);
    }
  }

  showModalPayment(){
    this.partnerService.getRegisterPaymentPartner({id: this.dataPartner.Id}).subscribe((res: any) => {
       if(res) {
        delete res['@odata.context'];
        this.modalService.create({
            title: 'Đăng ký thanh toán',
            content: ModalPaymentComponent,
            size: "lg",
            viewContainerRef: this.viewContainerRef,
            componentParams:{
              data : res
            }
        });
       }
    }, error => {
      this.message.error(`${error?.error.message}`)
    })
  }
}
