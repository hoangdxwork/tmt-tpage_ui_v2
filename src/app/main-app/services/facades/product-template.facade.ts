import { EventEmitter, Injectable } from "@angular/core";
import { StockChangeProductQtyDto } from "@app/dto/product-template/stock-change-productqty.dto";
import { TDSMessageService } from "tds-ui/message";
import { ProductTemplateService } from "../product-template.service";

@Injectable({
  providedIn: 'root'
})

export class ProductTemplateFacade {

  public onStockChangeProductQty$ = new EventEmitter();

  constructor(private message: TDSMessageService,
      private productTemplateService: ProductTemplateService) {
  }

  stockChangeProductQty(id: any, mapping: any[], type: string) {
    this.productTemplateService.getProductTemplateByIdV2(id).subscribe({
       next: (res: any) => {

          let model = {
              ProductTmplId: id
          }

          this.productTemplateService.stockChangeProductQty({ model: model }).subscribe({
            next: (res: any) => {
                delete res['@odata.context'];

                let value = [...res.value] as StockChangeProductQtyDto[];

                value.map((x:any, index: number) => {
                    x.LocationId = x.Location?.Id;
                    if(mapping && mapping.length > 0) {
                        x.NewQuantity = mapping[index];
                    }
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
                              this.onStockChangeProductQty$.emit(type);
                              this.message.info('Cập nhật tồn kho thành công');
                          },
                          error: (error: any) => {
                              this.message.error(error?.error?.message);
                              this.onStockChangeProductQty$.emit(type);
                          }
                      })
                  },
                  error: (error: any) => {
                      this.message.error(error?.error?.message);
                      this.onStockChangeProductQty$.emit(type);
                  }
                })
            },
            error: (error: any) => {
                this.message.error(error?.error?.message);
                this.onStockChangeProductQty$.emit(type);
            }
          })
        },
        error: (error: any) => {
            this.message.error(error?.error?.message);
            this.onStockChangeProductQty$.emit(type);
        }
      })
  }
}
