import { TDSMessageService, TDSModalRef, TDSSafeAny, TDSModalService } from 'tmt-tang-ui';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { DeliveryCarrierService } from 'src/app/main-app/services/delivery-carrier-order.service';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { Message } from 'src/app/lib/consts/message.const';
import { CreateBillDefaultErrorComponent } from '../create-bill-default-error/create-bill-default-error.component';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';

@Component({
  selector: 'app-create-bill-default',
  templateUrl: './create-bill-default.component.html'
})
export class CreateBillDefaultComponent implements OnInit {

  @Input() ids: TDSSafeAny[] = [];

  lstCarriers: Array<TDSSafeAny> = [];
  lstData!: TDSSafeAny[];
  lstLine!: TDSSafeAny[];

  isApplyPromotion: boolean = false;
  carrier: TDSSafeAny;

  saveType = {
    billSave: 1,
    billPrint: 2,
    billPrintShip: 3
  }

  typePrintInput: TDSSafeAny;

  constructor(
    private message: TDSMessageService,
    private modal: TDSModalService,
    private modalRef: TDSModalRef,
    private viewContainerRef: ViewContainerRef,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private carrierService: DeliveryCarrierService,
    private fastSaleOrderService: FastSaleOrderService
  ) { }

  ngOnInit(): void {
    this.loadCarrier();

    this.loadData();
  }

  loadData() {
    this.saleOnline_OrderService.getDefaultOrderIds({ids: this.ids}).subscribe(res => {
      delete res['@odata.context'];
      this.lstData = res;

      this.lstLine = res.Lines.map((x: TDSSafeAny) => {return this.createLines(x)});

      debugger;
    });
  }

  loadCarrier() {
    this.carrierService.get().subscribe(res => {
      this.lstCarriers = res.value;
    });
  }

  createLines(line: TDSSafeAny) {
    let result = {
      COD: line.COD,
      CarrierId: line.CarrierId,
      CarrierName: line.CarrierName,
      Comment: line.Comment,
      CompanyId: line.CompanyId,
      DepositAmount: line.DepositAmount,
      FacebookId: line.FacebookId,
      FacebookName: line.FacebookName,
      Id: line.Id,
      Ids: line.Ids,
      IsPayment: line.IsPayment,
      Partner: line.Partner,
      PartnerId: line.PartnerId,
      ProductNote: line.ProductNote,
      Reference: line.Reference,
      SaleOnlineIds: line.SaleOnlineIds,
      ShipAmount: line.ShipAmount,
      ShipWeight: line.ShipWeight,
      TimeLock: line.TimeLock,
      TotalAmount: line.TotalAmount,
      WarehouseId: line.WarehouseId,
      CheckAddress: line.CheckAddress
    };

    return result;
  }

  onAddCarrier() {

  }

  onEdit(id: any) {

  }

  onSave(type: TDSSafeAny) {
    if(!this.carrier) {
      this.message.error(Message.Bill.ErrorEmptyCarrier);
      return;
    }

    let orderInfo = this.lstLine.find(x => !x?.Partner?.Phone || !x?.Partner?.Street || !x?.Partner?.Name);
    if(orderInfo) {
      this.message.error(Message.Bill.ErrorEmptyPartner);
      return;
    }

    let model = this.prepareModel();

    this.fastSaleOrderService.insertOrderProductDefault({model: model}).subscribe(res => {
      if(!res.Error) {
        this.message.success(Message.Bill.InsertSuccess);

        if(res && res.Ids && res.Ids.length > 0) {
          res.Ids.forEach((id: TDSSafeAny) => {
            if(type == this.saveType.billPrint) {
              // TODO: in
            }
            else if(type == this.saveType.billPrintShip) {
              // TODO: in
            }
          });
        }
      }
      else {
        if(type == this.saveType.billPrint) {
          this.typePrintInput = "billPrint";
        }
        else if(type == this.saveType.billPrintShip) {
          this.typePrintInput = "billPrintShip";
        }
        this.onModalError(res.DataErrorDefault);
      }
    });

  }

  onModalError(error: TDSSafeAny[]) {
    this.modal.create({
      title: 'Danh sách lỗi tạo đơn',
      content: CreateBillDefaultErrorComponent,
      size: 'xl',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        model: this.prepareModel(),
        lstError: error,
        typePrint: this.typePrintInput
      }
    });
  }

  prepareModel() {
    let lines = this.lstLine.map(item => {
      delete item.CheckAddress;
      delete item.COD;

      // item.TotalAmount = parseNumber(item.TotalAmount);
      // item.ShipWeight = parseNumber(item.ShipWeight);
      // item.ShipAmount = parseNumber(item.ShipAmount);

      return item;
    });

    let result = {
      Id: 0,
      ApplyPromotion: this.isApplyPromotion,
      Carrier: this.carrier,
      CarrierId: this.carrier.Id,
      Lines: lines
    };

    return result;
  }

  onChangeCarrier(event: TDSSafeAny, item: TDSSafeAny) {
    item.CarrierId = event.Id;
    item.CarrierName = event.Name;

    if (event.Config_DefaultFee) {
      item.ShipAmount = item.Config_DefaultFee;
    }

    if (event.Config_DefaultWeight) {
      item.ShipWeight = item.Config_DefaultWeight;
    }
  }

  onCancel() {
    this.modalRef.destroy(null);
  }

}
