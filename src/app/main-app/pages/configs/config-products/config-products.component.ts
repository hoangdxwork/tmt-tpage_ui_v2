import { ProductTemplateService } from './../../../services/product-template.service';
import { ExcelExportService } from './../../../services/excel-export.service';
import { OdataProductTemplateService } from './../../../services/mock-odata/odata-product-template.service';
import { TagProductTemplateService } from '../../../services/tag-product-template.service';
import { TagService } from 'src/app/main-app/services/tag.service';
import { TagDTO } from './../../../dto/tag/tag.dto';
import { ODataProductTemplateDTO, ODataProductTagDTO } from './../../../dto/configs/product/config-odata-product.dto';
import { ConfigProductTemplateDTO } from '../../../dto/configs/product/config-product.dto';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { THelperDataRequest } from './../../../../lib/services/helper-data.service';
import { CTMTagFilterObjDTO } from './../../../dto/odata/odata.dto';
import { Router } from '@angular/router';
import { TDSSafeAny, TDSModalService, TDSHelperString, TDSMessageService, TDSResizeObserver, TDSTableQueryParams } from 'tmt-tang-ui';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-config-products',
  templateUrl: './config-products.component.html',
  styleUrls: ['./config-products.component.scss']
})
export class ConfigProductsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('viewChildProductTable') parentElement!: ElementRef;

  lstOfData:Array<ConfigProductTemplateDTO> = [];
  private destroy$ = new Subject<void>();
  
  expandSet = new Set<number>();
  setOfCheckedId = new Set<number>();
  listOfCurrentPageData: readonly ConfigProductTemplateDTO[] = [];
  columnList:Array<TDSSafeAny> = [
    {active:true, value:'ImageUrl',name:'Ảnh'},
    {active:true, value: 'DefaultCode', name: 'Mã SP'},
    {active:true, value: 'Name', name: 'Tên SP'},
    {active:true, value: 'ListPrice', name: 'Giá bán'},
    {active:false, value: 'QtyAvailable', name: 'SL thực tế'},
    {active:false, value: 'UOMName', name: 'Đơn vị'},
    {active:true, value: 'Tags', name: 'Nhãn'},
    {active:false, value: 'DateCreated', name: 'Ngày tạo'},
    {active:true, value: 'Active', name: 'Hiệu lực'}
  ]
  count: number = 1;
  tableWidth:number = 0;
  paddingCollapse: number = 32;
 
  checked = false;
  indeterminate = false;
  pageSize = 20;
  pageIndex = 1;
  isLoading = false;

  configModelTags:Array<TagDTO> = [];
  configTagDataList:Array<TagDTO> = [];
  public filterObj: CTMTagFilterObjDTO = {
    searchText: ''
  }
  indClickTag = -1;

  constructor(
    private router:Router,
    private modalService: TDSModalService,
    private message: TDSMessageService,
    private tagService: TagService,
    private productTagService: TagProductTemplateService,
    private productTemplateService: ProductTemplateService,
    private odataService: OdataProductTemplateService,
    private resizeObserver: TDSResizeObserver,
    private excelExportService: ExcelExportService
  ){}

  ngOnInit(): void {
    this.loadTagList();
    this.loadData(this.pageSize,this.pageIndex);
  }

  ngAfterViewInit(): void {
    this.tableWidth = this.parentElement.nativeElement.offsetWidth - this.paddingCollapse
    this.resizeObserver
      .observe(this.parentElement)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.tableWidth = this.parentElement.nativeElement.offsetWidth - this.paddingCollapse
        this.parentElement.nativeElement.click()
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onQueryParamsChange(params: TDSTableQueryParams){
    this.loadData(params.pageSize, params.pageIndex);
  }

  loadData(pageSize: number, pageIndex: number, filters?:TDSSafeAny,sort?:TDSSafeAny[]) {
    this.isLoading = true;
    
    if(TDSHelperString.hasValueString(this.filterObj.searchText)){
      filters = this.odataService.buildFilter(this.filterObj);
    }
    
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex,filters,sort);
    this.odataService.getView(params).pipe(takeUntil(this.destroy$)).subscribe((res: ODataProductTemplateDTO) => {
      this.count = res['@odata.count'] as number;
      this.lstOfData = res.value;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this.message.error(error.error.message ?? 'Tải dữ liệu sản phẩm thất bại!');
    });
  }

  loadTagList(){
    this.tagService.getProductTagList().pipe(takeUntil(this.destroy$)).subscribe(
      (res:ODataProductTagDTO)=>{
        this.configTagDataList = res.value;
      }
    )
  }

  setActive(active:boolean):TDSSafeAny{
    if(this.setOfCheckedId.size == 0) {
      return this.message.error('Vui lòng chọn tối thiểu 1 dòng!');
    }else{
      this.productTemplateService.setActive({model : {Active: active, Ids: Array.from(this.setOfCheckedId)}})
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res:TDSSafeAny)=>{
            active ? this.message.success('Mở hiệu lực thành công!'): this.message.success('Đóng hiệu lực thành công!');
            this.loadData(this.pageSize,this.pageIndex);
          },
          err=>{
            this.message.error(err.error.message ?? 'Thao tác thất bại!');
          }
        );
    }
  }

  exportExcel(){
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

    this.excelExportService.exportPost(
      `/ProductTemplate/ExportProduct`,
      excelModel,
      `san_pham_import_kiem_kho_theo_id`
    );
  }

  sortByIds(columnValue:string){
    let filter = {
      logic: "and",
      filters: [{
        field: "Active",
        operator: "eq",
        value: true
      }]
    };

    let sort = [
      { 
        field: columnValue, 
        dir: 'desc' 
      }
    ];

    this.loadData(this.pageSize,this.pageIndex,filter,sort);
  }

  removeByIds(){
    if(this.setOfCheckedId.size == 0) {
      this.message.error('Vui lòng chọn tối thiểu 1 dòng!');
      return;
    }else{
      this.productTemplateService.getRemoveIds({model : {ids: Array.from(this.setOfCheckedId)}})
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res:TDSSafeAny)=>{
            this.message.success('Xóa dữ liệu thành công!');
            this.loadData(this.pageSize,this.pageIndex);
          },
          err=>{
            this.message.error(err.error.message??'Thao tác thất bại!');
          }
        );
    }
  }

  doFilter(event:TDSSafeAny){
    let keyFilter = event.target.value as string;
    this.filterObj = {
      searchText:  TDSHelperString.stripSpecialChars(keyFilter.trim())
    }
    this.loadData(this.pageSize,this.pageIndex);
  }

  updateCheckedSet(id: number, checked: boolean): void {
        if (checked) {
            this.setOfCheckedId.add(id);
        } else {
            this.setOfCheckedId.delete(id);
        }
  }

  onCurrentPageDataChange(listOfCurrentPageData: readonly ConfigProductTemplateDTO[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
      this.checked = this.listOfCurrentPageData.every(({ Id }) => this.setOfCheckedId.has(Id));
      this.indeterminate = this.listOfCurrentPageData.some(({ Id }) => this.setOfCheckedId.has(Id)) && !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
      this.updateCheckedSet(id, checked);
      this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
      this.listOfCurrentPageData.forEach(({ Id }) => this.updateCheckedSet(Id, checked));
      this.refreshCheckedStatus();
  }

  sendRequestTableTab(): void {
      this.isLoading = true;
      const requestData = this.lstOfData.filter(data => this.setOfCheckedId.has(data.Id));
      console.log(requestData);
      setTimeout(() => {
          this.setOfCheckedId.clear();
          this.refreshCheckedStatus();
          this.isLoading = false;
      }, 1000);
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

  assignTags(Id: number, Tags: TDSSafeAny){
    let model = {
      ProductTmplId: Id,
      Tags: Tags,
    }
    
    this.productTagService.assignTag(model).pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
      if(res && res.PartnerId) {
          var exits = this.lstOfData.filter(x => x.Id == Id)[0] as TDSSafeAny;
          if(exits) {
            exits.Tags = JSON.stringify(Tags)
          }
        this.configModelTags = [];

        this.message.success('Gán nhãn thành công!');
      }
    }, error => {
      this.message.error(error.error.message??'Gán nhãn thất bại!');
    });

    this.indClickTag = -1;
    this.loadData(this.pageSize,this.pageIndex);
  }

  closeTag() {
    this.indClickTag = -1;
  }

  showCreateForm(data:TDSSafeAny){
    this.router.navigate(['configs/products/create']);
  }

  isHiddenColumn(columnValue:string){
    return !this.columnList.find(f=>f.value === columnValue).active;
  }

  refreshData(){
    this.pageIndex = 1;

    this.filterObj = {
      searchText: '',
    }

    this.loadData(this.pageSize, this.pageIndex);
  }

  showEditModal(i:number){
    
  }

  showRemoveModal(i:number){
    const modal = this.modalService.error({
        title: 'Xác nhận xóa sản phẩm',
        content: 'Bạn có chắc muốn xóa sản phẩm này không?',
        iconType:'tdsi-trash-fill',
        okText:"Xác nhận",
        cancelText:"Hủy bỏ",
        onOk: ()=>{
          //remove item here

        },
        onCancel:()=>{
          modal.close();
        },
      })
  }
}
