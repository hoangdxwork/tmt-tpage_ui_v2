import { TDSDestroyService } from 'tds-ui/core/services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSSafeAny, TDSHelperString, TDSHelperArray } from 'tds-ui/shared/utility';
import { ProductCategoryDTO } from '../../dto/product/product-category.dto';
import { ProductCategoryService } from '../../services/product-category.service';

@Component({
  selector: 'tpage-add-category',
  templateUrl: './tpage-add-category.component.html',
  providers: [TDSDestroyService]
})

export class TpageAddCategoryComponent implements OnInit {

  categoryList: ProductCategoryDTO[] = [];
  costMethodList: TDSSafeAny[] = [
    { value: 'standard', text: 'Giá cố định' },
    { value: 'fifo', text: 'Nhập trước xuất trước' },
    { value: 'average', text: 'Bình quân giá quyền' }
  ];
  modelDefault!: ProductCategoryDTO;
  _form!: FormGroup;
  isLoading: boolean = false;

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
    private message: TDSMessageService,
    private formBuilder: FormBuilder,
    private productCategoryService: ProductCategoryService,
    private destroy$: TDSDestroyService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadDefault();
    this.loadCateg();
  }

  createForm() {
    this._form = this.formBuilder.group({
      Name: [null, Validators.required],
      Parent: [null],
      Sequence: [null],
      PropertyCostMethod: ['average', Validators.required],
      IsPos: [true]
    });
  }

  loadDefault() {
    this.isLoading = true;

    this.productCategoryService.getDefault().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: TDSSafeAny) => {
        delete res['@odata.context'];
        this.modelDefault = {...res};
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.message.error(err.error.message);
      }
    });
  }

  loadCateg() {
    this.isLoading = true;

    this.productCategoryService.get().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: TDSSafeAny) => {
        if(res && TDSHelperArray.hasListValue(res.value)){
          this.categoryList = [...res.value];
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.message.error(err.error.message || Message.CanNotLoadData);
      }
    });
  }

  prepareModel() {
    let formModel = this._form.value;

    if (formModel.Name) {
      this.modelDefault.Name = formModel.Name
    }

    if (formModel.Parent) {
      this.modelDefault.Parent = formModel.Parent;
      this.modelDefault.ParentId = formModel.Parent.Id;
    }

    if (formModel.Sequence) {
      this.modelDefault.Sequence = formModel.Sequence
    }

    if (formModel.PropertyCostMethod) {
      this.modelDefault.PropertyCostMethod = formModel.PropertyCostMethod;
    }

    if (formModel.IsPos) {
      this.modelDefault.IsPos = formModel.IsPos;
    }

    return this.modelDefault;
  }

  cancel() {
    this.modal.destroy(null);
  }

  save() {
    if(this.isLoading) {
      return;
    }

    if (!this._form.valid) {
      this._form.markAllAsTouched(); //TODO: set touched cho toàn bộ formcontrol
      this.message.error('Dữ liệu không hợp lệ');
      return;
    }

    let model = this.prepareModel();
    this.isLoading = true;

    this.productCategoryService.insert(model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {

        if(!res) return;
        delete res["@odata.context"];
        this.isLoading = false;
        
        this.message.success(Message.InsertSuccess);
        this.modal.destroy(res);
      },
      error: (err) => {
        this.isLoading = false;
        this.message.error(err?.error?.message || Message.InsertFail);
      }
    });
  }
}
