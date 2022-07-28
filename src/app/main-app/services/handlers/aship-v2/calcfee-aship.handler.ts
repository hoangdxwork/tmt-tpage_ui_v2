
import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { AshipGetInfoConfigProviderDto } from "src/app/main-app/dto/carrierV2/aship-info-config-provider-data.dto";
import { CalculateFeeInsuranceInfoResponseDto } from "src/app/main-app/dto/carrierV2/delivery-carrier-response.dto";
import { DeliveryCarrierDTOV2 } from "src/app/main-app/dto/delivery-carrier.dto";
import { FastSaleOrder_DefaultDTOV2, ShipServiceExtra } from "src/app/main-app/dto/fastsaleorder/fastsaleorder-default.dto";
import { TDSMessageService } from "tds-ui/message";
import { FastSaleOrderService } from "../../fast-sale-order.service";

@Injectable({
  providedIn: 'root'
})

export class CalculateFeeAshipHandler {


  constructor(private fastSaleOrderService: FastSaleOrderService,
    private message: TDSMessageService) {

  }

  public calculateFeeAship(carrier: DeliveryCarrierDTOV2, configsProviderDataSource: AshipGetInfoConfigProviderDto[]) {

  }

}
