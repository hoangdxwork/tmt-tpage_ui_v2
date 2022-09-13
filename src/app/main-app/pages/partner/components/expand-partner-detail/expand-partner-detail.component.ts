import { CommonService } from 'src/app/main-app/services/common.service';
import { PartnerStatusDTO } from './../../../../dto/partner/partner.dto';
import { finalize, takeUntil } from 'rxjs';
import { Message } from './../../../../../lib/consts/message.const';
import { ModalPaymentComponent } from '../modal-payment/modal-payment.component';
import { Component, OnInit, Input, ViewContainerRef, ChangeDetectorRef, AfterViewInit, HostListener, Inject } from '@angular/core';
import { OdataPartnerService } from 'src/app/main-app/services/mock-odata/odata-partner.service';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { PartnerInvoiceDTO } from 'src/app/main-app/dto/partner/partner-invocie.dto';
import { CreditDebitDTO } from 'src/app/main-app/dto/partner/partner-creditdebit.dto';
import { TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSTableQueryParams } from 'tds-ui/table';
import { Router } from '@angular/router';
import { TDSDestroyService } from 'tds-ui/core/services';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'expand-partner-detail',
  templateUrl: './expand-partner-detail.component.html',
  providers: [TDSDestroyService]
})

export class ExpandPartnerDetailComponent implements OnInit, AfterViewInit {

  @Input() dataPartner: any = {};

  lstCreditDebit: Array<CreditDebitDTO> = [];
  pageSize1 = 20;
  pageIndex1 = 1;
  pageSize2 = 20;
  pageIndex2 = 1;
  isLoading: boolean = false;
  countDebit: number = 1;
  lstPartnerStatus!: Array<PartnerStatusDTO>;
  lstInvocie: Array<PartnerInvoiceDTO> = [];
  countInvocie: number = 1;
  revenues: any = {};

  constructor(private modalService: TDSModalService,
    private odataPartnerService: OdataPartnerService,
    private partnerService: PartnerService,
    private cdrRef: ChangeDetectorRef,
    private message: TDSMessageService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private destroy$: TDSDestroyService,
    private viewContainerRef: ViewContainerRef,
    private commonService: CommonService) {
  }

  ngOnInit(): void {
    this.partnerService.getPartnerRevenueById(this.dataPartner.Id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
            this.revenues = res;
        },
        error: (error: any) => {
            this.message.error(`${error?.error?.message}`)
        }
    })

    this.loadPartnerStatus();
  }

  getResizeExpand() {
    let element = this.document.getElementById(`expand[${this.dataPartner.Id}]`) as any;
    if(element) {
        let containerTable = element.closest('.tds-table-container') as any;
        let containerExpand = element.closest('.tds-custom-scroll') as any;
        let wrapView = Number(containerTable.clientWidth - 36);
        element.setAttribute('style', `width: ${wrapView}px; margin-left: ${Number(containerExpand.scrollLeft) + 2}px;`);

        let scrollTable = element.closest('.tds-custom-scroll');
        if(element && scrollTable) {
          scrollTable.addEventListener('scroll', function() {
              let scrollleft = Number(scrollTable.scrollLeft);
              let wrapScroll = Number(scrollTable.clientWidth - 24);

              element.setAttribute('style', `margin-left: ${scrollleft}px; width: ${wrapScroll}px;`)
          });
        }
    }

    this.cdrRef.detectChanges();
  }

  loadInvoice(partnerId: number, pageSize: number, pageIndex: number) {
    this.isLoading = true;
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex);

    this.odataPartnerService.getInvoicePartner(partnerId, params).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {

          this.countInvocie = res['@odata.count'];
          this.lstInvocie = [...res.value];

          this.isLoading = false
          this.cdrRef.markForCheck();
        },
        error: (error: any) => {
          this.isLoading = false
          this.message.error(error.error?.message);
        }
    })
  }

  loadPartnerStatus() {
    this.commonService.getPartnerStatus().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
            this.lstPartnerStatus = [...res];
        },
        error: (error: any) => {
            this.message.error(error.error.message || 'Tải trạng thái khách hàng lỗi');
        }
    });
  }

  loadCreditDebit(partnerId: number, pageSize: number, pageIndex: number) {
    this.isLoading = true;

    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex);
    this.odataPartnerService.getCreditDebitPartner(partnerId, params).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {

        this.countDebit = res['@odata.count'];
        this.lstCreditDebit = [...res.value];
        this.isLoading = false;
        this.cdrRef.markForCheck();
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
    this.partnerService.getRegisterPaymentPartner({id: this.dataPartner.Id}).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          delete res['@odata.context'];

          this.modalService.create({
              title: 'Đăng ký thanh toán',
              content: ModalPaymentComponent,
              size: "lg",
              viewContainerRef: this.viewContainerRef,
              componentParams:{
                dataModel : res
              }
          });
      },
      error: (error: any) => {
          this.message.error(`${error?.error.message}`)
      }
    })
  }

  checkStatus(data: string){
    switch(data){
      case 'Đã thanh toán':
        return 'success'
      case 'Đã xác nhận':
        return 'info'
      case 'Nháp':
        return 'secondary'
      default:
        return 'error'
    }
  }

  selectStatus(status: PartnerStatusDTO) {
    if(this.dataPartner.Id) {
      let data = {
        status: `${status.value}_${status.text}`
      }

      this.partnerService.updateStatus(this.dataPartner.Id, data).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            this.message.success(Message.Partner.UpdateStatus);
            this.dataPartner.StatusText = status.text;
        },
        error: (err: any) => {
          this.message.error(err.error? err.error.message: 'Cập nhật trạng thái thất bại');
        }
      });
    }
    else {
      this.message.error(Message.PartnerNotInfo);
    }
  }

  getStatusColor(statusText: string | undefined) {
    if(TDSHelperArray.hasListValue(this.lstPartnerStatus)) {
      let value = this.lstPartnerStatus.find(x => x.text == statusText);
      if(value) return value.value;
      else return '#e5e7eb';
    }
    else return '#e5e7eb';
  }

  onView(data: any) {
    this.router.navigateByUrl(`bill/detail/${data.Id}`);
  }

  ngAfterViewInit() {
    this.getResizeExpand();
  }

}
