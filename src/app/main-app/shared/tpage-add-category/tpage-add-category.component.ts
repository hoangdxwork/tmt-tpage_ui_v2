import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { ProductCategoryDTO } from '../../dto/product/product-category.dto';
import { ProductCategoryService } from '../../services/product-category.service';

@Component({
  selector: 'tpage-add-category',
  templateUrl: './tpage-add-category.component.html',
  styleUrls: ['./tpage-add-category.component.scss']
})

export class TpageAddCategoryComponent implements OnInit {

  formAddCategory!: FormGroup;

  defaultGet!: ProductCategoryDTO;

  lstParent!: Array<ProductCategoryDTO>;

  lstPropertyCostMethod: any[] = [
    {type: "standard", text: "Giá cố định"},
    {type: "fifo", text: "Nhập trước xuất trước"},
    {type: "average", text: "Bình quân giá quyền"},
  ];

  constructor(
    private fb: FormBuilder,
    private modal: TDSModalRef,
    private message: TDSMessageService,
    private productCategoryService: ProductCategoryService
  ) { }

  ngOnInit(): void {
    this.createForm();

    this.loadParent();
    this.loadDefault();
  }

  loadDefault() {
    this.productCategoryService.getDefault().subscribe((res: TDSSafeAny) => {
      delete res["@odata.context"];

      this.defaultGet = res;
      this.updateForm(res);
    });
  }

  loadParent() {
    this.productCategoryService.getParent().subscribe((res: TDSSafeAny) => {
      this.lstParent = res.value;
    });
  }

  onSave() {
    let model = this.prepareModel();

    this.productCategoryService.insert(model).subscribe(res => {
      this.message.success(Message.ProductCategory.InsertSuccess);
      this.onCancel(res);
    });
  }

  onCancel(result: TDSSafeAny) {
    this.modal.destroy(result);
  }

  prepareModel() {
    const formModel = this.formAddCategory.value;

    this.defaultGet.Name = formModel.Name;
    this.defaultGet.Parent = formModel.Parent;
    this.defaultGet.Sequence = formModel.Sequence;
    this.defaultGet.PropertyCostMethod = formModel.PropertyCostMethod;
    this.defaultGet.IsPos = formModel.IsPos;

    return this.defaultGet;
  }

  updateForm(data: ProductCategoryDTO) {
    let formControls = this.formAddCategory.controls;

    formControls["Name"].setValue(data.Name);
    formControls["Parent"].setValue(data.Parent);
    formControls["Sequence"].setValue(data.Sequence);
    formControls["PropertyCostMethod"].setValue(data.PropertyCostMethod);
    formControls["IsPos"].setValue(data.IsPos);
  }

  createForm() {
    this.formAddCategory = this.fb.group({
      Name: [null, Validators.required],
      Parent: [null],
      Sequence: [null],
      PropertyCostMethod: ["average"],
      IsPos: [true]
    });
  }

}
