import { TDSSafeAny } from 'tmt-tang-ui';
import { Injectable } from "@angular/core";


@Injectable({
  providedIn: 'root'
})
export class CheckFormHandler {

  constructor(
  ) {

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
}
