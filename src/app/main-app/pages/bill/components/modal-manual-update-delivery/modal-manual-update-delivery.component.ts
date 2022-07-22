import { TDSHelperString } from 'tds-ui/shared/utility';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { Message } from './../../../../../lib/consts/message.const';
import { Subject, takeUntil } from 'rxjs';
import { TDSMessageService } from 'tds-ui/message';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { DeliveryCarrierDTOV2 } from './../../../../dto/delivery-carrier.dto';
import { DeliveryCarrierService } from './../../../../services/delivery-carrier.service';
import { FastSaleOrderDTO } from './../../../../dto/saleonlineorder/saleonline-order-red.dto';
import { TDSModalRef } from 'tds-ui/modal';
import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-modal-manual-update-delivery',
  templateUrl: './modal-manual-update-delivery.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalManualUpdateDeliveryComponent implements OnInit, OnDestroy {
  @Input() model!: FastSaleOrderDTO[];

  lstOfData!: FastSaleOrderDTO[];
  lstCarriers: DeliveryCarrierDTOV2[] = [];
  statusAll: any;
  lstShipStatus = [
    { value: 'none', text: 'Chưa tiếp nhận' },
    { value: 'refund', text: 'Hàng trả về' },
    { value: 'other', text: 'Đối soát không thành công' },
    { value: 'sent', text: 'Đã tiếp nhận' },
    { value: 'cancel', text: 'Đã hủy' },
    { value: 'done', text: 'Đã thu tiền' },
    { value: 'done_and_refund', text: 'Đã thu tiền và trả hàng về' }
  ]

  private destroy$ = new Subject<void>();

  constructor(private modal: TDSModalRef,
    private carrierService: DeliveryCarrierService,
    private fastSaleOrderService: FastSaleOrderService,
    private message: TDSMessageService) { }

  ngOnInit(): void {
    this.loadCarrier();
    this.lstOfData = this.model;
  }

  loadCarrier() {
    this.carrierService.get().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.lstCarriers = res.value;
    },
    error => {
      this.message.error(error?.error?.message || Message.CanNotLoadData);
    });
  }

  onInputKeyup(ev:TDSSafeAny){
    if(TDSHelperString.hasValueString(ev.value)){console.log(ev.value)
      this.lstOfData = this.model.filter(f=> f.PartnerDisplayName?.includes(ev.value) || f.Number?.includes(ev.value));
    }else{
      this.lstOfData = this.model;
    }
  }

  onChangeStatus(status: any, data: FastSaleOrderDTO) {
    this.model.map((fso: FastSaleOrderDTO) => {
      if (fso.Id == data.Id) {
        fso.ShowShipStatus = status.text;
        fso.ShipStatus = status.value;
      }
    });
  }

  onChangeCarrier(carrier: DeliveryCarrierDTOV2, data: FastSaleOrderDTO) {
    this.model.map((fso: FastSaleOrderDTO) => {
      if (fso.Id == data.Id) {
        fso.CarrierId = carrier.Id;
        fso.CarrierDeliveryType = carrier.DeliveryType;
        fso.CarrierName = carrier.Name;
      }
    })
  }

  changeStatusForAll(){
    this.lstOfData.map((item)=>{
      item.ShipStatus = this.statusAll;
    })
  }

  prepareModel() {
    let dataModel = this.model.map(f => {
      return {
        AmountTotal: f.AmountTotal,
        Id: f.Id,
        Number: f.Number,
        PartnerName: f.PartnerDisplayName,
        ShipPaymentStatus: f.ShipPaymentStatus,
        ShipStatus: f.ShipStatus
      }
    });

    return dataModel;
  }

  onCancel() {
    this.modal.destroy(null);
  }

  onSave() {
    let model = { model: this.prepareModel() };

    this.fastSaleOrderService.updateStatusDeliveryPayment(model).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.message.success(Message.UpdatedSuccess);
      this.modal.destroy(null);
    },
    error => {
      this.message.error(error?.error?.message || Message.UpdatedFail);
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
