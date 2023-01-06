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
  selector: 'product-variant',
  templateUrl: './product-variant.component.html',
  host: {
    class: 'h-full w-full flex'
  },
  providers: [TDSDestroyService]
})

export class ListProductVariantComponent implements OnInit {
  //#region Declare
  setOfCheckedId = new Set<number>();
  lstOfData: any[] = [];
  team!: CRMTeamDTO;

  isLoading: boolean = false;
  isProcessing: boolean = false;

  checked = false;
  indeterminate = false;
  selected: number = 0;
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
    private crmTeamService: CRMTeamService,
    private productService: ProductService,
    private productShopCartService: ProductShopCartService,
    private excelExportService: ExcelExportService) {
  }

  ngOnInit(): void {
    this.loadTeamData();
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
    if (this.selected == 0) {
      return this.odataProductService.getView(params).pipe(takeUntil(this.destroy$));
    } else {
      return this.odataProductService.getProductOnFacebookPage(params, this.team?.ChannelId).pipe(takeUntil(this.destroy$));
    }
  }

  loadTeamData() {
    this.crmTeamService.onChangeTeam().pipe(takeUntil(this.destroy$)).subscribe((team) => {
      this.team = team as any;
    });
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.pageSize = params.pageSize;
    this.loadData(params.pageSize, params.pageIndex);
  }

  onSelectChange(value: number) {
    this.pageIndex = 1;
    this.selected = value;
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
                this.isLoading = false;
                this.message.success("Đã mở hiệu lực thành công!");
                this.loadData(this.pageSize, this.pageIndex);
            },
            error: (err) => {
              this.isLoading = false;
              this.message.error(err?.error?.message || 'Mở hiệu lực thất bại!');
            }
        })
        break;

      case 'unactive':
        let unactive = { Active: false, Ids: this.idsModel };
        this.isLoading = true;

        this.productService.setActive({ model: unactive }).pipe(takeUntil(this.destroy$)).subscribe({
            next: (res: any) => {
                this.isLoading = false;
                this.message.success("Đã hết hiệu lực!");
                this.loadData(this.pageSize, this.pageIndex);
            },
            error: (err) => {
                this.isLoading = false;
                this.message.error(err?.error?.message || 'Đóng hiệu lực thất bại!');
            }
        })
        break;

      default:
        break;
    }
  }

  addProductOnPageFB() {
    if (this.checkValueEmpty() == 0) return;

    let model = { PageId: this.team.ChannelId, ProductIds: this.idsModel };
    this.isLoading = true;
    this.productService.checkExitProductOnPageFB({ model: model }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          if (res && res.value && res.value.length == 0) {
              this.isLoading = false;
              this.message.error("Sản phẩm đã tồn tại trong Page");
              return;
          }

          let data = {
            model: { PageId: this.team.ChannelId, ProductIds: res.value }
          }

          this.productService.addProductOnFacebookPage(data).pipe(takeUntil(this.destroy$)).subscribe({
            next: (res: any) => {
                this.isLoading = false;
                this.message.success("Thêm sản phẩm vào Page thành công");
                return;
            },
            error: (err) => {
                this.isLoading = false;
                this.message.error(err?.error?.message);
                return;
            }
          });
      },
      error: (err) => {
          this.isLoading = false;
          this.message.error(err?.error?.message || 'Đã có lỗi xảy ra');
          return;
      }
    });
  }

  deleteProductOnPageFB() {
    if (this.checkValueEmpty() == 0) return;
    let data = {
      model:{
          PageId: this.team.ChannelId,
          ProductIds: this.idsModel
      }
    };

    this.isLoading = true;
    this.productService.deleteProductOnFacebookPage(data).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.message.success('Đã xóa sản phẩm khỏi Page');
        this.onSelectChange(this.selected);
      },
      error: (err) => {
        this.isLoading = false;
        this.message.error(err.error.message || 'Xóa thất bại đã có lỗi xảy ra!');
      }
    })
  }

  addProductOnShopCart() {
    if (this.checkValueEmpty() == 0) return;
    let team = this.teamShopCart as CRMTeamDTO;
    if(!team) {
        this.message.error('Không tìm thấy CRMTeam ShopCart');
        return;
    };

    let model = {
      TeamId: team.Id,
      Ids: this.idsModel
    }

    this.isLoading = true;
    this.productShopCartService.addProductOnShopCart({ model: model }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.isLoading = false;
          this.message.success("Thêm sản phẩm vào giỏ hàng thành công");
      },
      error: (err: any) => {
          this.isLoading = false;
          this.message.error(err?.error?.message);
      }
    })
  }

  exportExcel() {
    if (this.isProcessing) return;
    let state = {
      skip: 0,
      take: 20,
      filter: {
        filters: [],
        logic: "and"
      }
    };

    let data = { data: JSON.stringify(state) };

    this.excelExportService.exportPost('/Product/ExportProduct', { data: JSON.stringify(data) }, 'bien_the_san_pham_kiem_kho_theo_id')
      .pipe(finalize(() => this.isProcessing = false), takeUntil(this.destroy$))
      .subscribe();
  }

  createVariant() {
    this.router.navigateByUrl('/configs/product-variant/create');
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

  showEditModal(id: number) {
    let modal = this.modalService.create({
      title: 'Cập nhật biến thể sản phẩm',
      centered: true,
      content: EditProductVariantComponent,
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        id: id
      },
    });
    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe((result: any) => {
      if (result == true) {
        this.loadData(this.pageSize, this.pageIndex);
      }
    })
  }

  showRemoveModal(key: number) {
    if(this.selected == 0){
      const modal = this.modalService.error({
        title: 'Xác nhận xóa biến thể sản phẩm',
        content: 'Bạn có chắc muốn xóa biến thể sản phẩm này không?',
        iconType: 'tdsi-trash-fill',
        okText: "Xác nhận",
        cancelText: "Hủy bỏ",
        onOk: () => {
          this.productService.deleteProduct(key).pipe(takeUntil(this.destroy$)).subscribe({
            next: (res) => {
              this.message.success('Xóa sản phẩm thành công!')
              this.onSelectChange(this.selected);
              return
            },
            error: (err) => {
              this.message.error(err.error.message || 'Xóa thất bại đã có lỗi xảy ra!')
            }
          })
        },
        onCancel: () => {
          modal.close();
        },
      })
    }

    if(this.selected == 1){
      const modal = this.modalService.error({
        title: 'Xác nhận xóa biến thể sản phẩm khỏi page',
        content: `Bạn có chắc muốn xóa biến thể sản phẩm này khỏi page ${this.team.Name} không?`,
        iconType: 'tdsi-trash-fill',
        okText: "Xác nhận",
        cancelText: "Hủy bỏ",
        onOk: () => {
          let data = {
            model:{
              PageId: this.team.ChannelId,
              ProductIds: [key]
            }
          };

          this.productService.deleteProductOnFacebookPage(data).pipe(takeUntil(this.destroy$)).subscribe({
            next: (res) => {
              this.message.success('Đã xóa sản phẩm khỏi page')
              this.onSelectChange(this.selected);
              return
            },
            error: (err) => {
              this.message.error(err.error.message || 'Xóa thất bại đã có lỗi xảy ra!')
            }
          })
        },
        onCancel: () => {
          modal.close();
        },
      })
    }
  }

}
