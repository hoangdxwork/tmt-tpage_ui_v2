import { Injectable } from "@angular/core";
import { StockChangeProductQtyDto } from "@app/dto/product-template/stock-change-productqty.dto";
import { TDSMessageService } from "tds-ui/message";
import { ProductTemplateService } from "../product-template.service";

@Injectable({
  providedIn: 'root'
})

export class ProductTemplateFacade {

  constructor(private message: TDSMessageService,
      private productTemplateService: ProductTemplateService) {
  }

  stockChangeProductQty(id: any) {
    let model = {
        ProductTmplId: id
    }

    this.productTemplateService.stockChangeProductQty({ model: model }).subscribe({
      next: (res: any) => {
          delete res['@odata.context'];

          let value = [...res.value] as StockChangeProductQtyDto[];
          value.map(x => {
              x.LocationId = x.Location?.Id;
          });

          this.productTemplateService.postChangeQtyProduct({ model: value }).subscribe({
            next: (res1: any) => {

                let value2 = [...res1.value];
                let ids = value2.map(x => x.Id);
                let model2 = {
                    ids: ids
                }

                this.productTemplateService.changeProductQtyIds(model2).subscribe({
                    next: (res2: any) => {
                        this.message.info('Cập nhật tồn kho thành công');
                    },
                    error: (error: any) => {
                        this.message.error(error?.error?.message);
                    }
                })
            },
            error: (error: any) => {
                this.message.error(error?.error?.message);
            }
          })
      },
      error: (error: any) => {
          this.message.error(error?.error?.message);
      }
    })
  }

}
