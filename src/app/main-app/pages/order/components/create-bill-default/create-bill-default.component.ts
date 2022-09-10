import { TDSConfigService } from 'tds-ui/core/config';
import { CreateBillErrorComponent } from '../create-bill-error/create-bill-error.component';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { TDSNotificationService } from 'tds-ui/notification';
import { Subject, takeUntil, finalize } from 'rxjs';
import { Carrier, OrderBillDefaultDTO, DataErrorDefaultDTOV2, Partner } from './../../../../dto/order/order-bill-default.dto';
import { ResultCheckAddressDTO } from './../../../../dto/address/address.dto';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { Message } from 'src/app/lib/consts/message.const';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { UpdateInfoPartnerComponent } from '../update-info-partner/update-info-partner.component';
import { PrinterService } from 'src/app/main-app/services/printer.service';
import { DeliveryCarrierService } from 'src/app/main-app/services/delivery-carrier.service';
import { TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { ModalAddAddressV2Component } from '@app/pages/conversations/components/modal-add-address-v2/modal-add-address-v2.component';
import { CreateBillDefaultErrorDTO, DataErrorDefaultDTO } from '@app/dto/order/default-error.dto';
import { CompanyCurrentDTO } from '@app/dto/configs/company-current.dto';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-create-bill-default',
  templateUrl: './create-bill-default.component.html',
  providers: [TDSDestroyService]
})
export class CreateBillDefaultComponent implements OnInit {

  @Input() ids: TDSSafeAny[] = [];

  lstCarriers: Array<Carrier> = [];
  lstData!: OrderBillDefaultDTO;
  lstLine: Array<DataErrorDefaultDTOV2> = [];
  lstCheckRowErrors: Array<string> = [];
  innerText: string = '';
  phoneRegex!:string;

  isApplyPromotion: boolean = false;
  carrier!: Carrier;
  isLoading = false;

  companyCurrents!: CompanyCurrentDTO;
  chatomniEventEmiter: any;

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

  constructor(private notification: TDSNotificationService,
    private message: TDSMessageService,
    private modal: TDSModalService,
    private modalRef: TDSModalRef,
    private viewContainerRef: ViewContainerRef,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private carrierService: DeliveryCarrierService,
    private fastSaleOrderService: FastSaleOrderService,
    private printerService: PrinterService,
    private destroy$: TDSDestroyService,
    private sharedService: SharedService,
    private configService: TDSConfigService) { }

  ngOnInit(): void {
    this.loadCarrier();
    this.loadData();
    this.loadCurrentCompany();
    this.configService.set('notification', { maxStack: 100 });
  }

  loadCurrentCompany() {
    this.sharedService.setCurrentCompany();
    this.sharedService.getCurrentCompany().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: CompanyCurrentDTO) => {
        this.companyCurrents = res;
        if(this.companyCurrents?.Configs){
          this.phoneRegex = JSON.parse(this.companyCurrents.Configs)?.PhoneRegex;
        }
      },
      error: (error: any) => {
        this.message.error(error?.error?.message || 'Load thông tin công ty mặc định đã xảy ra lỗi!');
      }
    });
  }

  loadData() {
    this.isLoading = true;

    this.saleOnline_OrderService.getDefaultOrderIds({ ids: this.ids }).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res) => {
          delete res['@odata.context'];
          this.lstData = {...res};

          this.lstLine = this.lstData.Lines.map((x: TDSSafeAny) => { return this.createLines(x) });

          this.lstLine.forEach((x, i) =>{
            this.checkPartnerInfo(x.Partner, i);
          });

          this.isLoading = false;
        },
        error:(err) => {
          this.isLoading = false;
          this.message.error(err?.error?.message || Message.CanNotLoadData);
        }
      });
  }

  loadCarrier() {
    this.carrierService.get().pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: any) => {
        this.lstCarriers = res.value;
      },
      error:(err) => {
        this.message.error(err?.error?.message || Message.CanNotLoadData);
      }
    });
  }

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

  createLines(line: TDSSafeAny): DataErrorDefaultDTOV2 {
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
      Reference: line.Reference.replace('ĐH: ',''),
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
      this.lstLine.forEach((item) => {
        this.onChangeCarrier(this.carrier, item);
      });
    }
  }

  onChangeCarrier(event: TDSSafeAny, item: TDSSafeAny) {
    item.CarrierId = event.Id;
    item.CarrierName = event.Name;
    item.ShipAmount = event?.Config_DefaultFee || this.companyCurrents?.ShipDefault || 0;
    item.ShipWeight = event?.Config_DefaultWeight || this.companyCurrents?.WeightDefault || 100;

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
        partner: item.Partner,
        phoneRegex: this.phoneRegex
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
    this.lstLine = this.lstLine.filter((f,i)=> index != i);
  }

  onModalError(lstDataErrorDefault: DataErrorDefaultDTO[], lstErrors: TDSSafeAny[], carrierId: number, type?: string ) {
    const modal = this.modal.create({
      title: 'Danh sách lỗi tạo đơn',
      content: CreateBillErrorComponent,
      size: 'xl',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        billDefaultModel: this.prepareModel(),
        lstDataErrorDefault: lstDataErrorDefault,
        lstErrors: lstErrors,
        type: type
      }
    });

    modal.afterClose.subscribe({
      next:(res) => {
        this.modalRef.destroy(null);
      }
    })
  }

  prepareModel() {
    let lines: DataErrorDefaultDTO[] = this.lstLine.map(item => {
      delete item.CheckAddress;
      delete item.COD;

      return item as DataErrorDefaultDTO;
    });

    let result: OrderBillDefaultDTO = {
      Id: 0,
      ApplyPromotion: this.isApplyPromotion,
      Carrier: this.carrier,
      CarrierId: this.carrier?.Id,
      Lines: lines
    };

    return result;
  }

  checkPartnerInfo(partner: Partner, i: number){
    let error = ``;

    if(partner){
      if(!partner.Name) {
        error = `*Chưa có Tên`;
      }

      if(!partner.Phone){
        if(error != ``){
          error += `, Số điện thoại`
        }else{
          error = `*Chưa có Số điện thoại`;
        }
      }

      if(!partner.Street){
        if(error != ``){
          error += `, Địa chỉ`;
        }else{
          error = `*Chưa có Địa chỉ`;
        }
      }

      if(error != ``){
        this.lstCheckRowErrors[i] = error;
      }
    }else{
      let message = `*Không có thông tin khách hàng`;
      this.lstCheckRowErrors[i] = message;
    }
  }

  checkCarrier(model: OrderBillDefaultDTO){
    if (!model.CarrierId) {
      this.message.error(Message.Bill.ErrorEmptyCarrier);
      return false;
    }
    
    let hasError = false;
    model.Lines.forEach((x, i) => {
      if(!x.CarrierId){
        this.notification.error(`Lỗi`, `Dòng thứ <b class="text-info-500 font-semibold">${i + 1}</b> chưa chọn đối tác giao hàng`, { duration: 10000, pauseOnHover: true });
        hasError = true;
      }
    });

    if(hasError){
      return false;
    }

    return true;
  }

  onSave(type?: string) {
    if(this.isLoading){
      return;
    }

    let model = this.prepareModel();
    
    if (!this.checkCarrier(model)) {
      return;
    }
    
    if (!model.Lines || model.Lines.length == 0) {
      this.message.error(Message.EmptyData);
      return;
    }

    this.isLoading = true;

    this.fastSaleOrderService.insertOrderProductDefault({ model: model }).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res: CreateBillDefaultErrorDTO) => {

          if (!res.Error) {
            this.message.success(Message.Bill.InsertSuccess);
            if(type) {
              this.printOrder(res, Number(model?.CarrierId), type);
            }

            this.modalRef.destroy(null);
          } else {
            this.onModalError(res.DataErrorDefault || [], res.Errors, Number(model?.CarrierId), type);
          }

          this.isLoading = false;
        },
        error:(err) => {
          this.isLoading = false;
          this.message.error(err?.error?.message || 'Tạo đơn hàng thất bại');
        }
      });
  }

  printOrder( data: TDSSafeAny, carrierId: number, type?: string) {
    let obs: TDSSafeAny;
    if(type == 'print') {
        obs = this.printerService.printUrl(`/fastsaleorder/print?ids=${data.Ids}`);
    }

    if(type == 'printShip') {
        obs = this.printerService.printUrl(`/fastsaleorder/printshipthuan?ids=${data.Ids}`);
    }

    if (obs) {
      obs.pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
          this.printerService.printHtml(res);
          this.onCancel();

      }, (error: TDSSafeAny) => {
          if(error?.error?.message) {
              this.notification.error( 'Lỗi in phiếu', error?.error?.message);
          }
          this.onCancel();
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
        isSelectAddress: true
      }
    });

    modal.afterClose.subscribe({
      next:(result: ResultCheckAddressDTO) => {
        if(result){
          this.onLoadSuggestion(result, index);
          this.innerText = result.Address;
        }
      }
    })
  }
}
