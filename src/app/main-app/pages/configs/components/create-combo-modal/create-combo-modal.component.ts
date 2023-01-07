import { ProductComboDto } from './../../../../dto/product/product-combo.dto';
import { TDSSafeAny, TDSHelperString } from 'tds-ui/shared/utility';
import { THelperDataRequest } from './../../../../../lib/services/helper-data.service';
import { FilterObjDTO } from './../../../../services/mock-odata/odata-product.service';
import { OdataProductService } from 'src/app/main-app/services/mock-odata/odata-product.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TDSMessageService } from 'tds-ui/message';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSDestroyService } from 'tds-ui/core/services';
import { takeUntil, finalize } from 'rxjs';
import { ProductDTOV2 } from 'src/app/main-app/dto/product/odata-product.dto';
import { TDSModalRef } from 'tds-ui/modal';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-create-combo-modal',
  templateUrl: './create-combo-modal.component.html',
  providers: [TDSDestroyService]
})
export class CreateComboModalComponent implements OnInit {
  
  @Input() data!: ProductComboDto;
  @Output() getProductCombo$ = new EventEmitter<any>();

  _form!: FormGroup;
  isLoading: boolean = false;

  lstProductCombo: Array<ProductDTOV2> = [];
  filterObj: FilterObjDTO = {
    searchText: ''
  };

  numberWithCommas =(value:TDSSafeAny) =>{
    if(value != null)
    {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return value;
  } ;
  
  parserComas = (value: TDSSafeAny) =>{
    if(value != null)
    {
      return TDSHelperString.replaceAll(value,'.','');
    }
    return value;
  };

  constructor(private modal: TDSModalRef,
    private fb: FormBuilder,
    private destroy$: TDSDestroyService,
    private message: TDSMessageService,
    private productService: OdataProductService) { 
      this.createForm();
    }

  ngOnInit(): void { 
    if(this.data){
      this._form.patchValue(this.data);
    }

    this.loadData();
  }

  createForm(){
    this._form = this.fb.group({
      Product: [null, Validators.required],
      Quantity: [1],
      ProductId: [null]
    })
  }

  loadData(){
    this.isLoading = true;

    let filter = this.productService.buildFilter(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(10,1,filter);
    
    this.productService.getProductCombo(params).pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false)).subscribe(res => {
      this.lstProductCombo = res.value;
    },
    err => {
      this.message.error(err?.error?.message || Message.Product.CanNotLoadData);
    });
  }

  getProductId(product:ProductDTOV2){
    this._form.controls["ProductId"].setValue(product.Id);
  }

  onSearch(event: TDSSafeAny){
    this.filterObj.searchText = event.keyupEvent.target.value;

    this.loadData();
  }

  onSave(isCreate?: boolean){
    if(this._form.invalid){
      this.message.error('Vui lòng chọn sản phẩm');
      return
    }

    this.getProductCombo$.emit(this._form.value);
    
    if(isCreate){
      this.createForm();
    }else{
      this.cancel();
    }
  }

  cancel(){
    this.modal.destroy(null);
  }
}
