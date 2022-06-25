import { ConversationDataFacade } from './../../../../services/facades/conversation-data.facade';
import { ActivityDataFacade } from './../../../../services/facades/activity-data.facade';
import { ActivityStatus } from './../../../../../lib/enum/message/coversation-message';
import { TDSMessageService } from 'tds-ui/message';
import { Subject, finalize, takeUntil } from 'rxjs';
import { FastSaleOrder_DefaultDTOV2 } from './../../../../dto/fastsaleorder/fastsaleorder-default.dto';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { ModalConfirmPaymentComponent } from './../modal-confirm-payment/modal-confirm-payment.component';
import { ModalConfirmShippingAddressComponent } from './../modal-confirm-shipping-address/modal-confirm-shipping-address.component';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSHelperObject, TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-modal-detail-bill',
  templateUrl: './modal-detail-bill.component.html'
})
export class ModalDetailBillComponent implements OnInit {

  @Input() itemId : any;
  data!: FastSaleOrder_DefaultDTOV2;
  isLoading: boolean = false;
  addressShip!: string;
  enumActivityStatus = ActivityStatus;

  private destroy$ = new Subject<void>();
  constructor(
    private modal: TDSModalRef,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private fastSaleOrderService: FastSaleOrderService,
    private message: TDSMessageService,
    private activityDataFacade: ActivityDataFacade,
    private conversationDataFacade: ConversationDataFacade
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.isLoading = true
    this.fastSaleOrderService.getById(this.itemId).pipe(takeUntil(this.destroy$)).pipe(finalize(()=>{this.isLoading = false}))
    .subscribe((res: FastSaleOrder_DefaultDTOV2) => {
      this.data = res;
      this.addressShip = this.getFullAddress(this.data);
    })
  }

  getFullAddress(data: any) {
    if(data.Ship_Receiver) {
      let street = data.Ship_Receiver.Street ? data.Ship_Receiver.Street + ', ' : '';
      let ward = data.Ship_Receiver.Ward.name ? data.Ship_Receiver.Ward.name + ', ' : '';
      let district = data.Ship_Receiver.District.name ? data.Ship_Receiver.District.name + ', ' : '';
      let city = data.Ship_Receiver.City.name ? data.Ship_Receiver.City.name : '';
      if(data.Ship_Receiver) {
        return street + ward + district + city;
      }
    }

    return '';
  }

  cancel(){
    this.modal.destroy(null)
  }

  onSave(){
    if(this.isLoading){
      return
    }
    if(this.data.PaymentMethod == null) {
      this.message.error("Vui lòng chọn phương thức thanh toán.");
      return
    }
    if(this.data.ShowState != "Đã xác nhận") {
      this.message.error("Chỉ được gửi yêu cầu cho đơn hàng đã xác nhận.");
      return
    }
    this.isLoading = true;
    var model = [];

    var item = {
      Id: this.data.Id,
      Number: this.data.Number,
      PaymentMethod: this.data.PaymentMethod,
      AmountTotal: this.data.AmountTotal,
      PartnerId: this.data.PartnerId,
      TeamId: this.data.TeamId ? this.data.TeamId : 0,
      Note: this.data.DeliveryNote
    }
    model.push(item);

    this.fastSaleOrderService.sendPaymentRequest(model).pipe(takeUntil(this.destroy$)).pipe(finalize(()=>{ this.isLoading = false }))
    .subscribe((res: any) => {
      if(res[0]) {
        if(res[0].Status == "Success") {
          this.message.success("Gửi thành công.");
          res[0].data.forEach((x: TDSSafeAny) => {
            x["status"] = this.enumActivityStatus.sending;
            this.activityDataFacade.messageServer(x);
          });
          if(res && res[0] && res[0].data ) {
            this.conversationDataFacade.messageServer(res[0].data[0]);
          }
          this.modal.destroy(res[0].data);
        } else {
          this.message.error(res[0].Message);
        }
      }
    }, error => {
      this.message.error(error.error? error.error.message : 'Gửi yêu cầu thất bại')
    })
  }

  showModalConfirmShippingAddress(data: FastSaleOrder_DefaultDTOV2){
    const modal = this.modalService.create({
      title: 'Xác nhận địa chỉ giao hàng',
      content: ModalConfirmShippingAddressComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'lg',
      componentParams: {
        data: data
      }
    });
    modal.afterOpen.subscribe(() => {

    });
    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
        this.data = result
      }
    });
  }

  showModalConfirmPayment(data: FastSaleOrder_DefaultDTOV2){
    const modal = this.modalService.create({
      title: 'Xác nhận phương thức thanh toán',
      content: ModalConfirmPaymentComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'lg',
      componentParams: {
        data: data
      }
    });
    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
        this.data = result
      }
    });
  }
    
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
