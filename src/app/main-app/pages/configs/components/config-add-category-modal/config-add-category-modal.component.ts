import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ProductTemplateService } from './../../../../services/product-template.service';
import { ProductService } from './../../../../services/product.service';
import { TDSMessageService, TDSModalRef, TDSSafeAny } from 'tmt-tang-ui';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-config-add-category-modal',
  templateUrl: './config-add-category-modal.component.html'
})
export class ConfigAddCategoryModalComponent implements OnInit, OnDestroy {
  categoryList:Array<TDSSafeAny> = [];
  costMethodList:Array<TDSSafeAny>  = [];
  modelDefault:TDSSafeAny;
  addCategoryForm!:FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private modal: TDSModalRef, 
    private message: TDSMessageService, 
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private productTemplateService: ProductTemplateService
  ) {
    this.createForm();
    this.initList();
   }

  ngOnInit(): void {
    this.productTemplateService.getProductCategoryDefault().pipe(takeUntil(this.destroy$)).subscribe(
      (res:TDSSafeAny)=>{
        delete res['@odata.context'];
        this.modelDefault = res;
      },
      err=>{
        this.message.error(err.error.message);
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  createForm(){
    this.addCategoryForm = this.formBuilder.group({
      Name:[null,Validators.required],
      Parent:[null],
      Sequence:[null],
      PropertyCostMethod:['average'],
      IsPos:[true]
    });
  }

  initList(){
    this.productService.getProductCategory().pipe(takeUntil(this.destroy$)).subscribe(
      (res:TDSSafeAny)=>{
        this.categoryList = res.value;
      },
      err=>{
        this.message.error(err.error.message);
      }
    );

    this.costMethodList = [
      { value: 'standard', text: 'Giá cố định'},
      { value: 'fifo', text: 'Nhập trước xuất trước'},
      { value: 'average', text: 'Bình quân giá quyền'}
    ];
  }

  prepareModel(){
    let formModel = this.addCategoryForm.value;
    if(formModel.Name){
      this.modelDefault.Name = formModel.Name
    }

    if(formModel.Parent) {
      this.modelDefault.Parent = formModel.Parent;
      this.modelDefault.ParentId = formModel.Parent.Id;
    }

    if(formModel.Sequence) {
        this.modelDefault.Sequence = formModel.Sequence
    }

    if(formModel.PropertyCostMethod) {
        this.modelDefault.PropertyCostMethod = formModel.PropertyCostMethod;
    }

    if(formModel.IsPos) {
        this.modelDefault.IsPos = formModel.IsPos;
    }

    return this.modelDefault;
  }

  onSubmit() {
    if (!this.addCategoryForm.invalid) {
      let model = this.prepareModel();
      this.productTemplateService.postProductCategoryDefault(model).pipe(takeUntil(this.destroy$)).subscribe(
        (res:TDSSafeAny)=>{
          this.message.success('Thêm thành công');
          this.modal.destroy(null);
        },
        err=>{
          console.log(model)
          console.log(err.error.message)
          this.message.error('Thêm thất bại');
        }
      );
    }
  }

  cancel() {
      this.modal.destroy(null);
  }

  save() {
      this.onSubmit();
  }
}
