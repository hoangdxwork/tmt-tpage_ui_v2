import { fastSaleOrderBillofPartnerDTO, BillofPartnerDTO } from './../../../../dto/conversation-bill/conversation-bill.dto';
import { Subject } from 'rxjs';
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

  paymentMethodOptions: TDSSafeAny;
  lstBillofPartner: TDSSafeAny;
  pageCurrent = 1;
  partnerId!: number;
  datas: any[] = [];
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
    private fastSaleOrderService: FastSaleOrderService
    ) { }

  ngOnInit(): void {
    this.commonService.shopPaymentProviders$.subscribe(res => {
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

    this.partnerService.checkInfo(model).subscribe((res) => {
      if (res.Data && res.Data["Id"]) {
        this.partnerId = res.Data["Id"];
        this.nextData(null);
      }
    });
  }

  cancel(){
    this.modal.destroy(null)
  }

  getColorStatusText(status: string): TDSTagStatusType {
    switch(status) {
      case "Đã xác nhận":
        return "success";
      case "Nháp":
        return "secondary";
      default :
        return "error";
    }
  }

  showModalDetailBill(id: string){
    const modal = this.modalService.create({
      title: `Hóa đơn [${id}]`,
      content: ModalDetailBillComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'xl',
      componentParams: {
        itemId : id,
      }
    });
    // Return a result when closed
    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
      }
    });
  }

  nextData(event: any) {
    var model = {
      Page: this.pageCurrent,
      Limit: 10,
      PartnerId: this.partnerId,
    }

    this.fastSaleOrderService.getMappings(model).subscribe((res: fastSaleOrderBillofPartnerDTO) => {
      res.Items.forEach((item: BillofPartnerDTO) => {
        item.PaymentMethod = this.paymentMethodOptions[0] ? this.paymentMethodOptions[0].Text : null;
        this.datas.push(item);
      });

      this.lstBillofPartner = [...this.datas];
      if(res.TotalCount != 0) {
        this.pageCurrent++;
      }
    })
  }

  selectPayment(index: number, value: string){
    this.lstBillofPartner[index].PaymentMethod = value;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
