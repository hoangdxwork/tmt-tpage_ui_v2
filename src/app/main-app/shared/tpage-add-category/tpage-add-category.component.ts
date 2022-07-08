import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { ProductCategoryDTO } from '../../dto/product/product-category.dto';
import { ProductCategoryService } from '../../services/product-category.service';

@Component({
  selector: 'tpage-add-category',
  templateUrl: './tpage-add-category.component.html'
})

export class TpageAddCategoryComponent implements OnInit, OnDestroy {

  categoryList: ProductCategoryDTO[] = [];
  costMethodList: TDSSafeAny[] = [
    { value: 'standard', text: 'Giá cố định' },
    { value: 'fifo', text: 'Nhập trước xuất trước' },
    { value: 'average', text: 'Bình quân giá quyền' }
  ];
  modelDefault!: ProductCategoryDTO;
  _form!: FormGroup;

  private destroy$ = new Subject<void>();

  constructor(private modal: TDSModalRef,
    private message: TDSMessageService,
    private formBuilder: FormBuilder,
    private productCategoryService: ProductCategoryService
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
      PropertyCostMethod: ['average'],
      IsPos: [true]
    });
  }

  loadDefault() {
    this.productCategoryService.getDefault().pipe(takeUntil(this.destroy$)).subscribe(
      (res: TDSSafeAny) => {
        delete res['@odata.context'];
        this.modelDefault = res;
      },
      err => {
        this.message.error(err.error.message);
      }
    );
  }

  loadCateg() {
    this.productCategoryService.get().pipe(takeUntil(this.destroy$)).subscribe(
      (res: TDSSafeAny) => {
        this.categoryList = res.value;
      },
      err => {
        this.message.error(err.error.message || Message.CanNotLoadData);
      }
    );
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
    if (!this._form.invalid) {
      let model = this.prepareModel();

      this.productCategoryService.insert(model).pipe(takeUntil(this.destroy$)).subscribe(
        (res: TDSSafeAny) => {
          this.message.success(Message.InsertSuccess);
          this.modal.destroy(null);
        },
        err => {
          this.message.error(err?.error?.message || Message.InsertFail);
        }
      );
    } else {
      this.message.error('Vui lòng nhập tên nhóm');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
