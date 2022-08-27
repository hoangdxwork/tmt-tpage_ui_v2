import { Subject, takeUntil, finalize } from 'rxjs';
import { Carrier, Line, OrderBillDefaultDTO, LineV2, Partner } from './../../../../dto/order/order-bill-default.dto';
import { ResultCheckAddressDTO } from './../../../../dto/address/address.dto';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { Message } from 'src/app/lib/consts/message.const';
import { CreateBillDefaultErrorComponent } from '../create-bill-default-error/create-bill-default-error.component';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { UpdateInfoPartnerComponent } from '../update-info-partner/update-info-partner.component';
import { PrinterService } from 'src/app/main-app/services/printer.service';
import { DeliveryCarrierService } from 'src/app/main-app/services/delivery-carrier.service';
import { TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { ModalAddAddressV2Component } from '@app/pages/conversations/components/modal-add-address-v2/modal-add-address-v2.component';

@Component({
  selector: 'app-create-bill-default',
  templateUrl: './create-bill-default.component.html'
})
export class CreateBillDefaultComponent implements OnInit {

  @Input() ids: TDSSafeAny[] = [];

  lstCarriers: Array<Carrier> = [];
  lstData: Array<OrderBillDefaultDTO> = [];
  lstLine: Array<LineV2> = [];
  innerText: string = '';

  isApplyPromotion: boolean = false;
  carrier!: Carrier;
  isLoading = false;

  saveType = {
    billSave: 1,
    billPrint: 2,
    billPrintShip: 3
  }

  private destroy$ = new Subject<void>();
  chatomniEventEmiter: any;

  constructor(
    private message: TDSMessageService,
    private modal: TDSModalService,
    private modalRef: TDSModalRef,
    private viewContainerRef: ViewContainerRef,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private carrierService: DeliveryCarrierService,
    private fastSaleOrderService: FastSaleOrderService,
    private printerService: PrinterService,
  ) { }

  ngOnInit(): void {
    this.loadCarrier();
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    this.saleOnline_OrderService.getDefaultOrderIds({ ids: this.ids })
      .pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false)).subscribe(res => {
        delete res['@odata.context'];
        this.lstData = res;
        this.lstLine = res.Lines.map((x: TDSSafeAny) => { return this.createLines(x) });
      },
      err=>{
        this.message.error(err?.error?.message || Message.CanNotLoadData);
      });
  }

  loadCarrier() {
    this.carrierService.get().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.lstCarriers = res.value;
    },
    err=>{
      this.message.error(err?.error?.message || Message.CanNotLoadData);
    });
  }

  numberWithCommas = (value: TDSSafeAny) => {
    if (value != null) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }
    return value
  };

  parserComas = (value: TDSSafeAny) => {
    if (value != null) {
      return TDSHelperString.replaceAll(value, ',', '');
    }
    return value
  };

  mappingAddress(data: Partner) {
    if (data && data.City) {
      data.CityCode = data.City.code;
      data.CityName = data.City.Name;
    }
    if (data && data.District) {
      data.DistrictCode = data.District.code;
      data.DistrictName = data.District.Name;
    }
    if (data && data.Ward) {
      data.WardCode = data.Ward.code;
      data.WardName = data.Ward.Name;
    }
  }

  createLines(line: TDSSafeAny): LineV2 {
    this.mappingAddress(line.Partner);

    return {
      COD: line.COD,
      CheckAddress: line.CheckAddress,
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
      WarehouseId: line.WarehouseId
    };
  }

  changeCarrierAll() {
    if (this.carrier) {
      this.lstLine.forEach(item => {
        this.onChangeCarrier(this.carrier, item);
      });
    }
  }

  onChangeCarrier(event: TDSSafeAny, item: TDSSafeAny) {
    item.CarrierId = event.Id;
    item.CarrierName = event.Name;
    item.ShipAmount = event.Config_DefaultFee || 0;
    item.ShipWeight = event.Config_DefaultWeight || 100;
  }

  onLoadSuggestion(item: ResultCheckAddressDTO, index: number) {
    if (TDSHelperObject.hasValue(item)) {
      this.lstLine[index].Partner.Street = item.Address;
      this.lstLine[index].Partner.CityCode = item.CityCode;
      this.lstLine[index].Partner.CityName = item.CityName;
      this.lstLine[index].Partner.DistrictCode = item.DistrictCode;
      this.lstLine[index].Partner.DistrictName = item.DistrictName;
      this.lstLine[index].Partner.WardCode = item.WardCode;
      this.lstLine[index].Partner.WardName = item.WardName;
    }
  }

  onEdit(index: number) {
    let item = this.lstLine[index];
    const modal = this.modal.create({
      title: 'Sửa địa chỉ',
      content: UpdateInfoPartnerComponent,
      size: 'lg',
      centered: true,
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        partner: item.Partner
      }
    });

    modal.afterClose.subscribe((result: TDSSafeAny) => {
      if (TDSHelperObject.hasValue(result)) {
        this.lstLine[index].Partner["Name"] = result.Name;
        this.lstLine[index].Partner["Phone"] = result.Phone;
        this.lstLine[index].Partner["Street"] = result.Street;
        this.lstLine[index].Partner["Ward"] = result.Ward;
        this.lstLine[index].Partner["WardCode"] = result?.Ward?.code ? result.Ward.code : null;
        this.lstLine[index].Partner["WardName"] = result?.Ward?.name ? result.Ward.name : null;
        this.lstLine[index].Partner["District"] = result.District;
        this.lstLine[index].Partner["DistrictCode"] = result?.District?.code ? result.District.code : null;
        this.lstLine[index].Partner["DistrictName"] = result?.District?.name ? result.District.name : null;
        this.lstLine[index].Partner["City"] = result.City;
        this.lstLine[index].Partner["CityCode"] = result?.City?.code ? result.City.code : null;
        this.lstLine[index].Partner["CityName"] = result?.City?.name ? result.City.name : null;

      }
    });
  }

  onRemove(index: number) {
    this.lstLine.splice(index, 1);
  }

  onModalError(error: TDSSafeAny[], type: TDSSafeAny, carrierId: string) {
    const modal = this.modal.create({
      title: 'Danh sách lỗi tạo đơn',
      content: CreateBillDefaultErrorComponent,
      size: 'xl',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        model: this.prepareModel(),
        lstError: error
      }
    });

    modal.afterClose.subscribe(result => {
      this.printSave(type, result, carrierId);
      this.modalRef.destroy(null);
    });
  }

  prepareModel() {
    let lines: Line[] = this.lstLine.map(item => {
      delete item.CheckAddress;
      delete item.COD;

      return item;
    });

    let result: OrderBillDefaultDTO = {
      Id: 0,
      ApplyPromotion: this.isApplyPromotion,
      Carrier: this.carrier,
      CarrierId: this.carrier.Id,
      Lines: lines
    };

    return result;
  }

  onSave(type: TDSSafeAny) {
    if(this.isLoading){
      return;
    }

    if (!this.carrier) {
      this.message.error(Message.Bill.ErrorEmptyCarrier);
      return;
    }

    if (!this.lstLine || this.lstLine.length === 0) {
      this.message.error(Message.EmptyData);
      return;
    }

    let orderInfo = this.lstLine.find(x => !x?.Partner?.Phone || !x?.Partner?.Street || !x?.Partner?.Name);
    if (orderInfo) {
      this.message.error(Message.Bill.ErrorEmptyPartner);
      return;
    }

    let model = this.prepareModel();
    this.isLoading = true;

    this.fastSaleOrderService.insertOrderProductDefault({ model: model })
      .pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false)).subscribe(res => {
        if (!res.Error) {
          this.message.success(Message.Bill.InsertSuccess);
          this.printSave(type, res, model?.CarrierId.toString());
          this.modalRef.destroy(null);
        }
        else {
          this.onModalError(res.DataErrorDefault, type, model?.CarrierId.toString());
        }
      },
        err => {
          this.message.error(err?.error?.message || 'Tạo đơn hàng thất bại');
      });
  }

  printSave(type: TDSSafeAny, data: TDSSafeAny, carrierId: string) {
    if (TDSHelperObject.hasValue(data) && data.Ids) {
      data.Ids.forEach((id: TDSSafeAny) => {
        if (type == this.saveType.billPrint) {
          this.printerService.printUrl(`/fastsaleorder/print?ids=${id}`).subscribe();;
        }
        else if (type == this.saveType.billPrintShip) {
          let params = "";
          params = `&carrierId=${carrierId}`;
          this.printerService.printUrl(`/fastsaleorder/PrintShipThuan?ids=${id}${params}`);
        }
      });
    }
  }

  onCancel() {
    this.modalRef.destroy(null);
  }

  showModalSuggestAddress(index: number){
    let modal =  this.modal.create({
      title: 'Thêm địa chỉ',
      content: ModalAddAddressV2Component,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        _street: this.innerText,
      }
    });

    modal.afterClose.subscribe({
      next: (result: ResultCheckAddressDTO) => {
        if(result){
          this.onLoadSuggestion(result, index);
          this.innerText = result.Address;
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
