import { TDSSafeAny, TDSModalRef } from 'tmt-tang-ui';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { CheckAddressDTO } from 'src/app/main-app/dto/address/address.dto';

@Component({
  selector: 'app-update-info-partner',
  templateUrl: './update-info-partner.component.html',
})
export class UpdateInfoPartnerComponent implements OnInit {

  @Input() partner: TDSSafeAny;

  formUpdateInfo!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalRef: TDSModalRef,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.updateForm();
  }

  createForm() {
    this.formUpdateInfo = this.fb.group({
      Name: [null, [Validators.required]],
      Phone: [null],
      Street: [null],
      City: [null],
      District: [null],
      Ward: [null],
    });
  }

  updateForm() {
    if(this.partner) {
      this.formUpdateInfo.controls["Name"].setValue(this.partner.Name);
      this.formUpdateInfo.controls["Phone"].setValue(this.partner.Phone);
      this.formUpdateInfo.controls["Street"].setValue(this.partner.Street || this.partner.Address);

      this.formUpdateInfo.controls["City"].setValue( this.partner?.City?.code ? {
        Code: this.partner.City.code,
        Name: this.partner.City.name,
      } : null);

      this.formUpdateInfo.controls["District"].setValue( this.partner?.District?.code ? {
        Code: this.partner.District.code,
        Name: this.partner.District.name,
      } : null);

      this.formUpdateInfo.controls["Ward"].setValue( this.partner?.Ward?.code ? {
        Code: this.partner.Ward.code,
        Name: this.partner.Ward.name,
      } : null);

    }
  }

  save() {
    if (this.formUpdateInfo.valid) {
      let result = this.prepareModel();
      this.modalRef.destroy(result);
    }
  }

  prepareModel() {
    let formValue = this.formUpdateInfo.value;

    let model: TDSSafeAny = {
      Name: formValue["Name"],
      Phone: formValue["Phone"],
      Street: formValue["Street"],
      City: formValue["City"]?.Code ? {code: formValue["City"].Code, name: formValue["City"].Name } : null,
      District: formValue["District"]?.Code ? {code: formValue["District"].Code, name: formValue["District"].Name } : null,
      Ward: formValue["Ward"]?.Code ? {code: formValue["Ward"].Code, name: formValue["Ward"].Name } : null,
    };

    return model;
  }

  onChangeAddress(event: CheckAddressDTO) {
    let formControls = this.formUpdateInfo.controls;

    formControls["Street"].setValue(event.Street);

    formControls["City"].setValue( event.City?.Code ? {
      Code: event.City?.Code,
      Name: event.City?.Name
    } : null);

    formControls["District"].setValue( event.District?.Code ? {
      Code: event.District?.Code,
      Name: event.District?.Name,
    } : null);

    formControls["Ward"].setValue( event.Ward?.Code ? {
      Code: event.Ward?.Code,
      Name: event.Ward?.Name,
    } : null);
  }

  onCancel() {
    this.modalRef.destroy(null);
  }


}
