import { Component, Input, OnInit } from '@angular/core';
import { ProductVariantDto } from '@app/dto/configs/product/config-product-variant.dto';
import { ProductTemplateService } from '@app/services/product-template.service';
import { takeUntil } from 'rxjs';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-modal-edit-variants',
  templateUrl: './modal-edit-variants.component.html',
  providers: [TDSDestroyService],
})
export class ModalEditVariantsComponent implements OnInit {
  @Input() id!: number;
  @Input() data!: ProductVariantDto;

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
    private modal: TDSModalRef,
    private destroy$: TDSDestroyService,
    private productTemplateService: ProductTemplateService,
    private message: TDSMessageService,
  ) { }

  ngOnInit(): void {}

  getImage(url: string) {
    this.data.ImageUrl.setValue(url);
  }

  getBase64(base64: TDSSafeAny) {
    this.data.Image.setValue(base64);
  }

  save() {
    this.productTemplateService.updateProductVariants(Number(this.id), this.data).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: TDSSafeAny) => {
        this.modal.destroy(res);
        this.message.success("Cập nhật thành công!");
      },
      error: (error) => {
        this.message.error(error?.error?.message || 'Cập nhật thất bại! ');
      }
    })

  }

  cancel() {
    this.modal.destroy(null);
  }

}
