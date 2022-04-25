import { ProductService } from './../../../services/product.service';
import { ProductDTOV2, ODataProductDTOV2 } from './../../../dto/product/odata-product.dto';
import { switchMap, finalize } from 'rxjs/operators';
import { OdataProductService } from './../../../services/mock-odata/odata-product.service';
import { CRMTeamService } from './../../../services/crm-team.service';
import { ProductVariantEditTableModalComponent } from './../components/product-variant-edit-table-modal/product-variant-edit-table-modal.component';
import { takeUntil, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { THelperDataRequest } from './../../../../lib/services/helper-data.service';
import { Subject, Observable, fromEvent } from 'rxjs';
import { Router } from '@angular/router';
import { TDSSafeAny, TDSHelperString, TDSMessageService, TDSModalService, TDSHelperObject, TDSTableQueryParams } from 'tmt-tang-ui';
import { Component, OnInit, ViewEncapsulation, ViewContainerRef, ElementRef, ViewChild } from '@angular/core';

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
  listOfDataTableProduct: ProductDTOV2[] = [];
  pageId!: string;
  pageName!: string;
  currentTeam: TDSSafeAny;
  isLoading = false;
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

  constructor(
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private router: Router,
    private odataProductService: OdataProductService,
    private message: TDSMessageService,
    private teamService: CRMTeamService,
    private productService: ProductService,

  ) {}

  ngOnInit(): void {

    this.teamService.onChangeTeam().subscribe(data => {
      if (data) {
        this.currentTeam = data;
        this.pageId = data.Facebook_PageId;
        this.pageName = data.Facebook_PageName;
        if (this.selected == 1) {
          this.loadData(this.pageSize, this.pageIndex, this.pageId);
        }
      }
    });
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
    ).subscribe((res: ODataProductDTOV2) => {
      this.count = res['@odata.count'] as number;
      this.listOfDataTableProduct = res.value;
    });
  }

  private get(params: string): Observable<ODataProductDTOV2> {
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
      this.odataProductService.getProductOnFacebookPage(params, pageId).pipe(takeUntil(this.destroy$)).subscribe((res: ODataProductDTOV2) => {
        this.listOfDataTableProduct = res.value
        this.count = res['@odata.count'] as number
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
        this.message.error(error.error.message ?? 'Tải dữ liệu thất bại!');
      });
    } else {
      this.odataProductService.getView(params).pipe(takeUntil(this.destroy$)).subscribe((res: ODataProductDTOV2) => {
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
    if (this.selected) {
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
            .subscribe((res: any) => {
                this.message.success("Đã mở hiệu lực thành công!");
                this.onSelectChange(this.selected);
            });
          break;

        case 'unactive':
          let dataUnActive = JSON.stringify({ model: {Active: false,  Ids: array}})
          this.productService.getSetActive(dataUnActive)
            .subscribe((res: any) => {
                this.message.success("Hết hiệu lực thành công!");
                this.onSelectChange(this.selected);
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
    this.productService.checkExitProductOnPageFB(model).subscribe((res: any)=>{
      if(res.value.length > 0) {
        let data = JSON.stringify({
          model: {
            PageId: this.pageId,
            ProductIds: res.value,
          }
        })
        this.productService.addProductToFacebookPage(data).subscribe(res=>{
          this.message.success("Thao tác thành công");
        });
      } else {
        this.message.error("sản phẩm đã tồn tại trong page");
      }
    });
  }

  addNewData(data: TDSSafeAny) {
    this.router.navigate(['/configs/product-variant/create']);
  }

  refreshData() {
    this.pageIndex = 1;
    this.filterObj.searchText = '';
    this.loadData(this.pageSize, this.pageIndex);
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
    //receive result from modal after close modal
    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
        //get new changed value here
      }
    });
  }

  showRemoveModal(i: number) {
    const modal = this.modalService.error({
      title: 'Xác nhận xóa biến thể sản phẩm',
      content: 'Bạn có chắc muốn xóa biến thể sản phẩm này không?',
      iconType: 'tdsi-trash-fill',
      okText: "Xác nhận",
      cancelText: "Hủy bỏ",
      onOk: () => {
        //remove item here

      },
      onCancel: () => {
        modal.close();
      },
    })
  }
}