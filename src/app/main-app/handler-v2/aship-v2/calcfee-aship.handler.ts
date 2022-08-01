
import { formatNumber } from "@angular/common";
import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Observable } from "rxjs";
import { AshipGetInfoConfigProviderDto } from "src/app/main-app/dto/carrierV2/aship-info-config-provider-data.dto";
import { CalculateFeeInsuranceInfoResponseDto, CalculateFeeServiceResponseDto } from "src/app/main-app/dto/carrierV2/delivery-carrier-response.dto";
import { DeliveryCarrierDTOV2 } from "src/app/main-app/dto/delivery-carrier.dto";
import { FastSaleOrder_DefaultDTOV2, ShipServiceExtra } from "src/app/main-app/dto/fastsaleorder/fastsaleorder-default.dto";
import { TDSMessageService } from "tds-ui/message";
import { TDSHelperArray } from "tds-ui/shared/utility";
import { FastSaleOrderService } from "../../services/fast-sale-order.service";

@Injectable({
  providedIn: 'root'
})

export class CalculateFeeAshipHandler {

  constructor(private fastSaleOrderService: FastSaleOrderService,
      private message: TDSMessageService) {
  }

  public calculateFeeAship(model: any, carrier: DeliveryCarrierDTOV2, configsProviderDataSource: AshipGetInfoConfigProviderDto[]): Observable<any> {
      return new Observable((observer: any) => {

          this.fastSaleOrderService.calculateFeeAship(model).subscribe((res: any) => {

              if(res && res.Data?.Services) {
                  let extras = carrier.ExtraProperties ? (JSON.parse(carrier.ExtraProperties) ?? []).filter((x: any) => !x.IsHidden) : [] as AshipGetInfoConfigProviderDto[];

                  if(TDSHelperArray.hasListValue(extras) && TDSHelperArray.hasListValue(configsProviderDataSource)) {
                      extras.map((x: AshipGetInfoConfigProviderDto) => {
                          let exits = configsProviderDataSource.filter(e => e.ConfigName === x.ConfigName && (x.ConfigsValue.find(t => t.Id == e.ConfigValue)))[0];
                          if(exits) {
                              x.ConfigValue = exits.ConfigValue;
                          }
                      })
                  }

                  configsProviderDataSource = [...extras];

                  let objAs = {
                      configs: configsProviderDataSource,
                      data: res.Data
                  }

                  observer.next(objAs);
                  observer.complete();
              }

              else {
                  if (res && res.Error) {
                      this.message.error(res.Error.Message);
                  }

                  observer.next();
                  observer.complete();
              }

          }, err => {
              observer.next(err);
              observer.complete();
          })
      })
  }


  // cal() {
  //   if(!this.saleModel.Carrier) {
  //       return this.message.error('Vui lòng chọn  đối tác giao hàng');
  //   }

  //   if (!this.saleModel) {
  //       return this.message.error('Vui lòng chọn nhập khối lượng');
  //   }

  //   let model = this.prepareModelFeeV2();
  //   this.isCalcFee = true;

  //   this.calculateFeeAshipHandler.calculateFeeAship(model, event, this.configsProviderDataSource).subscribe((res) => {
  //       if(res) {debugger
  //           this.configsProviderDataSource = [];
  //           this.configsProviderDataSource = res.configs;

  //           this.insuranceInfo = res.data?.InsuranceInfo ?? null;
  //           this.shipServices = res.data?.Services ?? [];

  //           if(TDSHelperArray.hasListValue(this.shipServices)) {

  //               let svDetail = this.shipServices[0] as CalculateFeeServiceResponseDto;
  //               this.selectShipServiceV2(svDetail);

  //               this.message.success(`Đối tác ${event.Name} có phí vận chuyển: ${formatNumber(Number(svDetail.TotalFee), 'en-US', '1.0-0')} đ`);
  //           }
  //       }

  //       this.isCalcFee = false;
  //   }, error => {
  //       this.isCalcFee = false;
  //       this.message.error(error.error?.message || error.error?.error_description);
  //   })

  // }

}
