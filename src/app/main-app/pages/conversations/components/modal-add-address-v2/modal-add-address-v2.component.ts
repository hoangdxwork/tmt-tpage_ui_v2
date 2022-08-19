import { TDSModalRef } from 'tds-ui/modal';
import { ResultCheckAddressDTO } from 'src/app/main-app/dto/address/address.dto';
import { SuggestCitiesDTO, SuggestDistrictsDTO, SuggestWardsDTO } from 'src/app/main-app/dto/suggest-address/suggest-address.dto';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-add-address-v2',
  templateUrl: './modal-add-address-v2.component.html'
})
export class ModalAddAddressV2Component implements OnInit {

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

  onSave() {
    this.modal.destroy(this.items);
  }
}
