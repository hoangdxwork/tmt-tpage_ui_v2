import { TDSDestroyService } from 'tds-ui/core/services';
import { ProductTemplateService } from '../../../../services/product-template.service';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';

@Component({
  selector: 'create-country-modal',
  templateUrl: './create-country-modal.component.html',
  providers: [TDSDestroyService]
})

export class CreateCountryModalComponent implements OnInit {
  _form!:FormGroup;
  isLoading: boolean = false;

  constructor(
    private modal: TDSModalRef,
    private message: TDSMessageService,
    private productTemplateService: ProductTemplateService,
    private destroy$: TDSDestroyService,
    private formBuilder: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void { }

  initForm(){
    this._form = this.formBuilder.group({
      Code: [null],
      Name: [null,Validators.required],
      Note: [null]
    });
  }

  save() {
    if(!this._form.controls["Name"].value) {
      this.message.error('Vui lòng nhập tên xuất xứ sản phẩm');
      return;
    }

    this.isLoading = true;
    let model = this._form.value;

    this.productTemplateService.insertOriginCountry(model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {

        if(!res) return;
        delete res["@odata.context"];
        this.isLoading = false;

        this.message.success('Thêm mới thành công');
        this.modal.destroy(res);
      },
      error: (err) => {
        this.isLoading = false;
        this.message.error(err.error?.message || 'Thêm xuất xứ thất bại');
      }
    })
  }

  cancel() {
    this.modal.destroy(null);
  }
}
