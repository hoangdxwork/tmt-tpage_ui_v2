import { FormGroup, FormBuilder } from '@angular/forms';
import { DeliveryCarrierService } from 'src/app/main-app/services/delivery-carrier-order.service';
import { TDSModalService, TDSSafeAny, TDSModalRef, TDSHelperString, TDSMessageService, TDSHelperObject } from 'tmt-tang-ui';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { Message } from 'src/app/lib/consts/message.const';
import { CreateBillFastErrorComponent } from '../create-bill-fast-error/create-bill-fast-error.component';
import { EditOrderComponent } from '../edit-order/edit-order.component';
import { UpdateInfoPartnerComponent } from '../update-info-partner/update-info-partner.component';

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
      this.updateAmountTotal(this.lstData);
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

        this.onCancel();
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

  changeCarrierAll() {
    let carrier = this.formCreateBillFast.controls["carrier"].value;
    if(carrier) {
      this.lstData.forEach(item => {
        item.Carrier = carrier;
        item.CarrierId = carrier.Id;
        item.CarrierName = carrier.Name;
        item.DeliveryPrice = carrier.Config_DefaultFee || 0;
        item.ShipWeight = carrier.Config_DefaultWeight || 100;
      });
    }

  }

  onRemoveLine(index: number) {
    this.lstData.splice(index, 1);
  }

  onEdit(index: number) {
    let item = this.lstData[index];
    const modal = this.modal.create({
      title: 'Sửa địa chỉ',
      content: UpdateInfoPartnerComponent,
      size: 'lg',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        partner: item.Partner
      }
    });

    // modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    modal.afterClose.subscribe((result: TDSSafeAny) => {
      console.log('[afterClose] The result is:', result);
      if (TDSHelperObject.hasValue(result)) {
        this.lstData[index] = result;
      }
    });
  }

  onRemoveProduct(index: number, indexProduct: number) {
    let item = this.lstData[index];
    item["OrderLines"].splice(indexProduct, 1);

    this.updateAmountTotal(this.lstData);
  }

  updateAmountTotal(orders: Array<TDSSafeAny>) {
    orders.forEach(x => {
      let total = 0;
      if(x.OrderLines) {
        x.OrderLines.forEach((x: any) => { total += (x.PriceSubTotal || 0) });
      }

      x["AmountTotal"] = total;
    });
  }

  changePriceProduct(event: TDSSafeAny, index: number, indexProduct: number) {
    if (event) {
      let item = this.lstData[index];
      let product = item["OrderLines"][indexProduct];
      product["PriceUnit"] = event;
      product["PriceTotal"] = event * product["ProductUOMQty"];
      product["PriceSubTotal"] = event * product["ProductUOMQty"];

      this.updateAmountTotal(this.lstData);
    }
  }

  changeQuantityProduct(event: TDSSafeAny, index: number, indexProduct: number) {
    if (event) {
      let item = this.lstData[index];
      let product = item["OrderLines"][indexProduct];
      product["ProductUOMQty"] = event;
      product["PriceTotal"] = event * product["PriceUnit"];
      product["PriceSubTotal"] = event * product["PriceUnit"];

      this.updateAmountTotal(this.lstData);
    }
  }

  onCancel() {
    this.modalRef.destroy(null);
  }

}
