import { TDSSafeAny, TDSModalRef, TDSMessageService, TDSModalService } from 'tmt-tang-ui';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { ProductTemplateDTO, ProductType, ProductUOMDTO } from '../../dto/product/product.dto';
import { ProductTemplateService } from '../../services/product-template.service';
import { ProductCategoryService } from '../../services/product-category.service';
import { ProductUOMService } from '../../services/product-uom.service';
import { Message } from 'src/app/lib/consts/message.const';
import { ProductCategoryDTO } from '../../dto/product/product-category.dto';
import { TpageAddCategoryComponent } from '../tpage-add-category/tpage-add-category.component';
import { TpageSearchUOMComponent } from '../tpage-search-uom/tpage-search-uom.component';

@Component({
  selector: 'tpage-add-product',
  templateUrl: './tpage-add-product.component.html',
  styleUrls: ['./tpage-add-product.component.scss']
})
export class TpageAddProductComponent implements OnInit {

  @Output() onLoadedProductSelect = new EventEmitter<TDSSafeAny>();

  formAddProduct!: FormGroup;

  defaultGet!: ProductTemplateDTO;

  lstCategory!: Array<ProductCategoryDTO>;
  lstUOMCategory!: Array<ProductUOMDTO>;

  imageUrl = "https://randomuser.me/api/portraits/women/68.jpg";

  public readonly lstProductType = ProductType;

  constructor(
    private fb: FormBuilder,
    private modal: TDSModalService,
    private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private viewContainerRef: ViewContainerRef,
    private productTemplateService: ProductTemplateService,
    private productCategoryService: ProductCategoryService,
    private productUOMService: ProductUOMService
  ) { }

  ngOnInit(): void {
    this.createForm();

    this.loadCategory();
    this.loadUOMCateg();
    this.loadDefault();
  }

  loadDefault() {
    this.productTemplateService.getDefault().subscribe((res: TDSSafeAny) => {
      delete res["@odata.context"];

      this.defaultGet = res;
      this.updateForm(res);
    });
  }

  loadCategory() {
    this.productCategoryService.get().subscribe((res: any) => {
      this.lstCategory = res.value;
    });
  }

  loadUOMCateg() {
    this.productUOMService.getUOMCateg().subscribe((res: any) => {
      this.lstUOMCategory = res.value;
    });
  }

  onSave(type?: string) {
    let model = this.prepareModel();

    this.productTemplateService.insert(model).subscribe(res => {
      this.message.success(Message.Product.InsertSuccess);

      if(type == "select") {
        this.onLoadedProductSelect.emit(res);
      }
    });
  }

  onCancel() {
    this.modalRef.close();
  }

  onAddCateg() {
    this.modal.create({
      title: 'Thêm nhóm sản phẩm',
      content: TpageAddCategoryComponent,
      size: 'lg',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
      }
    });
  }

  onSearchUOM() {
    this.modal.create({
      title: 'Tìm kiếm đơn vị tính',
      content: TpageSearchUOMComponent,
      size: 'lg',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
      }
    });
  }

  prepareModel() {
    const formModel = this.formAddProduct.value;

    this.defaultGet["Name"] = formModel.Name;
    this.defaultGet["Type"] = formModel.Type;
    this.defaultGet["DefaultCode"] = formModel.DefaultCode;
    this.defaultGet["Barcode"] = formModel.Barcode;
    this.defaultGet["Categ"] = formModel.Categ;
    this.defaultGet["CategId"] = formModel.Categ.Id;

    this.defaultGet["Weight"] = formModel.Weight;
    this.defaultGet["ListPrice"] = formModel.ListPrice;
    this.defaultGet["DiscountSale"] = formModel.DiscountSale;
    this.defaultGet["PurchasePrice"] = formModel.PurchasePrice;
    this.defaultGet["DiscountPurchase"] = formModel.DiscountPurchase;
    this.defaultGet["StandardPrice"] = formModel.StandardPrice;

    if(formModel.UOM) {
      this.defaultGet["UOM"] = formModel.UOM;
      this.defaultGet["UOMId"] = formModel.UOM.Id;
    }

    if(formModel.UOMPO) {
      this.defaultGet["UOMPO"] = formModel.UOMPO;
      this.defaultGet["UOMPOId"] = formModel.UOMPO.Id;
    }
    this.defaultGet["ImageUrl"] = this.imageUrl;

    return this.defaultGet;
  }

  updateForm(data: ProductTemplateDTO) {
    let formControls = this.formAddProduct.controls;

    formControls["Type"].setValue(data.ShowType);
    formControls["Categ"].setValue(data.Categ);
    formControls["UOM"].setValue(data.UOM);
    formControls["UOMPO"].setValue(data.UOMPO);

    formControls["Name"].setValue(data.Name);
    formControls["DefaultCode"].setValue(data.DefaultCode);
    formControls["Barcode"].setValue(data.Barcode);
    formControls["Weight"].setValue(data.Weight);
    formControls["ListPrice"].setValue(data.ListPrice);
    formControls["DiscountSale"].setValue(
      data.DiscountSale
    );
    formControls["PurchasePrice"].setValue(
      data.PurchasePrice
    );
    formControls["DiscountPurchase"].setValue(
      data.DiscountPurchase
    );
    formControls["StandardPrice"].setValue(
      data.StandardPrice
    );
  }

  createForm() {
    this.formAddProduct  = this.fb.group({
        Name: [null, Validators.required],
        Type: [null],
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

}
