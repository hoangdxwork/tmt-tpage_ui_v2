import { Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { FastSaleOrder_DefaultDTOV2, ShipServiceExtra } from "src/app/main-app/dto/fastsaleorder/fastsaleorder-default.dto";
import { TDSHelperArray } from "tds-ui/shared/utility";

@Injectable({
  providedIn: 'root'
})

export class UpdateShipServiceExtrasHandler {

    public updateShipServiceExtras(shipExtraServices: ShipServiceExtra[], _form: FormGroup, fb: FormBuilder) {
      if (TDSHelperArray.isArray(shipExtraServices)) {
        shipExtraServices?.map(x => {
            if(x.IsSelected) {
              this.addShip_ServiceExtras(x, _form, fb);
            }
        })
      }
    }

    public so_updateShipServiceExtras(shipExtraServices: ShipServiceExtra[], saleModel: FastSaleOrder_DefaultDTOV2) {
      if(!TDSHelperArray.hasListValue(saleModel.Ship_ServiceExtras)) {
          saleModel.Ship_ServiceExtras = [] as any[];
      }

      if (TDSHelperArray.hasListValue(shipExtraServices)) {
        shipExtraServices?.map(x => {
            if(x && x.IsSelected) {
                let item = this.so_initShip_ServiceExtras(x);
                saleModel.Ship_ServiceExtras.push(item);
            }
        })
      }

      return {...saleModel};
    }

    public addShip_ServiceExtras(x: any, _form: FormGroup, fb: FormBuilder) {
      let control = <FormArray>_form.controls['Ship_ServiceExtras'];
      control.push(this.initShip_ServiceExtras(x, fb));
    }

    public initShip_ServiceExtras(data: ShipServiceExtra | null, fb: FormBuilder) {
      if(data) {
        return fb.group({
            Id: [data.Id],
            Name: [data.Name],
            Fee: [data.Fee],
            Type: [data.Type],
            ExtraMoney: [data.ExtraMoney],
            OrderTime: [data.OrderTime],
            Pickup_Time: [data.Pickup_Time],
            Pickup_Time_Range_Id: [data.Pickup_Time_Range_Id]
        })
      } else {
        return fb.group({
            Id: [null],
            Name: [null],
            Fee: [0],
            Type: [null],
            ExtraMoney: [null],
            OrderTime: [null],
            Pickup_Time: [null],
            Pickup_Time_Range_Id: [null]
        })
      }
    }

    public so_initShip_ServiceExtras(data: ShipServiceExtra) {
      return {
          Id: data.Id,
          Name: data.Name,
          Fee: data.Fee,
          Type: data.Type,
          ExtraMoney: data.ExtraMoney,
          OrderTime: data.OrderTime,
          Pickup_Time: data.Pickup_Time,
          Pickup_Time_Range_Id: data.Pickup_Time_Range_Id
      }
    }


}
