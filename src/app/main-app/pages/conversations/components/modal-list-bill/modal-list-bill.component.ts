import { TDSHelperString } from 'tds-ui/shared/utility';
import { CRMTeamService } from './../../../../services/crm-team.service';
import { GenerateMessageTypeEnum } from './../../../../dto/conversation/message.dto';
import { SendMessageComponent } from './../../../../shared/tpage-send-message/send-message.component';
import { fastSaleOrderBillofPartnerDTO, BillofPartnerDTO, paymentMethodDTO } from './../../../../dto/conversation-bill/conversation-bill.dto';
import { Subject, takeUntil, finalize } from 'rxjs';
import { FastSaleOrderService } from './../../../../services/fast-sale-order.service';
import { CommonService } from './../../../../services/common.service';
import { PartnerService } from './../../../../services/partner.service';
import { TDSMessageService } from 'tds-ui/message';
import { ModalDetailBillComponent } from './../modal-detail-bill/modal-detail-bill.component';
import { Component, Input, OnInit, Output, ViewContainerRef, EventEmitter } from '@angular/core';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSTagStatusType } from 'tds-ui/tag';
import { TDSHelperObject, TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-modal-list-bill',
  templateUrl: './modal-list-bill.component.html'
})
export class ModalListBillComponent implements OnInit {
  @Input() page_id!: string;
  @Input() psid!: string;
  @Output()
  public onFSOrderSelected = new EventEmitter<any>();
  @Output()
  public sendPaymentRequest = new EventEmitter<any>();
  @Output()
  public getOrderImageUrl = new EventEmitter<string>();

  paymentMethodOptions!: paymentMethodDTO[];
  lstBillofPartner!: BillofPartnerDTO[];
  lstBillDeafault!: BillofPartnerDTO[];
  pageCurrent = 1;
  pageCurrentOld = 0; 
  partnerId!: number;
  datas: BillofPartnerDTO[] = [];
  searchSelect: string = "";
  searchText: string = "";
  isLoading: boolean = false;
  public sortOptions: any[] = [
    { value: "", text: "Tất cả" },
    { value: "Đã thanh toán", text: "Đã thanh toán" },
    { value: "Đã xác nhận", text: "Đã xác nhận" },
    { value: "Nháp", text: "Nháp" },
    { value: "Hủy", text: "Hủy" }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private modal: TDSModalRef,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private message: TDSMessageService,
    private partnerService: PartnerService,
    private commonService: CommonService,
    private fastSaleOrderService: FastSaleOrderService,
    private teamService: CRMTeamService
    ) { }

  ngOnInit(): void {
    this.commonService.shopPaymentProviders$.pipe(takeUntil(this.destroy$)).subscribe((res : paymentMethodDTO[]) => {
      this.paymentMethodOptions = res;
    });
    this.createModal();
  }

  createModal() {
    this.lstBillofPartner = [];
    this.datas = [];
    this.pageCurrent = 1;
    let model = {
      UserId:  this.psid,
      PageId: this.page_id
    }

    this.partnerService.checkInfo(model).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res.Data && res.Data["Id"]) {
        this.partnerId = res.Data["Id"];
        this.nextData(null);
      }
    });
  }

  cancel(){
    this.modal.destroy(null)
  }

  showModalDetailBill(data : BillofPartnerDTO){
    const modal = this.modalService.create({
      title: `Hóa đơn [${data.Number}]`,
      content: ModalDetailBillComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'xl',
      componentParams: {
        itemId : data.Id,
      }
    });
    // Return a result when closed
    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
        this.outputLoadMessage(result);
      }
    });
  }

  nextData(event: TDSSafeAny) {
    let model = {
      Page: this.pageCurrent,
      Limit: 10,
      PartnerId: this.partnerId,
    }
    if(this.pageCurrentOld == this.pageCurrent)
      return
    this.isLoading = true
    this.pageCurrentOld = this.pageCurrent;
    this.fastSaleOrderService.getMappings(model).pipe(takeUntil(this.destroy$)).pipe(finalize(()=>{this.isLoading = false}))
    .subscribe((res: fastSaleOrderBillofPartnerDTO) => {
      res.Items.forEach((item: BillofPartnerDTO) => {
        item.PaymentMethod = this.paymentMethodOptions[0] ? this.paymentMethodOptions[0].Text : '';
        this.datas.push(item);
      });
      this.lstBillofPartner = [...this.datas];
      this.lstBillDeafault = [...this.datas];
      if(TDSHelperString.hasValueString(this.searchSelect)){
        this.switchSort(this.searchSelect);
      }
      if(TDSHelperString.hasValueString(this.searchText)){
        this.searchBill();
      }
      if(res.TotalCount != 0) {
        this.pageCurrent++;
      }
    })
  }

  switchSort(value: string) {
    this.searchSelect = value;
    let data = this.lstBillDeafault;
    let key = this.searchSelect;
    if (TDSHelperString.hasValueString(key)) {
      key = TDSHelperString.stripSpecialChars(key.trim());
    }
    data = data.filter((x) =>
      (x.ShowState && TDSHelperString.stripSpecialChars(x.ShowState.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(key.toLowerCase())) !== -1))
    this.lstBillofPartner = data
    return data
  }

  searchBill(){
    let data = TDSHelperString.hasValueString(this.searchSelect)? this.switchSort(this.searchSelect): this.lstBillDeafault;
    let key = this.searchText;
    if (TDSHelperString.hasValueString(key)) {
      key = TDSHelperString.stripSpecialChars(key.trim());
    }
    data = data.filter((x) =>
      (x.Number && TDSHelperString.stripSpecialChars(x.Number.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(key.toLowerCase())) !== -1))
    this.lstBillofPartner = data
    return data
  }

  selectPayment(index: number, value: string){
    this.lstBillofPartner[index].PaymentMethod = value;
  }

  outputLoadMessage(data: any) {
    data.forEach((e: TDSSafeAny) => {
      this.sendPaymentRequest.emit(e);
    });
  }

  showModalSendMessage(data:BillofPartnerDTO){
    this.modalService.create({
      title: 'Gửi tin nhắn nhanh',
      content: SendMessageComponent,
      size: 'lg',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        selectedUsers: [data.Id],
        messageType: GenerateMessageTypeEnum.Bill
      }
    });
  }

  confirmSubmit(data: BillofPartnerDTO) {
    if(this.isLoading){
      return
    }
    if(data.PaymentMethod == null) {
      this.message.error("Vui lòng chọn phương thức thanh toán.");
      return
    }
    if(data.ShowState != "Đã xác nhận") {
      this.message.error("Chỉ được gửi yêu cầu cho đơn hàng đã xác nhận.");
      return
    } 
    var model = [];
    this.isLoading = true
    var payment = this.paymentMethodOptions.filter(x => x.Text == data.PaymentMethod);
    var item = {
      Id: data.Id,
      Number: data.Number,
      PaymentMethod: payment[0] ? payment[0].Value : null,
      AmountTotal: data.AmountTotal,
      PartnerId: data.PartnerId ? data.PartnerId : 0,
      TeamId: data.TeamId ? data.TeamId : 0,
      Note: data.DeliveryNote
    }
    model.push(item);

    this.fastSaleOrderService.sendPaymentRequest(model).pipe(takeUntil(this.destroy$)).pipe(finalize(()=>{ this.isLoading = false }))
    .subscribe((res: any) => {
      if(res[0]) {
        if(res[0].Status == "Success") {
          this.message.success("Gửi thành công.");
          this.modal.destroy(res[0].data);
        } else {
          this.message.error(res[0].Message);
        }
      }
    }, error => {
      this.message.error(error.error? error.error.message:'Gửi yêu cầu thất bại');
    })
  }

  onSendImage(data: BillofPartnerDTO){
    this.fastSaleOrderService.getOrderHtmlToImage(data.Id).pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.getOrderImageUrl.emit(res);
    },err=>{
      this.message.error(err.error? err.error.message: 'Gửi hình ảnh thất bại')
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
