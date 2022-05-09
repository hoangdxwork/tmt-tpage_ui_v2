import { TDSSafeAny } from 'tmt-tang-ui';
import { Injectable } from "@angular/core";
import { FastSaleOrderService } from '../fast-sale-order.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { FastSaleOrderDTO } from '../../dto/bill/bill.dto';
import { map } from 'rxjs/operators';
import { FastSaleOrderDefaultDTO } from '../../dto/fastsaleorder/fastsaleorder.dto';
import { DeliveryCarrierService } from '../delivery-carrier.service';
import { DeliveryCarrierDTO } from '../../dto/carrier/delivery-carrier.dto';
import { CommonService } from '../common.service';
import { GeneralConfigsFacade } from '../facades/general-config.facade';


@Injectable({
  providedIn: 'root'
})
export class CheckFormHandler {

  lstCarriers!: DeliveryCarrierDTO[];
  saleConfig: TDSSafeAny;
  billDefault$!: Observable<FastSaleOrderDefaultDTO>;
  fastSaleOrderFormDefault!: FastSaleOrderDefaultDTO;

  constructor(
    private fastSaleOrderService: FastSaleOrderService,
    private deliveryCarrierService: DeliveryCarrierService,
    private generalConfigsFacade: GeneralConfigsFacade
  ) {
    this.loadData();
  }

  loadData() {
    this.deliveryCarrierService.dataCarrierActive$.subscribe(res => {
      this.lstCarriers = res;
    });
  }

  loadSaleConfig() {
    this.generalConfigsFacade.getSaleConfigs().subscribe(res => {
      this.saleConfig = res;
    });
  }

  checkValueModelCalculateFeeV2(model: TDSSafeAny) {
    let result = { status: false, model: null, error: "" };

    if (!model.ShipWeight || model.ShipWeight == 0) {
      result.error = "Khối lượng phải lớn hơn 0";
      return result;
    }

    result.status = result.error ? false : true;
    result.model = model;

    return result;
  }

  getBill(): Observable<FastSaleOrderDefaultDTO> {
    if(this.billDefault$) return this.billDefault$;

    this.billDefault$ = new Observable(observer => {
      this.getBillDefault().subscribe((bill: any) => {
          delete bill['@odata.context'];
          observer.next(bill);
          observer.complete();
      }, error => { observer.error(error) });
    });

    return this.billDefault$;
  }

  getBillDefault(): Observable<FastSaleOrderDefaultDTO> {
    return new Observable(observer => {
      if(this.fastSaleOrderFormDefault) {
        observer.next(this.fastSaleOrderFormDefault);
        observer.complete();
      }
      else {
        let typeInvoice = { "model": { "Type": "invoice" } };

        this.fastSaleOrderService.getDefault(typeInvoice)
          .pipe(map((res) => {
            this.updateBill(res);
            return res;
          }))
          .subscribe(res => {
            this.fastSaleOrderFormDefault = res;

            observer.next(this.fastSaleOrderFormDefault);
            observer.complete();
          });
      }
    });
  }

  updateBill(billDefault: FastSaleOrderDefaultDTO) {

    !billDefault.Ship_Extras && (billDefault.Ship_Extras = {});

    if(billDefault.Carrier) {
      // !billDefault.Carrier && (billDefault.Carrier = carrier);

      billDefault.DeliveryPrice = billDefault.Carrier?.Config_DefaultFee || billDefault.DeliveryPrice || 0;
      billDefault.ShipWeight = billDefault.Carrier?.Config_DefaultWeight || billDefault.ShipWeight || 100;

      billDefault.Ship_Extras = JSON.parse((billDefault.Carrier?.ExtrasText || "{}"));
    }

    billDefault.CashOnDelivery = billDefault.DeliveryPrice;

    if(this.saleConfig) {
      if (this.saleConfig.roles && (!billDefault.DeliveryPrice || billDefault.DeliveryPrice < 1)) {
        billDefault.DeliveryPrice = this.saleConfig.roles.ShipAmount;
      }

      if (this.saleConfig.roles && (!billDefault.ShipWeight || billDefault.ShipWeight < 1)) {
        billDefault.ShipWeight = this.saleConfig.roles?.Weight || 100;
      }
    }
  }

}
