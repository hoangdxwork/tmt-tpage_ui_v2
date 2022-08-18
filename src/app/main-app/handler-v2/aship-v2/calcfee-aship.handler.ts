
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AshipGetInfoConfigProviderDto } from "src/app/main-app/dto/carrierV2/aship-info-config-provider-data.dto";
import { DeliveryCarrierDTOV2 } from "src/app/main-app/dto/delivery-carrier.dto";
import { TDSMessageService } from "tds-ui/message";
import { TDSHelperArray } from "tds-ui/shared/utility";
import { FastSaleOrderService } from "../../services/fast-sale-order.service";

@Injectable()

export class CalculateFeeAshipHandler {

  constructor(private fastSaleOrderService: FastSaleOrderService,
      private message: TDSMessageService) {
  }

  public calculateFeeAship(model: any, carrier: DeliveryCarrierDTOV2, configsProviderDataSource: AshipGetInfoConfigProviderDto[]): Observable<any> {
      return new Observable((observer: any) => {

          this.fastSaleOrderService.calculateFeeAship(model).subscribe({
              next: (res: any) => {

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

                    configsProviderDataSource = [];
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
              },
              error: (error: any) => {
                  observer.next(error);
                  observer.complete();
              }
          })
        })
      }
}
