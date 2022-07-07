import { CommonService } from 'src/app/main-app/services/common.service';
import { PartnerStatusDTO } from './../../../../dto/partner/partner.dto';
import { finalize } from 'rxjs';
import { Message } from './../../../../../lib/consts/message.const';
import { ModalPaymentComponent } from '../modal-payment/modal-payment.component';
import { Component, OnInit, Input, ViewContainerRef, ChangeDetectorRef, AfterViewInit, HostListener } from '@angular/core';
import { OdataPartnerService } from 'src/app/main-app/services/mock-odata/odata-partner.service';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { PartnerInvoiceDTO } from 'src/app/main-app/dto/partner/partner-invocie.dto';
import { CreditDebitDTO } from 'src/app/main-app/dto/partner/partner-creditdebit.dto';
import { ODataRegisterPartnerDTO } from 'src/app/main-app/dto/partner/partner-register-payment.dto';
import { TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSTableQueryParams } from 'tds-ui/table';
import { Router } from '@angular/router';

@Component({
  selector: 'expand-partner-detail',
  templateUrl: './expand-partner-detail.component.html'
})

export class ExpandPartnerDetailComponent implements OnInit, AfterViewInit {

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

  @Input() dataPartner: any = {};

  constructor(private modalService: TDSModalService,
    private odataPartnerService: OdataPartnerService,
    private partnerService: PartnerService,
    private cdr: ChangeDetectorRef,
    private message: TDSMessageService,
    private router: Router,
    private viewContainerRef: ViewContainerRef,
    private commonService: CommonService) {
  }

  ngOnInit(): void {
    this.partnerService.getPartnerRevenueById(this.dataPartner.Id).subscribe((res: TDSSafeAny) => {
      this.revenues = res;
    }, error => {
       this.message.error('Load doanh số đã xảy ra lỗi!')
    })
    this.loadPartnerStatus();
  }

  loadInvoice(partnerId: number, pageSize: number, pageIndex: number) {
    this.isLoading = true;
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex);
    this.odataPartnerService.getInvoicePartner(partnerId, params).pipe(finalize(()=>{ this.isLoading = false }))
    .subscribe((res: any) => {
        this.countInvocie = res['@odata.count'];
        this.lstInvocie = [...res.value];
        this.cdr.markForCheck();
    },err=>{
      this.message.error(err.error? err.error.message: Message.CanNotLoadData);
    })
  }

  loadPartnerStatus() {
    this.commonService.getPartnerStatus().subscribe(res => {
      this.lstPartnerStatus = [...res];
    },err=>{
      this.message.error(err.error? err.error.message: 'Tải trạng thái khách hàng lỗi');
    });
  }

  loadCreditDebit(partnerId: number, pageSize: number, pageIndex: number) {
    this.isLoading = true;

    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex);
    this.odataPartnerService.getCreditDebitPartner(partnerId, params).subscribe((res: any) => {

        this.countDebit = res['@odata.count'];
        this.lstCreditDebit = [...res.value];
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
    this.partnerService.getRegisterPaymentPartner({id: this.dataPartner.Id}).subscribe((res) => {
        if(res) {
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
       }
    }, error => {
      this.message.error(`${error?.error.message}`)
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
      this.partnerService.updateStatus(this.dataPartner.Id, data).subscribe(res => {
        this.message.success(Message.Partner.UpdateStatus);
        this.dataPartner.StatusText = status.text;
      },err=>{
        this.message.error(err.error? err.error.message: 'Cập nhật trạng thái thất bại');
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
  }
}
