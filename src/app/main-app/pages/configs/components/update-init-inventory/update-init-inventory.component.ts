import { TDSHelperString } from 'tds-ui/shared/utility';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { takeUntil, mergeMap } from 'rxjs';
import { StockChangeProductQtyService } from './../../../../services/stock-change-product-qty.service';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSDestroyService } from 'tds-ui/core/services';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { StockChangeProductQtyDTO, StockLocationDTO } from './../../../../dto/product/stock-change-product-qty.dto';
import { Component, Input, OnInit } from '@angular/core';
import { Message } from '@core/consts/message.const';

@Component({
  selector: 'app-update-init-inventory',
  templateUrl: './update-init-inventory.component.html',
  providers: [TDSDestroyService]
})
export class UpdateInitInventoryComponent implements OnInit {
  @Input() lstData!: StockChangeProductQtyDTO[];

  _form!:FormGroup;
  lstLocation: Array<StockLocationDTO> = [];
  locationAll!: StockLocationDTO;
  initAll!:number;
  isLoading = false;

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

  constructor(
    private message: TDSMessageService,
    private modal: TDSModalRef,
    private fb: FormBuilder,
    private stockService: StockChangeProductQtyService,
    private destroy$: TDSDestroyService
  ) { 
    this.createForm();
  }

  ngOnInit(): void {
    this.loadLocations();
    this.updateForm();
  }

  createForm(){
    this._form = this.fb.group({
      datas: this.fb.array([])
    })
  }

  updateForm(){
    this.lstData.forEach(item => {
      this.dataArray.push(this.fb.group({
        Product:[item.Product],
        NewQuantity:[item.NewQuantity],
        Location:[item.Location],
        LocationId:[item.Location.Id]
      }))
    })
  }

  get dataArray(): FormArray {
    return this._form.get('datas') as FormArray;
  }

  loadLocations() {
    this.stockService.getStockLocation().pipe(takeUntil(this.destroy$)).subscribe({
      next:(res) => {
        this.lstLocation = [...res.value];
      },
      error:(err) => {
        this.message.error(err?.error?.message || 'Không thể tải dữ liệu địa điểm');
      }
    });
  }

  updateForAll(){
    if(this.initAll){
      for (let i = 0; i < this.dataArray.length; i++) {
        let formData = <FormGroup> this.dataArray.at(i);
        
        formData.controls["NewQuantity"].setValue(this.initAll);
      }
    }

    if(this.locationAll){
      for (let i = 0; i < this.dataArray.length; i++) {
        let formData = <FormGroup> this.dataArray.at(i);
        
        formData.controls["Location"].setValue(this.locationAll);
        formData.controls["LocationId"].setValue(this.locationAll.Id);
      }
    }
  }

  updateLocationId(location: StockLocationDTO, index: number){
    let formData = <FormGroup> this.dataArray.at(index);
    
    formData.controls["LocationId"].setValue(location.Id);
  }

  prepareModel() {
    return this.lstData.map((data, i) => {
      let formData = <FormGroup> this.dataArray.at(i);

      return Object.assign(data, formData.value);
    });
  }

  onSave() {
    if (this._form.invalid) {
      this.message.error("Vui lòng nhập đầy đủ thông tin");

      return;
    }

    this.isLoading = true;

    let model = this.prepareModel();
  
    this.stockService.postStockChangeProductQty({ model: model }).pipe(takeUntil(this.destroy$))
      .pipe(mergeMap(item => {

        let ids = item.value.map((f: any) => { return f.Id });
        
        return this.stockService.updateStockChangeProductQty({ids: ids})
      }))
      .subscribe({
        next:(res) => {
          this.message.success(Message.UpdatedSuccess);
          
          let data = this.dataArray.value as any[];
          let sum = data.reduce<number>((total, item) => { return total + item.NewQuantity }, 0);
          
          this.modal.destroy(sum);
        },
        error:(err) => {
          this.message.error(err?.error?.message || Message.UpdatedFail);
          this.isLoading = false;
        }
      });
  }

  onCancel() {
    this.modal.destroy(null);
  }
}