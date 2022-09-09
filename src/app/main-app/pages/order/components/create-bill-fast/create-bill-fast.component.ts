import { Observable } from 'rxjs';
import { TDSDestroyService } from 'tds-ui/core/services';
import { RegisterPayment } from './../../../../dto/fastsaleorder/register-payment';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { Message } from 'src/app/lib/consts/message.const';
import { CreateBillErrorComponent } from '../create-bill-error/create-bill-error.component';
import { UpdateInfoPartnerComponent } from '../update-info-partner/update-info-partner.component';
import { PrinterService } from 'src/app/main-app/services/printer.service';
import { DeliveryCarrierService } from 'src/app/main-app/services/delivery-carrier.service';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { CarrierListOrderDTO, GetListOrderIdsDTO } from 'src/app/main-app/dto/saleonlineorder/list-order-ids.dto';
import { CreateBillDefaultErrorDTO } from '@app/dto/order/default-error.dto';

@Component({
  selector: 'create-bill-fast',
  templateUrl: './create-bill-fast.component.html',
  providers: [TDSDestroyService]
})

export class CreateBillFastComponent implements OnInit {

  @Input() ids: string[] = [];
  @Input() lstData!: GetListOrderIdsDTO[];

  _form!: FormGroup;

  lstPayment: { Id:number, Payment:RegisterPayment }[] = [];
  lstCarriers: Array<CarrierListOrderDTO> = [];
  carrierForAll!: CarrierListOrderDTO;
  isLoading: boolean = false;
  isPrint: boolean = false;
  isPrintShip: boolean = false;

  numberWithCommas =(value:TDSSafeAny) =>{
    if(value != null)
    {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return value;
  } ;
  
  parserComas = (value: TDSSafeAny) =>{
    if(value != null)
    {
      return TDSHelperString.replaceAll(value,'.','');
    }
    return value;
  };

  constructor(private fb: FormBuilder,
    private message: TDSMessageService,
    private viewContainerRef: ViewContainerRef,
    private modal: TDSModalService,
    private modalRef: TDSModalRef,
    private destroy$: TDSDestroyService,
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

  loadCarrier() {
    this.carrierService.get().pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: any) => {
        this.lstCarriers = [...res.value];
      },
      error:(err) => {
        this.message.error(err?.error?.message || Message.CanNotLoadData);
      }
    });
  }

  onChangeCarrier(carrier: CarrierListOrderDTO, index: number) {
    if(TDSHelperObject.hasValue(carrier)){
      this.lstData[index].CarrierId = carrier.Id;
      this.lstData[index].CarrierName = carrier.Name;
      this.lstData[index].CarrierDeliveryType = carrier.DeliveryType;
      this.lstData[index].DeliveryPrice = carrier.Config_DefaultFee || 0;
      this.lstData[index].ShipWeight = carrier.Config_DefaultWeight || 100;
    }else{
      this.lstData[index].CarrierId = null as any;
      this.lstData[index].CarrierName = null as any;
      this.lstData[index].CarrierDeliveryType = null as any;
      this.lstData[index].DeliveryPrice = 0;
      this.lstData[index].ShipWeight = 100;
    }
  }

  createForm() {
    this._form = this.fb.group({
      amountTotal: [null],
      isPromotion: [false]
    });
  }

  checkEnabledPayment(data: GetListOrderIdsDTO){
    return this.lstPayment.some((item) => item.Id == data.Id);
  }

  onCheckPayment(data: GetListOrderIdsDTO){
    if(!this.checkEnabledPayment(data)){

      this.isLoading = true;
      let model = {
        ids: [data.Id]//Id:0 -> bug
      }

      this.fastSaleOrderService.getRegisterPayment(model).pipe(takeUntil(this.destroy$)).subscribe({
          next:(res) => {
            delete res['@odata.context'];
            this.lstPayment.push({
              Id: data.Id,
              Payment: res
            });

            this.isLoading = false;
          }, 
          error:(err) => {
            this.isLoading = false;
            this.message.error(err?.error?.message || 'Có lỗi xảy ra. Không thể thanh toán cho hóa đơn này');
          }
        })
    } else {
      this.isLoading = false;
      this.lstPayment = this.lstPayment.filter((item) => item.Id != data.Id);
    }
  }

  onModalError(DataErrorFast: TDSSafeAny[], errors: TDSSafeAny[], is_approve: boolean) {
    let type!:string;

    if(this.isPrint){
      type = 'print';
    }

    if(this.isPrintShip){
      type = 'printShip';
    }

    const modal = this.modal.create({
      content: CreateBillErrorComponent,
      size: 'xl',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        lstOrder: this.lstData,
        lstErrors: errors,
        lstDataErrorDefault: DataErrorFast,
        type: type,
        isApprove: is_approve
      }
    });

    modal.afterClose.subscribe({
      next:(result) => {
        this.onCancel();
      }
    })
  }

  changeCarrierAll() {
    this.lstData.forEach(item => {
      item.Carrier = this.carrierForAll;
      item.CarrierId = this.carrierForAll.Id;
      item.CarrierName = this.carrierForAll.Name;
      item.DeliveryPrice = this.carrierForAll.Config_DefaultFee || 0;
      item.ShipWeight = this.carrierForAll.Config_DefaultWeight || 100;
    });
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

  changePrint(str: string, active:boolean) {
    switch(str){
      case 'isPrint': 
        this.isPrint = active;
        this.isPrintShip = false;
        break;
      case 'isPrintShip':
        this.isPrintShip = active;
        this.isPrint = false;
    }
  }

  printSave(data: TDSSafeAny) {
    if (TDSHelperObject.hasValue(data) && data.Ids) {
      let obs!: Observable<any>;

      if(this.isPrint == true) {
        obs = this.printerService.printUrl(`fastsaleorder/print?ids=${data.Ids}`);
      }

      if(this.isPrintShip == true) {
        obs = this.printerService.printIP(`odata/fastsaleorder/OdataService.PrintShip`, {
          ids: data.Ids
        })
      }

      if (obs) {
        obs.pipe(takeUntil(this.destroy$)).subscribe({
          next:(res: TDSSafeAny) => {
            this.printerService.printHtml(res);
            this.modalRef.destroy(true);
          }, 
          error:(error: TDSSafeAny) => {
            if(error?.error?.message) {
              this.message.error(error?.error?.message);
            }
            this.modalRef.destroy(true);
          }
        });
      }else{
        this.modalRef.destroy(true);
      }
    }
  }

  onSave(confirm?: string) {
    if(this.isLoading){
      return
    }

    if(!this.lstData || this.lstData.length === 0) {
      this.message.error(Message.EmptyData);
      return;
    }

    this.isLoading = true;
    let model = {
      is_approve: TDSHelperString.hasValueString(confirm) ? true : false,
      model: this.lstData
    };
    
    this.fastSaleOrderService.insertListOrderModel(model).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: CreateBillDefaultErrorDTO) => {
        if (!res.Error) {
          this.isLoading = false;
          this.message.success(Message.Bill.InsertSuccess);
          this.printSave(res);
          this.onCancel();
        }
        else {
          this.isLoading = false;
          this.onModalError(res.DataErrorFast || [], res.Errors, model.is_approve);
        }
      },
      error:(err) => {
        this.isLoading = false;
        this.message.error(err?.error?.message || Message.InsertFail);
      }
    });
  }

  onCancel() {
    this.modalRef.destroy(null);
  }
}