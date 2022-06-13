import { ConfigDataFacade } from './../../../services/facades/config-data.facade';
import { OnDestroy } from '@angular/core';
import { THelperCacheService } from '../../../../lib/utility/helper-cache';
import { ExcelExportService } from '../../../services/excel-export.service';
import { ProductService } from '../../../services/product.service';
import { switchMap, finalize } from 'rxjs/operators';
import { OdataProductService } from '../../../services/mock-odata/odata-product.service';
import { CRMTeamService } from '../../../services/crm-team.service';
import { takeUntil, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { THelperDataRequest } from '../../../../lib/services/helper-data.service';
import { Subject, Observable, fromEvent } from 'rxjs';
import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation, ViewContainerRef, ElementRef, ViewChild } from '@angular/core';
import { ODataProductDTO } from 'src/app/main-app/dto/configs/product/config-odata-product.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { EditProductVariantComponent } from './edit/edit-product-variant.component';
import { TDSHelperArray, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSTableQueryParams } from 'tds-ui/table';

@Component({
  selector: 'list-product-variant',
  templateUrl: './list-product-variant.component.html',
  encapsulation: ViewEncapsulation.None,
})

export class ListProductVariantComponent  implements OnDestroy  {

  @ViewChild('innerText') innerText!: ElementRef;
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
  private destroy$ = new Subject<void>();

  public filterObj: TDSSafeAny = {
    searchText: ''
  }
  idsModel: any = [];

  constructor(private router: Router,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private odataProductService: OdataProductService,
    private message: TDSMessageService,
    private crmTeamService: CRMTeamService,
    private productService: ProductService,
    private excelExportService: ExcelExportService,
    private configDataService: ConfigDataFacade,
    private cacheApi: THelperCacheService) {

    this.crmTeamService.onChangeTeam().pipe(takeUntil(this.destroy$))
      .subscribe((team) => (this.team as any) = team);
  }

  private getViewData(params: string): Observable<ODataProductDTO> {
    this.isLoading = true;
    this.configDataService.onLoading$.emit(this.isLoading);
    if (this.selected == 0) {
      return this.odataProductService
        .getView(params).pipe(takeUntil(this.destroy$))
        .pipe(finalize(() => { this.isLoading = false }));
    } else {
      return this.odataProductService
        .getProductOnFacebookPage(params, this.team?.Facebook_PageId)
        .pipe(takeUntil(this.destroy$))
        .pipe(finalize(() => { this.isLoading = false }));
    }
  }

  loadData(pageSize: number, pageIndex: number) {
    this.lstOfData = [];
    let filters = this.odataProductService.buildFilter(this.filterObj || null);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters || null);

    this.getViewData(params).subscribe((res: any) => {
        this.count = res['@odata.count'] as number;
        this.lstOfData = [...res.value];
        this.configDataService.onLoading$.emit(false);
    }, error => {
        this.message.error('Tải dữ liệu khách hàng thất bại!');
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

  setActive(type:string) {
    if (this.checkValueEmpty() == 1) {
      switch(type) {
        case 'active':
          let active =  {Active: true,  Ids: this.idsModel};
          this.productService.setActive({ model: active }).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
            this.message.success("Đã mở hiệu lực thành công!");
            this.loadData(this.pageSize, this.pageIndex);
          }, error => {
            this.message.error('Mở hiệu lực thất bại!');
          })
          break;

        case 'unactive':
          let unactive = { Active: false,  Ids: this.idsModel }
          this.productService.setActive({ model: unactive }).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
            this.message.success("Đã hết hiệu lực!");
            this.loadData(this.pageSize, this.pageIndex);
          }, error => {
            this.message.error('Đóng hiệu lực thất bại!');
          })
          break;

        default:
          break;
      }
    }
  }

  addProductToPageFB() {
    if (this.checkValueEmpty() == 1) {
      let model = { PageId: this.team.Facebook_PageId, ProductIds: this.idsModel};

      this.productService.checkExitProductOnPageFB({ model: model}).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        if(!TDSHelperArray.hasListValue(res.value)) {
           this.message.error("Sản phẩm đã tồn tại trong page");
        } else {
          let data = {
            model: { PageId: this.team.Facebook_PageId,  ProductIds: res.value }
          }
          this.productService.addProductToFacebookPage(data).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
              this.message.success("Thao tác thành công");
          }, error => {
            this.message.error("Thêm mới sản phẩm vào page thất bại");
          });
        }
      });
    }
  }

  ngAfterViewInit(): void {
    fromEvent(this.innerText.nativeElement, 'keyup').pipe(
      map((event: any) => { return event.target.value }),
      debounceTime(750),
      distinctUntilChanged(),
      switchMap((text: TDSSafeAny) => {
        this.pageIndex = 1;
        this.filterObj.searchText = text;

        let filters = this.odataProductService.buildFilter(this.filterObj || null);
        let params = THelperDataRequest.convertDataRequestToString(this.pageSize, this.pageIndex, filters || null);
        return this.getViewData(params);
      }))
      .subscribe((res: any) => {
        this.count = res['@odata.count'] as number;
        this.lstOfData = [...res.value];
      }, error => {
          this.message.error('Tìm kiếm không thành công');
      });
  }

  exportExcel() {
    if (this.isProcessing) { return }
    let state = {
      skip: 0,
      take: 20,
      filter: {
        filters: [],
        logic: "and",
      }
    };

    let data = { data: JSON.stringify(state) }
    let that = this;
    let callBackFn = () => {
      that.isProcessing = false;
    }
    this.excelExportService.exportPost('/Product/ExportProduct', { data: JSON.stringify(data) }, 'bien_the_san_pham_kiem_kho_theo_id')
    .pipe(finalize(()=>this.isProcessing = false), takeUntil(this.destroy$))
    .subscribe();;
  }

  addNewData(data: TDSSafeAny) {
    this.router.navigateByUrl('/configs/product-variant/create');
  }

  refreshData() {
    this.pageIndex = 1;
    this.filterObj.searchText = '';
    this.innerText.nativeElement.value = '';

    this.checked = false;
    this.indeterminate = false;
    this.setOfCheckedId = new Set<number>();

    this.loadData(this.pageSize, this.pageIndex);
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  showEditModal(id: number) {
    let modal = this.modalService.create({
      title: 'Cập nhật biến thể sản phẩm',
      content: EditProductVariantComponent,
      viewContainerRef: this.viewContainerRef,
      componentParams: { id: id },
    });
    modal.afterClose.subscribe((result: any) => {
      if(result == true) {
        this.loadData(this.pageSize, this.pageIndex);
      }
    })
  }

  showRemoveModal(key: number) {
    const modal = this.modalService.error({
      title: 'Xác nhận xóa biến thể sản phẩm',
      content: 'Bạn có chắc muốn xóa biến thể sản phẩm này không?',
      iconType: 'tdsi-trash-fill',
      okText: "Xác nhận",
      cancelText: "Hủy bỏ",
      onOk: () => {
        this.productService.deleteProduct(key).pipe(takeUntil(this.destroy$)).subscribe(res=>{
          this.message.success('Xóa sản phẩm thành công!')
          this.onSelectChange(this.selected);
          return
        },err=>{
          this.message.error(err.error.message || 'Xóa thất bại đã có lỗi xảy ra!')
        })
      },
      onCancel: () => {
        modal.close();
      },
    })
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
