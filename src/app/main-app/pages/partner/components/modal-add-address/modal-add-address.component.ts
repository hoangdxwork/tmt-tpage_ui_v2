import { CheckAddressDTO } from './../../../../dto/address/address.dto';
import { CityDTO, DistrictDTO, WardDTO } from './../../../../dto/partner/partner-register-payment.dto';
import { TDSModalRef } from 'tmt-tang-ui';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-add-address',
  templateUrl: './modal-add-address.component.html',
  styleUrls: ['./modal-add-address.component.scss']
})

export class ModalAddAddressComponent implements OnInit {

  _form!: FormGroup

  @Input() _cities!: CityDTO;
  @Input() _districts!: DistrictDTO;
  @Input() _wards!: WardDTO;
  @Input() _street!: string;
  public items!: CheckAddressDTO;

  constructor(private fb: FormBuilder,
    private modal: TDSModalRef) { }

  ngOnInit(): void {
    this._districts;
  }

  onChangeAddress(item: CheckAddressDTO) {
      this.items = item;
  }

  onCancel() {
      this.modal.destroy(null);
  }

  onSave() {
    this.modal.destroy(this.items);
  }

}
