import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { ResultCheckAddressDTO } from 'src/app/main-app/dto/address/address.dto';
import { SuggestCitiesDTO, SuggestDistrictsDTO, SuggestWardsDTO } from 'src/app/main-app/dto/suggest-address/suggest-address.dto';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

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
  @Input() isSelectAddress!: boolean; // chọn mở modal từ tab partner và order
  public items!: ResultCheckAddressDTO;

  constructor(private fb: FormBuilder,
    private modal: TDSModalRef,
    private modalService: TDSModalService) { }

  ngOnInit(): void {
  }

  onLoadSuggestion(item: ResultCheckAddressDTO) {
    this.items = item;
  }

  onCancel() {
    if( this.isSelectAddress){
      if(!this.items){
        let item: ResultCheckAddressDTO = {
            Address: this._street,
            CityCode: this._cities ? this._cities.code :null,
            CityName: this._cities ? this._cities?.name : null,
            DistrictCode:  this._districts ? this._districts?.code : null,
            DistrictName: this._districts ? this._districts?.name : null,
            WardCode: this._wards ? this._wards?.code : null,
            WardName: this._wards ? this._wards?.name : null
        } as any;

        this.modal.destroy(item);
        return
      }
      this.modal.destroy(null);
      return
    }
    this.modalService.warning({
      title: 'Địa chỉ',
      content: 'Bạn có muốn giữ địa chỉ này',
      onOk: () => this.onSave(),
      onCancel:()=>{ this.modal.destroy(null); },
      okText:"Có",
      cancelText:"Không",
      confirmViewType: "compact",
    });
  }

  onSave() {
    if(this.items){
      this.modal.destroy(this.items);
    }
  }
}
