import { formatNumber } from "@angular/common";
import { EventEmitter, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TAPIDTO, TApiMethodType, TAuthService, TCommonService, UserInitDTO } from "src/app/lib";
import { TDSMessageService, TDSSafeAny } from "tmt-tang-ui";
import { BaseSevice } from "../base.service";
import { CommonService } from "../common.service";
import { FastSaleOrderService } from "../fast-sale-order.service";
import { CarrierHandler } from "./carier.handler";
import { CheckFormHandler } from "./check-form.handler";
import { FastSaleOrderHandler } from "./fast-sale-order.handler";

export interface ChangeCarrierResult {
  TypeShipExtra: any,
  EnableInsuranceFee: boolean,
  ShipServices: any,
  Costs: any
}

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

@Injectable({
  providedIn: 'root'
})
export class SaleOnline_OrderHandler extends BaseSevice {
  protected prefix: string = "";
  protected table: string = "";
  protected baseRestApi: string = "";

  userInit!: UserInitDTO;
  companyId: TDSSafeAny;
  saleConfig: TDSSafeAny;

  constructor(
    private apiService: TCommonService,
    private auth: TAuthService,
    private message: TDSMessageService,
    private commonService: CommonService,
    private carrierHandler: CarrierHandler,
    private checkFormHandler: CheckFormHandler,
    private fastSaleOrderHandler: FastSaleOrderHandler,
    private fastSaleOrderService: FastSaleOrderService
  ) {
    super(apiService);

    this.loadUserInfo();
    this.loadSaleConfig();
  }

  loadUserInfo() {
    this.auth.getUserInit().subscribe(res => {
      this.userInit = res || {};
      this.companyId = this.userInit?.Company?.Id;
    })
  }

  loadSaleConfig() {
    this.commonService.getConfigs().subscribe(res => {
      this.saleConfig = res;
    });
  }

  resetExtrasServices(result: ChangeCarrierResult) {
    result.EnableInsuranceFee = false;
    result.ShipServices = [];
  }

  changeCarrier(saleModel: any, orderForm: any, carrier: any, shipExtraServices: Array<any>): Observable<ChangeCarrierResult> {
    let result = {} as ChangeCarrierResult;

    this.resetExtrasServices(result);

    carrier && (carrier.CompanyId = this.companyId || carrier.CompanyId);

    this.changeCarrierUpdateDeliveryPrice(saleModel, orderForm, carrier);

    result.TypeShipExtra = this.initShipExtraServices(carrier, shipExtraServices);

    return Observable.create((observer: TDSSafeAny) => {
      // Cập nhật dịch vụ bổ xung
      this.calculateFeeHandler(carrier, saleModel, orderForm, shipExtraServices).subscribe(data => {
        result.EnableInsuranceFee = this.selectShipServicesModel(saleModel, carrier, shipExtraServices);
        result.ShipServices = data.Services;
        result.Costs = data.Costs;

        observer.next(result);
        observer.complete();
      }, error => {
        if(carrier) {
          observer.error(error);
        }
        else {
          observer.next(result);
          observer.complete();
        }
      });
    });
  }

  changeCarrierUpdateDeliveryPrice(saleModel: any, orderForm: any, carrier: any) {
    if(saleModel && saleModel.DeliveryPrice) {
      var oldDeliveryPrice = Object.assign(saleModel.DeliveryPrice);
    }

    this.changeCarrierUpdateInformation(saleModel, carrier);

    debugger;

    // Cập nhật tiền thu hộ
    if((saleModel.DeliveryPrice && oldDeliveryPrice != saleModel.DeliveryPrice) || saleModel.CashOnDelivery === 0) {
      this.onChangeAmount(saleModel, orderForm);
    }

  }

  onChangeAmount(saleModel: any, orderForm: any) {
    saleModel.DeliveryPrice = saleModel.DeliveryPrice || 0;
    let _form = orderForm.value;

    saleModel.AmountTotal = _form.TotalAmount;
    saleModel.CashOnDelivery = _form.TotalAmount + saleModel.DeliveryPrice - saleModel.AmountDeposit;
  }

  changeCarrierUpdateInformation(saleModel: any, carrier: any) {
    saleModel.Ship_ServiceId = "";
    saleModel.Ship_ServiceName = "";
    saleModel.Carrier = carrier;

    this.carrierHandler.changeCarrier(saleModel, carrier, this.saleConfig.roles);
  }

  // Thêm dịch vụ vận chuyển bổ xung bởi đối tác giao hàng
  initShipExtraServices(carrier: any, shipExtraServices: Array<any> ) {
    let type = null;

    this.carrierHandler.initNinjaVan(carrier, shipExtraServices) && (type = "NinjaVan");
    this.carrierHandler.initGHTK(carrier, shipExtraServices) && (type = "GHTK");
    this.carrierHandler.initOkieLa(carrier, shipExtraServices) && (type = "OkieLa");

    return type;
  }

  calculateFeeHandler(carrier: any, saleModel: any, orderForm: any, shipExtraServices: any): Observable<any> {
    return Observable.create((observer: TDSSafeAny) => {
      var calculateFeeResult = this.calculateFee(carrier, saleModel, orderForm, shipExtraServices);

      if (calculateFeeResult.error) {
        observer.error(calculateFeeResult.error);
        return;
      }

      saleModel = calculateFeeResult.saleModel;

      shipExtraServices.length = calculateFeeResult.shipExtraServices.length;
      calculateFeeResult.shipExtraServices.forEach((element, index) => {
        shipExtraServices[index] = element;
      });

      // let model = calculateFeeResult.calculateFee;
      let model = this.createModelCalculateFeeV2(saleModel, orderForm, shipExtraServices);
      let checkModel = this.checkFormHandler.checkValueModelCalculateFeeV2(model);

      if(!checkModel["status"]) {
        observer.error(checkModel.error);
        return;
      }

      if (this.companyId) {
        model.CompanyId = this.companyId;
      }

      this.fastSaleOrderService.calculateFeeV2(model).subscribe(res => {
        var format = 'n0';
        this.message.info(`Đối tác ${carrier && carrier.Name ? carrier.Name : ""} có phí vận chuyển: ${res.TotalFee}`);
        // Cập nhật lại phí ship (đối tác)
        saleModel.CustomerDeliveryPrice = res.TotalFee;
        if (res.Services && res.Services.length > 0) {
          this.selectShipService(res.Services[0], saleModel, shipExtraServices);
        }

        observer.next(res);
        observer.complete();

      }, (error: TDSSafeAny) => {
        observer.error(error);
      });

    });
  }

  calculateFee(item: any, saleModel: any, orderForm: any, shipExtraServices: any) {
    var result = {
      saleModel: null,
      calculateFee: null,
      shipExtraServices: [],
      error: ""
    };

    let isDeliveryType = null;

    if (item) {
      isDeliveryType = this.carrierHandler.existApiDeliveries(item.DeliveryType);
    }

    if (isDeliveryType) {
      var prepare = this.fastSaleOrderHandler.prepareBill(saleModel, orderForm, shipExtraServices);

      result.saleModel = prepare.saleModel;
      result.shipExtraServices = prepare.shipExtraServices;

      return result;
    }
    else {
      result.error = "Không tìm thấy loại giao hàng.";
      return result;
    }
  }

  createModelCalculateFeeV2(saleModel: any, orderForm: any, shipExtraServices: any): ModelCalculateFeeV2 {
    let model = {} as ModelCalculateFeeV2;

    let orderValue = orderForm.value;

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

    if (orderValue.Street || orderValue.Address) {
      model.Ship_Receiver = {
        Name: orderValue.PartnerName,
        Street: orderValue.Street || orderValue.Address,
        Phone: orderValue.Telephone,
        City: orderValue.City ? { name: orderValue.City.name, code: orderValue.City.code } : null,
        District: orderValue.District ? { name: orderValue.District.name, code: orderValue.District.code } : null,
        Ward: orderValue.Ward ? { name: orderValue.Ward.name, code: orderValue.Ward.code } : null
      };
    }

    return model;
  }

  selectShipService(shipService: any, saleModel: any, shipExtraServices: Array<any>) {
    if (shipService) {
      saleModel.Ship_ServiceId = shipService.ServiceId;
      saleModel.Ship_ServiceName = shipService.ServiceName;
      saleModel.CustomerDeliveryPrice = shipService.TotalFee;
    }

    let temps = [];

    if (shipExtraServices) {
      temps = shipExtraServices.map(x => x);
    }

    if (shipService.Extras && shipService.Extras.length > 0) {
      shipExtraServices.length = 0;
      shipService.Extras.forEach((element: TDSSafeAny) => {
        shipExtraServices.push(element);
      });

      // shipExtraServices = shipService.Extras;

      var listServiceTemp: Array<any>[] = [];

      temps.map(x => {
        var exist = shipExtraServices.filter(s => s.ServiceId === x.ServiceId)[0];
        if (exist) {
          exist.IsSelected = x.IsSelected;
          if (exist.ServiceId == 'XMG' && saleModel.Carrier.DeliveryType == 'ViettelPost' && exist.IsSelected == true) {
            exist.ExtraMoney = ( saleModel.Ship_Extras &&
              saleModel.Ship_Extras.IsCollectMoneyGoods &&
              saleModel.Ship_Extras.CollectMoneyGoods) ?
              saleModel.Ship_Extras.CollectMoneyGoods :
              saleModel.CustomerDeliveryPrice;
          }
        } else {
          listServiceTemp.push(x);
        }
      });

      listServiceTemp.forEach(sValue => {
        shipExtraServices.push(sValue);
      });

    } else {
      shipExtraServices.length = 0;
    }
    // if (this.saleModel.Ship_Extras && this.saleModel.Ship_Extras.IsDropoff && this.shipExtraServices) {
    //     this.shipExtraServices.map(x => {
    //         if (x.ServiceId === '53337' && this.saleModel.Carrier.DeliveryType === 'GHN') {
    //             x.IsSelected = true;
    //         }
    //         if (x.ServiceId == 'GNG' && this.saleModel.Carrier.DeliveryType === 'ViettelPost') {
    //             x.IsSelected = true;
    //         }
    //     });
    // }
  }

  // Chọn dịch vụ đối tác + trả về phí giá trị hàng hóa.
  selectShipServicesModel(model: any, carrier: any, shipExtraServices: Array<any>) {
    let resultEnable = false;

    shipExtraServices = shipExtraServices || [];
    let shipExtras = carrier && carrier.ExtrasText ? JSON.parse(carrier.ExtrasText): null;

    // Tự động mặc định chọn dịch vụ
    this.selectShipExtraServices(carrier, shipExtraServices);

    // Bảo hiểm, phí giá trị hàng hóa
    let existTypeInsurance = this.carrierHandler.existCarrierTypeInsurance(carrier.DeliveryType);

    if (existTypeInsurance && shipExtras && shipExtras.IsInsurance) {
      let isSelected = shipExtraServices.find(x => x.IsSelected == true);

      if(isSelected) {
        resultEnable = true;

        if (!model.Ship_InsuranceFee) {
          model.Ship_InsuranceFee = shipExtras.InsuranceFee || model.AmountTotal;
        }
      }
    }

    return resultEnable;
  }

  // Dịch vụ đối tác mặc định được chọn.
  selectShipExtraServices(carrier: any, shipExtraServices: Array<any>) {
    let shipExtras = carrier && carrier.ExtrasText ? JSON.parse(carrier.ExtrasText): null;
    shipExtraServices = shipExtraServices || [];

    //
    if (shipExtras && shipExtras.IsDropoff) {
      shipExtraServices.map(x => {
        if (x.ServiceId === '53337' && carrier.DeliveryType === 'GHN') {
          x.IsSelected = true;
        }
        if (x.ServiceId === 'GNG' && carrier.DeliveryType === 'ViettelPost') {
          x.IsSelected = true;
        }
      });
    }

    // Bảo hiểm
    let existTypeInsurance = this.carrierHandler.existCarrierTypeInsurance(carrier.DeliveryType);

    if (existTypeInsurance && shipExtras && shipExtras.IsInsurance) {
      shipExtraServices.map(x => {
        if (x.ServiceId === 'OrderAmountEvaluation' || x.ServiceId === "16" || x.ServiceId === "GBH") {
          x.IsSelected = true;
        }
      });
    }

    // Cho xem hàng
    if (shipExtras && shipExtras.IsPackageViewable) {
      shipExtraServices.map(x => {
        if (x.ServiceId === 'IsPackageViewable' && carrier.DeliveryType === 'MyVNPost') {
          x.IsSelected = true;
        }
        if (x.ServiceId === 'check_before_accept' && carrier.DeliveryType === 'Okiela') {
          x.IsSelected = true;
        }
      });
    }

    //
    if (shipExtras && shipExtras.Is_Fragile  && carrier.DeliveryType === 'OkieLa') {
      shipExtraServices.map(x => {
        if (x.ServiceId === 'is_fragile') {
          x.IsSelected = true;
        }
      });
    }

    //Phí thu tiền xem hàng
    if (shipExtras && shipExtras.IsCollectMoneyGoods && carrier.DeliveryType === 'ViettelPost') {
      shipExtraServices.map(x => {
        if (x.ServiceId === 'XMG') {
          // x.ExtraMoney = (shipExtras && shipExtras.CollectMoneyGoods) ? shipExtras.CollectMoneyGoods : this.saleModel.CustomerDeliveryPrice;
          x.ExtraMoney = (shipExtras && shipExtras.CollectMoneyGoods) ? shipExtras.CollectMoneyGoods : carrier.TotalFee;
          x.IsSelected = true;
        }
      });
    }
  }

  onUpdateInsuranceFee(serviceId: any, saleModel: any, orderForm: any, shipExtraServices: Array<any>): Observable<any> {
    return Observable.create((observer: TDSSafeAny) => {
      let carrier = saleModel.Carrier;
      this.calculateFeeHandler(carrier, saleModel, orderForm, shipExtraServices)
      .subscribe((res: any) => {
        if (res.Costs && res.Costs.length > 0) {
          res.Costs.map((x: TDSSafeAny) => {
            var exist = shipExtraServices.filter(s => s.ServiceId === x.ServiceId)[0];
            if (exist) {
              exist.Fee = x.TotalFee;
            }
          });
        } else {
          var exist = shipExtraServices.filter(s => s.ServiceId === serviceId)[0];
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

}
