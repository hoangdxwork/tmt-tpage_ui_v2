import { TDSDestroyService } from 'tds-ui/core/services';
import { EditProductVariantComponent } from '../edit-product-variant/edit-product-variant.component';
import { ExcelExportService } from '../../../services/excel-export.service';
import { ProductService } from '../../../services/product.service';
import { finalize } from 'rxjs/operators';
import { OdataProductService } from '../../../services/mock-odata/odata-product.service';
import { CRMTeamService } from '../../../services/crm-team.service';
import { takeUntil } from 'rxjs/operators';
import { THelperDataRequest } from '../../../../lib/services/helper-data.service';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ODataProductDTO } from 'src/app/main-app/dto/configs/product/config-odata-product.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { TDSHelperArray, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSTableQueryParams } from 'tds-ui/table';
import { ProductShopCartService } from '@app/services/shopcart/product-shopcart.service';

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
  lstOfData: any[] = [];
  isLoading: boolean = false;
  isProcessing: boolean = false;

  checked = false;
  indeterminate = false;
  pageSize: number = 20;
  pageIndex: number = 1;
  count: number = 0;
  public filterObj: TDSSafeAny = {
    searchText: ''
  }
  idsModel: any = [];
  teamShopCart!: CRMTeamDTO;

  constructor(private router: Router,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private destroy$: TDSDestroyService,
    private odataProductService: OdataProductService,
    private message: TDSMessageService,
    private productService: ProductService,
    private productShopCartService: ProductShopCartService,
    private excelExportService: ExcelExportService) {
  }

  ngOnInit(): void {
    this.loadInitShopCart();
  }

  loadData(pageSize: number, pageIndex: number) {
    this.lstOfData = [];

    let filters = this.odataProductService.buildFilter(this.filterObj || null);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters || null);

    this.isLoading = true;
    this.getViewData(params).subscribe({
      next:(res: any) => {
        if(res && res.value && TDSHelperArray.isArray(res.value)) {
            this.count = res['@odata.count'] as number;
            this.lstOfData = [...res.value];
        }

        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.message.error(err?.error?.message || 'Tải dữ liệu khách hàng thất bại!');
      }
    });
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

  private getViewData(params: string): Observable<ODataProductDTO> {
    return this.odataProductService.getProductOnShopCart(params).pipe(takeUntil(this.destroy$));
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.pageSize = params.pageSize;
    this.loadData(params.pageSize, params.pageIndex);
  }

  onSelectChange(value: number) {
    this.pageIndex = 1;
    this.filterObj.searchText = '';

    this.checked = false;
    this.indeterminate = false;
    this.setOfCheckedId.clear();

    this.loadData(this.pageSize, this.pageIndex);
  }

  onSearch(ev: TDSSafeAny) {
    this.pageIndex = 1;
    this.filterObj.searchText = ev.value;

    let filters = this.odataProductService.buildFilter(this.filterObj || null);
    let params = THelperDataRequest.convertDataRequestToString(this.pageSize, this.pageIndex, filters || null);
    this.isLoading = true;

    this.getViewData(params).subscribe({
      next: (res: any) => {
        if(res && res.value) {
            this.count = res['@odata.count'] as number;
            this.lstOfData = [...(res.value || [])];
        }

        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.message.error(err?.error?.message || 'Tìm kiếm không thành công');
      }
    });
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

  setActive(type: string) {
    if (this.checkValueEmpty() == 0) return;

    switch (type) {
      case 'active':
        let active = { Active: true, Ids: this.idsModel };
        this.isLoading = true;

        this.productService.setActive({ model: active }).pipe(takeUntil(this.destroy$)).subscribe({
            next: (res: any) => {
                this.message.success("Đã mở hiệu lực thành công!");
                this.isLoading = false;

                this.loadData(this.pageSize, this.pageIndex);
            },
            error: (err) => {
              this.message.error(err?.error?.message || 'Mở hiệu lực thất bại!');
              this.isLoading = false;
            }
        })
        break;

      case 'unactive':
        let unactive = { Active: false, Ids: this.idsModel };
        this.isLoading = true;

        this.productService.setActive({ model: unactive }).pipe(takeUntil(this.destroy$)).subscribe({
            next: (res: any) => {
                this.message.success("Đã hết hiệu lực!");
                this.isLoading = false;

                this.loadData(this.pageSize, this.pageIndex);
            },
            error: (err) => {
                this.message.error(err?.error?.message || 'Đóng hiệu lực thất bại!');
                this.isLoading = false;
            }
        })
        break;

      default:
        break;
    }
  }

  deleteProductOnShopCart() {
    if (this.checkValueEmpty() == 0) return;
    let team = this.teamShopCart as CRMTeamDTO;
    if(!team) {
        this.message.error('Không tìm thấy Team ShopCart');
        return;
    };

    let model = {
      TeamId: team.Id,
      Ids: [this.idsModel]
    }

    this.productShopCartService.deleteProductOnShopCart(model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.message.success("Xóa sản phẩm trong giỏ hàng thành công");
          this.isLoading = false;
          return;
      },
      error: (err: any) => {
          this.message.error(err?.error?.message);
          this.isLoading = false;
      }
    })
  }

  refreshData() {
    this.pageIndex = 1;
    this.filterObj.searchText = '';

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
