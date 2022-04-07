import { TDSModalRef, TDSMessageService, TDSSafeAny } from 'tmt-tang-ui';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductUOMService } from '../../services/product-uom.service';
import { Message } from 'src/app/lib/consts/message.const';
import { ProductUOMDTO } from '../../dto/product/product-uom.dto';

@Component({
  selector: 'tpage-add-uom',
  templateUrl: './tpage-add-uom.component.html',
  styleUrls: ['./tpage-add-uom.component.scss']
})
export class TpageAddUOMComponent implements OnInit {

  formAddUOM!: FormGroup;

  lstUOMCategory!: Array<ProductUOMDTO>;

  lstUOMType: any[] = [
    {type: "bigger",text: "Lớn hơn đơn vị gốc"},
    {type: "reference",text: "Là đơn vị gốc của nhóm này"},
    {type: "smaller",text: "Nhỏ hơn đơn vị gốc"},
  ];

  constructor(
    private fb: FormBuilder,
    private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private productUOMService: ProductUOMService
  ) { }

  ngOnInit(): void {
    this.createForm();

    this.loadProductUOMCateg();
  }

  loadProductUOMCateg() {
    this.productUOMService.getUOMCateg().subscribe((res: any) => {
      this.lstUOMCategory = res.value;
    });
  }

  onSave() {
    let model = this.prepareModel();

    this.productUOMService.insert(model).subscribe(res => {
      this.message.success(Message.ProductUOM.InsertSuccess);
      this.onCancel(res);
    });
  }

  onCancel(result: TDSSafeAny) {
    this.modalRef.destroy(result);
  }

  prepareModel() {
    const formModel = this.formAddUOM.value;

    let model = {
      Active: formModel.Active,
      Category: formModel.Category,
      CategoryId: formModel.Category.Id,
      CategoryName: formModel.Category.Name,
      Factor: formModel.Factor,
      FactorInv: formModel.FactorInv,
      Name: formModel.Name,
      Rounding: formModel.Rounding,
      UOMType: formModel.UOMType,
    };

    return model;
  }

  createForm() {
    this.formAddUOM = this.fb.group({
      Name: [null, Validators.required],
      Category: [null, Validators.required],
      UOMType: ["reference"],
      Factor: [1],
      FactorInv: [1],
      Active: [true],
      Rounding: [0.01]
    });
  }

}
