import { TDSDestroyService } from 'tds-ui/core/services';
import { FilterProductTemplateObjDTO } from '../../../services/mock-odata/odata-product-template.service';
import { ProductTemplateDTO } from '../../../dto/product/product.dto';
import { ColumnTableDTO } from '../../partner/components/config-column/config-column-partner.component';
import { THelperCacheService } from '../../../../lib/utility/helper-cache';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { finalize } from 'rxjs/operators';
import { ProductTemplateService } from '../../../services/product-template.service';
import { ExcelExportService } from '../../../services/excel-export.service';
import { OdataProductTemplateService } from '../../../services/mock-odata/odata-product-template.service';
import { TagProductTemplateService } from '../../../services/tag-product-template.service';
import { TagService } from 'src/app/main-app/services/tag.service';
import { TagDTO } from '../../../dto/tag/tag.dto';
import { ODataProductTagDTO, ODataProductTemplateDTO } from '../../../dto/configs/product/config-odata-product.dto';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { THelperDataRequest } from '../../../../lib/services/helper-data.service';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SortEnum } from 'src/app/lib';
import { TDSModalService } from 'tds-ui/modal';
import { TDSResizeObserver } from 'tds-ui/core/resize-observers';
import { TDSMessageService } from 'tds-ui/message';
import { TDSTableQueryParams } from 'tds-ui/table';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  providers: [TDSDestroyService],
  host: {
    class: 'w-full h-full flex'
  }
})

export class ConfigProductComponent implements OnInit, AfterViewInit {

  @ViewChild('viewChildProductTable') parentElement!: ElementRef;

  lstOfData: Array<ProductTemplateDTO> = [];
  expandSet = new Set<number>();
  setOfCheckedId = new Set<number>();
  listOfCurrentPageData: readonly ProductTemplateDTO[] = [];
  columnList: Array<ColumnTableDTO> = [
    { isChecked: true, value: 'ImageUrl', name: 'Ảnh' },
    { isChecked: true, value: 'DefaultCode', name: 'Mã SP' },
    { isChecked: true, value: 'Name', name: 'Tên SP' },
    { isChecked: true, value: 'ListPrice', name: 'Giá bán' },
    { isChecked: true, value: 'Tags', name: 'Nhãn' },
    { isChecked: true, value: 'Active', name: 'Hiệu lực' },
    { isChecked: false, value: 'QtyAvailable', name: 'SL thực tế' },
    { isChecked: false, value: 'UOMName', name: 'Đơn vị' },
    { isChecked: false, value: 'DateCreated', name: 'Ngày tạo' }
  ];
  count: number = 1;
  tableWidth: number = 0;
  marginLeftCollapse: number = 0;
  paddingCollapse: number = 36;
  checked = false;
  indeterminate = false;
  pageSize = 20;
  pageIndex = 1;
  filterObj: FilterProductTemplateObjDTO = {
    searchText: '',
    active: true
  };
  sort: SortDataRequestDTO[] = [
    {
      field: 'DateCreated',
      dir: SortEnum.desc // TODO: mặc định sắp xếp giảm dần theo ngày tạo
    }
  ];
  sortByName:string = '';
  isLoading = false;
  configModelTags: Array<TagDTO> = [];
  configTagDataList: Array<TagDTO> = [];

  indClickTag = -1;
  isProcessing: boolean = false;

  @ViewChild('viewChildWidthTable') viewChildWidthTable!: ElementRef;
  @ViewChild('viewChildDetailPartner') viewChildDetailPartner!: ElementRef;

  constructor(
    private router: Router,
    private modalService: TDSModalService,
    private message: TDSMessageService,
    private cacheApi: THelperCacheService,
    private destroy$: TDSDestroyService,
    private tagService: TagService,
    private productTagService: TagProductTemplateService,
    private productTemplateService: ProductTemplateService,
    private odataService: OdataProductTemplateService,
    private resizeObserver: TDSResizeObserver,
    private excelExportService: ExcelExportService
  ) { }

  ngOnInit(): void {
    this.loadGridConfig();
    this.loadTagList();
  }

  ngAfterViewInit(): void {
    this.tableWidth = this.viewChildWidthTable?.nativeElement?.offsetWidth - this.paddingCollapse

    this.resizeObserver
      .observe(this.viewChildWidthTable)
      .subscribe(() => {
        this.tableWidth = this.viewChildWidthTable?.nativeElement?.offsetWidth - this.paddingCollapse;
        this.viewChildWidthTable?.nativeElement.click()
      });
    setTimeout(() => {
      let that = this;
      let wrapScroll = this.viewChildDetailPartner?.nativeElement?.closest('.tds-table-body');
      wrapScroll?.addEventListener('scroll', function () {
        let scrollleft = wrapScroll.scrollLeft;
        that.marginLeftCollapse = scrollleft;
      });
    }, 500);
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.pageSize = params.pageSize;
    this.loadData(params.pageSize, params.pageIndex);
  }

  loadData(pageSize: number, pageIndex: number) {
    let filter = this.odataService.buildFilter(this.filterObj || null);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filter || null, this.sort || null);

    this.getViewData(params).subscribe((res: ODataProductTemplateDTO) => {
      this.count = res['@odata.count'] as number;
      this.lstOfData = res.value;
    }, err => {
      this.message.error(err?.error?.message || 'Tải dữ liệu sản phẩm thất bại!');
    });
  }

  private getViewData(params: string): Observable<ODataProductTemplateDTO> {
    this.isLoading = true;

    return this.odataService
      .getView(params).pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => { this.isLoading = false }));
  }

  //store data on indexedDB
  storeIndexedDB(key: string, value: TDSSafeAny) {
    const gridConfig = { data: value };
    this.cacheApi.setItem(key, gridConfig);
  }

  onChangeColumn() {
    const key = this.productTemplateService._keyCacheGrid;
    this.storeIndexedDB(key, this.columnList);
    this.loadData(this.pageSize, this.pageIndex);
  }

  loadGridConfig() {
    const key = this.productTemplateService._keyCacheGrid;
    this.cacheApi.getItem(key).pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
      if (res && res.value) {
        var jsColumns = JSON.parse(res.value) as any;
        this.columnList = jsColumns.value.data;
      }
    })
  }

  onInputChange(ev: TDSSafeAny) {
    this.pageIndex = 1;
    this.indClickTag = -1;

    this.filterObj.searchText = ev.value;
    this.loadData(this.pageSize, this.pageIndex);
  }

  loadTagList() {
    this.tagService.getProductTagList().pipe(takeUntil(this.destroy$)).subscribe(
      (res: ODataProductTagDTO) => {
        this.configTagDataList = res.value;
      }
    )
  }

  setActive(active: boolean): TDSSafeAny {
    if (this.setOfCheckedId.size == 0) {
      return this.message.error('Vui lòng chọn tối thiểu 1 dòng!');
    } else {
      this.productTemplateService.setActive({ model: { Active: active, Ids: Array.from(this.setOfCheckedId) } })
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res: TDSSafeAny) => {
            active ? this.message.success('Mở hiệu lực thành công!') : this.message.success('Đóng hiệu lực thành công!');
            this.loadData(this.pageSize, this.pageIndex);
          },
          err => {
            this.message.error(err?.error?.message || 'Thao tác thất bại!');
          }
        );
    }
  }

  exportExcel() {
    if (this.isProcessing) {
      return
    }

    let state = {
      skip: 0,
      take: 20,
      filter: {
        logic: "and",
        filters: [{
          field: "Active",
          operator: "eq",
          value: true,
        }],
      },
      sort: [
        {
          field: 'Name',
          dir: 'asc'
        }
      ]
    }

    let excelModel = {
      data: JSON.stringify(state)
    };

    this.excelExportService.exportPost(`/ProductTemplate/ExportProduct`, excelModel, `san_pham_import_kiem_kho_theo_id`)
      .pipe(finalize(() => this.isProcessing = false), takeUntil(this.destroy$))
      .subscribe();
  }

  sortByIds(columnValue: string) {
    // this.filterObj.active = true;

    switch(this.sortByName){
      case 'Z-A':
        this.sortByName = 'A-Z';
        this.sort = [
          {
            field: columnValue,
            dir: SortEnum.asc
          }
        ];
        break;
      case 'A-Z':
        this.sortByName = '';
        this.sort = [
          {
            field: 'DateCreated',
            dir: SortEnum.desc
          }
        ];
        break;
      default:
        this.sortByName = 'Z-A';
        this.sort = [
          {
            field: columnValue,
            dir: SortEnum.desc
          }
        ];
    }

    this.loadData(this.pageSize, this.pageIndex);
  }

  removeByIds() {
    if (this.setOfCheckedId.size == 0) {
      this.message.error('Vui lòng chọn tối thiểu 1 dòng!');
      return;
    } else {
      this.productTemplateService.getRemoveIds({ ids: Array.from(this.setOfCheckedId) })
        .pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
            this.loadData(this.pageSize, this.pageIndex);
            this.message.success('Xóa dữ liệu thành công!');
          },
          err => {
            this.message.error(err?.error?.message || 'Thao tác thất bại!');
          }
        );
    }
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

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  openTag(id: number, data: TDSSafeAny) {
    this.configModelTags = [];
    this.indClickTag = id;
    this.configModelTags = JSON.parse(data);
  }

  assignTags(Id: number, Tags: TDSSafeAny) {
    let model = {
      ProductTmplId: Id,
      Tags: Tags,
    }

    this.productTagService.assignTag(model).pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
      if (res && res.PartnerId) {
        var exits = this.lstOfData.filter(x => x.Id == Id)[0] as TDSSafeAny;
        if (exits) {
          exits.Tags = JSON.stringify(Tags)
        }
        this.configModelTags = [];

        this.message.success('Gán nhãn thành công!');
      }
    }, error => {
      this.message.error(error?.error?.message || 'Gán nhãn thất bại!');
    });

    this.indClickTag = -1;
    this.loadData(this.pageSize, this.pageIndex);
  }

  closeTag() {
    this.indClickTag = -1;
  }

  showCreateForm() {
    this.router.navigateByUrl(`/configs/products/create`);
  }

  isHiddenColumn(columnValue: string) {
    return !this.columnList.find(f => f.value === columnValue)?.isChecked;
  }

  refreshData() {
    this.pageIndex = 1;
    this.indClickTag = -1;

    this.checked = false;
    this.indeterminate = false;
    this.setOfCheckedId = new Set<number>();

    this.filterObj = {
      searchText: ''
    }

    this.loadData(this.pageSize, this.pageIndex);
  }

  editProduct(data: ProductTemplateDTO) {
    this.router.navigateByUrl(`/configs/products/edit/${data.Id}`);
  }

  removeProduct(data: ProductTemplateDTO) {
    const modal = this.modalService.error({
      title: 'Xác nhận xóa sản phẩm',
      content: 'Bạn có chắc muốn xóa sản phẩm này không?',
      iconType: 'tdsi-trash-fill',
      okText: "Xác nhận",
      cancelText: "Hủy bỏ",
      onOk: () => {
        this.productTemplateService.delete(data.Id).pipe(takeUntil(this.destroy$)).subscribe(
          (res: TDSSafeAny) => {
            this.message.success('Xóa thành công');
            if (this.lstOfData.length <= 1) {
              this.pageIndex = 1;
              this.filterObj.searchText = '';
            }
            this.loadData(this.pageSize, this.pageIndex);
          },
          err => {
            this.message.error(err?.error?.message ?? 'Xóa thất bại');
          }
        )
      },
      onCancel: () => {
        modal.close();
      },
    })
  }
}
