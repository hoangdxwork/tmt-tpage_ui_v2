import { TDSSafeAny, TDSMessageService, TDSHelperArray } from 'tmt-tang-ui';
import { Injectable } from "@angular/core";
import { GeneralConfigsFacade } from '../facades/general-config.facade';
import { Observable } from 'rxjs';
import { FastSaleOrderService } from '../fast-sale-order.service';
import { DeliveryCarrierService } from '../delivery-carrier.service';
import { groupBy as _groupBy } from 'lodash';

export interface ModelCalculateFeeV2{
  PartnerId: any,
  CompanyId: any,
  CarrierId: any,
  ServiceId: string,
  InsuranceFee: number,
  ShipWeight: number,
  CashOnDelivery: any,
  ServiceExtras: Array<any>,
  Ship_Receiver: any
}

@Injectable()
export class CarrierHandler {

  saleSetting: any;

  private delivery_types: any = ["fixed", "base_on_rule", "VNPost", "NinjaVan"];

  // Đối tác có phí báo hiểm
  private carrierTypeInsurance: any = ["MyVNPost", "GHN", "GHTK", "ViettelPost", "NinjaVan"];

  // Danh sách đối tác hỗ trợ tính phí
  private apiDeliveries: any = ['GHTK', 'ViettelPost', 'GHN', 'TinToc', 'SuperShip', 'FlashShip', 'OkieLa', 'MyVNPost', 'DHL', 'FulltimeShip', 'JNT', 'BEST', 'EMS', 'AhaMove', 'Snappy', 'NhatTin', "HolaShip"];

  constructor(
    private generalConfigsFacade: GeneralConfigsFacade,
    private fastSaleOrderService: FastSaleOrderService,
    private deliveryCarrierService: DeliveryCarrierService,
    private message: TDSMessageService
  ) {
    this.initialize();
  }

  private initialize() {
    this.generalConfigsFacade.getSaleConfigs().subscribe(res => {
      this.saleSetting = res?.SaleSetting;
    });

    this.deliveryCarrierService.dataCarrierActive$.subscribe(res => {
      let deliveriesTypes = _groupBy(res, 'DeliveryType');
      this.apiDeliveries = Object.keys(deliveriesTypes);
    });
  }

  existApiDeliveries(apiDeliveries: string) {
    return this.apiDeliveries.includes(apiDeliveries);
  }

  existCarrierTypeInsurance(carrierTypeInsurance: string) {
    return this.carrierTypeInsurance.includes(carrierTypeInsurance);
  }

  existDeliveryTypes(DeliveryTypes: string) {
    return this.delivery_types.includes(DeliveryTypes);
  }

  getShipExtraServices(carrier: TDSSafeAny, shipExtraServices: Array<TDSSafeAny>): boolean {
    let isEnableInsuranceFee = false;
    let type = null;

    if(!carrier) return false;

    let shipExtras = carrier.ExtrasText ? JSON.parse(carrier.ExtrasText) : null;
    let deliveryType = carrier.DeliveryType;
    type = deliveryType;

    if(deliveryType === 'OkieLa') {
      this.initOkieLa(shipExtraServices);
    }
    else if(deliveryType === 'NinjaVan' && shipExtras) {
      isEnableInsuranceFee = true;
      this.initNinjaVan(shipExtraServices, shipExtras);
    }
    else if(deliveryType === 'GHTK') {
      let isInsurance = shipExtras && shipExtras.IsInsurance;
      this.initGHTK(shipExtraServices, isInsurance);
    }
    // Add handling with other delivery type

    return isEnableInsuranceFee;
  }

  initGHTK(shipExtraServices: any, isInsurance: boolean) {
    shipExtraServices = shipExtraServices || [];
    shipExtraServices.length = 0;

    shipExtraServices.push(
      {
        ServiceId: '16',
        ServiceName: 'Bảo hiểm hàng hóa',
        Fee: 0,
        IsSelected: isInsurance
      },
    );
  }

  initOkieLa( shipExtraServices: any) {
    shipExtraServices = shipExtraServices || [];
    shipExtraServices.length = 0;

    shipExtraServices.push(
      {
        ServiceId: 'is_fragile',
        ServiceName: 'Hàng dễ vỡ?'
      },
      {
        ServiceId: 'check_before_accept',
        ServiceName: 'Cho khách xem hàng?'
      },
    );
  }

  initNinjaVan(shipExtraServices: any, shipExtras: any) {
    shipExtraServices = shipExtraServices || [];
    shipExtraServices.length = 0;

    shipExtraServices.push(
      {
        ServiceId: "NinjaVan",
        ServiceName: "Khai giá hàng hóa",
        Fee: shipExtras.InsuranceFee ? shipExtras.InsuranceFee : 0,
        IsSelected: shipExtras.IsInsurance ? shipExtras.IsInsurance : false,
      },
    );

  }

  changeCarrierV2(saleModel: any, orderForm: any, carrier: any, shipExtraServices: Array<any>): Observable<any> {
    let oldDeliveryPrice = saleModel.DeliveryPrice;

    this.changeCarrierReset(saleModel, carrier); // Update field
    this.updateCOD(saleModel, orderForm); // Update COD, AmountTotal
    // this.getShipExtraServices(carrier, shipExtraServices); // Get ship extra services

    return this.calculateFee(saleModel, orderForm, carrier, shipExtraServices);
  }

  changeCarrierReset(saleModel: any, carrier: any) {
    saleModel.Ship_ServiceId = "";
    saleModel.Ship_ServiceName = "";
    saleModel.CustomerDeliveryPrice = null;
    saleModel.Carrier = carrier;

    this.updateBillByCarrier(saleModel, carrier);
  }

  updateBillByCarrier(saleModel: any, carrier: any) {
    if(carrier) {
      saleModel.DeliveryPrice = carrier.Config_DefaultFee;
      saleModel.ShipWeight = carrier.Config_DefaultWeight;
    }
    else if(this.saleSetting) {
      saleModel.DeliveryPrice = this.saleSetting.ShipAmount;
      saleModel.ShipWeight = this.saleSetting.Weight;
    }
    else {
      saleModel.DeliveryPrice = saleModel.DeliveryPrice;
    }

    saleModel.DeliveryPrice = saleModel.DeliveryPrice || 0;
    saleModel.ShipWeight = saleModel.ShipWeight || 100;
    saleModel.Ship_Extras = carrier.ExtrasText ? JSON.parse(carrier.ExtrasText) : {};
  }

  updateCOD(saleModel: any, orderForm: any) {
    let formValue = orderForm.value;

    saleModel.AmountTotal = formValue.TotalAmount;
    saleModel.CashOnDelivery = formValue.TotalAmount + saleModel.DeliveryPrice - saleModel.AmountDeposit;
  }

  calculateFee(saleModel: any, orderForm: any, carrier: any, shipExtraServices: any): Observable<any> {
    return new Observable(observer => {
      if(!carrier) {
        observer.next(null);
        observer.complete();
      }
      else {
        let checkValueBill = this.checkValueBill(carrier);
        if(!checkValueBill) {
          this.prepareBillByOrderForm(saleModel, orderForm);

          let model = this.prepareModelCalculate(saleModel, shipExtraServices);
          let checkValueCalculate = this.checkValueCalculateFee(model);

          if(!checkValueCalculate) {
            this.fastSaleOrderService.calculateFeeV2(model).subscribe(res => {
              this.message.info(`Đối tác ${carrier && carrier.Name ? carrier.Name : ""} có phí vận chuyển: ${res.TotalFee}`);

              // TODO: Dịch vụ đối tác mặc định được chọn.

              // Phí ship đối tác
              saleModel.CustomerDeliveryPrice = res.TotalFee;
              if(TDSHelperArray.hasListValue(res.Services)) {
                this.selectShipService(res.Services[0], saleModel, shipExtraServices);
              }

              observer.next(res);
              observer.complete();

            }, error => observer.error(error));
          }
          else observer.error(checkValueCalculate);
        }
        else observer.error(checkValueBill);
      }
    });
  }

  checkValueBill(carrier: any) {
    let result = null;
    if(!this.existApiDeliveries(carrier.DeliveryType)) {
      result = "Không tìm thấy loại giao hàng.";
    }

    return result
  }

  checkValueCalculateFee(model: any) {
    let result = null;
    if(!model.ShipWeight || model.ShipWeight <= 0) {
      result = "Khối lượng phải lớn hơn 0.";
    }

    return result;
  }

  prepareBillByOrderForm(saleModel: any, orderForm: any) {
    let formValue = orderForm.value;

    saleModel.PartnerId = formValue.PartnerId;
    saleModel.Partner = formValue.Partner && formValue.Partner.Id ? formValue.Partner.Id : null;
    saleModel.FacebookId = formValue.Facebook_UserId;
    saleModel.FacebookName = formValue.Facebook_UserName || formValue.Name || formValue.PartnerName;
    saleModel.Facebook_ASUserId = formValue.Facebook_ASUserId;

    saleModel.Tax = formValue.Tax;
    saleModel.Discount = formValue.Discount;
    saleModel.AmountTax = formValue.AmountTax;
    saleModel.AmountUntaxed = formValue.AmountUntaxed;
    saleModel.DecreaseAmount = formValue.DecreaseAmount;
    saleModel.DiscountAmount = formValue.DiscountAmount;
    saleModel.PaymentAmount = formValue.PaymentAmount || 0;

    saleModel.TaxId = formValue.Tax ? formValue.Tax.Id : null;
    saleModel.User = formValue.User;
    saleModel.UserId = formValue.User ? formValue.User.Id : null

    saleModel.CompanyId = saleModel.Company ? saleModel.Company.Id : 0;
    saleModel.AccountId = saleModel.Account ? saleModel.Account.Id : 0;
    saleModel.JournalId = saleModel.Journal ? saleModel.Journal.Id : 0;
    saleModel.PriceListId = saleModel.PriceList ? saleModel.PriceList.Id : 0;
    saleModel.WarehouseId = saleModel.Warehouse ? saleModel.Warehouse.Id : 0;

    saleModel.Carrier = saleModel.Carrier != null && saleModel.Carrier.Id ? saleModel.Carrier : null;
    saleModel.CarrierId = saleModel.Carrier != null && saleModel.Carrier.Id ? saleModel.Carrier.Id : null;

    saleModel.PaymentJournalId = saleModel.PaymentJournal != null ? saleModel.PaymentJournal.Id : null;

    // Xóa detail gán lại
    saleModel.OrderLines = [];

    formValue.Details.forEach((element: TDSSafeAny) => {
      if (!saleModel.OrderLines)
        saleModel.OrderLines = [];

      saleModel.OrderLines.push({
        ProductId: element.ProductId,
        ProductUOMId: element.UOMId,
        ProductUOMQty: element.Quantity,
        PriceUnit: element.Price,
        Discount: 0,
        Discount_Fixed: 0,
        Type: "fixed",
        PriceSubTotal: element.Price * element.Quantity,
        Note: element.Note
      });
    });

    saleModel.Ship_Receiver = {
      Name: formValue.PartnerName || formValue.Name,
      Phone: formValue.Telephone,
      Street: formValue.Street || formValue.Address,
      City: formValue.City,
      District: formValue.District,
      Ward: formValue.Ward
    };
  }

  prepareModelCalculate(saleModel: any, shipExtraServices: any) {
    let model = {} as ModelCalculateFeeV2;

    model.PartnerId = saleModel.PartnerId || (saleModel.Partner && saleModel.Partner.Id ? (saleModel.Partner.Id) : null),
    model.CompanyId = saleModel.Company ? saleModel.Company.Id : saleModel.CompanyId,
    model.CarrierId = saleModel.Carrier ? saleModel.Carrier.Id : null,
    model.ServiceId = saleModel.Ship_ServiceId || '',
    model.InsuranceFee = saleModel.Ship_InsuranceFee || 0,
    model.ShipWeight = saleModel.ShipWeight,
    model.CashOnDelivery = saleModel.CashOnDelivery,
    model.ServiceExtras = [],
    model.Ship_Receiver = {}

    shipExtraServices = shipExtraServices && shipExtraServices.length > 0 ? shipExtraServices : [];

    shipExtraServices.map((x: TDSSafeAny) => {
      if (x.IsSelected) {
        model.ServiceExtras.push({
          Id: x.ServiceId,
          Name: x.ServiceName,
          Fee: x.Fee,
          Type: x.Type,
          ExtraMoney: x.ExtraMoney
        });
      }
    });

    model.Ship_Receiver = saleModel.Ship_Receiver;

    return model;
  }

  // Dịch vụ
  selectShipService(shipService: any, saleModel: any, shipExtraServices: any[]) {
    if(shipService) {
      saleModel.Ship_ServiceId = shipService.ServiceId;
      saleModel.Ship_ServiceName = shipService.ServiceName;
      saleModel.CustomerDeliveryPrice = shipService.TotalFee;
    }

    debugger;

    let oldShipExtraServices = shipExtraServices.map(x => ({...x}));

    if(shipService && TDSHelperArray.hasListValue(shipService.Extras)) {
      shipExtraServices.length = 0;

      shipService.Extras.forEach((item: any) => {
        shipExtraServices.push(item);
      });

      let listServiceTemp: any[] = [];

      oldShipExtraServices.forEach(old => {
        let exist = shipExtraServices.filter(s => s.ServiceId === old.ServiceId)[0];

        if(exist) {
          exist.IsSelected = old.IsSelected;
          if (exist.ServiceId == 'XMG' && saleModel.Carrier.DeliveryType == 'ViettelPost' && exist.IsSelected == true) {
            exist.ExtraMoney = ( saleModel.Ship_Extras &&
              saleModel.Ship_Extras.IsCollectMoneyGoods &&
              saleModel.Ship_Extras.CollectMoneyGoods) ?
              saleModel.Ship_Extras.CollectMoneyGoods :
              saleModel.CustomerDeliveryPrice;
          }else {
            listServiceTemp.push(old);
          }
        }
      });

      shipExtraServices = [...shipExtraServices, ...listServiceTemp];
    }
    else {
      shipExtraServices.length = 0;
    }
  }

  // Cập nhật giá dịch vụ giao hàng
  onUpdateInsuranceFee(serviceId: any, saleModel: any, orderForm: any, shipExtraServices: Array<any>): Observable<any> {
    return Observable.create((observer: TDSSafeAny) => {
      let carrier = saleModel.Carrier;
      this.calculateFee(carrier, saleModel, orderForm, shipExtraServices)
      .subscribe((res: any) => {
        if (res.Costs && res.Costs.length > 0) {
          res.Costs.map((x: TDSSafeAny) => {
            let exist = shipExtraServices.filter(s => s.ServiceId === x.ServiceId)[0];
            if (exist) {
              exist.Fee = x.TotalFee;
            }
          });
        } else {
          let exist = shipExtraServices.filter(s => s.ServiceId === serviceId)[0];
          if (exist) {
            exist.Fee = 0;
          }
        }

        observer.next();
        observer.complete();

      }, error => {
        observer.error();
      });
    });
  }

  // Dịch vụ bổ xung
  onCheckExtraService(extrasShip: any, shipServices: any[], saleModel: any, orderForm: any, shipExtraServices: Array<any>): Observable<any> {
    return new Observable(observer => {
      let enableInsuranceFee: TDSSafeAny = null;

      if (extrasShip.ServiceId === "16" || extrasShip.ServiceId === "GBH" || extrasShip.ServiceId === "OrderAmountEvaluation") {
        enableInsuranceFee = extrasShip.IsSelected;

        saleModel.Ship_InsuranceFee = saleModel.Ship_Extras.InsuranceFee || saleModel.AmountTotal;

        this.onUpdateInsuranceFee(extrasShip.ServiceId, saleModel, orderForm, shipExtraServices).subscribe(
          res => {
            observer.next(enableInsuranceFee);
            observer.complete();
          },
          error => {
            extrasShip.IsSelected = !extrasShip.IsSelected;
            enableInsuranceFee = extrasShip.IsSelected;

            observer.next(enableInsuranceFee);
            observer.complete();
          });

      } else if (saleModel.Carrier.DeliveryType === "EMS") {

        this.onUpdateInsuranceFee(extrasShip.ServiceId, saleModel, orderForm, shipExtraServices).subscribe(res => {
          observer.next(enableInsuranceFee);
          observer.complete();
        }, error =>{
          observer.next(enableInsuranceFee);
          observer.complete();
        });

      } else if (saleModel.Carrier.DeliveryType === "NinjaVan") {
        saleModel.Ship_InsuranceFee = saleModel.Ship_Extras.InsuranceFee || saleModel.AmountTotal;
        enableInsuranceFee = extrasShip.IsSelected;

        if (!extrasShip.IsSelected) {
          saleModel.Ship_InsuranceFee = 0;
        }

        observer.next(enableInsuranceFee);
        observer.complete();
      } else {
        var service = shipServices.filter(x => x.ServiceId === saleModel.Ship_ServiceId)[0];
        let totalFee: number = 0;

        if (service) {
          service.TotalFee;

          if (shipExtraServices) {
            shipExtraServices.map(x => {
              if (x.IsSelected) {
                totalFee += x.Fee;
              }
            });
          }

          saleModel.CustomerDeliveryPrice += totalFee;
        }

        if (extrasShip.ServiceId === "XMG" && saleModel.Carrier.DeliveryType === "ViettelPost" && extrasShip.IsSelected == true) {
          extrasShip.ExtraMoney = (saleModel.Ship_Extras && saleModel.Ship_Extras.IsCollectMoneyGoods && saleModel.Ship_Extras.CollectMoneyGoods)
          ? saleModel.Ship_Extras.CollectMoneyGoods : totalFee || saleModel.CustomerDeliveryPrice;
        }

        observer.next(enableInsuranceFee);
        observer.complete();
      }

    });

  }
}
