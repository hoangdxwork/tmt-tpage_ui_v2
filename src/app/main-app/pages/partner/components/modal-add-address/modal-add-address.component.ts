import { CheckAddressDTO, ResultCheckAddressDTO } from './../../../../dto/address/address.dto';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { SuggestCitiesDTO, SuggestDistrictsDTO, SuggestWardsDTO } from 'src/app/main-app/dto/suggest-address/suggest-address.dto';
import { TDSModalRef } from 'tds-ui/modal';

@Component({
  selector: 'app-modal-add-address',
  templateUrl: './modal-add-address.component.html',
})

export class ModalAddAddressComponent implements OnInit {

  _form!: FormGroup

  @Input() _cities!: SuggestCitiesDTO ;
  @Input() _districts!: SuggestDistrictsDTO;
  @Input() _wards!: SuggestWardsDTO;
  @Input() _street!: string;
  public items!: ResultCheckAddressDTO;

  constructor(private fb: FormBuilder,
    private modal: TDSModalRef) { }

  ngOnInit(): void {
  }

  onLoadSuggestion(item: ResultCheckAddressDTO) {
    this.items = item;
  }

  onCancel() {
      this.modal.destroy(null);
  }

  onSave() {debugger
    this.modal.destroy(this.items);
  }

}
