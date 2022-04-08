import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TDSMessageService, TDSModalRef } from 'tmt-tang-ui';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductTemplateService } from 'src/app/main-app/services/product-template.service';
import { ProductTemplateDTO } from 'src/app/main-app/dto/product/product.dto';
import { ProductTemplateV2DTO } from 'src/app/main-app/dto/producttemplate/product-tempalte.dto';
import { ProductCategoryService } from 'src/app/main-app/services/product-category.service';
import { ODataProductCategoryDTOV2, ProductCategoryDTO, ProductCategoryDTOV2 } from 'src/app/main-app/dto/product/product-category.dto';
import { ProductUOMService } from 'src/app/main-app/services/product-uom.service';
import { OdataProductUOMDTOV2, ProductUOMDTOV2 } from 'src/app/main-app/dto/product/product-uom.dto';

@Component({
  selector: 'app-modal-add-product',
  templateUrl: './modal-add-product.component.html',
})

export class ModalAddProductComponent implements OnInit {

  _form!: FormGroup;

  modelDefault!: ProductTemplateV2DTO;
  lstCateg!: ProductCategoryDTOV2[];
  lstUOM!: ProductUOMDTOV2[];
  lstUOMPO!: ProductUOMDTOV2[];

  types: string[] = ["Có thể lưu trữ", "Có thể tiêu thụ", "Dịch vụ"];

  constructor(private fb: FormBuilder,
      private message: TDSMessageService,
      private productUOMService: ProductUOMService,
      private productCategoryService: ProductCategoryService,
      private productTemplateService: ProductTemplateService,
      private modal: TDSModalRef) {
          this.createForm();
  }

  createForm() {
    this._form = this.fb.group({
        Name: [null, Validators.required],
        Type: ["Có thể lưu trữ"],
        DefaultCode: [null],
        Barcode: [null],
        Categ: [null, Validators.required],
        Weight: [0],
        ListPrice: [0],
        DiscountSale: [0],
        PurchasePrice: [0],
        DiscountPurchase: [0],
        StandardPrice: [0],
        UOM: [null, Validators.required],
        UOMPO: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.productTemplateService.getDefault().subscribe((res: any) => {
        delete res['@odata.context'];
        this.updateForm(res);

        this.modelDefault = res;
    }, error => {
       this.message.error('Load thông tin sản phẩm mặc định đã xảy ra lỗi!');
    })
  }

  updateForm(data: ProductTemplateV2DTO) {
     this._form.patchValue(data);
  }

  changeCateg() {
    this.productCategoryService.get().subscribe((res: ODataProductCategoryDTOV2) => {
      this.lstCateg = res.value;
    });
  }

  changeUOM() {
    this.productUOMService.get().subscribe((res: OdataProductUOMDTOV2) => {
      this.lstUOM = res.value;
    });
  }

  changeUOMPO() {
    this.productUOMService.get().subscribe((res: OdataProductUOMDTOV2) => {
      this.lstUOMPO = res.value;
    });
  }

  changeType(event: any) {
    this._form.controls['Type'].setValue(event);
  }

  cancel() {
      this.modal.destroy(null);
  }

  onSave() {
      let model = this.prepareModel();
      this.productTemplateService.insert(model).subscribe((res: ProductTemplateV2DTO) => {
            this.message.success('Thêm sản phẩm thành công!');
            this.modal.destroy(res);
      }, error => {
          this.message.error('Thêm sản phẩm đã xảy ra lỗi!');
          this.modal.destroy(null);
      })
  }

  prepareModel() {
    let formModel = this._form.value;

    this.modelDefault["Name"] = formModel.Name;
    this.modelDefault["Type"] = formModel.Type;
    this.modelDefault["DefaultCode"] = formModel.DefaultCode;
    this.modelDefault["Barcode"] = formModel.Barcode;
    this.modelDefault["Categ"] = formModel.Categ;
    this.modelDefault["CategId"] = formModel.Categ.Id;

    this.modelDefault["Weight"] = formModel.Weight;
    this.modelDefault["ListPrice"] = formModel.ListPrice;
    this.modelDefault["DiscountSale"] = formModel.DiscountSale;
    this.modelDefault["PurchasePrice"] = formModel.PurchasePrice;
    this.modelDefault["DiscountPurchase"] = formModel.DiscountPurchase;
    this.modelDefault["StandardPrice"] = formModel.StandardPrice;

    if(formModel.UOM) {
      this.modelDefault["UOM"] = formModel.UOM;
      this.modelDefault["UOMId"] = formModel.UOM.Id;
    }

    if(formModel.UOMPO) {
      this.modelDefault["UOMPO"] = formModel.UOMPO;
      this.modelDefault["UOMPOId"] = formModel.UOMPO.Id;
    }

    return this.modelDefault;
  }
}
