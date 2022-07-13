import { RegisterPayment } from './../../../../dto/fastsaleorder/register-payment';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, Input, OnInit, ViewContainerRef, OnDestroy } from '@angular/core';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { Message } from 'src/app/lib/consts/message.const';
import { CreateBillFastErrorComponent } from '../create-bill-fast-error/create-bill-fast-error.component';
import { UpdateInfoPartnerComponent } from '../update-info-partner/update-info-partner.component';
import { PrinterService } from 'src/app/main-app/services/printer.service';
import { Subject, finalize } from 'rxjs';
import { DeliveryCarrierService } from 'src/app/main-app/services/delivery-carrier.service';
import { DeliveryCarrierDTO } from 'src/app/main-app/dto/carrier/delivery-carrier.dto';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { GetListOrderIdsDTO } from 'src/app/main-app/dto/saleonlineorder/list-order-ids.dto';

@Component({
  selector: 'create-bill-fast',
  templateUrl: './create-bill-fast.component.html'
})

export class CreateBillFastComponent implements OnInit, OnDestroy {

  _form!: FormGroup;
  @Input() ids: string[] = [];
  @Input() lstData!: GetListOrderIdsDTO[];

  lstPayment: { Id:number, Payment:RegisterPayment }[] = [];

  lstCarriers: Array<DeliveryCarrierDTO> = [];
  isLoading: boolean = false;
  private destroy$ = new Subject<void>();

  isPrint: boolean = false;
  isPrintShip: boolean = false;

  constructor(private fb: FormBuilder,
    private message: TDSMessageService,
    private viewContainerRef: ViewContainerRef,
    private modal: TDSModalService,
    private modalRef: TDSModalRef,
    private fastSaleOrderService: FastSaleOrderService,
    private carrierService: DeliveryCarrierService,
    private printerService: PrinterService) {
      this.createForm();
  }

  ngOnInit(): void {
    if(TDSHelperArray.hasListValue(this.lstData)) {
      this.loadCarrier();
      this.updateAmountTotal(this.lstData);
    }
  }

  numberWithCommas =(value:TDSSafeAny) =>{
    if(value != null){
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
    return value;
  }

  parserComas = (value: TDSSafeAny) =>{
    if(value != null){
      return TDSHelperString.replaceAll(value,',','');
    }
    return value
  };

  loadCarrier() {
    this.carrierService.get().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.lstCarriers = [...res.value];
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
    this._form = this.fb.group({
      carrier: [null],
      amountTotal: [null],
      isPromotion: [false]
    });
  }

  checkEnabledPayment(data: GetListOrderIdsDTO){
    return this.lstPayment.some((item)=> item.Id == data.Id);
  }

  onCheckPayment(data: GetListOrderIdsDTO){
    if(!this.checkEnabledPayment(data)){

      this.isLoading = true;
      let model = {
        ids: [data.Id]//Id:0 -> bug
      }

      this.fastSaleOrderService.getRegisterPayment(model)
        .pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false))
        .subscribe(
          (res)=>{
            delete res['@odata.context'];
            this.lstPayment.push({
              Id: data.Id,
              Payment: res
            })
          }, err => {
            this.message.error(err.error.message ?? 'Có lỗi xảy ra. Không thể thanh toán cho hóa đơn này.');
          }
      )
    } else {
      this.lstPayment = this.lstPayment.filter((item)=> item.Id != data.Id);
    }
  }

  onSave(confirm?: string) {
    if(!this.lstData || this.lstData.length === 0) {
      this.message.error(Message.EmptyData);
      return;
    }

    this.isLoading = true;
    let model = {
      is_approve: TDSHelperString.hasValueString(confirm) ? true : false,
      model: this.lstData
    };

    this.fastSaleOrderService.insertListOrderModel(model).pipe(takeUntil(this.destroy$)).pipe(finalize(()=>{ this.isLoading = false; }))
    .subscribe(res => {
      if (!res.Error) {
        this.message.success(Message.Bill.InsertSuccess);

        this.printSave(res);
      }
      else {
        this.onModalError(res.DataErrorFast);
      }
    });
  }

  onModalError(error: TDSSafeAny[]) {
    const modal = this.modal.create({
      title: 'Danh sách lỗi tạo đơn',
      content: CreateBillFastErrorComponent,
      size: 'xl',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        lstOrder: this.lstData,
        lstError: error
      }
    });

    modal.afterClose.subscribe((result) => {
      this.printSave(result);
    });
  }

  printSave(data: TDSSafeAny) {
    if (TDSHelperObject.hasValue(data) && data.Ids) {
      let obs: TDSSafeAny;
      if(this.isPrint == true) {
        // TODO: in
        obs = this.printerService.printUrl(`fastsaleorder/print?ids=${data.Ids}`);
      }
      else if(this.isPrintShip == true) {
        // TODO: in
        obs = this.printerService.printIP(`odata/fastsaleorder/OdataService.PrintShip`, {
          ids: data.Ids,
        })
      }
      else {
        this.onCancel();
      }

      if (TDSHelperObject.hasValue(obs)) {
        obs.pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
            this.printerService.printHtml(res);
            this.onCancel();
        }, (error: TDSSafeAny) => {
          if(error?.error?.message) {
            this.message.error(error?.error?.message);
          }
        });
      }
    }
  }

  changeCarrierAll() {
    let carrier = this._form.controls["carrier"].value;
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
    this.lstData = this.lstData.filter((item, i) => i != index);
    this.lstPayment = this.lstPayment.filter((item)=> item.Id != this.lstData[index].Id);//xóa thông tin thanh toán trong danh sách thanh toán
  }

  onRemoveProduct(index: number, indexProduct: number) {
    let item = this.lstData[index];
    item["OrderLines"] = item["OrderLines"].filter((product: TDSSafeAny, i: number) => i !== indexProduct);

    this.updateAmountTotal(this.lstData);
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

    modal.afterClose.subscribe((result: TDSSafeAny) => {
      if (TDSHelperObject.hasValue(result)) {
        let partner = {
          Name: result?.Name || this.lstData[index].Partner?.Name,
          Phone: result?.Phone || this.lstData[index].Partner?.Phone,
          Street: result?.Street || this.lstData[index].Partner?.Street,
          Ward: result?.Ward || this.lstData[index].Partner?.Ward,
          WardCode: result?.Ward?.code || this.lstData[index].Partner?.Ward?.code,
          WardName: result?.Ward?.name || this.lstData[index].Partner?.Ward?.name,
          District: result.District || this.lstData[index].Partner?.District,
          DistrictCode: result?.District?.code || this.lstData[index].Partner?.District?.code,
          DistrictName: result?.District?.name || this.lstData[index].Partner?.District?.name,
          City: result.City || this.lstData[index].Partner?.City,
          CityCode: result?.City?.code || this.lstData[index].Partner?.City?.code,
          CityName: result?.City?.name || this.lstData[index].Partner?.City?.name
        };

        this.lstData[index].Partner = Object.assign(this.lstData[index].Partner, partner);
      }
    });
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

  changePrint(str: string) {
    if(str == 'isPrint') {
      this.isPrintShip = false;
    }
    else if(str == 'isPrintShip') {
      this.isPrint = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
