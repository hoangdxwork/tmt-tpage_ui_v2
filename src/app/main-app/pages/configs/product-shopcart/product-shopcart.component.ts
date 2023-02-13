import { Router, ActivatedRoute } from '@angular/router';
import { ConfigFacebookCartDTO } from './../../../dto/configs/facebook-cart/config-facebook-cart.dto';
import { GeneralConfigService } from './../../../services/general-config.service';
import { OdataProductShopCartDto, ProductShopCartDto } from './../../../dto/configs/product/config-product-shopcart.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { OdataProductService } from '../../../services/mock-odata/odata-product.service';
import { takeUntil } from 'rxjs/operators';
import { THelperDataRequest } from '../../../../lib/services/helper-data.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { TDSHelperArray, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSMessageService } from 'tds-ui/message';
import { TDSTableQueryParams } from 'tds-ui/table';
import { ProductShopCartService } from '@app/services/shopcart/product-shopcart.service';
import { SortDataRequestDTO } from '@core/dto/dataRequest.dto';
import { SortEnum } from '@core/enum';
import { ProductShopCartServiceV2 } from '@app/services/shopcart/product-shopcart-v2.service';
import { FilterObjFastSaleModel } from '@app/services/mock-odata/odata-fastsaleorder.service';

@Component({
  selector: 'product-shopcart',
  templateUrl: './product-shopcart.component.html',
  host: {
    class: 'h-full w-full flex'
  },
  providers: [TDSDestroyService]
})

export class ProductShopCartComponent implements OnInit {

  setOfCheckedId = new Set<number>();
  lstOfData: ProductShopCartDto[] = [];
  configCart!: ConfigFacebookCartDTO;

  isLoading: boolean = false;
  isProcessing: boolean = false;
  checked = false;
  indeterminate = false;

  pageSize: number = 20;
  pageIndex: number = 1;
  count: number = 0;
  sort!: string;

  public filterObj: TDSSafeAny = {
    q: ''
  }

  // sort: Array<SortDataRequestDTO>= [
  //   {
  //     field: "DateCreated",
  //     dir: SortEnum.desc,
  //   },
  //   {
  //     field: "Price",
  //       dir: SortEnum.desc,
  //   }
  // ];

  idsModel: any = [];
  teamShopCart!: CRMTeamDTO;
  expandSet = new Set<number>();

  indClickQuantity: number = -1;
  currentQuantity: number = 0;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private destroy$: TDSDestroyService,
    private odataProductService: OdataProductService,
    private generalConfigService: GeneralConfigService,
    private message: TDSMessageService,
    private productShopCartService: ProductShopCartService,
    private productShopCartService_v2: ProductShopCartServiceV2) {
  }

  ngOnInit(): void {
    this.loadConfigCart();
    this.loadInitShopCart();
  }

  loadData(pageSize: number, pageIndex: number) {
    this.lstOfData = [];

    let filters = this.odataProductService.buildFilter(this.filterObj || null);
    // let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters || null, this.sort);

    let params = {
      q: '',
      offset: (this.pageIndex - 1) * this.pageSize,
      limit: this.pageSize,
      sort: this.sort,
    }

    this.isLoading = true;
    this.getViewData(params).subscribe({
      next:(res: any) => {
        if(res && res.Datas && TDSHelperArray.isArray(res.Datas)) {
            this.count = res.Total as number;
            this.lstOfData = [...res.Datas];
        }
        this.expandSet = new Set<number>();
        this.isLoading = false;
      },
      error: (err) => {
        this.expandSet = new Set<number>();
        this.isLoading = false;
        this.message.error(err?.error?.message);
      }
    });
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet = new Set<number>();
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  onLoadOption(event: any): void {
    this.sort = event;
    this.loadData(this.pageSize, this.pageIndex);
  }

  loadConfigCart() {
    let name = "ConfigCart";
    this.isLoading  = true;

    this.generalConfigService.getByName(name).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: any) => {
        this.configCart = {...(res || {})};
        this.isLoading = false;
      },
      error:(err) => {
        this.isLoading = false;
          this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
      }
    })
  }

  loadInitShopCart() {
    this.productShopCartService.initShopCart().pipe(takeUntil(this.destroy$)).subscribe({
      next: (team: any) => {
          this.teamShopCart = team;
      },
      error: (err: any) => {
          this.message.error(err?.error?.message);
      }
    })
  }

  private getViewData(params: any): Observable<OdataProductShopCartDto> {
    return this.productShopCartService_v2.getProductTemplateOnShopCart(params).pipe(takeUntil(this.destroy$));
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.loadData(params.pageSize, params.pageIndex);
  }

  onSelectChange(value: number) {
    this.pageIndex = 1;
    this.filterObj.q = '';

    this.checked = false;
    this.indeterminate = false;
    this.setOfCheckedId.clear();

    this.loadData(this.pageSize, this.pageIndex);
  }

  onSearch(ev: TDSSafeAny) {
    this.pageIndex = 1;
    this.filterObj.q = ev.value;

    let filters = this.odataProductService.buildFilter(this.filterObj || null);
    // let params = THelperDataRequest.convertDataRequestToString(this.pageSize, this.pageIndex, filters || null, this.sort);

    let params = {
      q: this.filterObj.q,
      offset: (this.pageIndex - 1) * this.pageSize,
      limit: this.pageSize,
      sort: 'date_desc',
    }
    this.isLoading = true;

    this.getViewData(params).subscribe({
      next: (res: any) => {
        if(res && res.Datas) {
            this.count = res.Total as number;
            this.lstOfData = [...(res.Datas || [])];
        }

        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.message.error(err?.error?.message || 'Tìm kiếm không thành công');
      }
    });
  }

  closeSearchProduct(){
    this.filterObj.q = '';
    this.loadData(this.pageSize, this.pageIndex);
  }

  checkValueEmpty() {
    let ids: any[] = [...this.setOfCheckedId];
    this.idsModel = ids;

    if (ids.length == 0) {
      this.message.error('Vui lòng chọn tối thiểu một dòng!');
      return 0;
    }
    return 1;
  }

  openQuantityPopover(data: ProductShopCartDto) {
    this.indClickQuantity = data.Id;
    this.currentQuantity = data.ShopQuantity || 0;
  }

  changeQuantity(value: number) {
      this.currentQuantity = value;
  }

  saveChangeQuantity(data: ProductShopCartDto) {
    this.isLoading = true;

    let model = {
      models: [{
        ProductId: data.Id,
        Quantity: this.currentQuantity
      }]
    }

    this.productShopCartService.updateQuantityProductOnShopCart(model).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: any) => {
          this.isLoading = false;
          let index = this.lstOfData.findIndex(x => x.Id == data.Id && x.UOMId == data.UOMId);
          if(index > -1) {
            this.lstOfData[index].ShopQuantity = this.currentQuantity;
          }

          this.message.success('Cập nhật thành công');
          this.indClickQuantity = -1;
      },
      error:(err) => {
          this.isLoading = false;
          this.message.error(err.error?.message);
          this.indClickQuantity = -1;
      }
    })
  }

  closeQuantityPopover(): void {
      this.indClickQuantity = -1;
  }

  onDelete(data: ProductShopCartDto) {
    let model = {
      Ids: [data.Id]
    }

    this.apiDeleteProductOnShopCart(model);
  }

  deleteProductOnShopCart() {
    if (this.checkValueEmpty() == 0) return;
    let model = {
      Ids: this.idsModel
    }

    this.apiDeleteProductOnShopCart(model);
  }

  apiDeleteProductOnShopCart(model: any) {
    this.isLoading = true;
    this.productShopCartService_v2.deleteProductTemplateOnShopCart(model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.message.success("Xóa sản phẩm trong giỏ hàng thành công");

          if(this.pageIndex > 1 && this.lstOfData.length == model.Ids?.length) {
            this.pageIndex = this.pageIndex - 1;
          }
          this.loadData(this.pageSize, this.pageIndex);
      },
      error: (err: any) => {
          this.message.error(err?.error?.message);
          this.isLoading = false;
      }
    })
  }

  refreshData() {
    this.pageIndex = 1;
    this.filterObj.q = '';

    this.checked = false;
    this.indeterminate = false;
    this.setOfCheckedId.clear();
    this.loadData(this.pageSize, this.pageIndex);
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.lstOfData.forEach((x: any) => this.updateCheckedSet(x.Id, value));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.lstOfData.every(x => this.setOfCheckedId.has(x.Id));
    this.indeterminate = this.lstOfData.some(x => this.setOfCheckedId.has(x.Id)) && !this.checked;
  }

}
