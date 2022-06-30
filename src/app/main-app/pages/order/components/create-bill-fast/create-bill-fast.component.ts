import { filter, takeUntil } from 'rxjs/operators';
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

@Component({
  selector: 'create-bill-fast',
  templateUrl: './create-bill-fast.component.html'
})

export class CreateBillFastComponent implements OnInit, OnDestroy {

  @Input() ids: string[] = [];
  @Input() lstData!: TDSSafeAny[];

  formCreateBillFast!: FormGroup;
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
    if(value != null)
    {
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
    this.formCreateBillFast = this.fb.group({
      carrier: [null],
      amountTotal: [null],
      isPromotion: [false]
    });
  }

  onSave(confirm?: string) {
    if(!this.lstData || this.lstData.length === 0) {
      this.message.error(Message.EmptyData);
      return;
    }

    let model = {
      is_approve: TDSHelperString.hasValueString(confirm) ? true : false,
      model: this.lstData,
    };

    this.fastSaleOrderService.insertListOrderModel(model).subscribe(res => {
      if (!res.Error) {
        this.message.success(Message.Bill.InsertSuccess);

        this.printSave(res);
        // this.onCancel();
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
      // this.onCancel();
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
    this.lstData = this.lstData.filter((item, i) => i !== index);
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

    // modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    modal.afterClose.subscribe((result: TDSSafeAny) => {
      console.log('[afterClose] The result is:', result);
      if (TDSHelperObject.hasValue(result)) {

        if(!this.lstData[index]?.Partner) {
          this.lstData[index]["Partner"] = {};
        }

        this.lstData[index].Partner["Name"] = result.Name;
        this.lstData[index].Partner["Phone"] = result.Phone;
        this.lstData[index].Partner["Street"] = result.Street;
        this.lstData[index].Partner["Ward"] = result.Ward;
        this.lstData[index].Partner["WardCode"] = result?.Ward?.code ? result.Ward.code : null;
        this.lstData[index].Partner["WardName"] = result?.Ward?.name ? result.Ward.name : null;
        this.lstData[index].Partner["District"] = result.District;
        this.lstData[index].Partner["DistrictCode"] = result?.District?.code ? result.District.code : null;
        this.lstData[index].Partner["DistrictName"] = result?.District?.name ? result.District.name : null;
        this.lstData[index].Partner["City"] = result.City;
        this.lstData[index].Partner["CityCode"] = result?.City?.code ? result.City.code : null;
        this.lstData[index].Partner["CityName"] = result?.City?.name ? result.City.name : null;
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
