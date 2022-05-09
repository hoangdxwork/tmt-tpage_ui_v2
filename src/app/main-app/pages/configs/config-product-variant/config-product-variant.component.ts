import { THelperCacheService } from './../../../../lib/utility/helper-cache';
import { ProductIndexDBService } from './../../../services/product-indexDB.service';
import { DataPouchDBDTO, ProductPouchDBDTO, KeyCacheIndexDBDTO } from './../../../dto/product-pouchDB/product-pouchDB.dto';
import { ProductTemplateV2DTO } from './../../../dto/producttemplate/product-tempalte.dto';
import { ProductDTO } from './../../../dto/product/product.dto';
import { ExcelExportService } from './../../../services/excel-export.service';
import { ProductService } from './../../../services/product.service';
import { switchMap, finalize } from 'rxjs/operators';
import { OdataProductService } from './../../../services/mock-odata/odata-product.service';
import { CRMTeamService } from './../../../services/crm-team.service';
import { ProductVariantEditTableModalComponent } from './../components/product-variant-edit-table-modal/product-variant-edit-table-modal.component';
import { takeUntil, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { THelperDataRequest } from './../../../../lib/services/helper-data.service';
import { Subject, Observable, fromEvent } from 'rxjs';
import { Router } from '@angular/router';
import { TDSSafeAny, TDSHelperString, TDSMessageService, TDSModalService, TDSHelperObject, TDSTableQueryParams, TDSHelperArray } from 'tmt-tang-ui';
import { Component, OnInit, ViewEncapsulation, ViewContainerRef, ElementRef, ViewChild } from '@angular/core';
import { ODataProductDTO } from 'src/app/main-app/dto/configs/product/config-odata-product.dto';

@Component({
  selector: 'app-config-product-variant',
  templateUrl: './config-product-variant.component.html',
  styleUrls: ['./config-product-variant.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConfigProductVariantComponent implements OnInit {
  @ViewChild('innerText') innerText!: ElementRef;

  dropdownList: Array<TDSSafeAny> = [];
  setOfCheckedId = new Set<number>();
  listOfCurrentPageData: readonly TDSSafeAny[] = [];
  listOfDataTableProduct: ProductDTO[] = [];
  pageId!: string;
  pageName!: string;
  currentTeam: TDSSafeAny;
  isLoading = false;
  isProcessing: boolean = false;
  checked = false;
  indeterminate = false;
  selected: number = 0;
  pageSize: number = 20;
  pageIndex: number = 1;
  count: number = 0;
  indClickTag: number = -1;
  private destroy$ = new Subject<void>();
  public filterObj: TDSSafeAny = {
    searchText: ''
  }
  orderBy: string = 'Name'

  indexDbVersion: number = 0;
  indexDbProductCount: number = -1;
  indexDbStorage!: DataPouchDBDTO[];
  productTmplItems!: ProductTemplateV2DTO;

  constructor(
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private router: Router,
    private odataProductService: OdataProductService,
    private message: TDSMessageService,
    private teamService: CRMTeamService,
    private productService: ProductService,
    private excelExportService: ExcelExportService,
    private productIndexDBService: ProductIndexDBService,
    private cacheApi: THelperCacheService,
  ) {}

  ngOnInit(): void {

    this.teamService.onChangeTeam().pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data) {
        this.currentTeam = data;
        this.pageId = data.Facebook_PageId;
        this.pageName = data.Facebook_PageName;
        if (this.selected == 1) {
          this.loadData(this.pageSize, this.pageIndex, this.pageId);
        }
      }
    });
    this.loadProduct();
  }

  ngAfterViewInit(): void {
    fromEvent(this.innerText.nativeElement, 'keyup').pipe(
      map((event: any) => { return event.target.value }),
      debounceTime(750),
      distinctUntilChanged(),
      // TODO: switchMap xử lý trường hợp sub in sub
      switchMap((text: TDSSafeAny) => {
        this.pageIndex = 1;

        this.filterObj.searchText = text;
        let filters = this.odataProductService.buildFilter(this.filterObj);
        let params = TDSHelperString.hasValueString(this.filterObj.searchText)?
        THelperDataRequest.convertDataRequestToString(this.pageSize, this.pageIndex, filters):
        THelperDataRequest.convertDataRequestToString(this.pageSize, this.pageIndex);
        return this.get(params);
      })
    ).pipe(takeUntil(this.destroy$)).subscribe((res: ODataProductDTO) => {
      this.count = res['@odata.count'] as number;
      this.listOfDataTableProduct = res.value;
    });
  }

  private get(params: string): Observable<ODataProductDTO> {
    this.isLoading = true;
    if (this.selected == 0) {
      return this.odataProductService
        .getView(params).pipe(takeUntil(this.destroy$))
        .pipe(finalize(() => { this.isLoading = false }));
    }
    return this.odataProductService
      .getProductOnFacebookPage(params, this.pageId).pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => { this.isLoading = false }));
  }

  loadData(pageSize: number, pageIndex: number, pageId?: string) {
    this.isLoading = true;
    let filters = this.odataProductService.buildFilter(this.filterObj);
    let params = TDSHelperString.hasValueString(this.filterObj.searchText)?
    THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters):
    THelperDataRequest.convertDataRequestToString(pageSize, pageIndex);
    if (pageId) {
      this.odataProductService.getProductOnFacebookPage(params, pageId).pipe(takeUntil(this.destroy$)).subscribe((res: ODataProductDTO) => {
        this.listOfDataTableProduct = res.value
        this.count = res['@odata.count'] as number
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
        this.message.error(error.error.message ?? 'Tải dữ liệu thất bại!');
      });
    } else {
      this.odataProductService.getView(params).pipe(takeUntil(this.destroy$)).subscribe((res: ODataProductDTO) => {
        this.listOfDataTableProduct = res.value
        this.count = res['@odata.count'] as number
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
        this.message.error(error.error.message ?? 'Tải dữ liệu thất bại!');
      });
    }
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    if (this.selected == 0) {
      this.loadData(params.pageSize, params.pageIndex);
    }
    if (this.selected == 1) {
      this.loadData(params.pageSize, params.pageIndex, this.pageId);
    }
    this.pageIndex = params.pageIndex;
  }

  onSelectChange(value: number) {
    this.pageIndex = 1;
    this.indClickTag = -1;
    if (value == 0) {
      this.loadData(this.pageSize, this.pageIndex);
    }
    if (value == 1) {
      this.loadData(this.pageSize, this.pageIndex, this.pageId);
    }
  }

  getLoadData(){
    if (this.selected == 0) {
      this.loadData(this.pageSize, this.pageIndex);
    }
    if (this.selected == 1) {
      this.loadData(this.pageSize, this.pageIndex, this.pageId);
    }
  }

  setActive(type:string,) {
    let array = Array.from(this.setOfCheckedId);
    if(array.length == 0) {
      this.message.error('Vui lòng chọn tối thiểu 1 dòng!');
    }
    else {
      switch(type) {
        case 'active':
          let dataActive = JSON.stringify({ model: {Active: true,  Ids: array}})
          this.productService.getSetActive(dataActive)
            .pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
                this.message.success("Đã mở hiệu lực thành công!");
                this.getLoadData();
            });
          break;

        case 'unactive':
          let dataUnActive = JSON.stringify({ model: {Active: false,  Ids: array}})
          this.productService.getSetActive(dataUnActive)
            .pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
                this.message.success("Đã hết hiệu lực!");
                this.getLoadData();
            });
          break;

        default:
          break;
      }
    }
  }

  addProductToPageFB(){
    let array = Array.from(this.setOfCheckedId);
    if(array.length === 0){
      this.message.error("Vui lòng chọn tối thiểu 1 dòng");
      return;
    }
    if(!this.pageId){
      this.message.error("Vui lòng chọn Page");
      return;
    }
    let model  = JSON.stringify({
      model:{
        PageId: this.pageId,
        ProductIds: array,
      }
    })
    this.productService.checkExitProductOnPageFB(model).pipe(takeUntil(this.destroy$)).subscribe((res: any)=>{
      if(res.value.length > 0) {
        let data = JSON.stringify({
          model: {
            PageId: this.pageId,
            ProductIds: res.value,
          }
        })
        this.productService.addProductToFacebookPage(data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
          this.message.success("Thao tác thành công");
        });
      } else {
        this.message.error("sản phẩm đã tồn tại trong page");
      }
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

    this.excelExportService.exportPost('/Product/ExportProduct', { data: JSON.stringify(data) }, 'bien_the_san_pham_kiem_kho_theo_id');
  }


  addNewData(data: TDSSafeAny) {
    this.router.navigate(['/configs/product-variant/create']);
  }

  refreshData() {
    this.pageIndex = 1;
    this.filterObj.searchText = '';
    this.getLoadData();
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onCurrentPageDataChange(listOfCurrentPageData: readonly TDSSafeAny[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfCurrentPageData.filter(({ disabled }) => !disabled);
    this.checked = listOfEnabledData.every(({ Id }) => this.setOfCheckedId.has(Id));
    this.indeterminate = listOfEnabledData.some(({ Id }) => this.setOfCheckedId.has(Id)) && !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData
      .filter(({ disabled }) => !disabled)
      .forEach(({ Id }) => this.updateCheckedSet(Id, checked));
    this.refreshCheckedStatus();
  }

  sendRequestTableTab(): void {
    this.isLoading = true;
    const requestData = this.listOfDataTableProduct.filter(data => this.setOfCheckedId.has(data.Id));
    setTimeout(() => {
      this.setOfCheckedId.clear();
      this.refreshCheckedStatus();
      this.isLoading = false;
    }, 1000);
  }

  loadProduct(): void {
    let keyCache = JSON.stringify(this.productIndexDBService._keyCacheProductIndexDB);
    this.cacheApi.getItem(keyCache).subscribe((obs: TDSSafeAny) => {
        if(TDSHelperString.hasValueString(obs)) {
            let cache = JSON.parse(obs['value']) as TDSSafeAny;
            let cacheDB = JSON.parse(cache['value']) as KeyCacheIndexDBDTO;

            this.indexDbVersion = cacheDB.cacheVersion;
            this.indexDbProductCount = cacheDB.cacheCount;
            this.indexDbStorage = cacheDB.cacheDbStorage;
        }

        if(this.indexDbProductCount == -1 && this.indexDbVersion == 0) {
           this.loadProductIndexDB(this.indexDbProductCount, this.indexDbVersion);
        }
    })
  }


  showEditModal(id: number) {
    const modal = this.modalService.create({
      title: 'Cập nhật biến thể sản phẩm',
      content: ProductVariantEditTableModalComponent,
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        productId: id
      }
    });
    modal.afterOpen.subscribe(() => {

    });
    modal.afterClose.subscribe(result => {
      if (result) {
        this.getLoadData();
        this.pusToIndexDb();
      }
    });
  }

  pusToIndexDb(): any {
    this.indexDbProductCount = this.indexDbProductCount;
    this.loadProductIndexDB(this.indexDbProductCount, this.indexDbVersion);
  }

  loadProductIndexDB(productCount: number, version: number): any {
    this.productIndexDBService.getLastVersionV2(productCount, version).pipe(takeUntil(this.destroy$))
      .subscribe((data: ProductPouchDBDTO) => {
        if(TDSHelperArray.hasListValue(data.Datas)){
          if(this.indexDbProductCount == -1 && this.indexDbVersion == 0){
            this.indexDbStorage = data.Datas
          }else
          if(TDSHelperArray.hasListValue(data.Datas)){
            let dataProduct = data.Datas[data.Datas.length -1];
            let index = this.indexDbStorage.findIndex(x=> x.ProductTmplId == dataProduct.ProductTmplId && x.Id == dataProduct.Id)
            if(index > -1){
              this.indexDbStorage[index] = dataProduct
            }
          } 
          
          //TODO: check số version
          let versions = this.indexDbStorage.map((x: DataPouchDBDTO) => x.Version);
          let lastVersion = Math.max(...versions);

          //TODO: check số lượng
          let count = this.indexDbStorage.length;

          if(lastVersion != this.indexDbVersion || count != this.indexDbProductCount) {
            this.indexDbVersion = lastVersion;
            this.indexDbProductCount = count;
          }
        }

        this.mappingCacheDB();

    }, error => {
        this.isLoading = false;
        this.message.error('Load danh sách sản phẩm đã xảy ra lỗi!');
    })
  }

  mappingCacheDB() {
    //TODO: lưu cache cho ds sản phẩm
    let objCached: KeyCacheIndexDBDTO = {
        cacheCount: this.indexDbProductCount,
        cacheVersion: this.indexDbVersion,
        cacheDbStorage: this.indexDbStorage
    };

    let keyCache = JSON.stringify(this.productIndexDBService._keyCacheProductIndexDB);
    this.cacheApi.setItem(keyCache, JSON.stringify(objCached));
  }

  showRemoveModal(key: number) {
    const modal = this.modalService.error({
      title: 'Xác nhận xóa biến thể sản phẩm',
      content: 'Bạn có chắc muốn xóa biến thể sản phẩm này không?',
      iconType: 'tdsi-trash-fill',
      okText: "Xác nhận",
      cancelText: "Hủy bỏ",
      onOk: () => {
        this.productService.delete_product(key).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
}