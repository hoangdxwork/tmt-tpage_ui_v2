import { TDSModalRef } from 'tmt-tang-ui';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { SuggestCitiesDTO, SuggestDistrictsDTO, SuggestWardsDTO } from 'src/app/main-app/dto/suggest-address/suggest-address.dto';
import { ResultCheckAddressDTO } from 'src/app/main-app/dto/address/address.dto';
import { AddressesV2 } from 'src/app/main-app/dto/partner/partner-detail.dto';

@Component({
  selector: 'app-modal-add-address',
  templateUrl: './modal-add-address.component.html',
  styleUrls: ['./modal-add-address.component.scss']
})

export class ModalAddAddressComponent implements OnInit {

  _form!: FormGroup

  @Input() _cities!: SuggestCitiesDTO;
  @Input() _districts!: SuggestDistrictsDTO;
  @Input() _wards!: SuggestWardsDTO;
  @Input() _street!: string;
  public items!: ResultCheckAddressDTO;

  constructor( private fb: FormBuilder,
    private modal: TDSModalRef) { }

  ngOnInit(): void {
    this._districts; debugger
  }

  onLoadSuggestion(item: ResultCheckAddressDTO) {
      this.items = item;
  }

  onCancel() {
      this.modal.destroy(null);
  }

  onSave() {
    this.modal.destroy(this.items);
  }
}
