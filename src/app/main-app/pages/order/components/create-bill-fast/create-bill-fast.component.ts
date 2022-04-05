import { FormGroup, FormBuilder } from '@angular/forms';
import { DeliveryCarrierService } from 'src/app/main-app/services/delivery-carrier-order.service';
import { TDSModalService, TDSSafeAny, TDSModalRef, TDSHelperString, TDSMessageService } from 'tmt-tang-ui';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { Message } from 'src/app/lib/consts/message.const';
import { CreateBillFastErrorComponent } from '../create-bill-fast-error/create-bill-fast-error.component';

@Component({
  selector: 'create-bill-fast',
  templateUrl: './create-bill-fast.component.html'
})
export class CreateBillFastComponent implements OnInit {

  @Input() ids: string[] = [];

  formCreateBillFast!: FormGroup;
  lstData!: TDSSafeAny[];
  lstCarriers: Array<TDSSafeAny> = [];

  constructor(
    private fb: FormBuilder,
    private message: TDSMessageService,
    private viewContainerRef: ViewContainerRef,
    private modal: TDSModalService,
    private modalRef: TDSModalRef,
    private fastSaleOrderService: FastSaleOrderService,
    private carrierService: DeliveryCarrierService
  ) { }

  ngOnInit(): void {
    this.createForm();

    this.loadCarrier();

    this.loadData();
  }

  loadData() {
    this.fastSaleOrderService.getListOrderIds({ids:this.ids}).subscribe(res => {
      this.lstData = res.value;
      console.log(this.lstData);
    });
  }

  loadCarrier() {
    this.carrierService.get().subscribe(res => {
      this.lstCarriers = res.value;
    });
  }

  onChangeCarrier(event: TDSSafeAny, item: TDSSafeAny) {
    item.CarrierId = event.Id;
    item.CarrierName = event.Name;

    if (event.Config_DefaultFee) {
      item.DeliveryPrice = item.Config_DefaultFee;
    }

    if (event.Config_DefaultWeight) {
      item.ShipWeight = item.Config_DefaultWeight;
    }
  }

  createForm() {
    this.formCreateBillFast = this.fb.group({
      carrier: [null],
      amountTotal: [null],
      isPromotion: [false],
      isPrintShip: [false],
      isPrint: [false],
    });
  }

  onEdit(id: any) {

  }

  onEditLine(lineId: any) {

  }

  onSave(confirm?: string) {
    let model = {
      is_approve: TDSHelperString.hasValueString(confirm) ? true : false,
      model: this.lstData,
    };

    this.fastSaleOrderService.insertListOrderModel(model).subscribe(res => {
      if (!res.Error) {
        this.message.success(Message.Bill.InsertSuccess);

        let isPrint = this.formCreateBillFast.controls["isPrint"].value;
        let isPrintShip = this.formCreateBillFast.controls["isPrint"].value;

        if(isPrint == true) {
          // TODO: in
        }
        else if(isPrintShip == true) {
          // TODO: in
        }
      }
      else {
        this.onModalError(res.DataErrorFast);
      }
    });
  }

  onModalError(error: TDSSafeAny[]) {
    this.modal.create({
      title: 'Danh sách lỗi tạo đơn',
      content: CreateBillFastErrorComponent,
      size: 'xl',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        lstOrder: this.lstData,
        lstError: error
      }
    });
  }

  onCancel() {
    this.modalRef.destroy(null);
  }

}
