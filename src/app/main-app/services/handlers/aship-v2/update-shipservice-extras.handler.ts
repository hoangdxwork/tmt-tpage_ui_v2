import { Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { ShipServiceExtra } from "src/app/main-app/dto/fastsaleorder/fastsaleorder-default.dto";

@Injectable({
  providedIn: 'root'
})

export class UpdateShipServiceExtrasHandler {

    public updateShipServiceExtras(shipExtraServices: ShipServiceExtra[], _form: FormGroup, fb: FormBuilder) {
      if (shipExtraServices) {
        shipExtraServices.map(x => {
          if(x.IsSelected) {
            this.addShip_ServiceExtras(x, _form, fb);
          }
        })
      }
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
}
